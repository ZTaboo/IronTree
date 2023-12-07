use std::sync::Arc;

use captcha_rs::CaptchaBuilder;
use mongodb::bson::doc;
use nanoid::nanoid;
use tracing::log::{Level, log};

use crate::db::coll;
use crate::db::db_model::user;
use crate::model::global::AppState;
use crate::model::request_model::user::LoginModel;
use crate::utils;

pub fn get_captcha(state: Arc<AppState>) -> Result<(String, String), &'static str> {
    let capt = CaptchaBuilder::new()
        .length(5)
        .width(130)
        .height(40)
        .dark_mode(false)
        .complexity(1)
        .compression(40)
        .build();
    let id = nanoid!(20);
    let cache = match state.cache.clone() {
        None => {
            log!(Level::Error,"获取缓存实例失败");
            return Err("缓存未初始化");
        }
        Some(cache) => cache,
    };
    cache.insert(id.clone(), capt.text.clone());
    let res = cache.get(&id);
    println!("{res:?}");
    Ok((id.into(), capt.to_base64()))
}


pub async fn login(state: Arc<AppState>, req_data: LoginModel) -> Result<(user::User, String), &'static str> {
    // 查询验证码是否存在
    let cache = match state.cache.clone() {
        Some(val) => val,
        None => return Err("获取缓存实例失败"),
    };

    let res = match cache.get(req_data.captcha_id.as_str()) {
        Some(value) => value,
        None => return Err("验证码不存在"),
    };

    if res != req_data.captcha {
        log!(Level::Error,"验证码错误");
        return Err("验证码错误");
    } else {
        // 验证码正确则删除验证码
        cache.invalidate(req_data.captcha_id.as_str());
    }
    // 查询用户是否存在
    let mongo = match state.mon_db.clone() {
        None => return Err("获取数据库实例失败"),
        Some(client) => client,
    };

    // 查询用户并验证密码
    let user = match mongo.collection::<user::User>(coll::USER)
        .find_one(doc! {"username":req_data.username.clone()}, None).await {
        Ok(value) => value.ok_or("用户不存在")?,
        Err(e) => {
            log!(Level::Info,"error:{}",e.to_string());
            return Err("用户不存在:{}");
        }
    };

    if !utils::crypt::ver_password(req_data.password.as_bytes(), user.password.as_str()) {
        return Err("用户或密码错误");
    }

    // 生成id
    let session = nanoid!(25);
    let result = match mongo.collection::<user::User>(coll::USER)
        .find_one_and_update(doc! {"username":req_data.username}, doc! {"$set":{"token":session.clone()}}, None)
        .await {
        Ok(value) => value,
        Err(e) => {
            println!("{e}");
            return Err("用户或密码错误");
        }
    };
    let user_con = match result {
        None => return Err("用户或密码错误"),
        Some(con) => con
    };
    Ok((user_con, session))
}
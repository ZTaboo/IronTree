use captcha_rs::CaptchaBuilder;
use mongodb::bson::doc;
use nanoid::nanoid;
use tracing::log::{Level, log};

use crate::client;
use crate::db::coll;
use crate::db::db_model::user;
use crate::model::request_model::user::LoginModel;

pub mod guest;

pub fn get_captcha() -> Result<(String, String), &'static str> {
    let capt = CaptchaBuilder::new()
        .length(5)
        .width(130)
        .height(40)
        .dark_mode(false)
        .complexity(1)
        .compression(40)
        .build();
    let id = nanoid!(20);
    if let Some(cache) = client::CACHE.get() {
        cache.insert(id.clone(), capt.text.clone());
        let res = cache.get(&id);
        println!("{res:?}");
    } else {
        log!(Level::Error,"获取缓存实例失败");
        Err("获取缓存实例失败")?
    }
    Ok((id.into(), capt.to_base64()))
}


pub async fn login(req_data: LoginModel) -> Result<(), &'static str> {
    // 查询验证码是否存在
    let cache = match client::CACHE.get() {
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
    }
    // 查询用户是否存在
    let mongo = match client::MONGO.get() {
        None => return Err("获取数据库实例失败"),
        Some(client) => client,
    };

    println!("username:{}", req_data.username);
    let result = match mongo.collection::<user::User>(coll::USER).find_one(None, None).await {
        Ok(value) => value,
        Err(e) => {
            println!("{e}");
            return Err("用户名不存在");
        }
    };
    println!("{:#?}", result);
    Ok(())
}
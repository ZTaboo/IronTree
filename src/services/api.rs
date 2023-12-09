use axum::extract::Path;
use axum::Json;
use futures::stream::TryStreamExt;
use mongodb::bson::doc;
use mongodb::Database;
use mongodb::options::FindOptions;

use crate::db::{coll, db_model};
use crate::model::request_model::user::AddUserModel;
use crate::utils;

// 确保引入了 TryStreamExt trait

pub async fn add_user(req_data: Json<AddUserModel>, db: Database) -> Result<(), String> {
// 查询用户名是否存在
    let count = db
        .collection::<db_model::user::UserNoPass>(coll::USER)
        .count_documents(doc! {"username":req_data.username.clone()}, None)
        .await.map_err(|e| format!("系统错误:{}", e))?;
    if count > 0 {
        Err("用户已存在,请登录")?;
    }

    let new_pass = utils::crypt::enc_password(req_data.password.as_bytes()).map_err(|e| format!("密码加密错误:{}", e))?;
    let user = db_model::user::User {
        username: req_data.username.clone(),
        password: Some(new_pass),
        avatar: Some("avatar/default.png".to_string()),
        email: Some("admin@admin.com".to_string()),
        role: vec!["管理员".to_string()],
        ..db_model::user::User::default()
    };
    db.collection::<db_model::user::User>(coll::USER)
        .insert_one(user, None)
        .await.map_err(|e| format!("添加用户错误:{}", e))?;
    Ok(())
}

pub async fn get_user(db: Database, user: String) -> Result<db_model::user::UserNoPass, String> {
    let res = db
        .collection::<db_model::user::UserNoPass>(coll::USER)
        .find_one(doc! { "username": user }, None)
        .await
        .map_err(|e| format!("数据库错误:{}", e))?.ok_or_else(|| "用户不存在")?;
    Ok(res)
}

pub async fn del_user(users: Path<String>, db: Database) -> Result<(), String> {
    let users: Vec<String> = users.split(",").map(|s| s.to_string()).collect();
    // 批量删除res
    db.collection::<db_model::user::UserNoPass>(coll::USER)
        .delete_many(doc! {"$and": [
            {"role":{"$ne":["超级管理员"]}},
            {"username":{"$in":users}}
        ]}, None)
        .await.map_err(|e| format!("删除用户错误:{}", e.to_string()))?;
    Ok(())
}

pub async fn get_users(db: Database, page_num: u64, page_size: i64, sort: String) -> Result<(Vec<db_model::user::UserInitInfo>, u64), String> {
    let skip = (page_num - 1) * page_size as u64;
    let sort = match sort.as_str() {
        "desc" => doc! { "_id": -1 },
        "asc" => doc! { "_id": 1 },
        _ => doc! { "_id": 1 },
    };
    let find_options = FindOptions::builder()
        .limit(page_size)
        .skip(skip).sort(sort)
        .build();
    let res = db
        .collection::<db_model::user::UserInitInfo>(coll::USER)
        .find(None, find_options)
        .await
        .map_err(|e| format!("数据库错误:{}", e))?;
    let users: Vec<db_model::user::UserInitInfo> = res.try_collect()
        .await
        .map_err(|e| format!("数据库错误:{}", e))?;
    let total = db
        .collection::<db_model::user::UserInitInfo>(coll::USER)
        .count_documents(None, None)
        .await
        .map_err(|e| format!("数据库错误:{}", e))?;
    Ok((users, total))
}

pub async fn search_user(db: Database, con: String, page_num: u64, page_size: i64) -> Result<(Vec<db_model::user::UserInitInfo>, u64), String> {
    let skip = (page_num - 1) * page_size as u64;
    let find_options = FindOptions::builder()
        .limit(page_size)
        .skip(skip)
        .build();
    let res = db
        .collection::<db_model::user::UserInitInfo>(coll::USER)
        .find(doc! {"username":doc!{"$regex":con.clone()}}, find_options)
        .await
        .map_err(|e| format!("数据库错误:{}", e))?;
    let users: Vec<db_model::user::UserInitInfo> = res.try_collect()
        .await
        .map_err(|e| format!("数据库错误:{}", e))?;
    let total = db
        .collection::<db_model::user::UserInitInfo>(coll::USER)
        .count_documents(doc! {"username":doc!{"$regex":con}}, None)
        .await
        .map_err(|e| format!("数据库错误:{}", e))?;
    Ok((users, total))
}
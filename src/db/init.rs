use mongodb::{Client, Database, error};
use tracing::log::{Level, log};

use crate::db::{coll, db_model};
use crate::utils::crypt::enc_password;

pub async fn init_mongo() -> error::Result<Database> {
    let uri = "mongodb://root:012359clown@localhost:27017/?authMechanism=SCRAM-SHA-1";
    let client = Client::with_uri_str(uri).await.unwrap();
    let database = client.database("iron_tree");
    init_admin(&database).await?;
    Ok(database)
}

// 初始化超级管理员用户
async fn init_admin(database: &Database) -> error::Result<()> {
    // 查询是否有数据
    let res = database.collection::<db_model::user::UserNoPass>(coll::USER).count_documents(None, None).await?;
    if res > 0 {
        return Ok(());
    }
    // 创建管理用户
    let pass = match enc_password("admin".as_bytes()) {
        Ok(res) => res,
        Err(e) => {
            log!(Level::Info,"初始化超级管理员错误：{}",e.to_string());
            return Ok(());
        }
    };
    let new_data = db_model::user::User {
        username: "admin".to_string(),
        password: Some(pass),
        nickname: Some("超级管理员".to_string()),
        role: vec!["超级管理员".to_string()],
        avatar: Some("avatar/default.png".to_string()),
        email: Some("admin@admin.com".to_string()),
        ..db_model::user::User::default()
    };
    database.collection(coll::USER).insert_one(new_data, None).await?;
    Ok(())
}
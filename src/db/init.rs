use mongodb::{Client, Database, error};
use tracing::log::{Level, log};
use crate::db::{db_model, coll};
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
    let pass = match enc_password("admin".as_bytes()) {
        Ok(res) => res,
        Err(e) => {
            log!(Level::Info,"初始化超级管理员错误：{}",e.to_string());
            return Ok(());
        }
    };
    let new_data = db_model::user::User {
        username: "admin".into(),
        password: pass,
        role: "超级管理员".into(),
    };
    database.collection(coll::USER).insert_one(new_data, None).await?;
    Ok(())
}
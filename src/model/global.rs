use moka::sync::Cache;
use mongodb::Database;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Default)]
pub struct ResData<T> {
    pub code: usize,
    pub data: T,
    pub msg: String,
}

pub struct ParsingError {
    pub code: usize,
    pub msg: String,
}

#[derive(Clone, Debug, Default)]
pub struct AppState {
    // 版本
    pub version: String,
    // 数据库
    pub mon_db: Option<Database>,
    // 缓存
    pub cache: Option<Cache<String, String>>,
}
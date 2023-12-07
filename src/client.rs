use std::sync::OnceLock;

use moka::sync::Cache;
use mongodb::Database;

// 以废弃：全局缓存实例
pub static CACHE: OnceLock<Cache<String, String>> = OnceLock::new();
// 以废弃：iron_tree数据库
pub static MONGO: OnceLock<Database> = OnceLock::new();
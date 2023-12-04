use std::sync::OnceLock;
use moka::sync::Cache;
use mongodb::Database;

// 全局缓存实例
pub static CACHE: OnceLock<Cache<String, String>> = OnceLock::new();
// iron_tree数据库
pub static MONGO: OnceLock<Database> = OnceLock::new();
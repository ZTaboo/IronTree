use std::sync::OnceLock;
use moka::sync::Cache;

// 全局缓存实例
pub static CACHE: OnceLock<Cache<String, String>> = OnceLock ::new();

use axum::http::StatusCode;
use moka::sync::Cache;
use mongodb::Database;
use serde::{Deserialize, Serialize};

// 主要返回结构体
#[derive(Serialize, Deserialize, Default)]
pub struct ResData<T> {
    pub code: u16,
    pub data: T,
    pub msg: String,
}

// 分页返回结构体
#[derive(Serialize, Deserialize, Default)]
pub struct PageData<T> {
    pub code: u16,
    pub data: T,
    pub msg: String,
    pub total: u64,
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

// 返回错误信息结构体
#[derive(Debug)]
pub struct ResError {
    pub code: u16,
    pub msg: String,
}

// json序列化错误返回信息
#[derive(Debug)]
pub struct ApiError {
    pub code: StatusCode,
    pub msg: String,
}
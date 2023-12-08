use std::sync::Arc;

use axum::extract::{Path, State};
use axum::Json;

use crate::db::db_model;
use crate::model::global::{AppState, PageData, ResData, ResError};
use crate::model::request_model::user::AddUserModel;
use crate::services;
use crate::utils::custom::{IJson, res_error};

// 登录状态检测
pub async fn ping(state: State<Arc<AppState>>) -> IJson<ResData<String>> {
    let version = state.version.clone();
    println!("ping version:{version}");
    IJson(ResData { code: 200, msg: "is ok".to_string(), ..ResData::default() })
}

// 后台添加用户
pub async fn add_user(state: State<Arc<AppState>>, req_data: Json<AddUserModel>) -> Result<IJson<ResData<String>>, ResError> {
    let db = state.mon_db.clone().ok_or_else(|| res_error(401, "连接数据库失败".to_string()))?;
    services::api::add_user(req_data.clone(), db).await.map_err(|e| res_error(401, e))?;
    Ok(IJson(ResData { code: 200, msg: "is ok".to_string(), ..ResData::default() }))
}

// 获取用户详情信息
pub async fn get_user(state: State<Arc<AppState>>, specify_user: Path<String>) -> Result<IJson<ResData<db_model::user::UserNoPass>>, ResError> {
    let db = state.mon_db.clone().ok_or_else(|| res_error(401, "连接数据库失败".to_string()))?;
    let user_info = services::api::get_user(db, specify_user.clone()).await.map_err(|e| res_error(401, e))?;
    Ok(IJson(ResData { code: 200, msg: "is ok".to_string(), data: user_info }))
}

// 删除用户
pub async fn del_user(state: State<Arc<AppState>>, req_data: Path<String>) -> Result<IJson<ResData<String>>, ResError> {
    let db = state.mon_db.clone().ok_or_else(|| res_error(401, "连接数据库失败".to_string()))?;
    services::api::del_user(req_data, db).await.map_err(|e| res_error(401, e))?;
    Ok(IJson(ResData { code: 200, msg: "is ok".to_string(), ..ResData::default() }))
}

// 获取全部用户
pub async fn get_users(state: State<Arc<AppState>>, Path((page_num, page_size)): Path<(u64, i64)>) -> Result<IJson<PageData<Vec<db_model::user::UserNoPass>>>, ResError> {
    let db = state.mon_db.clone().ok_or_else(|| res_error(401, "连接数据库失败".to_string()))?;
    let (result, total) = services::api::get_users(db, page_num, page_size).await.map_err(|e| res_error(401, e))?;
    Ok(IJson(PageData { code: 200, msg: "is ok".to_string(), data: result, total }))
}

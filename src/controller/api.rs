use std::sync::Arc;

use axum::extract::State;

use crate::model::global::{AppState, ResData};
use crate::utils::custom::IJson;

// 登录状态检测
pub async fn ping(state: State<Arc<AppState>>) -> IJson<ResData<String>> {
    let version = state.version.clone();
    println!("ping version:{version}");
    IJson(ResData { code: 200, msg: "is ok".to_string(), ..ResData::default() })
}
// 后台添加用户
pub async fn add_user() {}
use std::sync::Arc;
use axum::extract::State;

use crate::model::global::{AppState, ResData};
use crate::utils::custom::IJson;

// 登录状态检测
pub async fn ping(State(state): State<Arc<AppState>>) -> IJson<ResData<String>> {
    println!("{state:?}");
    IJson(ResData { code: 200, msg: "is ok".to_string(), ..ResData::default() })
}
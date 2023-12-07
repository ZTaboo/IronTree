use std::sync::Arc;

use axum::Router;
use axum::routing::{get, post};

use crate::controller::api;
use crate::middleware;
use crate::model::global::AppState;

pub fn api(state: Arc<AppState>) -> Router<Arc<AppState>> {
    Router::new()
        .route("/ping", get(api::ping))
        .route("/addUser",post(api::add_user))
        .layer(axum::middleware::from_fn_with_state(state, middleware::auth)) // 鉴权中间件
}


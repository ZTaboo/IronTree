use std::sync::Arc;
use axum::Router;
use axum::routing::get;

use crate::controller::api;
use crate::middleware;
use crate::model::global::AppState;

pub fn api() -> Router<Arc<AppState>> {
    Router::new()
        .route("/ping", get(api::ping))
        .layer(axum::middleware::from_fn(middleware::auth))
    // 鉴权中间件
}


use axum::Router;
use axum::routing::get;

use crate::controller::api;
use crate::middleware;

pub fn api() -> Router {
    Router::new()
        .route("/ping", get(api::ping))
        .layer(axum::middleware::from_fn(middleware::auth))     // 鉴权中间件
}


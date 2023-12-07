use std::sync::Arc;
use axum::Router;
use axum::routing::{get, post};
use tower_http::services::ServeDir;
use crate::controller::guest;
use crate::model::global::AppState;

pub fn guest() -> Router<Arc<AppState>> {
    Router::new()
        // 静态资源目录
        .nest_service("/static",ServeDir::new("static"))
        .route("/captcha", get(guest::captcha))
        .route("/login",post(guest::login))
}
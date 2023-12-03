use axum::Router;
use axum::routing::get;
use crate::controller::guest;

pub fn guest() -> Router {
    Router::new()
        .route("/", get(guest::hello))
        .route("/captcha", get(guest::captcha))
}
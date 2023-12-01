use axum::Router;
use axum::routing::get;
use crate::controller::api;

pub fn router() -> Router {
    Router::new()
        .route("/", get(api::hello))
        .route("/captcha", get(api::captcha))
}
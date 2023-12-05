use axum::Router;
use axum::routing::{get, post};
use crate::controller::guest;

pub fn guest() -> Router {
    Router::new()
        .route("/captcha", get(guest::captcha))
        .route("/login",post(guest::login))
}
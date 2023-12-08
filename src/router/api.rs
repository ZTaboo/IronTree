use std::sync::Arc;

use axum::Router;
use axum::routing::{delete, get, post};

use crate::controller::api;
use crate::middleware;
use crate::model::global::AppState;

pub fn api(state: Arc<AppState>) -> Router<Arc<AppState>> {
    Router::new()
        .route("/ping", get(api::ping))
        .route("/user", post(api::add_user))
        .route("/get_user/:specify_user", get(api::get_user))
        .route("/del_user/:users", delete(api::del_user))
        .route("/users/:page_num/:page_size", get(api::get_users))
        .layer(axum::middleware::from_fn_with_state(state, middleware::auth)) // 鉴权中间件
}

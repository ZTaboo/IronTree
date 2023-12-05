use axum::Router;
use axum::routing::get;

use crate::middleware;
use crate::model::global::ResData;
use crate::utils::custom::IJson;

pub fn api() -> Router {
    Router::new()
        .route("/ping", get(ping_fn))
        .layer(axum::middleware::from_fn(middleware::auth))
}

async fn ping_fn() -> IJson<ResData<String>> {
    IJson(ResData { ..ResData::default() })
}
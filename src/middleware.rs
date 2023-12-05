use axum::{BoxError, Json};
use axum::http::{Method, StatusCode, Uri};
use tower_http::classify::{ServerErrorsAsFailures, SharedClassifier};
use tower_http::cors::{Any, CorsLayer};
use tower_http::LatencyUnit;
use tower_http::trace::{DefaultMakeSpan, DefaultOnRequest, DefaultOnResponse, TraceLayer};
use tracing::{Level, log};
use tracing::log::log;

use crate::model::global::ResData;

//  超时中间件
pub async fn handle_timeout_error(
    method: Method,
    uri: Uri,
    err: BoxError) -> (StatusCode, Json<ResData<String>>) {
    log!(log::Level::Info,"请求超时");
    if err.is::<tower::timeout::error::Elapsed>() {
        (
            StatusCode::REQUEST_TIMEOUT,
            Json(ResData { code: 408, msg: "请求超时".into(), ..ResData::default() }),
        )
    } else {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(ResData { code: 500, msg: format!("`{} {}` failed with {}", method, uri, err), ..ResData::default() }),
        )
    }
}

//  跨域中间件
pub fn cors() -> CorsLayer {
    CorsLayer::new()
        .allow_methods(Any)
        .allow_origin(Any)
}

//  日志输出格式处理
pub fn logger() -> TraceLayer<SharedClassifier<ServerErrorsAsFailures>> {
    TraceLayer::new_for_http()
        .make_span_with(DefaultMakeSpan::new().include_headers(true))
        .on_request(DefaultOnRequest::new().level(Level::INFO))
        .on_response(DefaultOnResponse::new().level(Level::INFO).latency_unit(LatencyUnit::Micros))
}
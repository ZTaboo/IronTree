use std::sync::Arc;

use axum::{BoxError, Json};
use axum::extract::{Request, State};
use axum::http::{HeaderMap, Method, StatusCode, Uri};
use axum::middleware::Next;
use axum::response::Response;
use mongodb::bson::doc;
use tower_http::classify::{ServerErrorsAsFailures, SharedClassifier};
use tower_http::cors::{Any, CorsLayer};
use tower_http::LatencyUnit;
use tower_http::trace::{DefaultMakeSpan, DefaultOnRequest, DefaultOnResponse, TraceLayer};
use tracing::{Level, log};
use tracing::log::log;

use crate::db::{coll, db_model};
use crate::model::global::{AppState, ResData};
use crate::utils::custom::IJson;

// 鉴权中间件
pub async fn auth(State(state): State<Arc<AppState>>, header: HeaderMap, req: Request, next: Next) -> Result<Response, (StatusCode, IJson<ResData<serde_json::Value>>)> {
    // 获取token
    let auth_str = match header.get("authorization") {
        None => return Err((StatusCode::UNAUTHORIZED, IJson(ResData { code: 401, msg: "请登录".into(), ..ResData::default() }))),
        Some(value) => value.to_str().map_err(|_| (StatusCode::UNAUTHORIZED, IJson(ResData { code: 401, msg: "请求数据错误".into(), ..ResData::default() })))?,
    };

    // 获取用户名
    let username_str = match header.get("username") {
        None => return Err((StatusCode::UNAUTHORIZED, IJson(ResData { code: 401, msg: "请登录".into(), ..ResData::default() }))),
        Some(value) => value.to_str().map_err(|_| (StatusCode::UNAUTHORIZED, IJson(ResData { code: 401, msg: "请求数据错误".into(), ..ResData::default() })))?,
    };

    // 数据库查询
    let mongo = match state.mon_db.clone() {
        None => return Err((StatusCode::INTERNAL_SERVER_ERROR, IJson(ResData { code: 500, msg: "数据库错误".into(), ..ResData::default() }))),
        Some(client) => client,
    };
    let count = mongo.collection::<db_model::user::UserNoPass>(coll::USER).count_documents(doc! {"username":username_str,"token":auth_str}, None).await;
    return match count {
        Ok(value) => {
            if value > 0 {
                let req = next.run(req).await;
                Ok(req)
            } else {
                Err((StatusCode::UNAUTHORIZED, IJson(ResData { code: 401, msg: "授权失效".into(), ..ResData::default() })))
            }
        }
        Err(_) => Err((StatusCode::UNAUTHORIZED, IJson(ResData { code: 401, msg: "登陆错误".into(), ..ResData::default() }))),
    };
}

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
        .allow_headers(Any)
}

//  日志输出格式处理
pub fn logger() -> TraceLayer<SharedClassifier<ServerErrorsAsFailures>> {
    TraceLayer::new_for_http()
        .make_span_with(DefaultMakeSpan::new().include_headers(true))
        .on_request(DefaultOnRequest::new().level(Level::INFO))
        .on_response(DefaultOnResponse::new().level(Level::INFO).latency_unit(LatencyUnit::Micros))
}
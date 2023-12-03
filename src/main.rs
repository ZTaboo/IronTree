use std::fs::File;

use axum::Router;
use moka::sync::Cache;
use tower_http::{compression::CompressionLayer, limit::RequestBodyLimitLayer};
use tracing::log::{Level, log};
use tracing_subscriber::{fmt, layer::SubscriberExt, util::SubscriberInitExt};
use utoipa::{
    openapi::security::{ApiKey, ApiKeyValue, SecurityScheme},
    Modify, OpenApi,
};
use utoipa_rapidoc::RapiDoc;
use utoipa_redoc::{Redoc, Servable};
use utoipa_swagger_ui::SwaggerUi;
use iron_tree::{client, middleware};
use iron_tree::router::guest::guest;

#[tokio::main]
async fn main() {
    #[derive(OpenApi)]
    #[openapi(
    modifiers(& SecurityAddon),
    paths(
    iron_tree::controller::guest::hello,
    iron_tree::controller::guest::captcha,
    ),
    tags(
    (
    name = "iron_tree", description = "后台快速开发"
    )
    )
    )]
    struct ApiDoc;

    struct SecurityAddon;

    impl Modify for SecurityAddon {
        fn modify(&self, openapi: &mut utoipa::openapi::OpenApi) {
            if let Some(components) = openapi.components.as_mut() {
                components.add_security_scheme(
                    "api_key",
                    SecurityScheme::ApiKey(ApiKey::Header(ApiKeyValue::new("todo_apikey"))),
                )
            }
        }
    }
    init();
    // 开启日志,日志写入文件
    let file = File::create("log.log").expect("create log error");
    let file_layer = fmt::layer().with_writer(file);
    // 日志写入控制台
    tracing_subscriber::registry()
        .with(file_layer)
        .with(fmt::layer())
        .init();
    let api = guest();
    let app = Router::new()
        .merge(api)
        .merge(SwaggerUi::new("/swagger").url("/api-docs/openapi.json", ApiDoc::openapi()))
        .merge(Redoc::with_url("/redoc", ApiDoc::openapi()))
        // There is no need to create `RapiDoc::with_openapi` because the OpenApi is served
        // via SwaggerUi instead we only make rapidoc to point to the existing doc.
        .merge(RapiDoc::new("/api-docs/openapi.json").path("/rapidoc"))
        .layer(CompressionLayer::new()) // 压缩数据;未指定压缩算法，默认自动选择
        .layer(RequestBodyLimitLayer::new(4096))    // 请求数据长度限制
        .layer(middleware::cors())
        .layer(middleware::logger());
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();
    log!(Level::Info,"http://localhost:8080");
    axum::serve(listener, app).await.unwrap();
}

fn init() {
    // 缓存实例初始化
    let cache = Cache::new(10000);
    client::CACHE.set(cache).expect("初始化缓存失败");
}

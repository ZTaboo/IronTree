use std::fs::File;
use std::sync::Arc;
use std::time::Duration;

use axum::error_handling::HandleErrorLayer;
use axum::Router;
use moka::sync::Cache;
use mongodb::Database;
use tower::ServiceBuilder;
use tower_http::{compression::CompressionLayer, limit::RequestBodyLimitLayer};
use tracing::log::{Level, log};
use tracing_subscriber::{fmt, layer::SubscriberExt, util::SubscriberInitExt};

use iron_tree::{middleware, router};
use iron_tree::db::init::init_mongo;
use iron_tree::model::global::AppState;
use iron_tree::router::guest::guest;

#[tokio::main]
async fn main() {
    let (cache, mongodb) = init().await;
    // 开启日志,日志写入文件
    let file = File::create("log.log").expect("create log error");
    let file_layer = fmt::layer().with_writer(file);
    // 日志写入控制台
    tracing_subscriber::registry()
        .with(file_layer)
        .with(fmt::layer())
        .init();
    let state = Arc::new(AppState { version: "v0.0.1".to_string(), mon_db: Some(mongodb), cache: Some(cache) });
    let guest_api = guest();
    let api = router::api::api(state.clone());
    let app = Router::new()
        .merge(guest_api)
        .nest("/api", api)
        .layer(CompressionLayer::new()) // 压缩数据;未指定压缩算法，默认自动选择
        .layer(RequestBodyLimitLayer::new(4096))    // 请求数据长度限制
        .layer(middleware::cors())
        .layer(middleware::logger())
        .layer( // 超时中间件
                ServiceBuilder::new()
                    .layer(HandleErrorLayer::new(middleware::handle_timeout_error))
                    .timeout(Duration::from_secs(30)),
        )
        .with_state(state);
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();
    log!(Level::Info,"http://localhost:8080");
    axum::serve(listener, app).await.unwrap();
}


async fn init() -> (Cache<String, String>, Database) {
    // 缓存实例初始化;超时30秒验证码失效
    let cache = Cache::builder()
        .max_capacity(1000)
        .time_to_live(Duration::from_secs(30))
        .build();
    // client::CACHE.set(cache).expect("初始化缓存失败");
    // 数据库实例
    let mongo_client = init_mongo().await.expect("连接数据库失败");
    // client::MONGO.set(mongo_client).expect("数据库全部变量设置失败");
    (cache, mongo_client)
}


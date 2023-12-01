use std::fs::File;
use axum::Router;
use moka::sync::Cache;
use tower_http::compression::CompressionLayer;
use tracing_subscriber::{fmt, layer::SubscriberExt, util::SubscriberInitExt};

use iron_tree::{client, middleware};
use iron_tree::router::router;

#[tokio::main]
async fn main() {
    init();
    // 开启日志,日志写入文件
    let file = File::create("log.log").expect("create log error");
    let file_layer = fmt::layer().with_writer(file);
    // 日志写入控制台
    tracing_subscriber::registry().with(file_layer).with(fmt::layer()).init();
    let api = router();
    let app = Router::new()
        .merge(api)
        .layer(CompressionLayer::new()) // 压缩数据
        .layer(middleware::cors())
        .layer(middleware::logger());
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

fn init() {
// 缓存实例初始化
    let cache = Cache::new(10000);
    client::CACHE.set(cache).expect("初始化缓存失败");
}
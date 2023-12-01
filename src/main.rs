use axum::Router;
use iron_tree::router::router;
use iron_tree::middleware;

#[tokio::main]
async fn main() {
    let mut app = Router::new();
    app = router(app).await
        .layer(middleware::cors());
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

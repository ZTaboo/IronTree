use axum::Router;
use axum::routing::get;
use crate::controller;

pub async fn router(app: Router) -> Router {
    app.route("/", get(controller::api::hello))
}
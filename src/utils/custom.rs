use axum::extract::FromRequest;
use axum::extract::rejection::JsonRejection;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use serde::Serialize;
use serde_json::json;

// 定义自己的Json extract
// create an extractor that internally uses `axum::Json` but has a custom rejection
#[derive(FromRequest)]
#[from_request(via(axum::Json), rejection(ApiError))]
pub struct IJson<T>(pub T);

// We implement `IntoResponse` for our extractor so it can be used as a response
impl<T: Serialize> IntoResponse for IJson<T> {
    fn into_response(self) -> axum::response::Response {
        let Self(value) = self;
        axum::Json(value).into_response()
    }
}

// We create our own rejection type
#[derive(Debug)]
pub struct ApiError {
    pub code: StatusCode,
    pub msg: String,
}

// We implement `From<JsonRejection> for ApiError`
impl From<JsonRejection> for ApiError {
    fn from(rejection: JsonRejection) -> Self {
        Self {
            code: rejection.status(),
            msg: rejection.body_text(),
        }
    }
}

// We implement `IntoResponse` so `ApiError` can be used as a response
impl IntoResponse for ApiError {
    fn into_response(self) -> axum::response::Response {
        let payload = json!({
            "code": self.code.as_u16(),
            "msg": self.msg,
        });

        (self.code, axum::Json(payload)).into_response()
    }
}
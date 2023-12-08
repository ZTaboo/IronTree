use axum::extract::FromRequest;
use axum::extract::rejection::JsonRejection;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Deserializer, Serialize, Serializer};
use serde::de::Error;
use serde_json::json;

use crate::model::global::{ApiError, ResError};

// 自定义api错误返回
pub fn res_error(code: u16, msg: String) -> ResError {
    ResError { code, msg }
}

// 自定义objectId序列化方法
pub fn serialize_id<S>(id: &String, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
{
    let oid = ObjectId::parse_str(id).map_err(serde::ser::Error::custom)?;
    oid.serialize(serializer)
}

// 自定义objectId反序列化方法
pub fn deserialize_id<'de, D>(deserializer: D) -> Result<String, D::Error>
    where
        D: Deserializer<'de>,
{
    let s: Option<String> = Option::deserialize(deserializer)?;
    match s {
        Some(ref s) if s.is_empty() =>
            Err(D::Error::custom("Empty string is not a valid ObjectId")),
        Some(s) => ObjectId::parse_str(&s)
            .map(|oid| oid.to_hex())
            .map_err(|e| D::Error::custom(e.to_string())),
        None => Err(D::Error::custom("Null value is not a valid ObjectId")),
    }
}

// 自定义接口错误返回信息
impl IntoResponse for ResError {
    fn into_response(self) -> axum::response::Response {
        let payload = json!({
            "code": self.code,
            "msg": self.msg,
        });

        (StatusCode::OK, axum::Json(payload)).into_response()
    }
}

// 定义自己的Json extract
#[derive(FromRequest)]
#[from_request(via(axum::Json), rejection(ApiError))]
pub struct IJson<T>(pub T);

impl<T: Serialize> IntoResponse for IJson<T> {
    fn into_response(self) -> axum::response::Response {
        let Self(value) = self;
        axum::Json(value).into_response()
    }
}

impl From<JsonRejection> for ApiError
{
    fn from(rejection: JsonRejection) -> Self {
        Self {
            code: rejection.status(),
            msg: rejection.body_text(),
        }
    }
}

impl IntoResponse for ApiError {
    fn into_response(self) -> axum::response::Response {
        let payload = json!({
            "code": self.code.as_u16(),
            "msg": self.msg,
        });

        (self.code, axum::Json(payload)).into_response()
    }
}
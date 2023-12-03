use std::collections::HashMap;
use axum::Json;

use crate::model::global::ResData;
use crate::services::get_captcha;

#[utoipa::path(
get,
path = "/",
responses(
(status = 200, description = "hello world")
)
)]
pub async fn hello() -> &'static str {
    return "hello world";
}

#[utoipa::path(
get,
path = "/captcha",
responses(
(status = 200, description = "获取验证码", body = ResData<HashMap<String, String>>)
)
)]
pub async fn captcha() -> Json<ResData<HashMap<String, String>>> {
    let (id, base64) = get_captcha().unwrap();
    let mut res_data = HashMap::new();
    res_data.insert("id".into(), id);
    res_data.insert("base64".into(), base64);
    Json(ResData { code: 200, data: res_data })
}
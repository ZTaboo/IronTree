use axum::Json;

use crate::model::global::ResData;
use crate::model::response_model;
use crate::services::get_captcha;

pub async fn hello() -> &'static str {
    return "hello world";
}

pub async fn captcha() -> Json<ResData<response_model::guest::CaptchaModel>> {
    let (id, base64) = get_captcha().unwrap();
    let res_data = response_model::guest::CaptchaModel {
        id,
        base64,
    };
    Json(ResData { code: 200, data: res_data })
}
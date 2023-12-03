use serde::Serialize;

#[derive(Serialize)]
pub struct CaptchaModel {
    pub id: String,
    pub base64: String,
}
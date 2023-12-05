use serde::Serialize;

#[derive(Serialize,Default)]
pub struct CaptchaModel {
    pub id: String,
    pub base64: String,
}
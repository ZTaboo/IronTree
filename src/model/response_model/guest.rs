use serde::{Deserialize, Serialize};

#[derive(Serialize, Default)]
pub struct CaptchaModel {
    pub id: String,
    pub base64: String,
}

// 登陆成功返回值
#[derive(Serialize, Deserialize, Default)]
pub struct LoginModel {
    pub username: String,
    pub avatar: Option<String>,
    pub role: Vec<String>,
    pub token: String,
}
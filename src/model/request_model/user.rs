use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Default)]
pub struct LoginModel {
    pub username: String,
    pub password: String,
    // 验证码
    pub captcha: String,
    #[serde(alias = "captchaId")]
    pub captcha_id: String,
}


#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AddUserModel {
    pub email: Option<String>,
    pub gender: Option<u8>,
    pub nickname: String,
    pub password: Option<String>,
    pub phone: Option<String>,
    pub role: Vec<String>,
    pub username: String,
}

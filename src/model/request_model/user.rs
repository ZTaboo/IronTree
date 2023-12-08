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
    #[serde(rename = "username")]
    pub username: String,

    #[serde(rename = "password")]
    pub password: String,

    #[serde(rename = "role")]
    pub role: String,
}

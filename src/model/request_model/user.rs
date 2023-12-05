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
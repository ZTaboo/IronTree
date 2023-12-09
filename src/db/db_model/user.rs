use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Default, Clone)]
pub struct User {
    pub username: String,
    pub password: Option<String>,
    // 邮箱
    pub email: Option<String>,
    // 昵称
    pub nickname: Option<String>,
    // 性别
    pub gender: Option<u8>,
    // 电话
    pub phone: Option<String>,
    // 头像
    pub avatar: Option<String>,
    // 权限
    pub role: Vec<String>,
    pub token: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Default, Clone)]
pub struct UserNoPass {
    pub username: String,
    #[serde(skip_deserializing, skip_serializing_if = "Option::is_none")]
    pub password: Option<String>,
    // 邮箱
    pub email: Option<String>,
    // 昵称
    pub nickname: Option<String>,
    // 性别
    pub gender: Option<u8>,
    // 电话
    pub phone: Option<String>,
    pub avatar: Option<String>,
    pub role: Vec<String>,
    pub token: Option<String>,
}

// 用户基础信息
#[derive(Serialize, Deserialize, Debug, Default, Clone)]
pub struct UserInitInfo {
    pub username: String,
    // 邮箱
    pub email: Option<String>,
    // 昵称
    pub nickname: Option<String>,
    // 性别
    pub gender: Option<u8>,
    // 电话
    pub phone: Option<String>,
    pub avatar: Option<String>,
    pub role: Vec<String>,
}
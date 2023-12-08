use serde::{Deserialize, Serialize};


#[derive(Serialize, Deserialize, Debug, Default, Clone)]
pub struct UserNoPass {
    pub username: String,
    #[serde(skip_deserializing, skip_serializing_if = "Option::is_none")]
    pub password: Option<String>,
    pub avatar: Option<String>,
    pub role: String,
    pub token: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Default, Clone)]
pub struct User {
    pub username: String,
    pub password: Option<String>,
    pub avatar: Option<String>,
    pub role: String,
    pub token: Option<String>,
}
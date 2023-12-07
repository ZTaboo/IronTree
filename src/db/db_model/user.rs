use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Default)]
pub struct User {
    pub username: String,
    pub password: String,
    pub avatar: Option<String>,
    pub role: String,
    pub token: Option<String>,
}
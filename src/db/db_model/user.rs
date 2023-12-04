use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct User {
    pub username: String,
    pub password: String,
    pub role: String,
}
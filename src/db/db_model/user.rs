use serde::{Deserialize, Serialize};

use crate::utils::custom::{deserialize_id, serialize_id};

#[derive(Serialize, Deserialize, Debug, Default, Clone)]
pub struct User {
    #[serde(rename = "_id", serialize_with = "serialize_id", deserialize_with = "deserialize_id")]
    pub _id: String,
    pub username: String,
    pub password: String,
    pub avatar: Option<String>,
    pub role: String,
    pub token: Option<String>,
}


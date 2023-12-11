use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Default, Clone)]
pub struct Role{
    #[serde(skip_serializing_if = "Option::is_none")]
    pub _id: Option<ObjectId>,
    pub name: String,
}
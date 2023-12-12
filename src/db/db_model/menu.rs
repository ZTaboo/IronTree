use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Default, Clone)]
pub struct Menu {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub _id: Option<ObjectId>,
    pub parent: String,
    // 菜单名称
    pub name: String,
    // 排序ID
    pub sort: u32,
    pub menu_type: String,
    pub icon: Option<String>,
    pub router: String,
    pub role: Option<String>,
}
use serde::{Deserialize, Serialize};

#[derive(Serialize,Deserialize,Clone,Debug)]
pub struct AddMenuModel{
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
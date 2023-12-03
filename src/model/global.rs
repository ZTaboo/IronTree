use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Serialize, Deserialize,ToSchema,Clone)]
pub struct ResData<T> {
    pub code: usize,
    pub data: T,
}
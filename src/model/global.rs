use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct ResData<T> {
    pub code: usize,
    pub data: T,
}
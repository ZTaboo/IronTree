use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Default)]
pub struct ResData<T> {
    pub code: usize,
    pub data: T,
    pub msg: String,
}

pub struct ParsingError {
    pub code: usize,
    pub msg: String,
}
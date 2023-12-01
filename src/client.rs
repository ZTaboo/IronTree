use std::cell::OnceCell;
use std::sync::OnceLock;
use moka::sync::Cache;

pub static CACHE: OnceLock<Cache<String, String>> = OnceLock ::new();

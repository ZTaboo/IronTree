use axum::Json;
use captcha_rs::CaptchaBuilder;
use crate::client::CACHE;

use crate::model::global::ResData;

pub async fn hello() -> &'static str {
    return "hello world";
}

pub async fn captcha() -> Json<ResData<String>> {
    let capt = CaptchaBuilder::new()
        .length(5)
        .width(130)
        .height(40)
        .dark_mode(false)
        .complexity(1)
        .compression(40)
        .build();
    if let Some(cache) = CACHE.get() {
        cache.insert("key1".into(), capt.text.clone());
        let res = cache.get("key1");
        println!("{res:?}");
    }
    Json(ResData { code: 200, data: capt.to_base64() })
}
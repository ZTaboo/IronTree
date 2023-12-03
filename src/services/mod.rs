use captcha_rs::CaptchaBuilder;
use nanoid::nanoid;
use tracing::log::{Level, log};
use crate::client::CACHE;

pub mod guest;

pub fn get_captcha() -> Result<(String, String), ()> {
    let capt = CaptchaBuilder::new()
        .length(5)
        .width(130)
        .height(40)
        .dark_mode(false)
        .complexity(1)
        .compression(40)
        .build();
    let id = nanoid!(20);
    if let Some(cache) = CACHE.get() {
        cache.insert(id.clone(), capt.text.clone());
        let res = cache.get(&id);
        println!("{res:?}");
    } else {
        log!(Level::Error,"获取缓存实例失败")
    }
    Ok((id.into(), capt.to_base64()))
}
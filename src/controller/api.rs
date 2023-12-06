use crate::model::global::ResData;
use crate::utils::custom::IJson;

// 登录状态检测
pub async fn ping() -> IJson<ResData<String>> {
    IJson(ResData { code: 200, msg: "is ok".to_string(), ..ResData::default() })
}
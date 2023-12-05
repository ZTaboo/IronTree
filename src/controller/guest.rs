use crate::model::global::ResData;
use crate::model::request_model::user::LoginModel;
use crate::model::response_model;
use crate::services;
use crate::utils::custom::IJson;

pub async fn captcha() -> IJson<ResData<response_model::guest::CaptchaModel>> {
    let (id, base64) = match services::guest::get_captcha() {
        Ok(val) => val,
        Err(e) => {
            return IJson(ResData {
                code: 500,
                data: response_model::guest::CaptchaModel {
                    id: "".into(),
                    base64: "".into(),
                },
                msg: e.to_string(),
            });
        }
    };
    let res_data = response_model::guest::CaptchaModel {
        id,
        base64,
    };
    IJson(ResData { code: 200, data: res_data, ..ResData::default() })
}

pub async fn login(IJson(req_data): IJson<LoginModel>) -> IJson<ResData<response_model::guest::LoginModel>> {
    let (user, token) = match services::guest::login(req_data.clone()).await {
        Ok(value) => value,
        Err(e) => return IJson(ResData { code: 500, msg: e.to_string(), ..ResData::default() }),
    };
    IJson(ResData { code: 200, data: response_model::guest::LoginModel { username: user.username, role: user.role, token: token.clone() }, ..ResData::default() })
}
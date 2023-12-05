#[allow(unused_imports)]
use super::crypt::{enc_password, ver_password};

// 生成密码与校验密码
#[test]
fn test_env_password() {
    if let Ok(res) = enc_password(b"hello world") {
        println!("result:{res}")
    }
    let res = ver_password(b"helloworld", "$argon2id$v=19$m=19456,t=2,p=1$RUDpcfd9hyzxX/Xm3MzZew$8jadRKuIG7pFj+qr73sQarND7NqnPvdf7smeOmprv6E");
    println!("ver result:{res}")
}
use argon2::{Argon2, PasswordHash, PasswordHasher, PasswordVerifier};
use argon2::password_hash::rand_core::OsRng;
use argon2::password_hash::SaltString;

// 加密密码
pub fn enc_password(password: &[u8]) -> Result<String, argon2::password_hash::Error> {
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    let res = argon2.hash_password(password, &salt)?.to_string();
    Ok(res)
}

pub fn ver_password(password: &[u8], db_password: &str) -> bool {
    let res = PasswordHash::new(db_password).unwrap();
    Argon2::default().verify_password(password, &res).is_ok()
}
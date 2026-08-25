# Rust Testing Reference

แนวทางการเขียน tests ใน Rust ที่ครอบคลุมและเชื่อถือได้

เขียน tests ที่ครอบคลุมและเชื่อถือได้

- ใช้ `#[cfg(test)]` สำหรับ unit tests inline กับ source code
- ใช้ `tests/` สำหรับ integration tests
- ใช้ `proptest` สำหรับ property-based testing
- รัน `cargo test --doc` แยกจาก `cargo nextest run`
- ใช้ `assert!`, `assert_eq!`, `assert_ne!` สำหรับ assertions
- ใช้ `#[should_panic]` สำหรับ testing panic conditions

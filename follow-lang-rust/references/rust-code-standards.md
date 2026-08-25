# Rust Code Standards Reference

แนวทางการเขียน Rust code ตาม Rust API Guidelines และ naming conventions

ทำตาม Rust API Guidelines และ naming conventions

- ทำตาม Rust naming conventions (RFC 430)
- Implement common traits: Copy, Clone, Eq, PartialEq, Ord, PartialOrd, Hash, Debug, Display, Default
- ใช้ traits สำหรับ abstraction
- จัดเรียง imports: std, external, internal
- ใช้ `crate::` สำหรับ internal imports
- ไม่ใช้ `unwrap()` ใน production code
- ใช้ `?` แทน `unwrap()` หรือ `try!`
- ตั้งค่า `forbid unsafe_code` ใน workspace
- ใช้ builder pattern สำหรับ complex constructors
- ใช้ newtype pattern สำหรับ domain-specific types
- ใช้ `clippy::correctness` เป็น `deny`, `clippy::perf` เป็น `deny`
- ใช้ `clippy::style`, `clippy::suspicious` เป็น `warn`
- ตั้งค่า `dbg_macro`, `todo`, `print_stdout`, `print_stderr` เป็น `warn` (deny ใน CI)

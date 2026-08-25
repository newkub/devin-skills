# Rust Documentation Reference

แนวทางการเขียน documentation สำหรับ public API ใน Rust

เขียน documentation ครบถ้วนสำหรับ public API

- ใช้ `//!` สำหรับ crate-level documentation
- ใช้ `#![warn(missing_docs)]` หรือ `#![deny(missing_docs)]` สำหรับ crate-level enforcement
- Public API ทุกอย่างควรมี documentation
- Examples ใช้ `?` ไม่ใช่ `unwrap` หรือ `try!`
- Function docs ควร include error, panic, safety considerations
- ใช้ `# Errors`, `# Panics`, `# Safety` sections ตามความเหมาะสม
- ตั้งค่า `RUSTDOCFLAGS="-D rustdoc::all"` ใน CI

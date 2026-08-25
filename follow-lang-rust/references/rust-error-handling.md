# Rust Error Handling Reference

แนวทางการจัดการ errors ใน Rust ด้วย patterns ที่เหมาะสมกับ context

ใช้ error handling patterns ที่เหมาะสมกับ context

- ใช้ `thiserror` สำหรับ library errors
- ใช้ `anyhow` สำหรับ application errors
- กำหนด error types ชัดเจนด้วย `#[from]`
- เพิ่ม context ด้วย `.context()`
- Error types ควร implement `std::error::Error`

# Rust Dependency Management Reference

แนวทางการจัดการ dependencies ใน Rust อย่างเป็นระบบ

จัดการ dependencies อย่างมีระบบ

- กำหนด `rust-version` (MSRV) ใน `Cargo.toml`
- ใช้ feature flags สำหรับ optional functionality
- ลด dependencies ให้น้อยที่สุดที่จำเป็น
- ใช้ `[workspace.dependencies]` สำหรับ shared dependency versions
- ตรวจสอบ dependencies sorted ด้วย `cargo sort`
- ใช้ `cargo outdated` สำหรับตรวจสอบ outdated dependencies

# Rust Project Structure and Configuration Reference

แนวทางการจัดโครงสร้าง Rust project และตั้งค่า configuration files สำหรับ Clean Architecture และ workspace patterns

## Project Structure

ใช้ Clean Architecture และ workspace patterns เพื่อ maintainability

- ใช้ workspace สำหรับ multi-crate projects
- แยก concerns ตาม layers: domain, application, infrastructure
- ใช้ `crates/` สำหรับ workspace members
- ตั้งชื่อไฟล์ด้วย snake_case
- ตั้งชื่อ types ด้วย PascalCase
- ใช้ `mod.rs` เป็น barrel exports เท่านั้น

## Configuration

ตั้งค่า configuration files ให้ถูกต้อง

- ตั้งค่า `Cargo.toml` สำหรับ workspace หรือ single crate
- ตั้งค่า `.cargo/config.toml` ด้วย `[build] jobs = 4`
- ตั้งค่า `[profile.dev]` มี `debug = "line-tables-only"` และ `incremental = true`
- ตั้งค่า `[profile.dev.package."*"]` มี `debug = false`
- ตั้งค่า `[profile.release]` มี `lto = true`, `opt-level = "z"`, `strip = true`, `codegen-units = 1`, `panic = "abort"`
- ตั้งค่า `rust-toolchain.toml` สำหรับ lock Rust version
- ตั้งค่า `rust-version` ใน workspace package
- สร้าง `justfile` สำหรับ development scripts
- ตั้งค่า sccache สำหรับ shared compilation cache

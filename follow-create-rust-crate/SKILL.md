---
name: follow-create-rust-crate
description: สร้าง Rust library crate ด้วย Cargo ตาม best practices
related:
  - follow-create-sdk
  - follow-lang-rust
  - run-test
  - follow-release
  - report-table
---

## Goal

สร้าง Rust library crate ด้วย Cargo ทีมี public API ชัดเจน เอกสารครบ ทดสอบผ่าน และพร้อม publish ไป crates.io

## Scope

ใช้สำหรับสร้าง library crate เป้น pure Rust หรือ FFI ครอบคลุม `Cargo.toml`, `src/lib.rs`, tests, examples, documentation, และ CI

## Execute

### 1. Setup Project

> Goal: สร้างโครงสร้าง crate

1. รัน `cargo new --lib <crate-name>`
2. สร้าง `justfile`, `rust-toolchain.toml`, `.gitignore`, `LICENSE`, `README.md`
3. สร้าง directories `src/`, `tests/`, `examples/`, `benches/` ถ้าจำเป็น
4. แยก modules ตาม responsibility

### 2. Configure Cargo.toml

> Goal: กำหนด crate metadata และ build profiles

1. ระบุ `name`, `version`, `edition`, `description`, `license`, `repository`, `keywords`, `categories`
2. ตั้ง `edition = "2024"`
3. ตั้ง `rust-version` ถ้าจำเป็น
4. ตั้งค่า `[lib]`, `crate-type` เป้น `["lib"]` หรือ `["cdylib"]` สำหรับ FFI
5. ตั้งค่า `[profile.dev]` และ `[profile.release]`

### 3. Write Public API

> Goal: ออกแบบ `lib.rs` ให้ชัดเจน

1. ใช้ `pub mod` สำหรับ modules
2. ใช้ `pub use` สำหรับ re-exports ที user ใช้บ่อย
3. เขียน doc comments (`///`) บน public types และ functions
4. ใช้ `#[cfg(...)]` สำหรับ feature flags

### 4. Implement Modules

> Goal: แยก implementation ตาม concern

1. สร้าง modules ใน `src/{module}.rs`
2. ใช้ `mod.rs` หรือ `src/{module}.rs` ตาม edition 2024
3. ใช้ `thiserror` สำหรับ error types
4. ไม่ใช้ `unwrap()` หรือ `expect()` ใน library code

### 5. Add Tests

> Goal: ทดสอบ unit และ integration

1. สร้าง `tests/` สำหรับ integration tests
2. สร้าง `#[cfg(test)] mod tests` ใน `src/`
3. ใช้ `benches/` สำหรับ benchmarks ถ้าจำเป็น
4. รัน `cargo test`, `cargo clippy`, `cargo fmt --check`

### 6. Add Documentation

> Goal: สร้าง rustdoc

1. เขียน doc comments สำหรับทุก public item
2. ใช้ `# Examples` ใน doc comments
3. รัน `cargo doc --no-deps`
4. ตรวจสอบว่า docs ไม่มี broken links

### 7. CI And Release

> Goal: ตั้งค่า CI และ release

1. สร้าง `.github/workflows/ci.yml` ดำเนินการ `test`, `clippy`, `fmt`, `doc`
2. สร้าง `.github/workflows/release.yml` สำหรับ `cargo publish`
3. ทำ `/follow-release` เมื่อ publish

### 8. Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

- ใช้ `snake_case` สำหรับ modules, functions, variables
- ใช้ `PascalCase` สำหรับ types, traits
- ใช้ `thiserror` สำหรับ library errors, `anyhow` สำหรับ examples/binaries
- ไม่ใช้ `unwrap()` ใน library code
- ระบุ `edition = "2024"`
- `crate-type` เป้น `["lib"]` ยกเว้นต้องใช้ FFI
- ดู `references/rust-crate.md` สำหรับ Cargo, rustdoc, publishing

## Expected Outcome

- Rust crate build ผ่าน `cargo build`
- `cargo test` ผ่าน
- `cargo clippy` ไม่มี warnings
- `cargo doc` สร้างเอกสารได้
- Public API ชัดเจนผ่าน `lib.rs`
- พร้อม publish ไป crates.io

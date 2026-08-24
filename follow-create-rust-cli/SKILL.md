---
name: follow-create-rust-cli
description: สร้าง CLI applications ด้วย Rust ตาม best practices
---

## Goal

สร้าง CLI applications ด้วย Rust ที่มีประสิทธิภาพสูง พร้อม type safety และ zero-cost abstractions

## Scope

ใช้สำหรับสร้าง CLI applications ด้วย Rust runtime

## Execute

### 1. Setup Project Structure
> Goal: Setup Project Structure

สร้างโครงสร้างโปรเจกต์ตามมาตรฐาน

1. สร้าง project ด้วย `cargo new --name <project> <path>`
2. สร้าง directories: `src/cli/`, `src/services/`, `src/types/`, `src/utils/`
3. แยก concerns: business logic, CLI interface, utilities
4. สร้าง entry point: `src/main.rs` สำหรับ binary, `src/lib.rs` สำหรับ library
5. ถ้า project มีหลาย binaries: สร้างใน `src/bin/`

### 2. Configure Dependencies
> Goal: Configure Dependencies

ตั้งค่า dependencies ใน `Cargo.toml`

1. เพิ่ม CLI dependencies: `clap` (argument parsing), `serde` (serialization), `serde_json` (JSON)
2. เพิ่ม logging: `tracing`, `tracing-subscriber`
3. เพิ่ม error handling: `thiserror` (library), `anyhow` (application)
4. เพิ่ม colored output: `colored` หรือ `nu-ansi-term`
5. เพิ่ม progress indicators: `indicatif`
6. เพิ่ม interactive prompts: `dialoguer` หรือ `inquire`
7. เพิ่ม table output: `comfy-table` หรือ `prettytable-rs`
8. ตั้งค่า `edition = "2024"` ใน `Cargo.toml`

### 3. Configure Build Profiles
> Goal: Configure Build Profiles

ตั้งค่า build profiles สำหรับ development และ production

1. ตั้งค่า `[profile.dev]` ด้วย `debug = "line-tables-only"` และ `incremental = true`
2. ตั้งค่า `[profile.release]` ด้วย `lto = true`, `opt-level = "z"`, `strip = true`, `codegen-units = 1`, `panic = "abort"`
3. ตั้งค่า `[profile.dev.package."*"]` ด้วย `debug = false` เพื่อ speed up deps compilation

### 4. Setup Scripts
> Goal: Setup Scripts

ตั้งค่า development scripts ใน `justfile`

1. เพิ่ม `dev` recipe: `cargo watch -x run`
2. เพิ่ม `build` recipe: `cargo build --release`
3. เพิ่ม `lint` recipe: `cargo clippy -- -D warnings && cargo fmt --check`
4. เพิ่ม `test` recipe: `cargo nextest run && cargo test --doc`
5. เพิ่ม `run` recipe: `cargo run --`

### 5. Development Workflow
> Goal: Development Workflow

ใช้ development workflow ที่มีประสิทธิภาพ

1. ใช้ `cargo watch -x run` สำหรับ development พร้อม watch mode
2. ใช้ `cargo build --release` สำหรับ production build
3. ใช้ `cargo clippy -- -D warnings` สำหรับ code quality checks
4. ใช้ `cargo fmt` สำหรับ formatting

### Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

### 1. Project Structure

โครงสร้างต้องถูกต้อง

- แยก concerns: business logic, CLI interface, utilities
- ใช้ Clean Architecture หรือ Layered Architecture
- แยก types ไว้ใน `src/types/`
- ใช้ `mod.rs` สำหรับ barrel exports
- ตั้งชื่อไฟล์ด้วย snake_case
- ตั้งชื่อ types ด้วย PascalCase

### 2. CLI Design

ออกแบบ CLI ให้ใช้งานง่าย

- ใช้ `clap` v4 สำหรับ argument parsing พร้อม derive macros
- ใช้ subcommands สำหรับ complex CLIs
- ใช้ `#[command(version, about)]` สำหรับ auto-generated help
- ใช้ `clap::Parser` derive สำหรับ type-safe argument parsing
- ใช้ `clap::Subcommand` สำหรับ subcommands
- กำหนด `#[arg(short, long, value_name = "FILE")]` สำหรับ arguments
- ใช้ `clap_complete` สำหรับ shell completions (bash, zsh, fish, powershell)

### 3. Error Handling

ใช้ error handling patterns ที่เหมาะสม

- ใช้ `thiserror` สำหรับ library errors
- ใช้ `anyhow` สำหรับ application errors
- กำหนด error types ชัดเจนด้วย `#[from]`
- เพิ่ม context ด้วย `.context()`
- ไม่ใช้ `unwrap()` ใน production code
- ใช้ `?` แทน `unwrap()` หรือ `expect()`

### 4. Output Formatting

จัดรูปแบบ output ให้อ่านง่าย

- ใช้ `colored` หรือ `nu-ansi-term` สำหรับ terminal colors
- ใช้ `indicatif` สำหรับ progress bars และ spinners
- ใช้ `comfy-table` หรือ `prettytable-rs` สำหรับ table output
- ใช้ `serde_json::to_string_pretty` สำหรับ JSON output
- ใช้ `tracing` สำหรับ structured logging
- ใช้ `dialoguer` หรือ `inquire` สำหรับ interactive prompts

### 5. Build Configuration

ตั้งค่า build tools อย่างเหมาะสม

- ใช้ `edition = "2024"` ใน `Cargo.toml`
- ตั้งค่า `[profile.release]` ด้วย `lto = true`, `opt-level = "z"`, `strip = true`
- ตั้งค่า `rust-toolchain.toml` สำหรับ lock Rust version
- ใช้ `cargo-watch` สำหรับ development watch mode
- ใช้ `cargo-nextest` สำหรับ parallel test execution

### 6. Development Workflow

ใช้ scripts ที่มีประสิทธิภาพ

- ใช้ `cargo watch` สำหรับ development watch mode
- ใช้ `justfile` สำหรับ development scripts
- รัน `cargo clippy` และ `cargo fmt` ก่อน commit
- ใช้ `cargo nextest run` สำหรับ fast test execution

## Expected Outcome

- CLI project ที่มีโครงสร้างที่ดีและ maintainable
- Development workflow ที่มีประสิทธิภาพ
- Type-safe CLI application พร้อมสำหรับ production
- Zero-cost abstractions และ memory safety
- Error handling ที่ robust
- Output ที่อ่านง่ายพร้อม colors และ formatting

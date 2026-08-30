---
name: follow-create-rust-cli
description: สร้าง CLI applications ด้วย Rust ตาม context และ best practices
related:
  - follow-create-cli
  - follow-tool-cargo
  - follow-architecture
  - follow-flat-folders
  - rethink
  - follow-my-tech-stack
  - review-techstack
  - review-architecture
---
## Goal

สร้าง CLI applications ด้วย Rust ที่มีประสิทธิภาพสูง พร้อม type safety และ zero-cost abstractions

## Scope

ใช้สำหรับสร้าง CLI applications ด้วย Rust runtime — ถ้ายังไม่ชัดว่า Rust หรือ Bun ให้ใช้ `/follow-create-cli` เลือก stack ก่อน

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack ก่อนสร้าง

1. ทำ `/follow-my-tech-stack` เพื่อสรุป tech stack ที่ใช้
2. ทำ `/review-techstack` เพื่อ review tech stack, dependencies, และ library design
3. บันทึกเหตุผลที่เลือก stack และ libraries สำหรับ reference ต่อไป

### 2. Decide Architecture

> Goal: เลือก architecture ที่เหมาะสมกับ CLI

1. ถ้ายังไม่ชัด Rust หรือ Bun → ทำ `/follow-create-cli` ก่อน
2. ทำ `/follow-architecture` หรือ `/review-architecture` เพื่อประเมิน context
3. เลือก architecture ตามลักษณะงาน:
   - CLI ง่ายๆ มี subcommands ไม่กี่ตัว → Command/Handler split
   - ต้อง support หลาย output modes (TTY/JSON/agent) → Functional Core / Imperative Shell
   - มีหลาย backend/IO ซับซ้อน ต้อง test สูง → Hexagonal / Ports & Adapters
4. บันทึกเหตุผลที่เลือก architecture นี้

### 3. Setup Project Structure

> Goal: สร้างโครงสร้างโปรเจกต์ตาม architecture ที่เลือก

สร้างโครงสร้างโปรเจกต์ตาม template ใน [references/project-structure-and-config.md](references/project-structure-and-config.md)

1. สร้าง project ด้วย `cargo new --name <project> <path>`
2. สร้าง directories ตาม architecture ที่เลือก:
   - Command/Handler split: `src/cli/`, `src/commands/`, `src/services/`, `src/output.rs`, `src/config.rs`
   - Functional Core: `src/core/`, `src/shell/`, `src/cli/`, `src/output.rs`
   - Hexagonal: `src/core/`, `src/ports/`, `src/app/`, `src/adapters/`, `src/commands/`, `src/wiring.rs`
3. แยก concerns: CLI parsing, business logic, output, external I/O
4. สร้าง entry point: `src/main.rs` สำหรับ binary, `src/lib.rs` สำหรับ library
5. ถ้า project มีหลาย binaries: สร้างใน `src/bin/`
6. ถ้า directory ซ้อนลึกเกิน 3 ระดับและไม่จำเป็น → ทำ `/follow-flat-folders`

### 4. Configure Dependencies

> Goal: เพิ่ม dependencies ที่จำเป็นสำหรับ CLI ใน `Cargo.toml`

ตั้งค่า dependencies ใน `Cargo.toml` — ดูตัวอย่างใน [references/project-structure-and-config.md](references/project-structure-and-config.md)

1. เพิ่ม CLI dependencies: `clap` (argument parsing), `serde` (serialization), `serde_json` (JSON)
2. เพิ่ม logging: `tracing`, `tracing-subscriber`
3. เพิ่ม error handling: `thiserror` (library), `anyhow` (application)
4. เพิ่ม colored output: `colored` หรือ `nu-ansi-term`
5. เพิ่ม progress indicators: `indicatif`
6. เพิ่ม interactive prompts: `dialoguer` หรือ `inquire`
7. เพิ่ม table output: `comfy-table` หรือ `prettytable-rs`
8. ตั้งค่า `edition = "2024"` ใน `Cargo.toml`

### 5. Configure Build Profiles

> Goal: ตั้งค่า build profiles สำหรับ development และ production

ตั้งค่า build profiles สำหรับ development และ production — ดูตัวอย่างใน [references/project-structure-and-config.md](references/project-structure-and-config.md)

1. ตั้งค่า `[profile.dev]` ด้วย `debug = "line-tables-only"` และ `incremental = true`
2. ตั้งค่า `[profile.release]` ด้วย `lto = true`, `opt-level = "z"`, `strip = true`, `codegen-units = 1`, `panic = "abort"`
3. ตั้งค่า `[profile.dev.package."*"]` ด้วย `debug = false` เพื่อ speed up deps compilation

### 6. Setup Scripts

> Goal: สร้าง justfile สำหรับ development scripts ที่ใช้ซ้ำได้

ตั้งค่า development scripts ใน `justfile` — ดู template ใน [references/project-structure-and-config.md](references/project-structure-and-config.md)

1. เพิ่ม `dev` recipe: `cargo watch -x run`
2. เพิ่ม `build` recipe: `cargo build --release`
3. เพิ่ม `lint` recipe: `cargo clippy -- -D warnings && cargo fmt --check`
4. เพิ่ม `test` recipe: `cargo nextest run && cargo test --doc`
5. เพิ่ม `run` recipe: `cargo run --`

### 7. Development Workflow

> Goal: ใช้ workflow ที่มี watch mode, lint และ format อัตโนมัติ

ใช้ development workflow ที่มีประสิทธิภาพ

1. ใช้ `cargo watch -x run` สำหรับ development พร้อม watch mode
2. ใช้ `cargo build --release` สำหรับ production build
3. ใช้ `cargo clippy -- -D warnings` สำหรับ code quality checks
4. ใช้ `cargo fmt` สำหรับ formatting

### 8. Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

### 1. Project Structure

โครงสร้างต้องถูกต้อง

- แยก concerns: CLI parsing, business logic, output formatting, external I/O
- เลือก architecture ตาม context โดยไม่บังคับ Clean หรือ Layered
- ค่าเริ่มต้น CLI ทั่วไป: Command/Handler split ด้วย `src/cli/`, `src/commands/`, `src/services/`, `src/output.rs`, `src/config.rs`
- ถ้ามีหลาย client (TTY/JSON/agent): Functional Core / Imperative Shell
- ถ้ามีหลาย backend/IO ซับซ้อน: Hexagonal / Ports & Adapters
- ใช้ flat modules (`foo.rs` + `foo/`) ตาม Rust 2018+ แทน `mod.rs` เมื่อเหมาะสม
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

- ใช้ /follow-tool-cargo ถ้าจำเป็น
- ใช้ /rethink ถ้าจำเป็น

## Expected Outcome

- CLI project ที่มีโครงสร้างที่ดีและ maintainable
- Architecture ที่เลือกเหมาะสมกับ context และบันทึกเหตุผล
- Directory structure ไม่ซ้อนลึกเกินไป (ใช้ `/follow-flat-folders` ถ้าจำเป็น)
- Development workflow ที่มีประสิทธิภาพ
- Type-safe CLI application พร้อมสำหรับ production
- Zero-cost abstractions และ memory safety
- Error handling ที่ robust
- Output ที่อ่านง่ายพร้อม colors และ formatting
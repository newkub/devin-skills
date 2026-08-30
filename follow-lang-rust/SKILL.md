---
name: follow-lang-rust
description: สร้างหรือปรับปรุง Rust project ด้วย Clean Architecture และ Workspace
related:
  - follow-clean-architecture
  - follow-tool-cargo
  - follow-tool-clippy
  - follow-test
  - follow-tool-mutants-rs
---

## Goal

กำหนดแนวทางการพัฒนา Rust applications ให้มีประสิทธิภาพสูงสุด

## Scope

ใช้สำหรับสร้างหรือปรับปรุง Rust projects ทั้ง single crate และ workspace

## Execute

### 1. Project Planning

> Goal: วางแผน architecture และเลือก dependencies ตาม project type

1. ระบุ Project Location ใน monorepo
2. ตัดสินใจใช้ Workspace หรือ Single Crate
3. กำหนด Architecture: Clean Architecture หรือ Standard
4. เลือก Async Runtime: Tokio (default), async-std, หรือ smol
5. ถ้า project มี Database: เลือก SQLx (default), Diesel, หรือ SeaORM
6. ถ้า project มี API: เลือก Axum (default), Actix-web, หรือ Rocket
7. ถ้า project มี TUI: เลือก Ratatui
8. ถ้า project ต้องการ WASM: เลือก wasm-bindgen และ wasm-pack

### 2. Directory Structure

> Goal: สร้างโครงสร้าง directory สำหรับ source, tests, benches, และ examples

1. ใช้ `src/` directory สำหรับ source code
2. สร้าง `crates/` สำหรับ workspace members
3. สร้าง `tests/` สำหรับ integration tests
4. สร้าง `benches/` สำหรับ benchmarks
5. สร้าง `examples/` สำหรับ usage examples
6. ถ้า project มี Clean Architecture: ทำ `/follow-clean-architecture`
7. ดูรายละเอียดใน [references/rust-project-structure.md](references/rust-project-structure.md)

### 3. Configuration

> Goal: ตั้งค่า Cargo, toolchain, และ build configurations

1. ตั้งค่า `Cargo.toml` (workspace หรือ single crate)
2. ตั้งค่า `.cargo/config.toml` สำหรับ build configurations
3. ตั้งค่า `rust-toolchain.toml` สำหรับ Rust version
4. สร้าง `justfile` สำหรับ development scripts
5. ตั้งค่า sccache สำหรับ shared compilation cache
6. ดูรายละเอียดใน [references/rust-cargo-workspace.md](references/rust-cargo-workspace.md) และ [references/rust-cargo-profiles.md](references/rust-cargo-profiles.md)

### 4. Quality Enforcement

> Goal: ตั้งค่า lints, security checks, และ test infrastructure

1. รัน `/follow-tool-cargo` เพื่อตั้งค่า Cargo lint rules และ workspace lint inheritance
2. รัน `/follow-tool-clippy` เพื่อตั้งค่า Clippy lint rules และ thresholds
3. ตั้งค่า `forbid unsafe_code` ใน workspace
4. ตั้งค่า `cargo-deny` สำหรับ security advisories
5. ตั้งค่า rustdoc warnings เป็น errors
6. ใช้ `cargo-nextest` สำหรับ parallel test execution ใน CI
7. ใช้ `cargo-llvm-cov` สำหรับ coverage reporting ใน CI
8. ใช้ Miri สำหรับตรวจสอบ undefined behavior ใน CI
9. ดูรายละเอียดใน [references/rust-code-standards.md](references/rust-code-standards.md) และ [references/rust-security.md](references/rust-security.md)

### 5. Verification

> Goal: ตรวจสอบ compilation, linting, formatting, และ tests ผ่านทั้งหมด

1. รัน `cargo check` ตรวจสอบ compilation errors
2. รัน `cargo clippy` ตรวจสอบ linting
3. รัน `cargo fmt` ตรวจสอบ formatting
4. รัน `cargo nextest run` ยืนยัน tests ผ่าน
5. รัน `cargo test --doc` ยืนยัน doctests ผ่าน
6. ทดสอบ `cargo build --release` สำเร็จ
7. ถ้า project มี WASM target: ทดสอบ `cargo build --target wasm32-unknown-unknown`

### 6. Testing Strategy

> Goal: กำหนด testing strategy ตาม project type

1. ทำ `/follow-test` สำหรับ testing strategy ทั่วไป
2. ใช้ `cargo-nextest` สำหรับ parallel test execution
3. ถ้า project มี business logic: ใช้ `proptest` สำหรับ property-based testing
4. ถ้า project มี API: เขียน integration tests ใน `tests/`
5. ใช้ `#[cfg(test)]` สำหรับ unit tests inline กับ source code
6. ถ้า project มี complex logic: ทำ `/follow-tool-mutants-rs` สำหรับ mutation testing
7. รัน `cargo test --doc` แยกจาก `cargo nextest run` (nextest ไม่รองรับ doctests)
8. ดูรายละเอียดใน [references/rust-testing.md](references/rust-testing.md)

## Rules

### 1. Project Structure And Configuration

- ใช้ Clean Architecture, workspace patterns, `Cargo.toml`, `.cargo/config.toml`, profiles
- ใช้ `rust-toolchain.toml`, `justfile`, sccache
- ดู [references/rust-project-structure.md](references/rust-project-structure.md)

### 2. Code Standards

- ทำตาม Rust API Guidelines, naming conventions, common traits, imports
- ใช้ builder/newtype patterns, clippy lints
- ดู [references/rust-code-standards.md](references/rust-code-standards.md)

### 3. Error Handling

- ใช้ `thiserror` สำหรับ library, `anyhow` สำหรับ application
- ใช้ `#[from]`, `.context()`
- ดู [references/rust-error-handling.md](references/rust-error-handling.md)

### 4. Documentation

- ใช้ `//!`, `#![warn(missing_docs)]`, `# Errors`/`# Panics`/`# Safety` sections
- ใช้ `RUSTDOCFLAGS`
- ดู [references/rust-documentation.md](references/rust-documentation.md)

### 5. CI/CD

- ใช้ GitHub Actions, ทดสอบ stable/beta/nightly/MSRV
- ใช้ `cargo-deny`, `cargo-nextest`, `cargo-llvm-cov`, Miri
- ดู [references/rust-ci-cd.md](references/rust-ci-cd.md)

### 6. Testing

- ใช้ `#[cfg(test)]`, `tests/`, `proptest`, doctests, assert macros, `#[should_panic]`
- ดู [references/rust-testing.md](references/rust-testing.md)

### 7. Performance

- ใช้ `criterion`, `cargo flamegraph`, `&str` vs `String`, `Cow<T>`, `SmallVec`, release profile
- ดู [references/rust-performance.md](references/rust-performance.md)

### 8. Security

- ใช้ `cargo-audit`, `cargo-deny`, `forbid unsafe_code`, `RUSTSEC` advisory database
- ดู [references/rust-security.md](references/rust-security.md)

### 9. Dependency Management

- กำหนด `rust-version`/MSRV, feature flags, `[workspace.dependencies]`, `cargo sort`, `cargo outdated`
- ดู [references/rust-dependency-management.md](references/rust-dependency-management.md)

### 10. Async Patterns

- ใช้ `tokio`, `JoinSet`, `CancellationToken`, `Send + Sync` bounds, `block_on`, `tokio::select!`, `Arc<T>`
- ดู [references/rust-async.md](references/rust-async.md)

## Expected Outcome

- Rust project ที่มีโครงสร้างถูกต้อง
- Clean Architecture ที่จัดระเบียบดี
- Code ที่มี memory safety และ performance
- Error handling ที่ robust
- Testing ที่ครอบคลุมด้วย unit, integration, และ property-based tests
- Performance ที่ optimized ด้วย profiling และ benchmarking
- Security ที่ผ่าน audit และ deny checks
- Dependencies ที่จัดการอย่างเป็นระบบ
- Async patterns ที่ safe และ efficient
- Build และ lint ที่ผ่านทั้งหมด
- Documentation ที่ครบถ้วน
- CI/CD pipeline ที่เข้มงวด

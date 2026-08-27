---
name: follow-tool-nextest
description: ตั้งค่าและใช้งาน cargo-nextest สำหรับ test runner ที่รวดเร็วใน Rust projects
related:
  - follow-lang-rust
  - follow-tool-cargo
  - follow-test
  - update-test
  - follow-tool-mutants-rs
  - run-test
---

## Goal

ตั้งค่าและใช้งาน cargo-nextest สำหรับ test runner ที่รวดเร็วและมีประสิทธิภาพใน Rust projects

## Scope

ใช้สำหรับ Rust projects ที่ใช้ Cargo build system

## Execute

### 1. Installation

> Goal: ติดตั้ง cargo-nextest บน environment

1. ติดตั้งด้วย `cargo binstall cargo-nextest --secure`
2. หรือติดตั้งจาก pre-built binaries ผ่าน `https://get.nexte.st/latest/{linux,mac,windows}`
3. Windows สามารถใช้ `winget install nextest.cargo-nextest`
4. ติดตั้งจาก source ด้วย `cargo install cargo-nextest --locked`
5. อัปเดตด้วย `cargo nextest self-update`
6. ดูรายละเอียดใน [references/nextest.md](references/nextest.md)

### 2. Run Tests

> Goal: รัน tests ด้วย cargo-nextest แทน `cargo test`

1. รัน all tests ด้วย `cargo nextest run`
2. รันเฉพาะ package ด้วย `cargo nextest run -p my-package`
3. รัน doctests แยก (nextest ไม่รองรับ doctests) ด้วย `cargo test --doc`
4. ดูรายละเอียดใน [references/nextest.md](references/nextest.md)

### 3. Configuration

> Goal: สร้าง `.config/nextest.toml` สำหรับ repository-specific configuration

1. สร้าง `.config/nextest.toml` ที่ Cargo workspace root
2. กำหนด profiles สำหรับ local และ CI runs
3. ใช้ profile เมื่อรัน: `cargo nextest run --profile ci`
4. ดูรายละเอียดใน [references/nextest.md](references/nextest.md)

### 4. List Tests

> Goal: แสดงรายการ tests ทั้งหมดก่อนรัน

1. รัน `cargo nextest list` สำหรับ list all tests
2. รัน `cargo nextest list --verbose` สำหรับ verbose output (binary paths, skipped tests)
3. ดูรายละเอียดใน [references/nextest.md](references/nextest.md)

### 5. Profiles

> Goal: ใช้ profiles สำหรับ local และ CI runs

1. `default`: สำหรับ local development
2. `ci`: สำหรับ CI (`fail-fast = false`)
3. สร้าง custom profiles ใน `.config/nextest.toml` ด้วย `inherits` keyword
4. หลีกเลี่ยง naming profiles ที่ขึ้นต้นด้วย `default-`
5. ดูรายละเอียดใน [references/nextest.md](references/nextest.md)

### 6. CI Integration

> Goal: เพิ่ม cargo-nextest ใน CI pipeline

1. ติดตั้ง cargo-nextest ใน CI ด้วย `cargo binstall cargo-nextest --secure`
2. รัน tests ด้วย `cargo nextest run --profile ci`
3. ใช้ JUnit output สำหรับ test reporting
4. ดูรายละเอียดใน [references/nextest.md](references/nextest.md)

## Rules

### 1. Test Execution

- ใช้ `cargo nextest run` แทน `cargo test` สำหรับ performance ที่ดีกว่า
- รัน doctests แยกจาก cargo-nextest ด้วย `cargo test --doc`
- ใช้ `cargo nextest run -p <package>` สำหรับรันเฉพาะ package

### 2. Profiles

- ใช้ `--profile ci` ใน CI เพื่อ run ทุก tests แม้จะ fail
- ใช้ `default` profile สำหรับ local development
- ตั้งค่า `fail-fast = false` ใน CI profile
- หลีกเลี่ยง naming profiles ที่ขึ้นต้นด้วย `default-`
- ใช้ `inherits` keyword สำหรับ profile inheritance

### 3. Configuration

- ตรวจสอบ configuration ใน `.config/nextest.toml`
- Repository config ที่ `.config/nextest.toml` check-in ใน VCS
- Personal config ที่ `~/.config/nextest/config.toml`
- ใช้ `--config-file` สำหรับ override config location

## Expected Outcome

- Test runner ที่รวดเร็วและมีประสิทธิภาพ
- Tests รันแบบ parallel อัตโนมัติ
- CI integration ที่เหมาะสม
- Test execution time ลดลง

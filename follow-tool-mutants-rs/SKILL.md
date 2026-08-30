---
name: follow-tool-mutants-rs
description: ตั้งค่าและใช้งาน cargo-mutants สำหรับ mutation testing ใน Rust projects
related:
  - follow-lang-rust
  - follow-tool-nextest
  - follow-tool-cargo
  - update-test-everything
  - follow-test
---

## Goal

ตั้งค่าและใช้งาน cargo-mutants สำหรับ mutation testing เพื่อปรับปรุงคุณภาพของ Rust tests

## Scope

ใช้สำหรับ Rust projects ที่ใช้ Cargo build system และต้องการตรวจสอบคุณภาพของ tests ด้วย mutation testing

## Execute

### 1. Installation

> Goal: ติดตั้ง cargo-mutants บน environment

1. ติดตั้งด้วย `cargo install --locked cargo-mutants`
2. หรือติดตั้งด้วย `cargo binstall cargo-mutants`
3. ตรวจสอบ version ด้วย `cargo mutants --version`
4. ดูรายละเอียดใน [references/cargo-mutants.md](references/cargo-mutants.md)

### 2. Prerequisites

> Goal: ตรวจสอบว่า project พร้อมสำหรับ mutation testing

1. รัน `cargo test` หรือ `cargo nextest run` เพื่อตรวจสอบว่า tests ไม่ flaky
2. ตรวจสอบว่า project build ได้บน host platform
3. หลีกเลี่ยงการรัน mutation testing ถ้า tests ยังไม่เสถียร
4. ดูรายละเอียดใน [references/cargo-mutants.md](references/cargo-mutants.md)

### 3. Run Mutation Testing

> Goal: รัน mutation testing ด้วย cargo-mutants

1. รัน `cargo mutants` ที root ของ Rust project
2. รันเฉพาะ file ด้วย `cargo mutants -f src/file.rs`
3. รันกับ toolchain เฉพาะด้วย `cargo +1.48 mutants`
4. แสดง caught/unviable mutants ด้วย `cargo mutants --caught` หรือ `cargo mutants --unviable`
5. ดูรายละเอียดใน [references/cargo-mutants.md](references/cargo-mutants.md)

### 4. Understand Results

> Goal: แปลผลลัพธ์และระบุ mutants ที่ต้องแก้ไข

1. `NOT CAUGHT` / `missed`: tests ไม่จับ mutant นี้ได้ → เพิ่ม tests
2. `CAUGHT`: tests จับ mutant นี้ได้ → test coverage ดี
3. `UNVIABLE`: mutant นี้ build ไม่ได้ → ไม่ต้องทำอะไร
4. `timeout`: mutant ทำให้ tests แขวน → ตรวจสอบหรือ skip
5. ดูรายละเอียดใน [references/cargo-mutants.md](references/cargo-mutants.md)

### 5. Configuration

> Goal: ตั้งค่า cargo-mutants สำหรับ project

1. สร้าง `mutants.toml` ที project root เมื่อต้องการ config ขั้นสูง
2. กำหนด `timeout`, `exclude_globs`, `copy_target` ตามต้องการ
3. ใช้ `#[mutants::skip]` สำหรับ functions หรือ impls ที่ไม่ต้องการ mutate
4. ใช้ `#[mutants::exclude_re("pattern")]` สำหรับกรอง mutations เฉพาะ
5. ดูรายละเอียดใน [references/cargo-mutants.md](references/cargo-mutants.md)

### 6. CI Integration

> Goal: เพิ่ม cargo-mutants ใน CI pipeline

1. เพิ่ม step `cargo mutants` ใน GitHub Actions หรือ CI ที่ใช้
2. ใช้ `cargo mutants --file` สำหรับ incremental testing ใน PR
3. ใช้ `cargo mutants` เต็มรูปแบบสำหรับ main branch
4. ดูรายละเอียดใน [references/cargo-mutants.md](references/cargo-mutants.md)

## Rules

### 1. Test Quality

- ต้องมี tests ที่เชื่อถือได้ก่อนรัน `cargo mutants`
- ไม่รองรับ cross-compilation
- ต้อง build ได้บน host platform
- ไม่ต้องเปลี่ยน source code เพื่อใช้ cargo-mutants เป็นค่าเริ่มต้น

### 2. Mutant Handling

- ใช้ `#[mutants::skip]` สำหรับ mutants ที่ไม่น่าสนใจ
- ใช้ `#[mutants::exclude_re("...")]` เพื่อกรอง mutations เฉพาะ
- เพิ่ม tests สำหรับ `NOT CAUGHT` mutants
- รัน `cargo mutants` เป็นระยะ เพื่อ track test quality

### 3. Configuration

- เก็บ `mutants.toml` ใน project root ถ้ามี
- ใช้ `timeout` เริ่มต้นที่เหมาะสม เพื่อป้องกัน tests แขวน
- ไม่ hard-code paths หรือ secrets ใน `mutants.toml`

## References

- [CLI reference](references/cli.md)
- [References index](references/index.md)

## Expected Outcome

- Mutation testing ทำงานได้อัตโนมัติ
- Test coverage และ quality ดีขึ้น
- Missed mutants ถูกระบุและแก้ไข
- Test suite มีความเชื่อถือได้สูงขึ้น

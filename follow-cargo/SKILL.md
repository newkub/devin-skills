---
name: follow-cargo
description: ตั้งค่า Cargo lint rules และ workspace lint configuration
allowed-tools:
- read
- edit
- grep
- glob
- exec
triggers:
- user
- model
---

## Goal

ตั้งค่า Cargo lint rules และ workspace lint configuration ใน Cargo.toml

## Execute

### 1. Analyze Project

1. รัน `/analyze-project` เพื่อดูโครงสร้างโปรเจกต์
2. ตรวจสอบ `Cargo.toml` ที่มีอยู่
3. ตรวจสอบ workspace configuration
4. ระบุว่าเป็น single crate หรือ workspace

### 2. Configure Cargo.toml Lint Rules

1. เพิ่ม lint attributes ใน `[lints]` section:
   ```toml
   [lints.rust]
   unused_extern_crates = "warn"
   unused_import_braces = "warn"
   unused_qualifications = "warn"
   variant_size_differences = "warn"
   missing_docs = "warn"
   ```

2. เพิ่ม clippy lint rules:
   ```toml
   [lints.clippy]
   all = "warn"
   pedantic = "warn"
   nursery = "warn"
   ```

3. สำหรับ workspace ให้ใช้ `[workspace.lints]`:
   ```toml
   [workspace.lints.rust]
   unused_extern_crates = "warn"
   unused_import_braces = "warn"
   unused_qualifications = "warn"

   [workspace.lints.clippy]
   all = "warn"
   pedantic = "warn"
   ```

### 3. Configure Workspace Lints

1. ตั้งค่า workspace-level lint rules ใน `Cargo.toml` หลัก
2. ใช้ `[workspace.lints]` สำหรับ shared lint rules
3. แต่ละ crate สามารถ inherit ด้วย:
   ```toml
   [lints]
   workspace = true
   ```

### 4. Setup Pre-commit Hooks

1. ติดตั้ง `lefthook` หรือ `pre-commit`
2. เพิ่ม hooks สำหรับ:
   - `cargo check --all-targets`
   - `cargo clippy --all-targets -- -D warnings`
   - `cargo fmt --check`
3. ตั้งค่าใน `lefthook.yml`:
   ```yaml
   pre-commit:
     true
     commands:
       check:
         run: cargo check --all-targets
       clippy:
         run: cargo clippy --all-targets -- -D warnings
       fmt:
         run: cargo fmt --check
   ```

### 5. Verify Configuration

1. รัน `cargo check --all-targets`
2. รัน `cargo clippy --all-targets -- -D warnings`
3. ตรวจสอบว่า lint rules ทำงานได้ถูกต้อง
4. รัน `/run-verify` เพื่อยืนยันว่าทุกอย่างทำงานได้

## Rules

### 1. Rust Lint Categories

- unused_extern_crates: warn (unused external crates)
- unused_import_braces: warn (unused import braces)
- unused_qualifications: warn (unused type qualifications)
- variant_size_differences: warn (enum variant size differences)
- missing_docs: warn (missing documentation)

### 2. Clippy Lint Categories

- all: warn (all clippy lints)
- pedantic: warn (pedantic lints)
- nursery: warn (experimental lints)

### 3. Workspace Configuration

- ตั้งค่า lint rules ที่ workspace level ใน `Cargo.toml` หลัก
- ใช้ `[workspace.lints]` สำหรับ shared lint rules
- แต่ละ crate สามารถ inherit ด้วย `workspace = true`
- แต่ละ crate สามารถ override rules ได้ถ้าจำเป็น

## Expected Outcome

- Cargo lint rules ตั้งค่าอัตโนมัติ
- Workspace lint configuration ถูกนำไปใช้
- Pre-commit hooks ตรวจสอบ lint rules
- Code quality สม่ำเสมอทั่วทั้งโปรเจกต์

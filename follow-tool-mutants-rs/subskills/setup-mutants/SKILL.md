---
name: follow-tool-mutants-rs-setup-mutants
description: ติดตั้ง cargo-mutants พร้อม config file และ baseline run สำหรับ Rust projects
argument-hint: "[scope]"
related:
  - follow-tool-mutants-rs
  - follow-lang-rust
  - follow-tool-cargo
  - follow-tool-nextest
  - run-test-mutation
---

## Goal

ติดตั้งและตั้งค่า cargo-mutants ให้รัน mutation testing บน Rust project ได้ — install, `.cargo/mutants.toml`, baseline run

## Scope

- First-time setup ของ cargo-mutants ใน Cargo workspace/project
- ครอบคลุม: install, config file, baseline run, verify output
- ไม่ครอบคลุม: sharding/CI optimization (`subskills/optimize-mutation`)

## Execute

### 1. Check Prerequisites

> Goal: ตรวจ environment และ test suite ก่อน install

1. ตรวจว่าเป็น Cargo project (`Cargo.toml` ที่ root) — ทำ `/follow-tool-cargo` ถ้าต้อง setup cargo ก่อน
2. รัน `cargo test` หรือ `cargo nextest run` — tests ต้องเขียวและไม่ flaky ก่อน mutation testing
3. ตรวจว่า project build ได้บน host platform — cargo-mutants ไม่รองรับ cross-compilation
4. ตรวจ `cargo mutants --version` — ถ้ามีแล้ว (idempotent check) → skip install

### 2. Install cargo-mutants

> Goal: ติดตั้ง cargo-mutants binary

1. ติดตั้งด้วย `cargo install --locked cargo-mutants`
2. หรือเร็วกว่าด้วย `cargo binstall cargo-mutants` (prebuilt binary)
3. Verify ด้วย `cargo mutants --version`

### 3. Create Config

> Goal: สร้าง `.cargo/mutants.toml` ขั้นต่ำ

1. สร้าง `.cargo/mutants.toml` ที่ source tree root — check-in เข้า VCS
2. กำหนด top-level keys (ไม่มี `[mutants]` table): `timeout_multiplier`, `examine_globs`, `exclude_globs`, `test_package`
3. ถ้าใช้ nextest → `test_tool = "nextest"` (เร็วกว่าเพราะ fail-fast) — ทำ `/follow-tool-nextest` ถ้ายังไม่มี
4. ตั้ง `exclude_globs` สำหรับ generated/vendored/test-only code
5. ดู config keys เพิ่มเติมใน `references/cargo-mutants.md` หรือ official docs

### 4. Baseline Run

> Goal: รัน mutation testing ครั้งแรกบน scope จำกัด

1. รัน `cargo mutants -f <file.rs>` บนไฟล์เล็กก่อน — ยืนยัน pipeline ทำงาน
2. รัน `cargo mutants` เต็มถ้า scope พอเหมาะ — หรือจำกัดด้วย `examine_globs`
3. ตรวจ output ใน `mutants.out/` — ดู `missed`/`NOT CAUGHT`, `caught`, `unviable`, `timeout`
4. บันทึก baseline: mutant count, caught/missed ratio — ใช้เทียบ runs ถัดไป

### 5. Verify

> Goal: ยืนยัน setup reproducible

1. รันซ้ำด้วย args เดิม — ผลต้องสม่ำเสมอ (ไม่ใช่ flaky)
2. ถ้า verify ไม่ผ่าน → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report

## Rules

- Tests ต้องเขียวและ stable ก่อน — ห้ามรันบน suite ที่ flaky
- ไม่ต้องแก้ source code เพื่อใช้ cargo-mutants — เป็นค่าเริ่มต้น
- เก็บ `.cargo/mutants.toml` ใน VCS — ห้ามใส่ secrets หรือ absolute paths
- `timeout_multiplier`/`minimum_test_timeout` ตั้งให้เหมาะ — ป้องกัน tests แขวน
- Baseline บน scope เล็กก่อน — full run อาจใช้เวลานานมาก

## Expected Outcome

- cargo-mutants ติดตั้งและ `.cargo/mutants.toml` commit แล้ว
- Baseline run สำเร็จพร้อม `mutants.out/` results
- ทราบ caught/missed mutants เริ่มต้นสำหรับ track ต่อ

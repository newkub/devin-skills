---
name: check-should-update
description: ตรวจสอบ git changes เพื่อตัดสินใจว่า target ต้องอัปเดทหรือไม่
argument-hint: "<target>... [--refs <from-ref..to-ref>]"
allowed-tools:
  - exec
  - grep
  - glob
  - find_file_by_name
  - read
related:
  - check-git-diff
  - follow-create-rust-cli
  - follow-tool-git
  - refactor
  - update-devin-global-skills
---

## Goal

ตรวจสอบ git changes ของ target paths เพื่อตัดสินใจว่าต้องอัปเดท ข้าม หรือสร้างใหม่

## Scope

ใช้กับทุก workflow ที่ต้องเช็คว่า target ต้องอัปเดทตาม code changes หรือไม่ ก่อนเริ่มงาน
Skill นี้มี Rust CLI เพื่อตรวจสอบเร็วและใช้งานนอก Devin ได้

## Execute

### 1. Build CLI

> Goal: build Rust CLI จาก source ใน skill directory

1. ตรวจสอบว่ามี `Cargo.toml` และ `src/main.rs` ใน skill directory
2. รันคำสั่ง `cargo build --release` ใน skill directory
3. ตรวจสอบว่า binary อยู่ที่ `target/release/check-should-update` (หรือ `.exe` บน Windows)

### 2. Run CLI

> Goal: รัน CLI ใน target workspace

1. เปลี่ยน working directory ไปยัง root ของ target project
2. รันคำสั่ง `<skill-dir>/target/release/check-should-update.exe <target>... [--refs <from-ref..to-ref>]`
3. ค่าเริ่มต้นของ ref range คือ `HEAD~1..HEAD`
4. รับผลลัพธ์: `skip`, `update`, หรือ `create`

### 3. Check Changes

> Goal: ตีความผลลัพธ์ให้ถูกต้อง

1. ถ้า target ใด target หนึ่งยังไม่มี → return `create`
2. ถ้าทุก target อยู่ใน git repo และไม่มี changes → return `skip`
3. ถ้าทุก target อยู่ใน git repo และมี changes อย่างน้อยหนึ่ง path → return `update`
4. ถ้าไม่อยู่ใน git repo หรือ git command ล้มเหลว → return `update` พร้อม warning

## Rules

### 1. Target Paths

- Calling workflow ต้องระบุ target path(s) ที่ต้องเช็ค
- ใช้ glob patterns ที่รองรับโดย `git diff --name-only`
- รองรับทั้ง file และ directory

### 2. Return Values

- `skip` — ไม่มี changes ข้ามไป validate
- `update` — มี changes ทำตามขั้นตอนถัดไป
- `create` — target ยังไม่มี ทำตามขั้นตอนสร้างใหม่

### 3. CLI Behavior

- ค่าเริ่มต้น `refs` คือ `HEAD~1..HEAD`
- ถ้า `HEAD~1` ไม่อยู่ (root commit หรือ repo ใหม่) → CLI จะ return `update` ถ้า target มีอยู่
- ถ้า `refs` เป็นค่าที่ user กำหนดและ git command ล้มเหลว → CLI จะ return exit code 1
- ใช้ `-v` หรือ `--verbose` เพื่อดู reasoning ที `stderr`

- ใช้ /check-git-diff ถ้าจำเป็น
- ใช้ /follow-create-rust-cli ถ้าจำเป็น
- ใช้ /follow-tool-git ถ้าจำเป็น
- ใช้ /refactor ถ้าจำเป็น
- ใช้ /update-devin-global-skills ถ้าจำเป็น

## Expected Outcome

- รู้ว่า target ต้อง `skip`, `update`, หรือ `create`
- ไม่เสียเวลาอัปเดทถ้าไม่มีอะไรเปลี่ยน
- Rust CLI build ผ่านและทำงานถูกต้อง

---
name: check-broken-skills-references
description: ตรวจหา broken skill references ใน SKILL.md ของ devin skills repo ด้วย Rust CLI
argument-hint: "[path]"
related:
  - check-reference
  - deep-validate
  - check-backward-compatibility
  - analyze-security-risk
  - update-references---
## Goal

ตรวจหา broken skill references ใน `SKILL.md` ของ devin skills repo โดยเปรียบเทียบ references ที่อ้างถึงกับ skills ที่มีอยู่จริง

## Scope

ใช้สำหรับ scan devin skills repo เพื่อหา references ไปยัง skills ที่ไม่มีอยู่ ครอบคลุมทั้ง `/skill-name` patterns ใน prompt body และ `related` fields ใน frontmatter ไม่รวมการแก้ไข (ใช้ `/update-references` สำหรับแก้)

## Execute

### 1. Build CLI

> Goal: build Rust CLI จาก source ใน skill directory

1. ตรวจสอบว่า `Cargo.toml` และ `src/main.rs` อยู่ใน skill directory
2. รันคำสั่ง `cargo build --release` ใน skill directory
3. ตรวจสอบ binary ที่ `target/release/check-broken-skills-references` (หรือ `.exe` บน Windows)

### 2. Run CLI

> Goal: รัน CLI เพื่อ scan broken references

1. เปลี่ยน working directory ไปยัง skill directory
2. รันคำสั่ง `cargo run -- [PATH]` หรือ `<skill-dir>/target/release/check-broken-skills-references [PATH]`
3. ถ้าไม่ระบุ `PATH` จะใช้ `%APPDATA%\devin\skills` (Windows) หรือ `$HOME/.devin/skills` (Unix)
4. รับผลลัพธ์: รายการ broken references แยกตาม Critical/Warning

## Rules

### 1. Rust CLI

- ใช้ `clap` สำหรับ argument parsing
- ใช้ `regex` สำหรับหา `/skill-name` patterns
- ใช้ `serde_yaml` สำหรับ parse `related` frontmatter
- รองรับ Unicode content ใน SKILL.md โดยไม่ panic

### 2. Filter False Positives

- URL fragments (`https://...`) ไม่ใช่ skill references
- File paths (`references/foo.md`) ไม่ใช่ skill references
- npm packages (`@capacitor/...`) ไม่ใช่ skill references
- Generic placeholders (`/skill-name`, `/some-skill`) ไม่ใช่ skill references

### 3. Severity Classification

- Critical: broken `related` field reference
- Warning: broken body `/skill-name` reference

### 4. No Auto-Fix

- `check-broken-skills-references` ตรวจและรายงานเท่านั้น
- ถ้าต้องการแก้ → ทำ `/update-references` หลังจากนี้

## Expected Outcome

- CLI binary ถูก build สำเร็จ
- รายงาน broken references ครบถ้วน พร้อม skill name, reference, type, severity
- สถิติ: total skills, total references checked, broken count
- ถ้ามี Critical → แนะนำ next action (`/update-references` หรือ `/resolve-errors`)
- ถ้าไม่พบ → "no broken references found"

---
name: update-usage-md
description: สร้างหรืออัปเดต USAGE.md usage documentation ให้สะท้อน public API และ CLI จริง
argument-hint: "[scope]"
related:
  - review-usage-md
  - report-usage-md
  - report-table
  - suggest-next-action
  - deep-validate
  - update-project
  - deep-update-project
  - follow-tool-usage
---

## Goal

สร้างหรืออัปเดต `USAGE.md` ที่ root ของ workspace ให้สะท้อนการใช้งานจริง — public API, CLI commands, examples และ configuration โดยเขียนจาก code จริงเสมอ

## Scope

- ใช้เมื่อ public API, CLI หรือ features เปลี่ยนแปลง หรือ `USAGE.md` ยังไม่มี/ล้าสมัย
- `USAGE.md` เป็น manual usage documentation ที่เขียนจาก code จริง ไม่ generate จาก spec file
- เรียกจาก `/update-project` หรือ `/deep-update-project` เมื่อ sync project docs
- ถ้า project ใช้ `usage` CLI spec tool (มี `usage.kdl`) → ใช้ `/follow-tool-usage` แทน

## Execute

### 1. Review Current State

> Goal: เข้าใจสถานะปัจจุบันของ `USAGE.md`

1. ตรวจว่า `<workspace>/USAGE.md` มีอยู่หรือไม่
2. ถ้ามี → ทำ `/review-usage-md` เพื่อหา gaps และ stale content
3. ถ้าไม่มี → บันทึก status `missing` เตรียมสร้างใหม่
4. บันทึก findings จาก review

### 2. Detect Usage Surface

> Goal: ระบุ public API และ CLI จริงของ workspace

1. อ่าน package manifest (`Cargo.toml`, `package.json`, `pyproject.toml`) — name, version, bin targets
2. อ่าน `README.md` สำหรับ overview และ installation
3. สแกน public API จาก code จริง:
   - Rust: `pub` items ใน `src/lib.rs`, bin targets ใน `src/main.rs`/`src/bin/`
   - TypeScript/JS: `exports` ใน `index.ts`, `bin` ใน `package.json`
   - Python: `__all__` ใน `__init__.py`, entry points ใน `pyproject.toml`
4. อ่าน `examples/` หรือ tests สำหรับ usage patterns จริง
5. ระบุสิ่งที่เปลี่ยนแปลงกับ `USAGE.md` เดิม (ถ้ามี)

### 3. Write USAGE.md

> Goal: `USAGE.md` ครอบคลุมการใช้งานจริง

สร้างหรืออัปเดต `<workspace>/USAGE.md` ด้วย sections:

- `## Overview` — paragraph สั้น 1-3 บรรทัด
- `## Installation` — command ติดตั้งหรือ dependency declaration ตาม ecosystem
- `## Usage` — basic usage ตาม workspace type (library import / CLI commands / binary)
- `## API Reference` (library) หรือ `## Commands` (CLI) — table ของ public items พร้อม signature สั้น
- `## Examples` — code examples ที่มาจาก code จริง
- `## Configuration` — config options (ถ้ามี)

### 4. Validate

> Goal: `USAGE.md` ถูกต้องและครบถ้วน

1. ทุก public API / CLI command ใน code ต้องมีใน `USAGE.md`
2. code examples ต้องมี syntax ถูกต้องและมาจาก code จริง
3. ตรวจว่า `USAGE.md` ไม่เกิน 250 บรรทัด
4. ตรวจว่า version และ package name ตรงกับ manifest

### 5. Report

> Goal: รายงานผลการอัปเดต

1. ทำ `/report-usage-md` หรือ `/report-table` สรุป sections และสิ่งที่เปลี่ยนแปลง
2. ทำ `/suggest-next-action` เพื่อแนะนำขั้นต่อไป

## Rules

### 1. Code Is Source Of Truth

- `USAGE.md` เขียนจาก code จริงเสมอ ห้ามเขียน API หรือ commands ที่ไม่มีใน code
- ถ้า project ใช้ `usage.kdl` spec → delegate ไป `/follow-tool-usage` แทนการเขียนเอง

### 2. Coverage

- ทุก public API ต้องมีใน `USAGE.md` หรือระบุเหตุผลที่ยกเว้น
- ทุก CLI command ต้องมี help หรือ description
- ทุก feature หลักต้องมีอย่างน้อย 1 example

### 3. Examples

- examples ต้อง copy หรือ adapt จาก code จริง (`src/`, `examples/`, tests)
- ห้ามเขียน mock examples ที่ run ไม่ได้

### 4. Idempotency

- รันซ้ำด้วย code เดิมต้องได้ `USAGE.md` เหมือนเดิม
- overwrite `USAGE.md` ได้เฉพาะเมื่อไฟล์ถูก maintain โดย skill นี้หรือ user confirm

- ใช้ /deep-validate ถ้าจำเป็น

## Expected Outcome

- `<workspace>/USAGE.md` สะท้อน public API และ CLI จริง
- ครบ Overview, Installation, Usage, API Reference/Commands, Examples
- version และ package name ตรงกับ manifest
- รายงานสรุปการเปลี่ยนแปลงครบถ้วน

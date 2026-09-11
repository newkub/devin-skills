---
name: follow-readme-md
description: ปฏิบัติตาม README.md — ใช้เป็น source of truth สำหรับ setup, commands และ workflow ของ project
argument-hint: "[task]"
related:
  - follow-agents-md
  - update-readme-md
  - review-usage-md
  - suggest-next-action
---

## Goal

อ่านและทำตาม `README.md` ของ project — ใช้เป็น source of truth สำหรับ install commands, run scripts, env requirements และ project conventions

## Scope

ใช้เมื่อเข้า project ใหม่, ไม่มี `AGENTS.md`, หรือต้องการยืนยันว่า commands/setup ใน README ยังใช้ได้จริง

## Execute

### 1. Locate And Read

> Goal: หาและอ่าน README ที่เกี่ยวข้อง

1. อ่าน `README.md` ที่ root; ถ้า monorepo → อ่าน README ของ workspace ที่เกี่ยวข้องด้วย
2. สกัด: prerequisites, install commands, dev/build/test scripts, env vars, ports
3. ถ้า README ขาดข้อมูลจำเป็น → ดู `package.json`/`Cargo.toml`/`Makefile` ประกอบ

### 2. Verify Commands

> Goal: ยืนยัน commands ใน README ใช้ได้จริง

1. เทียบ commands ใน README กับ scripts จริงใน manifest
2. รัน install/dev command ตาม README ถ้าต้อง verify จริง
3. ถ้า command ใช้ไม่ได้ → บันทึกเป็น drift

### 3. Apply

> Goal: ใช้ README เป็น workflow หลัก

1. ทำงานตาม instructions ใน README (setup → dev → test → build)
2. ถ้า README มี `AGENTS.md` ชี้นำเพิ่ม → ทำ `/follow-agents-md` ด้วย
3. ถ้าพบ drift ระหว่าง README กับ code จริง → แนะนำ `/update-readme-md`

## Rules

- README มี priority ต่ำกว่า `AGENTS.md` — ถ้าขัดกันให้ทำตาม `AGENTS.md`
- ห้ามเดา commands — ใช้จาก README หรือ manifest เท่านั้น
- ถ้า README ไม่มีหรือว่าง → ทำ `/update-readme-md` สร้างใหม่
- ใช้ /review-usage-md ถ้าจำเป็น
- ใช้ /suggest-next-action ถ้าจำเป็น

## Expected Outcome

- ทำตาม README ได้ครบ โดยไม่เดา commands
- Drift ระหว่าง README กับ code จริงถูกระบุและ report

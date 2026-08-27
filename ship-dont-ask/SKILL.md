---
name: ship-dont-ask
description: Ship workspace โดยไม่ถาม confirmation หลัง verify และ validate ผ่าน
related:
  - ship
  - ship-dont-ask-continuous
  - dont-ask
  - run-check
  - deep-validate
  - git-commit
---

## Goal

ส่งมอบ workspace โดยไม่ถาม confirmation เพิ่มเติม หลังจาก verify, validate, และ commit พร้อมแล้ว

## Scope

ใช้เมื่อ workspace ผ่านเกณฑ์ทั้งหมดและไม่มี action เสี่ยง ไม่รวม push หรือ release ถ้าต้องการ push ให้ทำหลัง `/ship-dont-ask` ด้วยคำสั่งที่เหมาะสม

## Execute

### 1. Pre-Flight Check

> Goal: ยืนยันว่าพร้อม ship โดยไม่ถาม

1. ตรวจสอบว่าไม่มี uncommitted changes ที่ไม่พร้อม
2. ตรวจสอบว่าไม่มี destructive action ที่รอดำเนินการ
3. ตรวจว่า `AGENTS.md` อัปเดตและถูกต้อง

### 2. Verify And Validate

> Goal: ตรวจสอบคุณภาพก่อน ship

1. ทำ `/run-check` เพื่อตรวจ lint, typecheck, scan
2. ทำ `/deep-validate` เพื่อตรวจความถูกต้อง
3. ถ้าไม่ผ่าน → หยุดและ report โดยไม่ ship

### 3. Commit

> Goal: commit การเปลี่ยนแปลง

1. ทำ `/git-commit` สำหรับ submodule ก่อนถ้ามี
2. ทำ `/git-commit` ที่ root
3. ถ้าไม่มี changes → หยุดและ report

### 4. Ship Without Asking

> Goal: ส่งมอบโดยไม่ถาม confirmation

1. ทำ `/ship` ตาม `AGENTS.md` workflow
2. ไม่ถามผู้ใช้ก่อน ship
3. ไม่ push หรือ release โดยอัตโนมัติ

### 5. Report

> Goal: สรุปผล

1. ทำ `/report-table` สรุป status, commit, checks
2. ทำ `/suggest-next-action` เพื่อแนะนำขั้นตอนถัดไป

## Rules

### 1. No Confirmation Prompt

- ห้ามใช้ `ask_user_question` เพื่อขอคำยืนยันก่อน ship
- ห้ามเรียก `/ask-me`, `/ask-project-requirement`, `/understand-me` ใน flow นี้
- ห้ามเรียก `/follow-your-suggestion` เพื่อขอคำยืนยัน

### 2. Stop On Failure

- ถ้า `/run-check` หรือ `/deep-validate` ไม่ผ่าน ต้องหยุดและ report
- ถ้าพบ conflicts, broken refs, หรือ destructive action ต้องหยุด
- ไม่ ship โดยไม่ตรวจ

### 3. AGENTS.md First

- ทำ `/update-agents-md` และ `/follow-agents-md` ก่อน ship ทุกครั้ง
- ทำตาม `AGENTS.md` workflow

### 4. No Push/Release

- `/ship-dont-ask` ไม่ push หรือ release อัตโนมัติ
- ถ้าต้องการ push ให้ใช้ `git push` หรือ `/git-push` หลัง ship

## Expected Outcome

- Workspace ผ่าน verify/deep-validate
- Commit สำเร็จโดยไม่ถาม
- Report ครบถ้วน
- ไม่มี push/release โดยไม่ได้รับคำสั่งชัดเจน

---
name: ship
description: Ship โดยอัปเดต AGENTS.md แล้วทำตาม workflows ใน AGENTS.md โดยมี user confirm ก่อน release
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
  - ask_user_question
triggers:
  - user
  - model
related:
  - update-agents-md
  - follow-agents-md
  - git-commit
  - run-release
  - ask-me
  - resolve-errors
  - report
---

## Goal

Ship ครบวงจรโดยอัปเดต `AGENTS.md` แล้วทำตาม workflows ใน `AGENTS.md` จนถึง release โดยมี user confirm ก่อน release เสมอ

## Scope

ใช้กับ workspace ที่มี `AGENTS.md` ทั้ง root และ sub-workspaces ถ้าเป็น monorepo ไม่รวม deploy setup (ใช้ `/follow-deploy`)

## Execute

### 1. Update AGENTS.md

> Goal: `AGENTS.md` เป็นปัจจุบันก่อนเริ่ม ship

1. ทำ `/update-agents-md` ก่อนทุกอย่าง
2. ตรวจสอบว่า `AGENTS.md` ถูกต้องและครบถ้วน
3. ถ้า `AGENTS.md` ไม่พร้อมใช้ → stop และ report

### 2. Follow AGENTS.md

> Goal: ทำตาม workflows/skills ที่ `AGENTS.md` ระบุ

1. ทำ `/follow-agents-md` เพื่ออ่านและ execute instructions จาก `AGENTS.md`
2. ตรวจสอบว่า workflows ทุกตัวถูก execute ครบถ้วนตาม `## Expected Outcome` ของ `follow-agents-md`
3. ถ้าพบ error ให้ทำ `/resolve-errors` แล้วกลับไปทำ `/follow-agents-md` ซ้ำจนผ่าน

### 3. Confirm Release

> Goal: ขอ user confirm ก่อน release เสมอ

1. ทำ `/ask-me` พร้อมตัวเลือก:
   - `Proceed with release (recommended)` — ดำเนินการ release ต่อ
   - `Abort release` — หยุดไม่ release รายงานสถานะ
   - `Review summary first` — แสดงสรุปผลลัพธ์ก่อนตัดสินใจ
2. ถ้า user เลือก `Abort release` → stop และ report ทันที
3. ถ้า user เลือก `Review summary first` → แสดงสรุปผลจาก Phase 1-2 แล้วถามซ้ำ

### 4. Release And Finalize

> Goal: Release ไปยัง external platforms หลัง user confirm

1. ทำ `/git-commit` ถ้ายังไม่มี commit สำหรับการเปลี่ยนแปลงที่เกิดจาก Phase 1-2
2. ทำ `/run-release` เพื่อ auto-detect platforms และ release
3. ถ้า release ไม่สำเร็จ → ทำ `/resolve-errors` แล้ว retry (max 3)
4. ทำ `/report` พร้อม `/report-table` สรุปผล
5. ทำ `/suggest-next-action`

## Rules

### 1. AGENTS.md First

- `/update-agents-md` ต้องทำก่อนทุกอย่าง ไม่ข้ามกรณีใด
- `/follow-agents-md` ต้องทำหลัง `AGENTS.md` อัปเดตแล้ว
- ห้าม duplicate รายละเอียดที่มีอยู่ใน `AGENTS.md`

### 2. Mandatory User Confirmation

- ห้าม release โดยไม่ได้รับ user confirmation
- ใช้ `/ask-me` เท่านั้น
- หาก user ปฏิเสธ → stop ทันที

### 3. Sub-Workflow Discipline

- ทุก `/command` ที่อ้างถึงต้องอ่าน `SKILL.md` จริงก่อนทำ
- ทำตาม `## Execute` ของแต่ละ skill จนครบ
- ก่อน mark `completed` ต้อง verify `## Expected Outcome` ของ sub-workflow นั้น

## Expected Outcome

- `AGENTS.md` อัปเดตและถูกต้อง
- Workflows ที่ระบุใน `AGENTS.md` ถูก execute ครบ
- User ยืนยันการ release ผ่าน `/ask-me`
- `/run-release` สำเร็จ หรือ report สถานะหากยกเลิก
- รายงานผลลัพธ์การ ship ครบถ้วนตาม `/report`

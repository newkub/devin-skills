---
name: list-todo-gist
description: แสดง todo items จาก GitHub Gist `devin-todo.md` ผ่าน `gh` — grouped by priority/status
argument-hint: "[--status|--project|--all]"
related:
  - save-to-todo-gist
  - update-todo-md
  - use-gh-cli
  - implement-to-production
  - report
---

## Goal

ดึงและแสดง todo items ที่เก็บไว้ใน GitHub Gist `devin-todo.md` (สร้างโดย `/save-to-todo-gist`) เป็นตารางที่อ่านง่าย — ใช้ resume งานค้างข้ามเครื่อง/ข้าม project

## Scope

- read-only — ไม่แก้ items; เพิ่ม/อัปเดตใช้ `/save-to-todo-gist` หรือ `/update-todo-md`
- ต้องมี `gh` authenticated (`gh auth status`) — ถ้าไม่มี → stop แล้วแนะนำ `/use-gh-cli`
- รองรับ filter: `--status pending`, `--project <name>`, `--all` (รวม completed)

## Execute

### 1. Locate Gist

> Goal: หา gist `devin-todo`

1. `gh gist list --limit 100` แล้วหา description `devin-todo` หรือไฟล์ `devin-todo.md`
2. ถ้าไม่พบ → รายงานว่าไม่มี todo gist และแนะนำ `/save-to-todo-gist` — stop

### 2. Fetch And Parse

> Goal: ดึงเนื้อหาและ parse เป็น items

1. `gh gist view <id-or-url> --filename devin-todo.md`
2. Parse ตาราง markdown: `Title`, `Description`, `Status`, `Priority`, `Created`, `Project`
3. Apply filter จาก argument: status, project; default แสดงเฉพาะ `pending` + `in-progress` (ใช้ `--all` ถ้าต้องการ completed)

### 3. Report

> Goal: แสดงผลเป็นตาราง

1. ทำ `/report` table columns: `No.`, `Title`, `Status`, `Priority`, `Project`, `Created`, `Why Pending`
2. จัดกลุ่มตาม `Project` แล้วเรียง `Priority`: high → medium → low
3. สรุป counts ด้านบน: pending/in-progress/completed
4. แนะนำ next action: `/implement-to-production` สำหรับ implement หรือ `/save-to-todo-gist` สำหรับเพิ่ม items

## Rules

### Read-Only

- ห้ามแก้ gist — report เท่านั้น
- items stale หรือเสร็จแล้ว → เสนอให้ `/save-to-todo-gist` merge อัปเดต status

### Output

- ตารางมี `No.` เป็นคอลัมน์แรก เสมอ ตาม `/report` conventions
- ถ้า items > 50 → แสดงเฉพาะ `high` + `medium` และสรุปจำนวนที่เหลือ
- บอก gist URL เสมอ

## Expected Outcome

- ตาราง todo items จาก gist ครบตาม filter พร้อม summary counts
- เห็นงานค้างข้าม project ในที่เดียว
- next action ชัดเจนท้าย report

---
name: check-todo-comments
description: Audit TODO, FIXME, HACK comments หาอันที่เก่า ไม่มี owner หรือเป็น debt ที่ลืม
argument-hint: "[path-or-max-age]"
related:
  - report-scan-todo
  - list-todo-md
  - update-todo-md
  - check-dead-code
  - check-commit-quality
  - report-table
---

## Goal

ตรวจ TODO/FIXME/HACK/XXX comments ทั้ง codebase — หาอันที่เก่าเกิน, ไม่มี owner/reference หรือชี้ไป code ที่เปลี่ยนไปแล้ว เพื่อให้ technical debt ไม่หายไปเงียบๆ

## Scope

- ตรวจ comment markers: `TODO`, `FIXME`, `HACK`, `XXX`, `BUG`, `NOTE:`, `OPTIMIZE`, `REFACTOR`
- ใช้ git blame ดูอายุและผู้เขียนของแต่ละ marker
- Read-only: รายงานและจัดหมวด — แก้ไข/ลบผ่าน `/update-todo-md` หรือทำ task จริง

## Execute

### 1. Scan Markers

> Goal: รวบรวม markers ทั้งหมดพร้อมตำแหน่ง

1. ใช้ `search-files-patterns` ค้นหา marker patterns ทุกภาษา (`//`, `#`, `/* */`, `--`, `;;`)
2. ข้าม vendored/generated files และ markers ใน strings/docs ที่ไม่เกี่ยว
3. จับเนื้อหา comment ที่ตาม marker มาด้วย

### 2. Enrich With Git Data

> Goal: ใส่อายุและ owner ให้แต่ละ marker

1. ใช้ `git blame -L` ดูวันที่และ author ของแต่ละ marker line
2. จัดกลุ่มตามอายุ: <30 วัน, 30-90 วัน, >90 วัน (stale)
3. flag markers ที่ไม่มี owner/ticket reference (ไม่มี `TODO(name)` หรือ issue link)

### 3. Classify

> Goal: แยก debt ที่ยัง relevant ออกจากที่ค้าง

1. **Stale**: >90 วันไม่มีการแก้ — candidate สำหรับทำหรือลบ
2. **Orphaned**: code ที่ comment อ้างถึงเปลี่ยน/ถูกลบไปแล้ว
3. **Vague**: markers ไม่มีคำอธิบาย (`// TODO` เปล่าๆ)
4. **Actionable**: มี context ครบและยัง relevant — เสนอเป็น task
5. **Blocking**: `FIXME`/`BUG`/`HACK` ที่อยู่ใน critical paths — severity สูงกว่า TODO ทั่วไป

### 4. Report

> Goal: รายงาน debt แยกตามประเภทและอายุ

1. ใช้ `/report-table` คอลัมน์: `No.`, `File:Line`, `Marker`, `Age`, `Author`, `Content`, `Category`
2. สรุป: totals ตาม marker type, oldest items, debt hotspots (ไฟล์/โมดูลที่มีเยอะ)
3. เสนอ: ลบที่ stale/orphaned, แปลง actionable เป็น issue/task (`/update-todo-md` หรือ `/create-github-issue` ตาม project convention)

## Rules

### 1. Evidence-Based

- ทุก item ต้องมี file:line, age จาก git blame จริง และเนื้อหา comment
- ไม่ flag markers ใน tests/fixtures ที่เป็น intentional placeholders

### 2. Read-Only

- ไม่ลบหรือแก้ comments — รายงานและให้ user เลือก action
- การแปลงเป็น tasks/issues ต้องมี user confirmation ก่อน

### 3. Respect Conventions

- ถ้า project มี TODO convention (`TODO(#123)`, `TODO(name):`) → ประเมินตาม convention นั้น
- threshold ของ "stale" ปรับตาม argument หรือ project norm ได้

## Expected Outcome

- รายงาน TODO debt แยกตามอายุ/ประเภท/ความรุนแรง
- รายการ stale + orphaned markers ที่ควรจัดการ
- ข้อเสนอแปลง actionable items เป็น tracked tasks

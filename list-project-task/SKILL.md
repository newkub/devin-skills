---
name: list-project-task
description: รายการ tasks ทั้งหมดใน project จาก TODO.md, TASKS.md และ task files
---

## Goal

รวบรวมและแสดง tasks ทั้งหมดใน project ทีอาจกระจายอยู่ใน TODO.md, TASKS.md, issue templates, หรือ task files

## Scope

ใช้สำหรับ project ที่มีไฟล์ TODO.md, TASKS.md, `.devin/tasks/`, GitHub issue templates หรือ roadmap โดยไม่แก้ไข source code

## Execute

### 1. Discover Task Sources

> Goal: หา sources ที่เก็บ tasks ทั้งหมด

1. ตรวจหา `TODO.md` ทั้ง root และ workspaces
2. ตรวจหา `TASKS.md`, `ROADMAP.md`, `MILESTONES.md`
3. ตรวจหา `.devin/tasks/`, `.tasks/`, `tasks/` directories
4. ตรวจหา GitHub issue templates ใน `.github/ISSUE_TEMPLATE/`
5. ตรวจหา project management files เช่น `.todo`, `backlog.md`

### 2. Read And Parse Tasks

> Goal: แยก tasks จากเนื้อหา

1. อ่านแต่ละไฟล์และจับรูปแบบ task เช่น `- [ ]`, `- [x]`, `### Task`, `## TODO`
2. ระบุ status: `pending`, `in-progress`, `done`, `blocked`
3. ระบุ metadata ถ้ามี: assignee, priority, due date, labels
4. ถ้าไฟล์ยาว >250 บรรทัด → อ่านเฉพาะ sections ที่เกี่ยวข้อง

### 3. Categorize Tasks

> Goal: จัดกลุ่ม tasks ให้เห็นภาพรวม

1. จัดกลุ่มตาม source: `TODO.md`, `TASKS.md`, `GitHub issues`, `roadmap`
2. จัดกลุ่มตาม status: `pending`, `in-progress`, `done`, `blocked`
3. จัดกลุ่มตาม priority ถ้ามี: `high`, `medium`, `low`
4. ระบุ tasks ที่ duplicate ข้าม sources

### 4. Validate Completeness

> Goal: ตรวจสอบว่าไฟล์มีครบถ้วน

1. ทำ `/check-reference` สำหรับ task links ถ้ามี
2. ตรวจว่า task ลิงก์ไปยัง issue หรือ PR จริง
3. ระบุ tasks ทีขาด metadata หรือไม่ชัดเจน

### 5. Report

> Goal: แสดงผล tasks ในรูปแบบทีอ่านง่าย

1. ใช้ `/report-markdown-table` คอลัมน์: No, Source, Task, Status, Priority, Assignee, Notes
2. เรียงตาม priority แล้ว status
3. แยก group ตาม source
4. ระบุจำนวน tasks ทั้งหมด, pending, in-progress, done

## Rules

### 1. Read Only

- ไม่แก้ไข, เพิ่ม หรือลบ tasks โดยไม่ได้รับ instruction
- ถ้าต้องการ update → ใช้ `/update-todo-md`

### 2. Source Coverage

- ตรวจหา sources ทั้งหมดที่มีชื่อตาม pattern ทั่วไป
- ถ้า project ใช้รูปแบบพิเศษ ให้ระบุเป็น info
- ไม่รวบรวมจาก commit messages หรือ PR titles ยกเว้น user ขอ

### 3. Status Mapping

- `- [ ]` หรือ unchecked → `pending`
- `~` หรือ `WIP` หรือ `in progress` → `in-progress`
- `- [x]` หรือ checked → `done`
- `blocked`, `hold`, `wait` → `blocked`

### 4. Accuracy

- ไม่เดา status ถ้าไม่ชัด
- ไม่เติม assignee หรือ priority ถ้าไม่มี
- ถ้า task ซ้ำใน sources หลายไฟล์ ให้ merge เป็นรายการเดียวพร้อมระบุ sources

## Expected Outcome

- ตาราง tasks ทั้งหมดใน project พร้อม status
- รายการแยกตาม source และ priority
- ไม่มี missing tasks จาก sources ทั่วไป
- Tasks ที่ duplicate หรือไม่ชัดถูกระบุ ลบออก

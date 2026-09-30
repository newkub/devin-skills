---
name: save-to-todo-gist
description: เก็บงานค้างจาก session ลง GitHub Gist (`devin-todo.md`) ผ่าน `gh` — sync ข้ามเครื่อง
argument-hint: "[title-or-auto]"
related:
  - list-todo-gist
  - save-to-todo-md
  - update-todo-md
  - use-gh-cli
  - report-progress
  - report
---

## Goal

บันทึกงานที่ยังไม่เสร็จ — pending items, blocked tasks, follow-ups — ลง GitHub Gist ไฟล์เดียว `devin-todo.md` ผ่าน `gh` CLI เพื่อให้ resume งานได้จากทุกเครื่อง (ต่างจาก `/save-to-todo-md` ที่เก็บใน `TODO.md` ของ project)

## Scope

- ใช้เมื่อ: ต้องการเก็บงานค้างไว้นอก repo, sync ข้ามเครื่อง/ข้าม project, หรือ user สั่งเก็บ todo ลง gist
- ไม่ implement งาน — เก็บเป็น tracked items เท่านั้น
- ต้องมี `gh` authenticated (`gh auth status`) — ถ้าไม่มี → stop แล้วแนะนำ `/use-gh-cli`

## Execute

### 1. Report Progress First

> Goal: สรุปสถานะงานปัจจุบันก่อนเก็บ items

1. ทำ `/report-progress` ก่อนเสมอ — สรุปงานที่เสร็จ/ค้าง
2. ใช้ผล report เป็น input สำหรับ remaining work

### 2. Collect Remaining Work

> Goal: รวบรวมงานค้างจาก context

1. ดู todo list ปัจจุบัน — items ที่ยัง `pending`/`in_progress`
2. ดู blockers และ deferred items ที่เจอระหว่างทำงาน
3. รวม follow-ups ที่ถูกเสนอแต่ยังไม่ทำ
4. ถ้า argument ระบุ title → เก็บภายใต้หัวข้อนั้น; ไม่ระบุ → ใช้ชื่อ task ปัจจุบัน

### 3. Find Or Create Gist

> Goal: หา gist เดิมหรือสร้างใหม่หนึ่งเดียวต่อ account

1. ค้นหา gist: `gh gist list --limit 100` แล้วหา description `devin-todo` หรือไฟล์ `devin-todo.md`
2. ถ้าไม่พบ → สร้างไฟล์ `devin-todo.md` ด้วย header ตาม convention:
   ```
   | Title | Description | Status | Priority | Created | Project |
   |---|---|---|---|---|---|
   ```
   แล้ว `gh gist create devin-todo.md --desc "devin-todo"` (default เป็น secret gist — ห้าม `--public` เว้น user สั่ง)
3. ถ้าพบ → ดึงเนื้อหาเดิม: `gh gist view <id-or-url> --filename devin-todo.md` เก็บไว้ merge

### 4. Append Items And Push

> Goal: เพิ่ม items ลง gist โดยไม่ทับของเดิม

1. Normalize items: แต่ละ item actionable — what + why pending + priority (`high`/`medium`/`low`) + project name
2. Append rows ใหม่ต่อท้ายตารางเดิม: `| <title> | <description + why pending> | pending | <priority> | <YYYYMMDD> | <project> |`
3. Dedupe กับ rows เดิม — merge/อัปเดต status แทนเพิ่มซ้ำ
4. Push กลับด้วย `gh gist edit <id> --filename devin-todo.md` รับ content ใหม่ผ่าน stdin (pipe) — หรือ `gh api gists/<id> -X PATCH -F 'files[devin-todo.md][content]=<content>'`

### 5. Report

> Goal: รายงานผล

1. ใช้ `/report` สรุป: `No.`, `Item`, `Priority`, `Why Pending`, `Action`
2. บอก gist URL และจำนวน items ที่เพิ่ม/ข้าม/merge

## Rules

### 1. Single Gist, Append Only

- gist เดียวต่อ account — หา description `devin-todo` เสมอ ห้ามสร้างซ้ำ
- ห้ามลบหรือเขียนทับ items เดิม — merge เฉพาะ item เดียวกันชัดเจน
- secret gist เท่านั้น — todo อาจมี context project ที่ไม่ควร public

### 2. Actionable Items

- ทุก item ต้องทำต่อได้โดยไม่ต้องอ่าน session — มี context/reference ครบ
- ระบุ project เสมอเพราะ gist รวมข้าม repos

### 3. Session Aware

- เรียกเมื่องานเหลือค้างจริง — ไม่สร้าง items จากงานที่เสร็จสมบูรณ์
- ถ้าไม่มีอะไรค้าง → รายงานว่าไม่มี ไม่บังคับเขียน

## Expected Outcome

- งานค้างถูกเก็บใน gist `devin-todo.md` พร้อม priority, เหตุ และ project
- ไม่มี items ซ้ำ; gist เดิมถูก merge ไม่ทับ
- Resume ได้จาก `/list-todo-gist` บนเครื่องใดก็ได้ที่ `gh` auth ไว้

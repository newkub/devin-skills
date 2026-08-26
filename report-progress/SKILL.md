---
name: report-progress
description: รายงานสถานะของ agent session ปัจจุบัน รวมงานทีเสร็จ งานค้าง และ next actions
---

## Goal

รายงานสถานะของ agent session ปัจจุบันว่า ทำอะไรไปแล้วบ้าง เสร็จแล้วหรือไม่ อะไรยังค้างอยู่ และต้องทำอะไรต่อ

## Scope

ใช้สำหรับสรุปสถานะของ Devin session ปัจจุบัน จาก conversation history, git status, project state, และ todo list ที่มีอยู่

## Execute

### 1. Gather Session Context

เก็บข้อมูลของ session ปัจจุบัน

> Goal: รู้ context ของงานทีกำลังทำ

1. อ่าน session summary ล่าสุดจาก `%APPDATA%\devin\cli\summaries\`
2. ตรวจสอบ working directory ปัจจุบัน และ `git status --short`
3. อ่าน `AGENTS.md` หรือ `global_rules.md` ของ project ถ้ามี
4. ค้นหาไฟล์ todo/roadmap เช่น `todo.md`, `ROADMAP.md`, `.devin/todo.md`
5. ถ้า context ไม่ชัด → ทำ `/ask-me` เพื่อถาม user

### 2. Identify Completed Work

ระบุงานทีทำเสร็จแล้ว

> Goal: รู้งานทีผ่านไปแล้ว

1. สรุป commit ล่าสุด ชื่องาน และ files ทีเปลี่ยนแปลง
2. ตรวจสอบสถานะ working tree ว่าสะอาดหรือมี uncommitted changes
3. ระบุ checkpoints สำคัญจาก conversation history
4. ใช้ `/report-markdown-table` แสดง completed work

### 3. Identify Pending Work

ระบุงานทียังไม่เสร็จ

> Goal: รู้งานทียังค้าง และ blockers

1. ตรวจสอบ todo/roadmap ทียังไม่เครื่องหมาย completed
2. ระบุ uncommitted/unpushed changes
3. ระบุ tests, build, lint หรือ validation ทียังไม่ผ่าน
4. ระบุ dependencies หรือ decisions ทีรอ user

### 4. Report And Suggest Next Actions

สร้าง report และ next actions

> Goal: report ชัดเจน พร้อม next steps

1. สรุปสถานะโดยรวมของ session
2. ใช้ `/report-markdown-table` หรือ `/report-markdown-ansi` แสดง completed, pending, blockers
3. ระบุ priority ของงานค้าง
4. ทำ `/suggest-next-action` เพื่อเสนอ next step

## Rules

### 1. Data Sources

- ใช้ `%APPDATA%\devin\cli\summaries\` สำหรับ session history
- ใช้ `git status` และ `git log` สำหรับ committed/uncommitted changes
- อ่าน `AGENTS.md` และ project rules ถ้ามี
- ถาม user ถ้าข้อมูลไม่ครบ

### 2. Accuracy

- ไม่อ้างว่างานเสร็จถ้า git ยังไม่ commit หรือยังไม่ verified
- ไม่ hallucinate งานทีไม่ได้เกิดขึ้นใน session
- แยกแยะระหว่างงานทีเสร็จ งานค้าง และงานทีต้องรอ user

### 3. Report Format

- สรุป key findings ไว้ด้านบนสุด
- ใช้ symbols ✅ ❌ ⚠️ สำหรับ status
- ใช้ `/report-markdown-table` สำหรับงานทีต้องการหลาย columns
- ใช้ `/report-markdown-ansi` สำหรับสถานะ/progress

### 4. Privacy

- ไม่อ้างอิงหรือเปิดเผย secrets, API keys, credentials
- ไม่อ่านไฟล์ทีไม่เกี่ยวข้อง

## Expected Outcome

- รู้สถานะปัจจุบันของ session ทั้งหมด
- รายงาน completed work, pending work, blockers ชัดเจน
- มี priority และ next actions ที actionable
- report อ่านง่าย พร้อม symbols และ table

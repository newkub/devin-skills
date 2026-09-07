---
name: report-usage
description: รายงาน usage ของ APIs/functions/skills/dependencies, USAGE.md, หรือ Devin session/cost
argument-hint: "[scope]"
related:
  - report-file-structure
  - report
  - list-devin-session
  - suggest-next-action
---

## Goal

สร้างรายงาน usage ตาม scope ทีระบุ: APIs/functions/skills/dependencies, `USAGE.md` coverage, หรือ Devin session/cost

## Scope

ใช้สำหรับหนึ่งในสามกรณี:
- วิเคราะห์ frequency, consumers, top callers ของ code APIs/functions/skills/dependencies
- ตรวจ `USAGE.md` ว่ามี sections ครบ เปรียบเทียบกับ `README.md`/`package.json`
- สรุป Devin session usage/cost ตาม period หรือ billing tags

(merged from: `report-usage-md`, `report-devin-usage`)

## Execute

### 1. Choose Scope

> Goal: ระบุประเภท usage ทีต้อง report

1. ถาม user หรือ detect จาก request
2. เลือก scope:
   - `code` — APIs, functions, classes, skills, dependencies
   - `usage-md` — ไฟล์ `USAGE.md` ใน project
   - `devin` — Devin sessions และ cost
3. ถ้าไม่ชัด → ทำ `/ask-me`

### 2. Code Usage

> Goal: วิเคราะห์การใช้งาน code

1. ระบุ targets: endpoints, functions, classes, skills หรือ dependencies
2. ค้นหา call sites/imports ด้วย `grep` หรือ `glob`
3. ระบุ files/workspaces ทีใช้, version, signature
4. ทำ `/report` สรุป top consumers, frequency, versions
5. ทำ `/report-file-structure` สำหรับ caller tree ถ้ามีประโยชน์
6. ระบุ unused, overused, deprecated usages

### 3. USAGE.md Coverage

> Goal: ตรวจสอบและสรุป `USAGE.md`

1. หาไฟล์ `USAGE.md`, `docs/USAGE.md`, `.github/USAGE.md`, หรือ `docs/`
2. ถ้าไม่มี → บันทึก `missing` พร้อม path
3. ถ้ามี → อ่านและระบุ sections: Installation, Quick Start, Usage, Examples, Configuration, CLI, API, Troubleshooting
4. เปรียบเทียบกับ `README.md` และ `package.json` scripts/bin
5. ทำ `/report` สรุป Section, Status, Evidence

### 4. Devin Session Usage

> Goal: สรุป session usage และ cost

1. ใช้ `devin_session_search` หรือ `/list-devin-session` ดึง sessions ตาม period/tag
2. ใช้ `devin_billing_tag_manage` ดึง billing tags ถ้ามี
3. คำนวณ sessions per day/week, success/failure/stopped distribution
4. ระบุ tag breakdown, recurring task patterns, long-running sessions
5. ทำ `/report` สรุป Period/Tag, Sessions, Success %, Top Task Type, Note
6. ระบุ automation candidates และ waste signals

### 5. Report And Next Action

> Goal: สรุปผลลัพธ์

1. ทำ `/report` ตาม scope ทีเลือก
2. สรุป key findings, unused/deprecated items, gaps
3. แนะนำ next action ที่เหมาะสม
4. ทำ `/suggest-next-action`

## Rules

### 1. Read Only

- ไม่แก้ไข code, sessions, หรือ billing config
- ไม่ expose sensitive data

### 2. Evidence Based

- ทุก metric ต้องมี source: file path, line number, หรือ API response
- ระบุวิธีนับอย่างชัดเจน

### 3. Actionable

- ระบุ unused, deprecated, overused usages
- ระบุ gaps ใน `USAGE.md`
- ระบุ automation candidates จาก Devin usage
- แนะนำ next action ชัดเจน

## Expected Outcome

- usage table พร้อม frequency และ consumers
- `USAGE.md` status: exists/missing, sections มี/ขาด
- Devin usage report ตาม period/tags
- unused/deprecated usages หรือ automation candidates
- summary และ next actions

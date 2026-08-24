---
name: report-release-changelog
description: จัดรูปแบบ release changelog จากข้อมูล diff ระหว่าง GitHub tags
allowed-tools:
  - read
  - write
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
---

## Goal

รับข้อมูล release diff จาก `/check-release-changelog` หรือ GitHub API แล้วจัดรูปแบบเป็น report changelog ที่อ่านง่าย

## Scope

ใช้สำหรับสร้าง changelog report ของ release ใดๆ จาก raw compare data หรือเมื่อ user ขอ report โดยเฉพาะ

## Execute

### 1. Receive Data

> Goal: รับข้อมูล diff ดิบ
> Goal: มีข้อมูลครบสำหรับเขียน report

1. ถ้าได้รับจาก `/check-release-changelog` → อ่าน `repo`, `from`, `to`, `compareUrl`, `releaseNotes`, `commits`, `filesChanged`
2. ถ้า user ให้ URL หรือ tag โดยตรง → ทำ `/check-release-changelog` ก่อน
3. ถ้าไม่มีข้อมูล → `/ask-me`

### 2. Format Changelog

> Goal: จัดรูปแบบ report
> Goal: report อ่านง่าย มี highlights

1. Header: release version, compare URL, release date
2. Summary: จำนวน commits, files changed, additions, deletions, จำนวน PRs
3. Breaking Changes: รายการที่มี `!` หรือ `BREAKING CHANGE`
4. Features: รายการ `feat`
5. Fixes: รายการ `fix`
6. Performance/Security: รายการ `perf`, `security`
7. Docs: รายการ `docs`
8. Other Changes: รายการ `chore`, `refactor`, `ci`
9. Files Changed: สรุป top 10 files ตามจำนวน changes

### 3. Output

> Goal: นำเสนอ report
> Goal: user ได้รับ report พร้อม next action

1. ใช้ `/report-table` สำหรับตารางสรุป
2. เก็บ report เป็น markdown ถ้า user ต้องการไฟล์
3. ทำ `/suggest-next-action`

## Rules

### Report UX/UI
> Goal: report อ่านง่าย สรุป key findings ไว้ด้านบน และนำไปสู่ action

1. สรุป key findings ไว้ด้านบนก่อนรายละเอียด
2. ใช้ `/report-table` สำหรับตารางเปรียบเทียบหลาย columns
3. ใช้ `/report-ansi` สำหรับรายงานสถานะ/progress/logs
4. ใช้ numbered columns, headers ชัดเจน, จัดกลุ่ม/เรียงลำดับตามความสำคัญ
5. ใช้ symbols ✅ ❌ ⚠️ สำหรับ status indicators
6. ทำ `/suggest-next-action` ท้าย report เสมอ

### 1. Clarity

- เรียงลำดับ sections: Breaking → Features → Fixes → Performance/Security → Docs → Other
- ระบุ compare URL ไว้ด้านบน
- ถ้าไม่มีข้อมูลบาง section → ข้ามไป ไม่ใส่ `none`

### 2. Accuracy

- สรุป commit message ให้กระชับ ไม่ตัดทอนจนผิดเจตนา
- ถ้าเป็น PR ให้ใส่ `#<number>`

### 3. Conciseness

- ถ้า commits มากกว่า 50 → แสดงเฉพาะ top 20 ของแต่ละ category พร้อม count

## Expected Outcome

- Report changelog ที่มี header, summary, categories, files changed
- อ่านง่าย มี highlights
- มี next action ชัดเจน

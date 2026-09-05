---
name: review-readme-md
description: ตรวจสอบ README.md ก่อน update-readme-md แก้ไข ครอบคลุม section order และ format
related:
  - scan-codebase
  - check-monorepo
  - report-table
  - suggest-next-action
  - update-readme-md
  - improve-docs
---

## Goal

Review `README.md` ทั้ง root และ workspace ก่อนเรียก `update-readme-md` เพื่อยืนยันว่า section order, table format, icons, content standards, coverage ครบถ้วน

## Scope

ใช้ก่อนเรียก `update-readme-md` — ตรวจ `README.md` ทั้ง root และทุก workspace ใน monorepo ทำ review เท่านั้น ไม่แก้ไข `README.md`

## Execute

### 1. Prepare Context

> Goal: เข้าใจ project structure และ README target

1. ทำ `/scan-codebase`
2. ทำ `/check-monorepo`
3. ระบุ `README.md` ทั้งหมด
4. ถ้าไม่มี `README.md` → flag เป็น critical

### 2. Check Section Order

> Goal: ตรวจ section order ตามมาตรฐาน

1. ทำตาม `references/section-order.md`

### 3. Check Tables And Icons

> Goal: ตรวจ table columns และ icon format

1. ทำตาม `references/tables-icons.md`

### 4. Check Content Standards

> Goal: ตรวจ content quality และ language

1. ทำตาม `references/content-standards.md`

### 5. Check Usage Coverage

> Goal: ตรวจ Usage section ครอบคลุมทุก access methods

1. ทำตาม `references/usage-coverage.md`

### 6. Check Features Coverage

> Goal: ตรวจ Features table ครอบคลุมทุก features

1. ทำตาม `references/features-coverage.md`

### 7. Check Workspace Consistency

> Goal: ตรวจ workspace READMEs ใน monorepo

1. ทำตาม `references/workspace-consistency.md`

### 8. Score And Report

> Goal: สรุป review score และ findings

1. ทำตาม `references/scoring.md`
2. ทำ `/report-table` พร้อม findings
3. ทำ `/suggest-next-action`

## Rules

### 1. Review Only

- ทำ review เท่านั้น ไม่แก้ไข `README.md`
- ถ้าต้องแก้ไข ให้เรียก `update-readme-md`
- ทุก finding ต้องมี file path และ evidence

### 2. Severity Ratings

- `Critical`: ไม่มี README.md, section order ผิดอย่างรุนแรง
- `High`: ขาด section สำคัญ, placeholder แทนข้อมูลจริง, ภาษาผิด
- `Medium`: table columns ไม่ครบ, icons ไม่มี color, ANSI codeblock
- `Low`: workspace README ขาด, features บางส่วนขาด
- `Info`: ข้อเสนอแนะ ไม่กระทบการทำงาน

### 3. Scoring

- review score = weighted average ของ findings
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)
- Score < 70 → แนะนำ `update-readme-md`

### 4. Formatting

- ห้ามใช้ `**` (bold markers)
- ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

- ใช้ /improve-docs ถ้าจำเป็น

## Expected Outcome

- รายงาน README Review พร้อม score และ grade
- รายงาน findings พร้อม severity, evidence, action
- ยืนยัน section order, table format, icons, content standards
- ยืนยัน Usage ครอบคลุมทุก access methods
- ยืนยัน Features ครอบคลุมทุก features
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

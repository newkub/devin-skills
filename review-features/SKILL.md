---
name: review-features
description: ตรวจสอบ features documentation ก่อน update-features-md แก้ไข
---

## Goal

Review features documentation ก่อนเรียก `update-features-md` เพื่อยืนยันว่า `docs/project/features.md` ครอบคลุมทุก features จาก source code, format ถูกต้อง, และไม่ซ้ำซ้อน

## Scope

ใช้ก่อนเรียก `update-features-md` — ตรวจ `docs/project/features.md` และ features coverage ทำ review เท่านั้น ไม่แก้ไข docs ระหว่าง review

## Execute

### 1. Prepare Context

> Goal: เข้าใจ project structure และ features target

- ทำ `/scan-codebase` เพื่อดู project structure
- ทำ `/check-monorepo` เพื่อยืนยัน monorepo status
- ตรวจว่า `docs/project/features.md` มีอยู่ ถ้าไม่ → flag เป็น critical
- บันทึก workspace list ถ้าเป็น monorepo

### 2. Check Format

> Goal: ตรวจ format ของ features.md

ทำตาม references/format.md

### 3. Check Coverage

> Goal: ตรวจ features coverage จาก source code

ทำตาม references/coverage.md

### 4. Check No Duplication

> Goal: ตรวจไม่มี duplicated docs

ทำตาม references/duplication.md

### 5. Check Sidebar And Nav

> Goal: ตรวจ sidebar และ nav integration

- ตรวจว่า `docs/project/features.md` อยู่ใน sidebar
- ตรวจว่า `docs/roadmap/index.md` ลิงก์ไป features (ถ้ามี)
- บันทึก findings

### 6. Check Monorepo Coverage

> Goal: ตรวจ monorepo coverage

ทำตาม references/monorepo.md

### 7. Score And Report

> Goal: สรุป review score และ findings

ทำตาม references/scoring.md

- คำนวณ review score, grade และ supplementary metrics
- ทำ `/report-table`
- ทำ `/suggest-next-action`

## Rules

1. Review Only
   - ทำ review เท่านั้น ไม่แก้ไข docs ระหว่าง review
   - ทุก finding ต้องมี file path และ evidence
2. Severity Ratings
   - Critical: ไม่มี features.md, ไม่มี features เลย
   - High: ขาด features สำคัญ, format ผิด
   - Medium: ขาด domain grouping, ขาด columns, HTML แทน markdown
   - Low: sidebar ขาด, monorepo coverage ไม่ครบ
   - Info: ข้อเสนอแนะ
3. Scoring
   - review score = weighted average ของ findings
   - Grade A-F ตาม thresholds
   - Score < 70 → แนะนำให้เรียก `update-features-md`
4. Formatting
   - ห้ามใช้ bold markers — ใช้ backticks
   - รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงาน Features Review พร้อม score และ grade
- รายงาน findings พร้อม severity, evidence และ action
- ยืนยัน format, coverage, no duplication ครบ
- ยืนยัน sidebar และ monorepo coverage ครบ
- แนะนำ action ถัดไป

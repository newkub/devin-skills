---
name: review-features
description: ตรวจสอบ features documentation ก่อน update-features แก้ไข
related:
  - update-features
  - update-docs
  - validate
  - report-table
  - suggest-next-action
---

## Goal

Review features documentation ก่อนเรียก `update-features` เพื่อยืนยันว่า `docs/project/features.md` ครอบคลุมทุก features จาก source code, format ถูกต้อง, และไม่ซ้ำซ้อน

## Scope

ใช้ก่อนเรียก `update-features` — ตรวจ `docs/project/features.md` และ features coverage ทำ review เท่านั้น ไม่แก้ไข docs ระหว่าง review

## Execute

### 1. Prepare Context

> Goal: เข้าใจ project structure และ features target

1. ทำ `/scan-codebase` เพื่อดู project structure
2. ทำ `/check-monorepo` เพื่อยืนยัน monorepo status
3. ตรวจว่า `docs/project/features.md` มีอยู่ ถ้าไม่ → flag เป็น critical
4. บันทึก workspace list ถ้าเป็น monorepo

### 2. Check Format

> Goal: ตรวจ format ของ features.md

1. ดู `references/format.md` สำหรับ format validation rules
2. ตรวจว่ามี markdown table `| Feature | Description | Module | Domain | Status |`
3. ตรวจว่า features จัดกลุ่มตาม domain ด้วย heading `## <domain>`
4. ตรวจว่าแต่ละ feature มี name, description, module, domain
5. ตรวจว่าไม่ใช้ HTML หรือ interactive UX — markdown only
6. บันทึก findings พร้อม evidence

### 3. Check Coverage

> Goal: ตรวจ features coverage จาก source code

1. ดู `references/coverage.md` สำหรับ coverage checks จาก source code
2. ตรวจ routes directory เพื่อระบุ pages และ user-facing features
3. ตรวจ modules directory เพื่อระบุ business logic features
4. ตรวจ database schema files เพื่อระบุ tables และ relationships
5. ตรวจ server handlers และ API routes เพื่อระบุ endpoints
6. เปรียบเทียบกับ `docs/project/features.md` เพื่อระบุ missing features
7. บันทึก findings พร้อม evidence

### 4. Check No Duplication

> Goal: ตรวจไม่มี duplicated docs

1. ดู `references/duplication.md` สำหรับ no-duplication checks
2. ตรวจว่าไม่มี docs/ ในแต่ละ workspace (delegated to `/update-docs`)
3. ตรวจว่าไม่มี `.devin/features/` directory
4. ตรวจว่าไม่สร้าง docs ซ้ำในแต่ละ workspace
5. บันทึก findings พร้อม evidence

### 5. Check Sidebar And Nav

> Goal: ตรวจ sidebar และ nav integration

1. ตรวจว่า `docs/project/features.md` อยู่ใน sidebar (delegated to `/update-docs`)
2. ตรวจว่า `docs/roadmap/index.md` ลิงก์ไป features (ถ้ามี)
3. บันทึก findings พร้อม evidence

### 6. Check Monorepo Coverage

> Goal: ตรวจ monorepo coverage

1. ดู `references/monorepo.md` สำหรับ monorepo coverage checks
2. ถ้า monorepo ตรวจว่า features จากทุก workspace ถูกวิเคราะห์
3. ตรวจว่าแต่ละ feature ระบุ workspace ที่เกี่ยวข้อง
4. บันทึก findings พร้อม evidence

### 7. Score And Report

> Goal: สรุป review score และ findings

1. ดู `references/scoring.md` สำหรับ scoring formula และ grade thresholds
2. คำนวณ review score = weighted average (Critical=0, High=25, Medium=50, Low=75, Info=100)
3. กำหนด grade: A (90+), B (80+), C (70+), D (60+), F (<60)
4. ทำ `/report-table` พร้อม findings: Category, Severity, Finding, Evidence, Action
5. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Review Only

- ทำ review เท่านั้น ไม่แก้ไข docs ระหว่าง review
- ถ้าต้องแก้ไข ให้เรียก `update-features` หลัง review
- ทุก finding ต้องมี file path และ evidence

### 2. Severity Ratings

- `Critical`: ไม่มี features.md, ไม่มี features เลย
- `High`: ขาด features สำคัญจาก source code, format ผิด
- `Medium`: ขาด domain grouping, ขาด columns, HTML แทน markdown
- `Low`: sidebar ขาด, monorepo coverage ไม่ครบ
- `Info`: ข้อเสนอแนะ ไม่กระทบการทำงาน

### 3. Scoring

- review score = weighted average ของ findings ทั้งหมด
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)
- Score < 70 → แนะนำให้เรียก `update-features` ก่อนดำเนินการ

### 4. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงาน Features Review พร้อม score และ grade
- รายงาน findings พร้อม severity, evidence และ action required
- ยืนยัน format, coverage, no duplication ครบถ้วน
- ยืนยัน sidebar และ monorepo coverage ครบถ้วน
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

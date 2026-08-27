---
name: review-readme-md
description: ตรวจสอบ README.md ก่อน update-readme-md แก้ไข ครอบคลุม section order และ format
related:
  - scan-codebase
  - check-monorepo
  - report-table
  - suggest-next-action
---

## Goal

Review `README.md` ทั้ง root และ workspace ก่อนเรียก `update-readme-md` เพื่อยืนยันว่า section order, table format, icons, content standards, และ coverage ครบถ้วนและถูกต้อง

## Scope

ใช้ก่อนเรียก `update-readme-md` — ตรวจ `README.md` ทั้ง root และทุก workspace ใน monorepo ทำ review เท่านั้น ไม่แก้ไข `README.md` ระหว่าง review

## Execute

### 1. Prepare Context

> Goal: เข้าใจ project structure และ README target

1. ทำ `/scan-codebase` เพื่อดู project structure
2. ทำ `/check-monorepo` เพื่อยืนยัน monorepo status
3. ระบุ `README.md` ทั้งหมด: root และ workspace (ถ้า monorepo)
4. ถ้าไม่มี `README.md` → flag เป็น critical

### 2. Check Section Order

> Goal: ตรวจ section order ตามมาตรฐาน

1. ตรวจลำดับ sections: Status Callout > Hero > UI Sketch > Get Started > Features > Usage > Project > API References > Development > License
2. ตรวจว่า UI Sketch เป็น text codeblock (ไม่ใช่ ANSI) วางด้านบน Get Started โดยไม่มี heading
3. ตรวจว่า License section แยกด้านล่างสุด (root เท่านั้น)
4. บันทึก findings พร้อม evidence (file, line)

> ดู `references/section-order.md` สำหรับ section order rules

### 3. Check Tables And Icons

> Goal: ตรวจ table columns และ icon format

1. ตรวจ Features table มี 5 columns: Icon, Feature, Description, Benefit, Usage
2. ตรวจ Project sub-tables: Goal (4 columns), Scope (4), When To Use (3), Key Concepts/Core Principles/Best Practices (3)
3. ตรวจ Development > Tech Stack (4 columns), Scripts (JSON codeblock)
4. ตรวจ icons ใช้ iconify CDN พร้อม `?color=%23<hex>` — ห้ามใช้ emoji ในตาราง
5. ตรวจ Icon column จัดกึ่งกลางด้วย `:---:`
6. บันทึก findings พร้อม evidence

> ดู `references/tables-icons.md` สำหรับ table columns และ icon format rules

### 4. Check Content Standards

> Goal: ตรวจ content quality และ language

1. ตรวจว่า content เป็นภาษาอังกฤษ (via `/translate-to-lang-en`)
2. ตรวจว่าใช้ข้อมูลจริง ไม่มี placeholder ยกเว้น banner image
3. ตรวจว่าไม่มี `## Information`, `## Key Concepts`, `## Tech Stack` เป็น section แยก
4. ตรวจว่าไม่มี ANSI codeblock ใน README ทั้งหมด
5. บันทึก findings พร้อม evidence

> ดู `references/content-standards.md` สำหรับ content quality และ language rules

### 5. Check Usage Coverage

> Goal: ตรวจ Usage section ครอบคลุมทุก access methods

1. ตรวจว่า `## Usage` มี `### Usage via ...` สำหรับทุก access method ที่ project รองรับ
2. Web: text instructions ไม่ใช่ code block
3. API: code block พร้อม import และ function call
4. CLI: bash code block พร้อม command
5. SDK: code block พร้อม install + import + usage
6. TUI/Desktop/Browser Extension: text instructions
7. บันทึก findings พร้อม evidence

> ดู `references/usage-coverage.md` สำหรับ Usage section coverage rules

### 6. Check Features Coverage

> Goal: ตรวจ Features table ครอบคลุมทุก features

1. ตรวจว่า Features ครอบคลุมทุก features จาก source code
2. ตรวจว่าแต่ละ row กระชับ มีครบทุก column
3. ตรวจว่าเขียน business value ไม่ใช่แค่ technical details
4. บันทึก findings พร้อม evidence

### 7. Check Workspace Consistency

> Goal: ตรวจ workspace READMEs ใน monorepo

1. ถ้า monorepo ตรวจว่าทุก workspace มี `README.md`
2. ตรวจว่า workspace README ไม่มี License section (ใช้ของ root)
3. ตรวจว่า workspace README ไม่ซ้ำเนื้อหา root
4. บันทึก findings พร้อม evidence

> ดู `references/workspace-consistency.md` สำหรับ workspace README rules

### 8. Score And Report

> Goal: สรุป review score และ findings

1. คำนวณ review score = weighted average (Critical=0, High=25, Medium=50, Low=75, Info=100)
2. กำหนด grade: A (90+), B (80+), C (70+), D (60+), F (<60)
3. ทำ `/report-table` พร้อม findings: Category, Severity, Finding, Evidence, Action
4. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

> ดู `references/scoring.md` สำหรับ scoring formula และ grade thresholds

## Rules

### 1. Review Only

- ทำ review เท่านั้น ไม่แก้ไข `README.md` ระหว่าง review
- ถ้าต้องแก้ไข ให้เรียก `update-readme-md` หลัง review
- ทุก finding ต้องมี file path และ evidence

### 2. Severity Ratings

- `Critical`: ไม่มี README.md, section order ผิดอย่างรุนแรง
- `High`: ขาด section สำคัญ, placeholder แทนข้อมูลจริง, ภาษาผิด
- `Medium`: table columns ไม่ครบ, icons ไม่มี color, ANSI codeblock
- `Low`: workspace README ขาด, features บางส่วนขาด
- `Info`: ข้อเสนอแนะ ไม่กระทบการทำงาน

### 3. Scoring

- review score = weighted average ของ findings ทั้งหมด
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)
- Score < 70 → แนะนำให้เรียก `update-readme-md` ก่อนดำเนินการ

### 4. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงาน README Review พร้อม score และ grade
- รายงาน findings พร้อม severity, evidence และ action required
- ยืนยัน section order, table format, icons, content standards ครบถ้วน
- ยืนยัน Usage ครอบคลุมทุก access methods
- ยืนยัน Features ครอบคลุมทุก features จาก source code
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

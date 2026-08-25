---
name: review-devin-subagents
description: ตรวจสอบ subagent ก่อน update-devin-subagents แก้ไข ครอบคลุม format
---

## Goal

Review devin subagents ก่อนเรียก `update-devin-subagents` เพื่อยืนยันว่า `AGENT.md` ผ่านเกณฑ์มาตรฐาน: frontmatter, sections, line count, style, และ safety

## Scope

ใช้ก่อนเรียก `update-devin-subagents` — ตรวจ subagent ใน `%APPDATA%\devin\agents` ทำ review เท่านั้น ไม่แก้ไข subagents ระหว่าง review

## Execute

### 1. Prepare Context

> Goal: เข้าใจ subagent target

1. ทำ `/list-devin-subagents` เพื่อยืนยันว่า subagent มีอยู่จริง
2. ถ้าไม่พบ → flag เป็น critical
3. อ่าน `AGENT.md` ของ subagent target
4. บันทึก subagent name และ directory

### 2. Check Frontmatter

> Goal: ตรวจ frontmatter ครบถ้วน

1. ตรวจว่ามี `name`, `description`, `model`, `allowed-tools` ใน frontmatter (ดู `references/frontmatter.md` สำหรับ validation rules)
2. ตรวจว่า `name` ตรงกับ directory name
3. ตรวจว่า `description` ไม่เกิน 100 ตัวอักษร
4. ตรวจ `permissions` ระบุ `deny` สำหรับ system paths ที่เสี่ยง
5. บันทึก findings พร้อม evidence

### 3. Check Sections

> Goal: ตรวจ sections ตามมาตรฐาน

1. ตรวจ sections ตามลำดับ: `## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome` (ดู `references/sections.md` สำหรับ validation rules)
2. ตรวจว่าไฟล์ไม่เกิน 250 บรรทัด
3. ตรวจว่าไม่มี TODO/MOCK/placeholder
4. บันทึก findings พร้อม evidence

### 4. Check Style

> Goal: ตรวจ style conventions

1. ตรวจว่าใช้ backticks สำหรับ `tools`, `commands`, `file paths` (ดู `references/style.md` สำหรับ validation rules)
2. ตรวจว่าไม่ใช้ `**` bold markers
3. ตรวจว่า heading ภาษาอังกฤษ Title Case
4. บันทึก findings พร้อม evidence

### 5. Check Safety

> Goal: ตรวจ safety และ security

1. ตรวจว่าไม่มี secrets/credentials hardcoded (ดู `references/safety.md` สำหรับ validation rules)
2. ตรวจว่า `permissions` deny risky system paths
3. ตรวจว่า `allowed-tools` เหมาะสมกับ scope ของ subagent
4. บันทึก findings พร้อม evidence

### 6. Score And Report

> Goal: สรุป review score และ findings

1. คำนวณ review score = weighted average (Critical=0, High=25, Medium=50, Low=75, Info=100) (ดู `references/scoring.md` สำหรับ scoring formula)
2. กำหนด grade: A (90+), B (80+), C (70+), D (60+), F (<60)
3. ทำ `/report-table` พร้อม findings: Category, Severity, Finding, Evidence, Action
4. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Review Only

- ทำ review เท่านั้น ไม่แก้ไข subagents ระหว่าง review
- ถ้าต้องแก้ไข ให้เรียก `update-devin-subagents` หลัง review
- ทุก finding ต้องมี file path และ evidence

### 2. Severity Ratings

- `Critical`: ไม่มี subagent, ขาด frontmatter จำเป็น, secrets hardcoded
- `High`: ขาด sections จำเป็น, เกิน 250 บรรทัด, `permissions` ไม่ deny risky paths
- `Medium`: TODO/MOCK/placeholder, style ผิด, `allowed-tools` ไม่เหมาะสม
- `Low`: description เกิน 100, heading ไม่ Title Case
- `Info`: ข้อเสนอแนะ ไม่กระทบการทำงาน

### 3. Scoring

- review score = weighted average ของ findings ทั้งหมด
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)
- Score < 70 → แนะนำให้เรียก `update-devin-subagents` ก่อนดำเนินการ

### 4. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงาน Subagent Review พร้อม score และ grade
- รายงาน findings พร้อม severity, evidence และ action required
- ยืนยัน frontmatter, sections, line count, style, safety ครบถ้วน
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

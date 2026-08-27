---
name: review-usage-md
description: Review USAGE.md quality, coverage, and consistency in workspace
---

## Goal

Review `USAGE.md` ใน workspace ว่ามีคุณภาพ ครอบคลุม และ consistency กับ project หรือไม่

## Scope

- ตรวจสอบโครงสร้าง เนื้อหา และ formatting ของ `USAGE.md`
- เปรียบเทียบกับ `README.md`, `package.json`, examples, code
- ให้ findings พร้อม severity และ recommendation
- ใช้ก่อน `/update-usage-md`

## Execute

### 1. Consider Existing Skills

> Goal: ตรวจสอบว่ามี skill อื่นเหมาะสมกว่าหรือไม่

1. ดูรายละเอียดใน [references/consider-existing-skills.md](references/consider-existing-skills.md)
2. บันทึก findings พร้อม severity และ evidence

### 2. Prepare Context

> Goal: เข้าใจ project และ `USAGE.md`

1. ดูรายละเอียดใน [references/prepare-context.md](references/prepare-context.md)
2. บันทึก findings พร้อม severity และ evidence

### 3. Check Structure

> Goal: ตรวจโครงสร้าง `USAGE.md`

1. ดูรายละเอียดใน [references/check-structure.md](references/check-structure.md)
2. บันทึก findings พร้อม severity และ evidence

### 4. Check Content

> Goal: ตรวจเนื้อหา

1. ดูรายละเอียดใน [references/check-content.md](references/check-content.md)
2. บันทึก findings พร้อม severity และ evidence

### 5. Check Consistency

> Goal: เปรียบเทียบกับ project

1. ดูรายละเอียดใน [references/check-consistency.md](references/check-consistency.md)
2. บันทึก findings พร้อม severity และ evidence

### 6. Check Formatting

> Goal: ตรวจรูปแบบ

1. ดูรายละเอียดใน [references/check-formatting.md](references/check-formatting.md)
2. บันทึก findings พร้อม severity และ evidence

### 7. Score And Report

> Goal: สรุป review

1. ดูรายละเอียดใน [references/score-and-report.md](references/score-and-report.md)
2. บันทึก findings พร้อม severity และ evidence

## Rules

### 1. Review Only

- ไม่แก้ไข `USAGE.md` ระหว่าง review
- ถ้าต้องแก้ → สรุป findings แล้วใช้ `/update-usage-md`

### 2. Severity

- `Critical`: `USAGE.md` หายไป หรือข้อมูลผิดพลาดร้ายแรง
- `High`: examples รันไม่ได้, commands ผิด
- `Medium`: section ขาด, consistency กับ project หาย
- `Low`: formatting, heading levels, line count
- `Info`: ข้อเสนอแนะ

### 3. Evidence

- ทุก finding ต้องมี file path, line number, snippet
- อ้างอิง `package.json` หรือ `README.md` เป็นหลัก

### 4. Scope

- Review `USAGE.md` แบบ manual เท่านั้น
- ถ้า generate จาก `usage.kdl` → ใช้ `/review-app-usage` แทน

### 5. Formatting

- ห้ามใช้ `**` (bold markers)
- ใช้ backticks สำหรับ file paths, commands, skill names
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงาน `USAGE.md` review พร้อม score และ grade
- findings มี severity, evidence, action
- ยืนยัน consistency กับ project
- คำแนะนำถัดไปชัดเจน

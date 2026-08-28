---
name: report-enhance-prompt
description: ปรับปรุง prompt ให้ชัดเจน เป็นระเบียบ แยกหน่วยงาน และสร้างแผน
argument-hint: "[prompt]"
related:
  - report-numbered-bullet
  - follow-single-responsibility
  - sumarize-your-understand
  - report-plan
  - follow-math-concepts
  - follow-math-probability
  - follow-math-proofs
---

## Goal

รับ prompt จาก user แล้ว enhance ให้ชัดเจน แยกเป็น numbered/bullet list พร้อม references และพร้อมใช้ `/report-plan`

## Scope

ใช้เมื่อ prompt ยาว, คลุมเครือ, มีหลายงาน หรือต้องการ plan ก่อนลงมือ — ไม่แก้ไขไฟล์จริง

## Execute

### 1. Parse Original Prompt

> Goal: เข้าใจความต้องการดิบ

1. อ่าน prompt ทีได้รับ
2. ระบุ goal, scope, constraints, expected outcome
3. ระบุคำถามทีต้องตอบก่อน
4. ถ้าไม่ชัด → ทำ `/sumarize-your-understand` หรือ `/ask-me`

### 2. Decompose With Single Responsibility

> Goal: แยกงานออกเป็นหน่วยย่อย

1. ทำ `/follow-single-responsibility` แยกแต่ละคำขอ/งาน
2. เรียงลำดับตาม dependency, priority, หรือลำดับเวลา
3. ถ้ามีคณิตศาสตร์/ตรรกะซับซ้อน → ใช้ `/follow-math-concepts` หรือ `/follow-math-proofs`
4. ถ้ามีการตัดสินใจภายใต้ความไม่แน่นอน → ใช้ `/follow-math-probability`

### 3. Enhance Prompt

> Goal: สร้าง prompt ทีดีขึ้น

1. เขียนประโยคเปิดทีระบุ goal ชัดเจน
2. แยกแต่ละงานเป็น numbered list
3. ใต้แต่ละงานใช้ bullet สำหรับรายละเอียด/acceptance criteria
4. ระบุ references:
   - URLs ที่เกี่ยวข้อง
   - `/skill-name` ทีควรใช้
   - paths/files ทีเกี่ยวข้อง
5. ระบุ output format ทีต้องการ

### 4. Report With Numbered Bullet

> Goal: นำเสนอผลลัพธ์

1. ทำ `/report-numbered-bullet` สำหรับรูปแบบ output
2. แสดง:
   - `## Original Summary` (1-2 บรรทัด)
   - `## Enhanced Prompt` (numbered + bullets)
   - `## References` (URLs, skills, paths)
   - `## Questions` (ถ้ามี)
   - `## Suggested Next Action`
3. ถ้าต้องการแผนละเอียด → ส่งต่อให้ `/report-plan`

## Rules

### 1. Preserve Intent

- รักษาความหมายและข้อกำหนดเดิมของ user
- ไม่เพิ่ม scope หรือลด scope โดยไม่มีเหตุผล
- ถ้าขัดแย้งในตัว prompt → ชี้ให้ชัดและใช้ `/ask-me`

### 2. Single Responsibility

- แต่ละข้อใน numbered list ทำสิงเดียว
- ถ้าพบหลายคำขอในข้อเดียว → แบ่งย่อย
- ทุก bullet สนับสนุนหัวข้อหลักทีติดอยู่

### 3. Reference Discipline

- ใส่ URL จริงถ้า prompt ระบุมา
- ใส่ `/<skill-name>` ทีเกี่ยวข้อง
- ใช้ backticks สำหรับ paths, commands, code
- ไม่สร้าง reference ที่ไม่มีอยู่จริง

### 4. Math Support

- ถ้ามี performance, complexity, cost trade-off → ใช้ `/follow-math-algorithm-complexity` หรือ `/follow-math-optimization`
- ถ้ามี uncertainty หรือ risk → ใช้ `/follow-math-probability`
- ถ้าต้อง proving correctness → ใช้ `/follow-math-proofs`
- ถ้ามีสถิติหรือ metrics → ใช้ `/follow-math-statistics`

## Expected Outcome

- Prompt ทีปรับปรุงแล้ว กระชับ ชัดเจน
- แยกงานเป็น numbered list แต่ละข้อมี single responsibility
- มี bullet สำหรับรายละเอียดและ references
- ระบุ URL, skills, paths ทีเกี่ยวข้อง
- พร้อมส่งต่อให้ `/report-plan` หรือ `/continue`

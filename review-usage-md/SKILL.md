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

1. ทำ `/consider-use-in-another-skills` เพื่อหา skills ที่เกี่ยวข้อง
2. ถ้า project เป็น CLI ที่มี `usage.kdl` → ใช้ `/review-usage` แทน
3. ถ้า `USAGE.md` ไม่มี → แนะนำ `/update-usage-md` หรือ `/report-usage-md`
4. ถ้าไม่มี skill อื่นเหมาะสมกว่า → ดำเนินการ review

### 2. Prepare Context

> Goal: เข้าใจ project และ `USAGE.md`

1. อ่าน `USAGE.md` ถ้ามี
2. อ่าน `README.md` และ `package.json`
3. อ่าน `AGENTS.md` หรือ project conventions ถ้ามี
4. ค้นหา examples ใน `examples/`, `docs/`, tests

### 3. Check Structure

> Goal: ตรวจโครงสร้าง `USAGE.md`

1. ตรวจ `##` sections: Goal, Installation, Quick Start, Usage, Examples, Configuration, CLI, API, Troubleshooting
2. ตรวจ section order ตาม user flow
3. ตรวจ heading levels ถูกต้อง
4. บันทึก findings หาก section ขาดหรือเรียงผิด

### 4. Check Content

> Goal: ตรวจเนื้อหา

1. ตรวจ examples รันได้จริง
2. ตรวจ commands/options ตรงกับ `package.json` และ CLI จริง
3. ตรวจ paths ถูกต้อง
4. ตรวจไม่มี placeholder หรือ generic filler
5. ตรวจไม่มี `**` (bold markers)

### 5. Check Consistency

> Goal: เปรียบเทียบกับ project

1. เปรียบเทียบ version กับ `package.json`
2. เปรียบเทียบ bin/scripts กับ `package.json`
3. เปรียบเทียบ examples กับ test files หรือ `examples/`
4. เปรียบเทียบ API กับ exports ใน `src/index.ts`

### 6. Check Formatting

> Goal: ตรวจรูปแบบ

1. ตรวจ `USAGE.md` ไม่เกิน 250 บรรทัด
2. ตรวจ backticks สำหรับ code, paths, commands
3. ตรวจ lists ใช้ภาษาไทยหรืออังกฤษสม่ำเสมอ
4. ตรวจ links ไม่ broken

### 7. Score And Report

> Goal: สรุป review

1. ให้ severity: Critical, High, Medium, Low, Info
2. คำนวณ score จาก findings
3. ทำ `/report-table` แสดง Category, Severity, Finding, Evidence, Action
4. ทำ `/suggest-next-action`

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
- ถ้า generate จาก `usage.kdl` → ใช้ `/review-usage` แทน

### 5. Formatting

- ห้ามใช้ `**` (bold markers)
- ใช้ backticks สำหรับ file paths, commands, skill names
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงาน `USAGE.md` review พร้อม score และ grade
- findings มี severity, evidence, action
- ยืนยัน consistency กับ project
- คำแนะนำถัดไปชัดเจน

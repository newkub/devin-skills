---
name: report-usage-md
description: Report the status and coverage of USAGE.md in workspace
related:
  - update-usage-md
  - review-usage-md
  - consider-use-in-another-skills
  - report-usage
  - report
  - report-table
  - suggest-next-action
---

## Goal

รายงานสถานะและความครอบคลุมของ `USAGE.md` ใน workspace

## Scope

- ตรวจสอบว่า `USAGE.md` มีหรือไม่
- สรุปเนื้อหาและ sections ที่มี
- เปรียบเทียบกับ `README.md`, `package.json`, examples
- ใช้ก่อน `/update-usage-md` หรือ `/review-usage-md`

## Execute

### 1. Consider Existing Skills

> Goal: ตรวจสอบว่ามี skill อื่นเหมาะสมกว่าหรือไม่

1. ทำ `/consider-use-in-another-skills` เพื่อหา skills ที่เกี่ยวข้อง
2. ถ้า project เป็น CLI ที่มี `usage.kdl` → ใช้ `/report-usage` แทน
3. ถ้า project ไม่มี `USAGE.md` ทั่วไป → ดำเนินการตาม steps ต่อไป
4. ถ้า `/report` ทั่วไปครอบคลุมพอ → delegate ไปยัง `/report`

### 2. Locate USAGE.md

> Goal: หาไฟล์ `USAGE.md`

1. ใช้ `find_file_by_name` หรือ `ls` ค้นหา `USAGE.md`
2. ตรวจสอบ path ทั่วไป: root, `docs/`, `.github/`
3. ถ้าไม่มี → บันทึก status: `missing`
4. ถ้ามี → บันทึก path และ line count

### 3. Read And Summarize

> Goal: สรุปเนื้อหา

1. อ่าน `USAGE.md` ทั้งหมด
2. ระบุ sections ทีมี: Installation, Quick Start, Usage, Examples, Configuration, CLI, API, Troubleshooting
3. นับจำนวน examples และ commands
4. บันทึก sections ทีขาด

### 4. Compare With Project

> Goal: เปรียบเทียบกับ project จริง

1. อ่าน `package.json` สำหรับ bin, scripts, version
2. อ่าน `README.md` สำหรับ overview
3. ค้นหา `examples/` หรือ test files สำหรับ usage examples
4. เปรียบเทียบ `USAGE.md` กับ sources พบ gaps

### 5. Report

> Goal: รายงานสถานะ

1. ทำ `/report-table` แสดง: Section, Status, Evidence
2. ระบุ `missing`, `present`, `stale`, `needs-update`
3. ทำ `/suggest-next-action` สำหรับ `/update-usage-md` หรือ `/review-usage-md`

## Rules

### 1. Read-Only

- ไม่แก้ไขไฟล์ระหว่าง report
- ถ้าต้องการแก้ → ใช้ `/update-usage-md` หรือ `/review-usage-md`

### 2. Accuracy

- ตรวจสอบ path จริงก่อน report
- ไม่สรุป sections ที่ไม่มี
- ระบุ line count และ word count ถ้ามีประโยชน์

### 3. Scope

- รายงานเฉพาะ `USAGE.md` แบบ manual
- ถ้า `USAGE.md` ถูก generate จาก `usage.kdl` → ชี้ไป `/report-usage` แทน

### 4. Formatting

- ห้ามใช้ `**` (bold markers)
- ใช้ backticks สำหรับ paths, section names, skill names
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงาน `USAGE.md` status: exists/missing
- รายการ sections ที่มีและขาด
- เปรียบเทียบกับ `README.md` และ `package.json`
- คำแนะนำ action ถัดไป

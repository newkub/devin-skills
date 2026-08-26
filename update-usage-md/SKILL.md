---
name: update-usage-md
description: Create or update USAGE.md in workspace with installation, usage, examples, and options
---

## Goal

สร้างหรืออัปเดต `USAGE.md` ใน workspace เพื่ออธิบายวิธีใช้งาน project ครบถ้วน

## Scope

- ใช้เมื่อ project ต้องการ `USAGE.md` แบบ manual
- ไม่ใช้สำหรับ CLI ที่ generate `USAGE.md` จาก `usage.kdl` (ใช้ `/update-usage` แทน)
- อัปเดต `USAGE.md` ให้ตรงกับ `README.md`, `package.json`, examples และ code ล่าสุด

## Execute

### 1. Consider Existing Skills

> Goal: ตรวจสอบว่ามี skill อื่นเหมาะสมกว่าหรือไม่

1. ทำ `/consider-use-in-another-skills` เพื่อหา skills ที่เกี่ยวข้อง
2. ถ้า project เป็น CLI ที่มี `usage.kdl` → ใช้ `/update-usage` แทน
3. ถ้า project มี `/update-docs` ที่เหมาะสมกว่า → delegate ไปยัง skill นั้น
4. ถ้าไม่มี skill อื่นเหมาะสมกว่า → ดำเนินการตาม steps ต่อไป

### 2. Gather Context

> Goal: รวบรวมข้อมูลสำหรับ `USAGE.md`

1. อ่าน `README.md` เพื่อเข้าใจ overview และ target users
2. อ่าน `package.json` สำหรับ `name`, `version`, `bin`, `scripts`
3. อ่าน `AGENTS.md` หรือ project rules ถ้ามี
4. ค้นหา examples ใน `examples/`, `docs/examples/`, หรือ test files
5. ตรวจสอบ CLI entry หรือ main exports สำหรับ library

### 3. Decide Structure

> Goal: กำหนดโครงสร้าง `USAGE.md`

1. เลือก sections ตาม project type:
   - Installation (`npm install`, `bun install`, `cargo install`, `go install`)
   - Quick Start
   - Basic Usage
   - Examples
   - Configuration
   - CLI Options / Commands
   - API Reference (ถ้าเป็น library)
   - Troubleshooting
2. ระบุ audience: users, developers, contributors
3. ทำ `/report-plan` ถ้า structure ใหญ่

### 4. Draft USAGE.md

> Goal: เขียน `USAGE.md` ฉบับร่าง

1. สร้างหรือเขียนทับ `USAGE.md` ด้วยโครงสร้างทีเลือก
2. ใช้ backticks สำหรับ commands, paths, options, code
3. ใส่ examples จริงจาก project
4. อธิบาย flags, args, options หากมี CLI
5. อ้างอิง `README.md` สำหรับ links ต่อไป

### 5. Validate

> Goal: ตรวจสอบความถูกต้อง

1. ตรวจ `USAGE.md` ไม่เกิน 250 บรรทัด
2. ตรวจไม่มี `**` bold markers
3. ตรวจ examples รันได้จริง
4. ตรวจว่าไม่มี placeholder หรือ generic filler
5. ตรวจ consistency กับ `README.md` และ `package.json`

### 6. Update Cross-References

> Goal: อัปเดต links ใน project

1. อัปเดต `README.md` ให้ชี้ไป `USAGE.md` ถ้าจำเป็น
2. อัปเดต `AGENTS.md` หรือ project docs ถ้ามี
3. ทำ `/update-reference` เพื่อ sync references

## Rules

### 1. Manual Only

- ใช้ `/update-usage-md` สำหรับ manual `USAGE.md`
- ถ้า generate จาก `usage.kdl` → ใช้ `/update-usage` แทน

### 2. Evidence-Based

- ทุก example ต้องรันได้จริงหรือมาจาก project จริง
- ไม่เดา commands หรือ options
- ใช้ `package.json` เป็นแหล่งหลักสำหรับ scripts/bin

### 3. Structure

- เรียง sections ตาม user flow: Install → Quick Start → Usage → Examples → Config → Troubleshooting
- ใช้ heading levels อย่างชัดเจน
- ห้ามใช้ `**` (bold markers)

### 4. Single Responsibility

- `USAGE.md` focus ที่วิธีใช้งานเท่านั้น
- ข้อมูลติดตั้งระบบ, การ contribute หรือ architecture ควรอยู่ใน `README.md` หรือ `CONTRIBUTING.md`

### 5. Safety

- สำรอง `USAGE.md` เดิมก่อน overwrite
- ถ้า `USAGE.md` มีอยู่ ตรวจสอบ diff ก่อน commit

## Expected Outcome

- `USAGE.md` มีอยู่ใน workspace
- ครอบคลุม installation, usage, examples, configuration, troubleshooting
- ตรงกับ `README.md`, `package.json` และ code ล่าสุด
- ไม่เกิน 250 บรรทัด
- รายงานสรุปสิ่งที่เปลี่ยนแปลง

---
name: check-dead-code
description: ตรวจหา dead code และ unused exports ใน project
argument-hint: "[path]"
related:
  - check-unused-files
  - check-unused-deps
  - refactor-to-single-responsibility
  - improve
---

## Goal
ตรวจหา code ทีไม่ถูกใช้งาน เช่น unused exports, functions, variables, classes

## Scope
- ใช้กับ TypeScript, JavaScript, Python, Rust, Go ตามเครื่องมือทีมี
- รองรับ monorepo และ multi-package
- รายงานเฉพาะส่วนที่ปลอดภัยลบได้

## Execute
### 1. Select Tool

> Goal: Select Tool

1. TypeScript/JavaScript: ลอง `knip`, `ts-prune`
2. Python: ลอง `vulture`
3. Rust: ใช้ `cargo-deadcode` หรือ `rustc` lints
4. Go: ใช้ `unused` จาก `golang.org/x/tools`

### 2. Run Scan

> Goal: Run Scan

1. รันคำสั่งใน project root
2. บันทึก output เป็น JSON/stdout
3. ตรวจสอบว่า tool detect entrypoints ถูกต้อง

### 3. Verify

> Goal: Verify

1. ตรวจสอบว่า symbols ที report ไม่ถูกใช้จริง
2. ข้าม public API ทีอาจถูกใช้นอก repo
3. ระบูิ public exports ทีไม่ควรลบ

### 4. Report

> Goal: Report

1. สรุป dead code ตามไฟล์
2. แนะนำลำดับการลบ
3. ใช้ `/report-table` แสดงผล

## Rules
### 1. Safety

- ไม่ลบ public API โดยไม่ตรวจสอบ consumers
- ไม่ลบ code ที test หรือ build scripts อาจใช้
- ทำ dry run ก่อนลบจริง

### 2. Precision

- ตรวจสอบ entrypoints เช่น `main`, `index`, `bin`
- ข้าม dynamically imported symbols
- ใช้ `grep` หรือ `code_search` ยืนยัน consumers

## Expected Outcome
- รายการ dead code ทีปลอดภัยลบได้
- รายงานรูปแบบตาราง
- ไม่มี regression จากการลบ

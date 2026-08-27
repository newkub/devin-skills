---
name: edit-by-use-scripts
description: แก้ไขไฟล์ผ่าน scripts ที่สร้างด้วย /use-scripts เพื่อ automate การแก้ไขแบบ reproducible
argument-hint: "[target]"
---

## Goal

แก้ไขไฟล์ใน workspace ผ่าน scripts ที่สร้างด้วย `/use-scripts` เพื่อให้การแก้ไขเป็น reproducible ตรวจสอบได้ และปลอดภัย

## Scope

ใช้เมื่อ task เป็นการแก้ไขไฟล์ที่ซับซ้อน ต้องแก้หลายไฟล์พร้อมกัน หรือต้องการ reproducibility และ audit trail ไม่ใช้สำหรับการแก้ไขไฟล์เดียวแบบ simple (ใช้ `/edit-only` แทน)

## Execute

### 1. Identify Edit Task

> Goal: ระบุขอบเขตการแก้ไข

1. รับรายการไฟล์และการเปลี่ยนแปลงที่ต้องการจาก user
2. ตรวจสอบว่าเป็นการแก้ไขที่เหมาะกับ scripts (หลายไฟล์, มี pattern, ต้อง reproducible)
3. ถ้าเป็นการแก้ไขไฟล์เดียวแบบ simple → แนะนำ `/edit-only` แทน
4. ถ้าเป็น config files → แนะนำ `/edit-manual` แทน

### 2. Plan Edits

> Goal: วางแผนการแก้ไขก่อนเขียน script

1. ทำ `/scan-codebase` เพื่อหาไฟล์ที่เกี่ยวข้องและ patterns
2. ระบุจุดที่ต้องแก้และค่าใหม่ที่ต้องการ
3. ทำ `/dont-over-engineer` เพื่อวางแผน minimal changes
4. บันทึก plan เป็นรายการ: ไฟล์, จุดที่แก้, ค่าใหม่, ผลกระทบ

### 3. Create Edit Script

> Goal: สร้าง script สำหรับ automate การแก้ไข

1. ทำ `/use-scripts` เพื่อเลือก shell/type ที่เหมาะสม
2. เขียน script ใน `$env:TEMP` (OS temp directory) เท่านั้น
3. Script ต้องมี dry run mode เพื่อ preview ก่อน execute จริง
4. Script ต้องมี backup mode: สำเนาไฟล์เดิมก่อนแก้
5. Script ต้อง validate โครงสร้างไฟล์หลังแก้ (เช่น JSON/YAML/TS syntax)
6. Script ต้อง report สรุป: ไฟล์ที่แก้, จำนวน changes, errors ถ้ามี

### 4. Dry Run And Preview

> Goal: ตรวจสอบผลลัพธ์ก่อน execute จริง

1. รัน script ใน dry run mode
2. ตรวจสอบ output ว่าการเปลี่ยนแปลงถูกต้อง
3. ถ้าไม่ถูกต้อง → แก้ script แล้ว dry run ใหม่
4. ถ้า dry run ผ่าน → ขอ user confirmation ก่อน execute จริง

### 5. Execute And Validate

> Goal: แก้ไขไฟล์จริงและตรวจสอบผลลัพธ์

1. รัน script ใน execute mode
2. ตรวจสอบ report จาก script
3. ทำ `/run-verify-fast` เพื่อตรวจสอบ lint, typecheck, และ scan
4. ถ้ามี errors → ทำ `/resolve-errors` (max 3 ครั้ง → rollback และ report)
5. ทำ `/update-references` เพื่ออัปเดต references ที่เกี่ยวข้อง

### 6. Cleanup And Ship

> Goal: ลบไฟล์ชั่วคราวและส่งมอบงาน

1. ลบ scripts จาก `$env:TEMP`
2. ลบ backup files หลังยืนยันว่าการแก้ไขผ่านทุก validation
3. ทำ `/ship`
4. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

### 1. Script Safety

- Script ต้องมี dry run mode เสมอ ก่อน execute จริง
- Script ต้องสร้าง backup ของไฟล์ก่อนแก้
- Script ต้อง validate โครงสร้างไฟล์หลังแก้
- ถ้า validation ไม่ผ่าน → rollback จาก backup และ report
- ห้าม execute จริงโดยไม่มี user confirmation หลัง dry run

### 2. Script Location

- เก็บ scripts ใน `$env:TEMP` (OS temp directory) เท่านั้น
- ลบ scripts หลังใช้งานเสมอ
- ไม่ commit scripts ชั่วคราวเข้า repository

### 3. Reproducibility

- Script ต้องให้ผลเหมือนเดิมเมื่อรันด้วย input เดิม
- ไม่สร้าง side effects นอกจากการแก้ไฟล์ที่กำหนด
- บันทึก script และ output สำหรับ audit trail ถ้าจำเป็น

### 4. Choose Appropriate Skill

- ใช้ `/edit-only` สำหรับการแก้ไฟล์เดียวแบบ simple
- ใช้ `/edit-manual` สำหรับ configuration files
- ใช้ `/edit-by-use-scripts` สำหรับการแก้หลายไฟล์ที่มี pattern หรือต้อง reproducible

## Expected Outcome

- ไฟล์ถูกแก้ไขผ่าน scripts ที่ reproducible และตรวจสอบได้
- มี dry run และ backup ก่อน execute จริง
- การแก้ไขผ่าน `/run-verify-fast` และ `/update-references`
- Scripts ชั่วคราวถูกลบหลังใช้งาน
- มี audit trail ของการเปลี่ยนแปลง

---
name: improve-redundancy
description: ลด redundancy และ duplication ใน code, content และ config โดยรักษา canonical version เดียว
argument-hint: "[path-or-dimension]"
related:
  - improve-consistency
  - improve-simplicity
  - improve-dependencies
  - use-astgrep
  - follow-tool-jscpd
  - update-references
  - report-table
---

## Goal

ลด duplication และ redundancy ที่ไม่จำเป็นใน code, content, หรือ config โดยรวบรวมเป็น canonical version เดียว

## Scope

- ใช้กับ code, docs, skill files, config files
- Duplicate dependencies → ส่งต่อ `/improve-dependencies`
- Inconsistency ของ pattern หลายแบบ → ส่งต่อ `/improve-consistency`
- Content ซับซ้อนเกิน → ส่งต่อ `/improve-simplicity`

## Execute

### 1. Detect Duplication

> Goal: หาส่วนซ้ำซ้อน

1. รับ `[path-or-dimension]` จาก argument หรือ context
2. ใช้ `/scan-codebase` หรือ `use-astgrep` หา repeated patterns, functions, constants
3. ถ้าเป็น code จำนวนมาก → `/follow-tool-jscpd` เพื่อ detect copy-paste
4. บันทึกตัวอย่างพร้อม occurrences และ files

### 2. Classify Redundancy

> Goal: แยกประเภทก่อนแก้

1. **Code duplication** — ฟังก์ชัน/บล็อก code ซ้ำ
2. **Content duplication** — ข้อความอธิบายซ้ำในหลายไฟล์
3. **Config duplication** — ค่า/setting ซ้ำซ้อน
4. **Cross-skill duplication** — เนื้อหา skill ทับกัน → ส่งต่อ `/review-redundancy`

### 3. Choose Canonical

> Goal: ตัดสินใจ version หลัก

1. เลือก version ทีใช้มากสุด, test ครอบคลุมสุด, หรือ user ระบุ
2. ถ้าไม่ชัดเจน → `/ask-me` ให้ user เลือก
3. บันทึกเหตุผลทีเลือก canonical

### 4. Remove And Centralize

> Goal: ลด redundancy อย่างเป็นระบบ

1. สร้าง canonical helper/constant/section ถ้ายังไม่มี
2. แทนที่ duplicate ด้วย reference ไป canonical
3. ลบ content/code ซ้ำซ้อน
4. ถ้าแก้หลายไฟล์ → `/use-scripts` เพื่อ automation
5. ทุก batch เสร็จ → `/run-check` + `/run-test` ถ้ามี

### 5. Validate

> Goal: ยืนยันว่าไม่พัง

1. รัน `/run-check` หรือ `/run-lint`
2. รัน `/run-test` ถ้ามี
3. ตรวจว่า canonical ถูกอ้างอิงถูกต้อง
4. ถ้ามี rename → `/update-references`

### 6. Report

> Goal: สรุปสิ่งที่ลบ/รวม

1. ใช้ `/report-table` คอลัมน์: No., Duplicate Type, Canonical, Files Fixed, Status
2. ระบุ redundancy ที่ตั้งใจเก็บไว้พร้อมเหตุผล

## Rules

- ไม่ลบ redundancy ที่ตั้งใจ (เช่น backup, fail-over, intentional duplication)
- แยก canonical ให้ชัด ก่อนแทนที่
- ทำทีละ dimension หรือ batch — ห้ามแก้หลายประเภทพร้อมกัน
- ทุก rename/move ต้อง `/update-references`
- ถ้าไม่แน่ใจว่าซ้ำซ้อนหรือไม่ → ถาม user ก่อน

## Expected Outcome

- ลด duplication ใน code, content, config ตาม scope ทีเลือก
- มี canonical version ชัดเจน
- ไม่มี regression
- รายงานประเภท redundancy ทีแก้และทีตั้งใจเก็บ

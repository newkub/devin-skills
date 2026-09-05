---
name: improve-architecture
description: แก้ไข architecture findings จาก review-architecture ด้วย restructure และ refactor
argument-hint: "[scope-or-module]"
related:
  - review-architecture
  - refactor
  - restructure
  - refactor-to-single-responsibility
  - follow-architecture
  - deep-validate
  - run-check
  - report-table
  - report-architecture-diagram
  - ask-me
---

## Goal

แก้ไข architecture findings จาก `/review-architecture` — boundary violations, coupling, layering และ dependency direction จนสอดคล้องกับ target architecture

## Scope

ใช้หลัง `/review-architecture` เมื่อต้องแก้ปัญหาเชิงโครงสร้าง: layer violations, circular dependencies, god modules, misplaced responsibilities — ไม่ครอบคลุมการเปลี่ยน framework หรือ rewrite ทั้งระบบ

## Execute

### 1. Collect Findings

> Goal: รวบรวม structural findings

1. รัน `/review-architecture` ถ้ายังไม่มี findings
2. จัดกลุ่ม: layer violations, circular deps, coupling, god modules, misplaced files
3. ทำ `/report-architecture-diagram` แสดง current structure

### 2. Plan Target Structure

> Goal: กำหนดโครงสร้างเป้าหมายที่ตรงกับ conventions

1. ทำ `/follow-architecture` เพื่อยืนยัน pattern ของ project
2. ระบุ target module/layer ของแต่ละ finding
3. เรียงลำดับ fix: foundation → dependencies → high-impact
4. ถ้าเปลี่ยน public API หรือ module boundary → `/ask-me`

### 3. Fix Boundary Violations

> Goal: ทุก import ไหลตาม dependency direction

1. ย้าย/แก้ imports ที่ข้าม layer ผิดทิศ
2. แตก circular dependencies ด้วย interface หรือ event
3. ใช้ `/refactor` สำหรับ code moves ที่มี consumers จำนวนมาก

### 4. Reduce Coupling

> Goal: ลด coupling ระหว่าง modules

1. แยก god modules ด้วย `/refactor-to-single-responsibility`
2. แทนที่ direct dependencies ด้วย abstractions ที่เหมาะสม
3. ย้าย misplaced files ด้วย `/restructure`

### 5. Validate Structure

> Goal: ยืนยันโครงสร้างใหม่ถูกต้องและไม่มี regression

1. รัน `/run-check` และ `/deep-validate`
2. ทำ `/report-architecture-diagram` แสดง after structure
3. เปรียบเทียบ findings เดิมว่าแก้ครบ

### 6. Report Changes

> Goal: สรุป structural changes พร้อม evidence

1. ทำ `/report-table` สรุป findings → action → files changed
2. ระบุ residual issues ที่ยังไม่แก้พร้อมเหตุผล
3. ระบุ follow-up refactors ถ้ามี

## Rules

### 1. Preserve Behavior

- เปลี่ยนเฉพาะ structure ไม่เปลี่ยน behavior
- ทุก move/rename ต้องทำ `/update-references`
- ไม่เปลี่ยน public API โดยไม่ได้รับอนุญาต

### 2. Incremental

- แก้ทีละ finding แยก commit ต่อ logical change
- ถ้า fix กระทบ >10 ไฟล์ → ทำ `/use-scripts` หรือ split เป็น phases
- ห้าม big-bang refactor โดยไม่มี checkpoint

### 3. Convention Aligned

- โครงสร้างใหม่ต้องตรงกับ `AGENTS.md` และ existing patterns
- ถ้า convention ไม่ชัด → `/ask-me` ก่อนแก้

## Expected Outcome

- Boundary violations และ circular deps ถูกแก้
- Coupling ลดลงตาม metrics ที่วัดได้
- Validation ผ่านไม่มี regression
- รายงาน before/after structure พร้อม evidence

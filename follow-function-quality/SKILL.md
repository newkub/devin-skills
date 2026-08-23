---
name: follow-function-quality
description: ตรวจสอบและปรับปรุงคุณภาพของ functions เช่น SRP, naming, side effects, complexity, purity
allowed-tools:
  - read
  - edit
  - write
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - rename
---
## Goal

ตรวจสอบและปรับปรุงคุณภาพของ functions ให้มี single responsibility, naming ชัดเจน, ลด side effects, ลด complexity, และ promote pure functions

## Scope

ใช้กับ source code ใน project หรือ workspace ที่ต้องการตรวจสอบ function-level quality ทั้งในการ review, refactor, หรือ before/after การเปลี่ยนแปลง

## Execute

### 1. Scan Functions

> Goal: หา functions ทั้งหมดใน target path
> Goal: มีรายการ functions พร้อม signature และ body overview

1. ทำ `/check-code-structure` เพื่อดู top-level functions, methods, members
2. ทำ `/use-ast-grep-outline` ด้วย `--type function --view expanded` เพื่อดู parameters, return type, body structure
3. กรองเฉพาะ source functions ไม่รวม test/spec/generated

### 2. Check Function SRP

> Goal: ตรวจสอบว่า function ทำหน้าที่เดียว
> Goal: ทุก function มี single responsibility

1. อ่าน body ของ function ว่ามีหลาย concern หรือไม่
2. ถ้า function ทำหลายอย่าง (read + write + validate + transform) → mark เป็น violation
3. แยกลำดับการทำงาน: validation → transformation → side effect → return

### 3. Check Naming Quality

> Goal: ตรวจสอบชื่อ function ให้สะท้อน intent
> Goal: ชื่อ function บ่งบอกสิ่งที่ทำอย่างชัดเจน

1. ใช้ `/review-codebase` เพื่อตรวจสอบ naming conventions
2. ตรวจสอบว่าชื่อขึ้นต้นด้วย verb (get, set, compute, validate, handle, etc.)
3. หลีกเลี่ยงชื่อกำกวม เช่น `doStuff`, `process`, `data`, `temp`, `helper`, หรือ single-letter
4. ถ้าชื่อไม่สะท้อน intent → ระบุ rename candidate

### 4. Check Function Complexity

> Goal: วัด complexity ของ function
> Goal: function เล็ก อ่านง่าย ทดสอบง่าย

1. วัดจำนวนบรรทัดของ function (ไม่เกิน 50 บรรทัด หรือ threshold ของ project)
2. นับจำนวน parameters (ไม่เกิน 4 ตัว; ถ้าเกินควรรับ object)
3. นับ nesting depth (if/for/while ซ้อนกัน) ไม่เกิน 3 ระดับ
4. ตรวจสอบ cyclomatic complexity (if/switch/loop branches) ไม่เกิน 10
5. ใช้ `/use-scripts` เพื่อคำนวณ metrics ถ้ามีหลายไฟล์

### 5. Check Purity And Side Effects

> Goal: ตรวจสอบ pure functions และ side effects
> Goal: แยก pure functions ออกจาก side effects เมื่อเป็นไปได้

1. ระบุ function ที่อ่าน/เขียน global state, DOM, file, network, database
2. ระบุ function ที่ modify parameters โดย reference
3. แนะนำให้แยก logic เป็น pure function และ isolate side effect ไปอีก function

### 6. Check Parameters And Returns

> Goal: ตรวจสอบ parameter และ return patterns
> Goal: ลด coupling ผ่าน interface ที่ชัดเจน

1. หลีกเลี่ยง boolean parameters (flag parameters) หรือทำให้ชื่ออ่านออก
2. หลีกเลี่ยง null/undefined หรือ any ใน parameters/return ถ้าเป็นไปได้
3. ตรวจสอบว่า return type consistent ไม่มี multiple return shapes
4. แนะนำ early returns / guard clauses แทน nested if

### 7. Refactor Functions

> Goal: แก้ไข functions ที่มีปัญหา
> Goal: ได้ function ทีดีขึ้น

1. แยก multi-responsibility function ออกเป็น functions ย่อยด้วย composition
2. ลด parameters ด้วย object parameter หรือ partial application
3. ลด nesting ด้วย early returns, guard clauses, หรือ extract helper
4. ทำ `/refactor` หรือ `/refactor-to-srp` ถ้าต้องการย้าย/แยก functions
5. ทำ `/edit-relative` หลัง rename หรือ split functions

### 8. Report

> Goal: สรุปผลการตรวจสอบ
> Goal: ผู้ใช้ได้รับ actionable report

1. สร้างตาราง: file, function, issue, severity, recommended action
2. จัดลำดับตาม severity: Critical > High > Medium > Low
3. ระบุ quick wins กับ major refactor
4. แนะนำ next skill: `/refactor-codebase` หรือ `/refactor-to-srp` ถ้ามีหลาย functions

## Rules

### Thresholds

- function length ไม่เกิน 50 บรรทัด (ยกเว้น cohesive setup/initialization)
- parameter count ไม่เกิน 4
- nesting depth ไม่เกิน 3 ระดับ
- cyclomatic complexity ไม่เกิน 10
- 1 function = 1 responsibility

### Naming

- ขึ้นต้นด้วย verb บ่งบอก action
- ไม่ใช้ generic names เช่น `process`, `data`, `temp`, `handle`
- ไม่ใช้ single-letter ยกเว้น loop index หรือ math

### Purity

- แยก pure functions ออกจาก side effects
- หลีกเลี่ยง global state mutation
- หลีกเลี่ยง modify parameters โดย reference

### Refactor Safety

- ทำ dry run ก่อน split/rename functions
- ทำ `/update-reference` หลัง rename
- ต้องผ่าน test หลัง refactor

## Expected Outcome

- รายการ functions ที่มี quality issues พร้อม severity
- Actionable recommendations สำหรับแต่ละ function
- Functions ที่ถูก refactor หรือ split เมื่อจำเป็น
- ไม่มี broken references หลังการเปลี่ยนแปลง
- ผ่าน `/run-check` และ `/run-test` หลังจาก refactor

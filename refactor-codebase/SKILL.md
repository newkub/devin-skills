---
name: refactor-codebase
description: Refactor codebase ครบวงจร — SRP, long files, imports, architecture, packages,
  code styles
triggers:
- user
allowed-tools:
- read
- edit
- write
- exec
- grep
- glob
related:
- refactor-to-srp
- follow-function-quality
- follow-import-export
- follow-architecture
- refactor-packages
- create-plan
- implement-plan
---

## Goal

Refactor codebase ครบวงจรเพื่อปรับปรุง SRP, boundaries, code styles, maintainability

## Scope

- ใช้กับทุก workspace ที่ต้องการ refactor
- ครอบคลุม SRP, long files, import/export, architecture, packages, code styles
- ใช้ `/create-plan` สำหรับงานใหญ่
- ใช้ `/implement-plan` สำหรับ execute แผน

## Execute

### 1. Review And Baseline

> Goal: เข้าใจ codebase ก่อน refactor

1. ทำ `/review-codebase` สำหรับ deep review
2. ทำ `/check-code-structure`, `/improve-code-duplication`, `/check-long-files`
3. บันทึก baseline: files, symbols, responsibilities

### 2. Create Plan If Large

> Goal: มีแผนก่อน refactor ขนาดใหญ่

1. ถ้างานมี >5 files หรือมีหลาย concerns → ทำ `/create-plan`
2. ถ้างานเล็ก → ข้ามไป Step 3

### 3. Refactor By Concern

> Goal: แก้ไขปัญหาเฉพาะทีละเรื่อง

1. ถ้ามี SRP violations → ทำ `/refactor-to-srp`
2. ถ้ามี function quality issues (long functions, bad naming, side effects, complex params) → ทำ `/follow-function-quality`
3. ถ้ามีไฟล์ยาว >250 บรรทัด → ทำ `/refactor-to-srp`
4. ถ้ามี imports/exports ซับซ้อน → ทำ `/follow-import-export`
5. ถ้า architecture ไม่ชัด → ทำ `/follow-architecture`
6. ถ้ามี package/module ปัญหา → ทำ `/refactor-packages`

### 4. Update References

> Goal: ไม่มี broken references

1. ทำ `/edit-relative` สำหรับ relative paths/imports
2. ทำ `/update-reference` สำหรับ global references
3. ถ้ามี broken references → ทำ `/resolve-errors`

### 5. Verify

> Goal: code ผ่าน lint/typecheck/test

1. ทำ `/run-check`, `/run-test`
2. ทำ `/check-code-structure` เปรียบเทียบ baseline
3. ถ้าไม่ผ่าน → กลับไปแก้ที่ Step 3 (max 3)

### 6. Implement Plan

> Goal: ทำงานตามแผนจนครบและลบแผน

1. ถ้ามี `.devin/plan/<title>-<date>.md` → ทำ `/implement-plan`
2. ถ้าไม่มีแผน → รายงานผล

### 7. Report

> Goal: สื่อสารผล refactor

1. ทำ `/report` สรุป before/after
2. ระบุ TODO ถ้ามี

## Rules

### 1. Code Style

- ทำให้ดีตามที่ควรเป็น
- ทำให้ type safe
- ทำให้ maintenance ง่าย
- ทำให้ test ง่าย
- ทำให้อ่านง่าย
- ลด side effect
- ใช้ naming สม่ำเสมอ
- ลบ unused imports/exports
- จัดเรียง imports/exports ตามมาตรฐาน project

### 2. Minimal Change

- ทำ `/dont-over-engineer` ก่อน
- หลีกเลี่ยง abstraction ที่ไม่จำเป็น
- รักษา public API ถ้าไม่จำเป็นต้องเปลี่ยน

### 3. Safety

- destructive actions ต้องมี user confirmation
- ทำ `/update-reference` หลังย้าย/ลบ/แยกไฟล์
- ไม่ force push

### 4. Verification

- ต้องผ่าน `/run-check` และ `/run-test`
- ไฟล์ไม่เกิน 250 บรรทัด
- ไม่มี broken references

## Expected Outcome

- Codebase มี SRP ชัดเจน
- ไฟล์และ packages มีขนาดเหมาะสม
- imports/exports สะอาด
- ผ่าน lint/typecheck/test
- รายงาน before/after

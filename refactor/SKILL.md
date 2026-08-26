---
name: refactor
description: Refactor codebase ครบวงจร — SRP, boundaries, code styles, consistency, maintainability
argument-hint: "[scope]"
related:
  - refactor-to-single-responsibility
  - refactor-packages
  - review-refactor
  - review-quality
  - follow-architecture
  - review-architecture
  - dont-over-engineer
---

## Goal

Refactor codebase ครบวงจรเพื่อปรับปรุง SRP, boundaries, code styles, consistency, และ maintainability

## Scope

- ใช้กับทุก workspace ที่ต้องการ refactor
- ครอบคลุม SRP, long files, import/export, architecture, packages, code styles
- รวม consistency check สำหรับ naming, patterns, structure, และ style
- ใช้ `/create-plan` สำหรับงานใหญ่
- ใช้ `/implement-plan` สำหรับ execute แผน

## Execute

### 1. Review And Baseline

> Goal: เข้าใจ codebase ก่อน refactor

1. ทำ `/update-review-codebase-cli-and-run` สำหรับ deep review
2. ทำ `/check-code-structure`, `/review-quality`, `/check-long-files`
3. บันทึก baseline: files, symbols, responsibilities

### 2. Create Plan If Large

> Goal: มีแผนก่อน refactor ขนาดใหญ่

1. ถ้างานมี >5 files หรือมีหลาย concerns → ทำ `/create-plan`
2. ถ้างานเล็ก → ข้ามไป Step 3

### 3. Refactor By Concern

> Goal: แก้ไขปัญหาเฉพาะทีละเรื่อง

1. ถ้ามี SRP violations → ทำ `/refactor-to-single-responsibility`
2. ถ้ามี function quality issues (long functions, bad naming, side effects, complex params) → ทำ `/review-refactor`
3. ถ้ามีไฟล์ยาว >250 บรรทัด → ทำ `/refactor-to-single-responsibility`
4. ถ้ามี imports/exports ซับซ้อน → ทำ `/review-architecture`
5. ถ้า architecture ไม่ชัด → ทำ `/follow-architecture`
6. ถ้ามี package/module ปัญหา → ทำ `/refactor-packages`

### 4. Update References

> Goal: ไม่มี broken references

1. ทำ `/edit-relative` สำหรับ relative paths/imports
2. ทำ `/update-reference` สำหรับ global references
3. ถ้ามี broken references → ทำ `/resolve-errors`

### 5. Check Consistency

> Goal: naming, patterns, structure, style สอดคล้องกันทั้ง codebase

1. ทำ `/review-quality` เพื่อตรวจ inconsistencies ใน naming, patterns, structure, หรือ style
2. ถ้าพบ inconsistencies → แก้ตาม findings
3. อัปเดต skills/configs ที่เกี่ยวข้องให้สอดคล้อง

### 6. Verify

> Goal: code ผ่าน lint/typecheck/test/build

1. ทำ `/run-verify` เพื่อรัน scan, lint, typecheck, test, build
2. ทำ `/check-code-structure` เปรียบเทียบ baseline
3. ถ้าไม่ผ่าน → กลับไปแก้ที่ Step 3 (max 3)

### 7. Implement Plan

> Goal: ทำงานตามแผนจนครบและลบแผน

1. ถ้ามี `.devin/plan/<title>-<date>.md` → ทำ `/implement-plan`
2. ถ้าไม่มีแผน → รายงานผล

### 8. Report

> Goal: สื่อสารผล refactor และ consistency

1. ทำ `/report` สรุป before/after รวม refactor และ consistency check
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

### 3. Consistency

- ทำ `/review-quality` เมื่อพบ inconsistencies ใน naming, patterns, structure, หรือ style
- รักษา conventions เดียวกันทั้ง codebase
- อัปเดต skills/configs ที่เกี่ยวข้องให้สอดคล้อง

### 4. Safety

- destructive actions ต้องมี user confirmation
- ทำ `/update-reference` หลังย้าย/ลบ/แยกไฟล์
- ไม่ force push

### 5. Verification

- ต้องผ่าน `/run-verify` และ `/run-test`
- ไฟล์ไม่เกิน 250 บรรทัด
- ไม่มี broken references

## Expected Outcome

- Codebase มี SRP ชัดเจน
- ไฟล์และ packages มีขนาดเหมาะสม
- imports/exports สะอาด
- naming, patterns, structure มี consistency ผ่าน `/review-quality`
- ผ่าน lint/typecheck/test/build
- รายงาน before/after รวม refactor และ consistency

---
name: follow-code-quality
description: รักษามาตรฐานคุณภาพโค้ดด้วย separation of concerns, type safety, error handling
---

## Goal

รักษามาตรฐานคุณภาพโค้ดด้วย separation of concerns, type safety, error handling, และ code organization ที่ดี

## Scope

ใช้สำหรับทุก workspace เพื่อรักษามาตรฐานคุณภาพโค้ด

## Execute

### 1. Analyze Code Quality

> Goal: วิเคราะห์คุณภาพโค้ดปัจจุบัน
> Goal: ระบุ issues ด้าน code quality ทั้งหมดก่อนแก้ไข

1. ทำ `/review-codebase`, `/deep-review`, `/check-circular-dependencies`, `/review-codebase` — mixed concerns/duplication/code smells, SRP/SoC/type safety/hard code/anti-patterns/dead code/side effects/naming, circular dependencies, type safety check
2. จัดลำดับ issues ตาม priority: security > type errors > performance > code quality — ถ้าไม่พบ issues → ข้ามไป Step 3

### 2. Apply Fixes

> Goal: แก้ไข issues ที่พบตามลำดับความสำคัญ
> Goal: แก้ไข issues ทั้งหมดตาม priority

1. ทำ `/no-hard-code` เพื่อลบ hard code — ถ้าพบ sensitive data exposure → แก้ก่อนเป็น priority สูงสุด
2. ทำ `/review-codebase`, `/review-correctness`, `/review-codebase` — naming conventions/type safety, side effects management, debuggability, type safety improvements, config optimization
3. แก้ไข issues ที่เหลือตามลำดับความสำคัญ — ถ้าแก้ไม่ได้ → ทำ `/resolve-errors` ก่อนดำเนินต่อ

### 3. Verify Quality

> Goal: ตรวจสอบผลลัพธ์หลังแก้ไข
> Goal: ยืนยันว่า code ผ่าน lint, typecheck, และ test

1. ทำ `/run-lint`, `/run-typecheck`, `/run-test` — lint, typecheck, test พร้อมกัน
2. ถ้าไม่ผ่าน → ทำ `/resolve-errors` แล้ว retry (max 3 → stop/report)

## Rules

### 1. Execution Order

- วิเคราะห์ก่อนแก้ไขเสมอ — แก้ไขตามลำดับ: security > type errors > performance > code quality
- ตรวจสอบผลลัพธ์หลังแก้ไขทุกครั้ง — ใช้ `/dont-over-engineer` เพื่อกำหนดขอบเขตการแก้ไขให้ minimal

### 2. Code Principles

- ไม่ swallow errors ใช้ typed error classes และ log with context
- เขียน pure functions แยก side effects และทำให้ predictable
- Self-documenting code, DRY, consistent patterns, ไฟล์ไม่เกิน 250 บรรทัด
- Use composition, generic types, และ decouple components
- JSDoc สำหรับ public functions ไม่ comments สำหรับ self-documenting code
- ไม่ sensitive data exposure, parameterized queries, และ input validation

### 3. High Impact Content

- ทุก bullet ต้องตอบได้ว่า "ถ้าไม่มีแล้วผลลัพธ์เปลี่ยนไหม" — ถ้าไม่เปลี่ยน → ลบ
- ห้าม TODO, MOCK, placeholder, generic filler, หรือคำสวยแต่ไม่ actionable

## Expected Outcome

- Code ที่ test ง่าย debug ง่าย — clear separation of concerns, no circular dependencies
- Functions with single responsibility, high type safety, systematic error handling
- No hard code, consistent naming conventions — code ผ่าน lint, typecheck, และ test
- ทุก step มี `, ` markers สำหรับ parallel execution

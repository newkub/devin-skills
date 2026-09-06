---
name: improve-error-handling
description: ปรับปรุง error handling ให้ลึก — taxonomy, boundaries, propagation, retry และ user-facing errors
argument-hint: "[target-or-scope]"
related:
  - review-stability
  - improve-stability
  - resolve-errors
  - refactor
  - run-verify
  - run-test
  - report-table
  - suggest-next-action
  - check-error-coverage
  - improve-error-messages
---

## Goal

ปรับปรุง error handling ของ code ให้เป็นระบบ ตรวจสอบได้ และ recover ได้ โดยครอบคลุม error taxonomy, error boundaries, propagation strategy, typed errors และ user-facing error messages

## Scope

ใช้เมื่อ task ต้องการปรับปรุง error handling โดยเฉพาะ — เช่น error taxonomy, try/catch patterns, error boundaries, retry/timeout policy, error propagation ข้าม layer — ไม่รวม stability ภาพรวม (monitoring, alerting, recovery) ซึ่งใช้ `/improve-stability` แทน และไม่รวมการแก้ error ที่เกิดจาก build/test ซึ่งใช้ `/resolve-errors` แทน

## Execute

### 1. Analyze Error Handling

> Goal: ระบุ error handling ปัจจุบันและ gaps

1. ทำ `/check-code-structure` เพื่อดู error paths, throw sites, catch blocks
2. ค้นหา anti-patterns: empty catch, catch-all `catch {}` ที่ swallow errors, `throw` ของ generic `Error`, `any`/`unknown` ที่ไม่ narrow, promise ที่ไม่มี `.catch`/`try-await`
3. ระบุ error boundaries ของแต่ละ layer (route, service, repository, external calls)
4. ทำ `/check-long-files` เพื่อหาไฟล์ที่ error handling ปนกับ business logic

### 2. Design Error Taxonomy

> Goal: กำหนด error types ที่สื่อความหมาย

1. แยก error เป็น domain errors (business rules), infrastructure errors (network, DB, IO) และ unexpected errors (bugs)
2. ใช้ specific error classes/types หรือ Result/Either pattern ตาม convention ของ codebase (เช่น `OrpcResult` ใน project นี้)
3. กำหนด error codes หรือ discriminated unions สำหรับ error ที่ caller ต้อง branch
4. ไม่สร้าง error class ใหม่ถ้ามีของ project อยู่แล้ว

### 3. Fix Propagation And Boundaries

> Goal: error ไหลถูกทางและหยุดถูกจุด

1. กำหนดจุดที่ error ควรถูกจัดการ (boundary) — route handlers, service entry, external adapters
2. เอา `try/catch` ที่ไม่เพิ่มค่าออก — ให้ error propagate ขึ้น boundary แทน
3. แปลง internal errors เป็น user-safe messages ที่ boundary เดียว ไม่ซ้ำหลายชั้น
4. ตรวจว่า errors ไม่รั่ว stack trace/secrets ไปยัง user-facing responses

### 4. Improve Recoverability

> Goal: กำหนด retry/fallback ที่เหมาะสม

1. เพิ่ม retry + backoff เฉพาะ transient errors (network, timeout, rate-limit)
2. กำหนด timeout ให้ external calls ทุกจุดที่ขาด
3. ใส่ fallback/degraded path สำหรับ non-critical dependencies
4. ไม่ retry errors ที่ deterministic (validation, auth, not-found)

### 5. Update References

> Goal: signatures และ callers ถูกต้องหลังเปลี่ยน error contract

1. ทำ `/edit-relative` เมื่อเปลี่ยน return type เป็น Result หรือเปลี่ยน throw behavior
2. ทำ `/update-references` เพื่ออัปเดต callers, tests, และ error-handling docs
3. ค้นหา `catch`/`unwrapResult`/`.catch(` sites ที่เกี่ยวข้องอีกครั้งเพื่อยืนยันครบ

### 6. Verify

> Goal: error handling ถูกต้องและไม่มี regression

1. ทำ `/run-test` รวมถึง error-path tests
2. ทำ `/run-verify` สำหรับ lint, typecheck
3. ตรวจว่า error tests ครอบคลุม paths ที่เปลี่ยน — ถ้าขาดให้เพิ่ม
4. ถ้าไม่ผ่าน → กลับไป Step 3 (สูงสุด 3 ครั้ง → stop/report)

### 7. Report

> Goal: สรุปผล error handling improvements

1. ทำ `/report-table` แสดง before/after: throw sites, catch blocks, error types, boundaries
2. ระบุ error paths ที่ยังไม่ได้แก้พร้อมเหตุผล

## Rules

### 1. Minimal And Conventional

- ใช้ error types/patterns ที่ codebase มีอยู่แล้วก่อน ไม่บังคับ Result pattern ถ้า codebase ใช้ throw
- แก้เฉพาะ error handling — ไม่ refactor business logic โดยไม่จำเป็น
- ทำ `/dont-over-engineer` เสมอ

### 2. No Silent Failures

- ห้ามเพิ่ม catch ที่ swallow errors โดยไม่มี logging/recovery
- ทุก catch ต้องทำอย่างใดอย่างหนึ่ง: recover, transform, log+rethrow, หรือ boundary handling

### 3. Boundary Discipline

- error handling อยู่ที่ boundary เดียวต่อ concern — ไม่ handle ซ้ำหลาย layer
- internal errors ต้องไม่รั่ว implementation details หรือ secrets สู่ client

### 4. Verification

- ต้องรัน `/run-test` และ `/run-verify` ก่อนถือว่าเสร็จ
- error-path tests ต้องมีสำหรับทุก boundary ที่เปลี่ยน

## Expected Outcome

- Errors มี taxonomy ชัดเจนและ type-safe ตาม convention ของ codebase
- ไม่มี silent catch หรือ unhandled promise rejections ใน scope ที่แก้
- Boundaries ชัดเจน: user-facing errors safe, internal errors logged
- Callers, tests, docs อัปเดตครบ
- Lint, typecheck, tests ผ่าน

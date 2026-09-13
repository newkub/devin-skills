---
name: deep-validate-check-type-safety
description: Validate type safety dimension — typecheck, any/ts-ignore, type flow
argument-hint: "[scope]"
related:
  - run-typecheck
  - check-types-coverage
  - report
---

## Goal

ตรวจ type safety dimension ของ `/deep-validate` — type errors, `any`/`@ts-ignore` ที่ไม่จำเป็น และ type flow ตั้งแต่ schema ถึง UI

## Scope

- ใช้เมื่อ `/deep-validate` dispatch มาที่ dimension `type-safety`/`types` หรือเรียกเดี่ยวๆ
- Read-only: บันทึก findings — ไม่แก้ types

## Execute

### 1. Run Typecheck

> Goal: type errors ทั้งหมดพร้อม location

1. ทำ `/run-typecheck` เพื่อตรวจสอบ type errors
2. บันทึก errors พร้อม file:line

### 2. Check Weak Types

> Goal: หา type escapes ที่ลด safety

1. ตรวจสอบไม่มี `any` ที่ไม่จำเป็น — ทำ `/check-types-coverage` ถ้าต้องการ coverage metric
2. ตรวจสอบไม่มี `@ts-ignore` หรือ `@ts-nocheck`
3. ตรวจสอบ type inference ใช้ถูกต้อง

### 3. Check Type Flow

> Goal: types ไหลต่อเนื่องตลอด stack

1. ตรวจสอบ type flow: schema → validation → API → UI
2. flag จุดที่ types ขาดต่อ (manual re-declaration, unsafe casts)

### 4. Report

> Goal: ส่ง findings กลับ parent

1. ตาราง: `No.`, `Finding`, `Severity`, `Location`, `Recommendation`

## Rules

- `any` ที่จำเป็น (เช่น untyped third-party boundary) ให้ annotate ไว้ ไม่ flag
- severity: type error จริง = High+, weak types = Medium/Low

## Expected Outcome

- Findings ของ type safety dimension พร้อม severity และ evidence

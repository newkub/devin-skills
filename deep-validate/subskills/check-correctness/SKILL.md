---
name: deep-validate-check-correctness
description: Validate correctness dimension — requirements, logic, edge cases, error handling
argument-hint: "[scope]"
related:
  - review-quality
  - report
---

## Goal

ตรวจ correctness dimension ของ `/deep-validate` — ทำงานตาม requirement, logic ถูก, edge cases ครบ, error handling ไม่ขาด

## Scope

- ใช้เมื่อ `/deep-validate` dispatch มาที่ dimension `correctness` หรือเรียกเดี่ยวๆ
- Read-only: บันทึก findings พร้อม severity — ไม่แก้ code

## Execute

### 1. Check Against Requirements

> Goal: ยืนยัน code ทำตาม requirement

1. ทำ `/review-quality` เพื่อตรวจสอบความถูกต้อง
2. ตรวจสอบความถูกต้องตาม principle หรือ standard
3. ตรวจสอบว่าทำงานได้ตาม requirement และไม่มี errors

### 2. Check Logic And Edge Cases

> Goal: logic ครอบคลุม edge cases

1. ตรวจสอบ logic และ edge cases ได้รับการจัดการ
2. ตรวจสอบ error handling ครบถ้วน
3. บันทึก findings พร้อม severity (Critical/High/Medium/Low) + evidence (file, line)

### 3. Report

> Goal: ส่ง findings กลับ parent

1. ตาราง: `No.`, `Finding`, `Severity`, `Location`, `Recommendation`
2. ระบุสิ่งที่ถูกต้องอยู่แล้วเสมอ

## Rules

- ทุก finding ต้องมี evidence (file path, line number)
- แยก "ผิด requirement" ออกจาก "style issue" — style ไปที่ `check-quality`

## Expected Outcome

- Findings ของ correctness dimension พร้อม severity และ evidence

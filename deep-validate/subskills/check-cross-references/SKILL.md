---
name: deep-validate-check-cross-references
description: Validate cross-reference dimension — config, module refs, API contracts, docs
argument-hint: "[scope]"
related:
  - check-reference
  - update-references
  - check-api-contract
  - report
---

## Goal

ตรวจ cross-reference dimension ของ `/deep-validate` — config/env refs, module references, API contracts ตรง implementation, docs ตรง code

## Scope

- ใช้เมื่อ `/deep-validate` dispatch มาที่ dimension `cross-reference`/`refs` หรือเรียกเดี่ยวๆ
- Read-only: บันทึก findings — แก้ไขผ่าน `/update-references`

## Execute

### 1. Check Config And Env References

> Goal: config/env ที่ code อ้างถึงมีจริง

1. ตรวจสอบ config files และ environment variables ที่ code ใช้มีอยู่จริง
2. flag env vars ที่ code อ้างแต่ไม่มีใน `.env.example` หรือ config

### 2. Check Module And Contract References

> Goal: references ภายในและ contract ตรงกัน

1. ตรวจสอบ references ระหว่าง modules ถูกต้อง — ทำ `/check-reference` ถ้าต้องการ deep pass
2. ตรวจสอบ API contracts ตรงกับ implementation — ทำ `/check-api-contract` ถ้ามี API surface
3. ตรวจสอบ dependencies ไม่ conflict กับ existing versions

### 3. Check Docs References

> Goal: documentation ตรงกับ code จริง

1. ตรวจสอบ documentation ตรงกับ code จริง
2. flag docs ที่อ้าง APIs/files ที่ไม่มีแล้ว

### 4. Report

> Goal: ส่ง findings กลับ parent

1. ตาราง: `No.`, `Finding`, `Severity`, `Location`, `Recommendation`

## Rules

- broken reference ที่ทำ runtime พัง = High; stale docs = Low
- ทุก finding ระบุทั้งสองฝั่งของ reference (source → missing target)

## Expected Outcome

- Findings ของ cross-reference dimension พร้อม severity และ evidence

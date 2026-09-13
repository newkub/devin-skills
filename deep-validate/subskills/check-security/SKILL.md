---
name: deep-validate-check-security
description: Validate security dimension — input validation, auth, secrets, injection, rate limit
argument-hint: "[scope]"
related:
  - review-security
  - check-secrets
  - check-rate-limiting
  - report
---

## Goal

ตรวจ security dimension ของ `/deep-validate` — input validation, authn/authz, secrets, injection, rate limiting

## Scope

- ใช้เมื่อ `/deep-validate` dispatch มาที่ dimension `security` หรือเรียกเดี่ยวๆ
- Read-only: บันทึก findings — แก้ไขผ่าน `/review-security` fix subskills

## Execute

### 1. Check Input Handling

> Goal: input ทุกทางถูก validate/sanitize

1. ตรวจสอบ input validation และ sanitization
2. ตรวจสอบ parameterized queries ป้องกัน SQL injection

### 2. Check Auth And Exposure

> Goal: auth ถูกต้อง ไม่มี secrets หลุด

1. ตรวจสอบ authentication และ authorization patterns
2. ตรวจสอบไม่มี hardcoded secrets หรือ API keys — ทำ `/check-secrets` ถ้าต้องการ deep pass
3. ตรวจสอบ API security และ rate limiting — ทำ `/check-rate-limiting` กับ endpoints ที่เปิดใหม่
4. บันทึก findings พร้อม severity + evidence

### 3. Report

> Goal: ส่ง findings กลับ parent

1. ตาราง: `No.`, `Finding`, `Severity`, `Location`, `Recommendation`
2. security findings เรียง Critical ก่อนเสมอ

## Rules

- hardcoded secret ที่ยืนยัน = Critical
- ระบุ exploit path สั้นๆ ในแต่ละ finding — ไม่ flag แบบ generic
- deep security review เต็มรูปแบบ → delegate `/review-security`

## Expected Outcome

- Findings ของ security dimension พร้อม severity และ evidence

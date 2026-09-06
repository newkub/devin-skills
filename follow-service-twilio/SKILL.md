---
name: follow-service-twilio
description: ใช้ Twilio ส่ง SMS/OTP/verify — Messaging, Verify API, webhooks
argument-hint: "[target-or-scope]"
related:
  - follow-best-practice
  - run-verify
  - run-test
  - report-table
---

## Goal

ใช้ Twilio ส่ง SMS/OTP/verify — Messaging, Verify API, webhooks

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ library/tool นี้ — setup, usage, debugging, หรือ best practices

## Execute

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

1. สร้าง client ด้วย accountSid/authToken จาก env — ไม่ expose ฝั่ง client
1. ใช้ Verify API (`verify.v2.services().verifications`) สำหรับ OTP — ไม่ต้องจัดการ code เอง
1. ใช้ Messaging (`messages.create`) สำหรับ SMS ทั่วไป — ตั้ง messagingServiceSid
1. รับ status callbacks ผ่าน webhook — verify signature ด้วย Twilio signature

### 2. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ

## Rules

- ใช้ Verify API แทน self-managed OTP เมื่อเป็นไปได้
- verify webhook signatures เสมอ
- ระวัง regional compliance (sender IDs, opt-out)
- ไม่ log message bodies ที่มี PII/OTP

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices
- ไม่มี security/performance pitfalls ที่รู้จัก
- Lint, typecheck, tests ผ่าน
---
name: follow-service-stripe-verify-connection
description: ยืนยัน Stripe keys ใช้งานได้ — balance call ตอบกลับ, mode ถูก (test/live), webhook secret พร้อม
argument-hint: "[mode]"
related:
  - follow-secret-manager
  - report
---

## Goal

ยืนยันหลัง setup/config ว่า Stripe เชื่อมต่อได้จริง — secret key valid, mode ตรงที่คาด, webhook secret มี

## Scope

- ใช้เมื่อ `/follow-service-stripe` dispatch มาที่ `verify`/`verify-connection`
- Read-only: ตรวจสอบ — ไม่สร้าง charges/customers

## Execute

### 1. Check Keys Present

> Goal: keys ครบและ mode สอดคล้อง

1. ตรวจ `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` มี (ไม่ print ค่า)
2. ตรวจ key prefix: `sk_test_`/`pk_test_` vs `sk_live_`/`pk_live_` — secret/publishable ต้อง mode เดียวกัน
3. flag test keys ใน production config (หรือกลับกัน)

### 2. Smoke Test API Call

> Goal: API ตอบกลับด้วย key นี้

1. `stripe balance retrieve` (CLI) หรือ `stripe.balance.retrieve()` (SDK)
2. 200 = key valid; 401 = invalid/revoked
3. บันทึก mode ที่ API confirm (test vs live)

### 3. Check Webhook Readiness

> Goal: webhook endpoint พร้อมรับ events

1. ตรวจ `STRIPE_WEBHOOK_SECRET` format (`whsec_...`)
2. local dev → `stripe listen` รันได้และ forward URL ถูก
3. production → webhook endpoint ใน dashboard ชี้ production URL (HTTPS)

### 4. Report

> Goal: สรุป connection status

1. ใช้ `/report` คอลัมน์: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `auth-failed` / `mode-mismatch` / `webhook-not-ready`

## Rules

- ใช้ read calls เท่านั้น — ห้ามสร้าง checkout/charge
- ไม่ print key values — แสดงแค่ prefix/mode
- mode mismatch = flag เสมอ (test key ใน prod = critical)

## Expected Outcome

- Verdict พร้อม mode + account evidence

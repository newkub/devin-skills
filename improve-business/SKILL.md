---
name: improve-business
description: แก้ไข business logic findings ด้าน payment, subscription, multi-tenancy, feature flags, และ email
argument-hint: "[target-or-scope]"
related:
  - review-business
  - review-correctness
  - run-test
  - run-verify
  - report-table
  - suggest-next-action
---

## Goal

แก้ไข business logic findings จาก `/review-business` ให้ถูกต้อง ปลอดภัย และเสถียน

## Scope

ใช้กับ business logic เฉพาะทาง: payment, subscription, multi-tenancy, feature flags, realtime, email, pricing, billing — ไม่รวม general code quality หรือ UX (ใช้ `/improve-quality`, `/improve-uxui` แทน)

## Execute

### 1. Review Findings

> Goal: เข้าใจ business findings

1. อ่าน report จาก `/review-business`
2. แบ่ง findings ตาม domain: payment, subscription, multi-tenancy, feature flags, realtime, email
3. จัดลำดับตาม risk และ revenue impact
4. ระบุ compliance/regulatory requirements ที่เกี่ยวข้อง

### 2. Fix Core Business Rules

> Goal: business rules ถูกต้อง

1. แก้ calculations (pricing, tax, discount, proration)
2. แก้ state machines ของ order/subscription lifecycle
3. ตรวจ edge cases: refunds, upgrades, downgrades, cancellations
4. รัน domain tests

### 3. Fix Payment And Billing

> Goal: payment flows ปลอดภัย

1. แก้ integration กับ payment provider
2. แก้ idempotency keys สำหรับ charges
3. ตรวจ webhook handling
4. รัน payment tests ใน sandbox

### 4. Fix Multi-Tenancy

> Goal: tenant isolation ถูกต้อง

1. ตรวจ data access scoped by tenant
2. แก้ shared state ที่ไม่ได้ตั้งใจ
3. ตรวจ role/permission checks
4. รัน tenant isolation tests

### 5. Fix Feature Flags

> Goal: feature flags ทำงานถูกต้อง

1. ตรวจ flag evaluation logic
2. แก้ rollout/default values
3. ตรวจ flag cleanup สำหรับ features ที่ release แล้ว
4. รัน flag tests

### 6. Fix Realtime And Notifications

> Goal: realtime events และ notifications ถูกต้อง

1. แก้ event ordering/delivery
2. แก้ email templates/transactional emails
3. ตรวจ rate limiting และ spam prevention
4. รัน integration tests

### 7. Validate Business Logic

> Goal: ยืนยันว่า business logic ถูกต้อง

1. รัน domain unit tests
2. รัน `run-test` และ `run-verify`
3. ทดสอบ scenarios สำคัญด้วย integration tests
4. ทำ `/review-correctness` เพื่อ verify logic

### 8. Report

> Goal: สรุปผล

1. ทำ `/report-table` สรุป fixes
2. ทำ `/review-business` อีกครั้งเพื่อ verify
3. ทำ `/suggest-next-action`

## Rules

### 1. Compliance First

- ตรวจ PCI-DSS, GDPR, tax rules ตาม domain
- ไม่เก็บ sensitive data โดยไม่ encryption

### 2. Audit Trail

- business state changes ต้อง log ได้
- ไม่ลบ history โดยไม่ได้ตั้งใจ

### 3. Safety

- ใช้ sandbox สำหรับ payment tests
- ทำ dry run สำหรับ billing changes

### 4. Minimal Change

- แก้เฉพาะ business rule ที่ผิด
- ไม่เปลี่ยน pricing โดยไม่ business approval

## Expected Outcome

- Business logic ถูกต้องและปลอดภัย
- Payment, subscription, multi-tenancy, feature flags, realtime, email ทำงานได้
- `run-test` และ `run-verify` ผ่าน
- `/review-business` ไม่พบ issues เดิม
- รายงาน fixes พร้อม next action

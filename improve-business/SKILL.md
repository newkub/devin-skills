---
name: improve-business
description: หา business logic improvements ใน scope — payment, subscription, pricing, feature flags — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-features
  - improve-backend
  - improve-security
  - deep-review
  - deep-review-then-fix
  - follow-service-stripe
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "business logic improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domain `review-business` เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "business rules/payment ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-business` — payment flows, subscription lifecycle, pricing logic, refund/credit paths, feature flags, plan entitlements, usage metering, webhook handling
- feature extends/gaps ทั่วไป → `/improve-features`; auth/entitlement checks → `/improve-rbac`; service structure → `/improve-backend`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domain `review-business` — payment edge cases, subscription state machines, entitlement bypasses, webhook idempotency, flag debt
3. รวบรวม prioritized list พร้อม severity และ evidence — money-path bugs เป็น P0 เสมอ

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain `review-business`)
2. Payment changes ต้อง idempotent + auditable — ใช้ provider best practices (`/follow-service-stripe` ถ้า Stripe)
3. Money paths ต้องมี tests ครอบ edge cases (partial refund, downgrade, trial expiry)
4. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domain `review-business`
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ห้าม hardcode pricing/entitlement rules — ใช้ config หรือ provider of truth
- Money calculations ใช้ integer minor units เท่านั้น ห้าม float
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized business improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม test coverage บน money paths

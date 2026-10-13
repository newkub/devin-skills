---
name: improve-payment-recovery
description: หา payment recovery improvements — dunning, card retry, involuntary churn — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-billing
  - improve-metering
  - improve-email
  - follow-service-stripe
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "payment recovery improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains `review-backend + review-business` (dunning scope) เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "failed payment/dunning ควร improve อะไร" — thin entry ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-backend` (dunning scope) — webhook handling ของ payment provider events, retry schedule (smart retries), grace period state machine, cancel/revive correctness
- `review-business` (dunning scope) — involuntary churn reduction, recovery email/in-app flow, final dunning ก่อน cancel, customer self-serve card update
- ตั้งค่า billing/products/invoices → `/improve-billing`; usage-based metering → `/improve-metering`; ส่ง recovery emails ทาง deliverability → `/improve-email`
- เกณฑ์ boundary เต็ม: `follow-improve/references/scope-map.md`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domains `review-backend + review-business` (dunning scope) — ไม่มี retry ladder, webhook ไม่ idempotent, customer ติด grace state
3. รวบรวม prioritized list พร้อม severity และ evidence — ยกเลิกผิดคน (false cancel) เป็น P0

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain ที่ตรง)
2. ทุก dunning state change ต้องมี state-machine test (retry→success, retry→exhaust→grace→cancel) ผ่าน `/test-api`
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains ที่ระบุ
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ห้าม simulate การเงินจริง — ใช้ test mode/provider sandbox ผ่าน `/follow-service-stripe`
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized payment-recovery improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม dunning state-machine tests

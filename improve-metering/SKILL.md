---
name: improve-metering
description: หา usage metering improvements — counters, quotas, attribution, billing-grade data — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-billing
  - improve-rate-limiting
  - improve-business
  - follow-service-stripe
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "metering improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains `review-backend + review-business` (metering scope) เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "usage metering/quota ควร improve อะไร" — thin entry ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-backend` (metering scope) — meter event pipeline (exactly-once/at-least-once+dedupe), aggregation correctness, idempotency keys, clock handling, retroactive re-runs
- `review-business` (metering scope) — quota definitions ตรง plan logic, entitlement checks, usage-based transition cases
- เก็บเงิน/invoicing → `/improve-billing`; กัน abuse ต่อวินาที → `/improve-rate-limiting`; metering semantics ระดับ event → `/improve-events`
- เกณฑ์ boundary เต็ม: `follow-improve/references/scope-map.md`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domains `review-backend + review-business` (metering scope) — events หายระหว่าง retry, double-count จาก missing dedupe
3. รวบรวม prioritized list พร้อม severity และ evidence — under/over-count ที่กระทบเงินเป็น P0

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain ที่ตรง)
2. ทุก metering fix ต้องมี reconciliation test (นับซ้ำ/ตกหล่นเทียบ ledger เดียวกับแหล่ง events)
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains ที่ระบุ
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- Metering data เป็น financial-grade — ห้ามแก้แบบ best-effort โดยไม่มี backfill plan
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized metering improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม reconciliation tests

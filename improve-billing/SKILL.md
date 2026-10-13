---
name: improve-billing
description: หา improvements ของ billing — checkout, subscriptions, invoices — รวม findings แล้วแก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
  - improve-api
---

## Goal

ตอบคำถาม "billing improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains `review-api + review-security + review-business` เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "billing ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-api` — billing endpoints, webhook handling, idempotent charges
- `review-security` — payment data handling, webhook signature, PII
- `review-business` — pricing flow, proration, invoice accuracy

### Tools And Libraries

| Skill | ใช้เมื่อ |
|---|---|
| `f` | o |
| `S` | t |
- failed-payment/dunning recovery → `/improve-payment-recovery`; usage tracking → `/improve-metering`


## Execute

### 1. Review

1. รับ `<scope>` จาก argument หรือ conversation context — ไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domains `review-api + review-security + review-business` — checkout flows, subscription lifecycle, webhook idempotency, invoice correctness

### 2. Present Findings

1. ทำ `/report` แสดง billing improvements: No., Finding, Severity, Fix Skill

### 3. Fix All Findings

1. ทำ `/deep-review-then-fix` แก้ทุก finding ตาม Domain Map
2. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains `review-api + review-security + review-business`
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized billing improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix`
---
name: improve-rate-limiting
description: หา improvements ของ rate limiting — limits, 429 handling, backoff — รวม findings แล้วแก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
  - improve-security
  - improve-api
---

## Goal

ตอบคำถาม "rate limiting improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains `review-security + review-api + review-stability` เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "rate limiting ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-security` — abuse vectors, bypass paths
- `review-api` — 429 contract, Retry-After headers, limit semantics
- `review-stability` — throttling ภายใต้ burst, graceful degradation

## Execute

### 1. Review

1. รับ `<scope>` จาก argument หรือ conversation context — ไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domains `review-security + review-api + review-stability` — limit design, key strategy, 429 responses, client backoff

### 2. Present Findings

1. ทำ `/report` แสดง rate limiting improvements: No., Finding, Severity, Fix Skill

### 3. Fix All Findings

1. ทำ `/deep-review-then-fix` แก้ทุก finding ตาม Domain Map
2. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains `review-security + review-api + review-stability`
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized rate limiting improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix`
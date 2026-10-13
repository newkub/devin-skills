---
name: improve-queues
description: หา improvements ของ background jobs — retries, DLQ, idempotency — รวม findings แล้วแก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "background jobs/queues improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains `review-backend + review-stability` เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "background jobs/queues ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-backend` — job handlers, producers, consumers, scheduling
- `review-stability` — consumer lag, worker sizing, priority, backpressure, poison-message ops
- messaging semantics (event schema, versioning, ordering, idempotency, DLQ design) → `/improve-events`; crash/recovery กว้าง → `/improve-stability`; เกณฑ์ boundary เต็ม: `follow-improve/references/scope-map.md`
- scheduled-run ops → `/improve-scheduled-jobs`

## Execute

### 1. Review

1. รับ `<scope>` จาก argument หรือ conversation context — ไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domains `review-backend + review-stability` — retry policy, idempotency keys, DLQ handling, backpressure

### 2. Present Findings

1. ทำ `/report` แสดง background jobs/queues improvements: No., Finding, Severity, Fix Skill

### 3. Fix All Findings

1. ทำ `/deep-review-then-fix` แก้ทุก finding ตาม Domain Map
2. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains `review-backend + review-stability`
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized background jobs/queues improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix`
---
name: improve-resilience
description: หา improvements ของ resilience — timeouts, retries, circuit breakers — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-stability
  - improve-error-handling
  - improve-events
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "resilience improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains `review-stability + review-backend` เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "resilience ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-stability` — timeouts, retries, circuit breakers, fallbacks, bulkheads, graceful degradation (resilience patterns — เจ้าของพื้นที่นี้)
- `review-backend` — failure propagation, dependency isolation
- crash/recovery กว้าง → `/improve-stability`; error paths/error UI → `/improve-error-handling`; messaging semantics → `/improve-events`; เกณฑ์ boundary เต็ม: `follow-improve/references/scope-map.md`

## Execute

### 1. Review

1. รับ `<scope>` จาก argument หรือ conversation context — ไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domains `review-stability + review-backend` — missing timeouts, retry storms, missing circuit breakers, blast radius

### 2. Present Findings

1. ทำ `/report` แสดง resilience improvements: No., Finding, Severity, Fix Skill

### 3. Fix All Findings

1. ทำ `/deep-review-then-fix` แก้ทุก finding ตาม Domain Map
2. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains `review-stability + review-backend`
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized resilience improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix`
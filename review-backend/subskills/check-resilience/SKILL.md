---
name: review-backend-check-resilience
description: Check resilience — timeouts, retries, circuit breakers, fallbacks, error handling
argument-hint: "[scope]"
related:
  - review-backend
  - review-stability
  - use-astgrep
  - report
---

## Goal

Run the errors/resilience/caching dimension of `/review-backend` แบบ focused — service รอดเมื่อ dependency ล้ม

## Scope

- ใช้เมื่อ `/review-backend` dispatch มาที่ `resilience`/`errors`/`caching` หรือเรียก standalone
- ครอบคลุม: timeouts, retry policy, circuit breakers, fallbacks, error boundaries, cache failure modes
- deep stability pass → `/review-stability`

## Execute

### 1. Resilience Checks

> Goal: ทุก outbound call มี failure story

ทำตาม `../../references/resilience.md` + `../../references/caching.md`

1. timeouts — ทุก external call (HTTP, DB, queue) มี timeout ไม่ใช่ default อนันต์
2. retries — backoff + jitter + max attempts; idempotent-only retry บน non-idempotent ห้าม
3. circuit breakers / bulkheads — cascading failure protection บน flaky deps
4. fallbacks — degraded response เมื่อ dep ล้ม vs hard fail
5. cache failure — stale-on-error, stampede protection, cache-down behavior

### 2. Error Handling

> Goal: errors ถูกจับและ propagate ถูกต้อง

1. swallowed errors — empty catch, error→null patterns
2. error classification — retryable vs permanent แยกชัด
3. boundary errors — API/job boundary มี consistent error contract

### 3. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Call/Site`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น — fix ใน parent `## Fix` หรือ `/review-stability` `improve-resilience`
- ทุก finding มี file path + line
- unbounded retry / missing timeout บน critical path = High

## Expected Outcome

- Resilience findings แยก timeouts/retries/breakers/fallbacks/cache
- Cascading-failure risks flagged พร้อม dep chain

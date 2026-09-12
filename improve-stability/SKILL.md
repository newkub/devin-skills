---
name: improve-stability
description: Apply stability fixes จาก review-stability — error handling, retries, timeouts, graceful degradation
argument-hint: "[scope]"
related:
  - review-stability
  - review-observability
  - resolve-errors
  - deep-analyze
  - use-subagents
  - run-check
  - run-test
  - report
  - suggest-next-action
---

## Goal

แก้ reliability/stability issues ที่ `/review-stability` พบ — unhandled errors, missing timeouts/retries, crash paths, resource leaks, no graceful degradation — พร้อม tests พิสูจน์

## Scope

ใช้หลัง `/review-stability` มี findings หรือเมื่อระบบล้มบ่อย — apply fixes ไม่ใช่ report-only

- ถ้า observability gaps (logging/metrics/tracing) → `/review-observability` แล้ว `/improve-observability`
- ถ้า scope ใหญ่หลาย services → dispatch ผ่าน `/use-subagents`

## Execute

### 1. Collect Findings

> Goal: รู้ว่าอะไรทำระบบไม่เสถียร

1. ทำ `/review-stability` หรืออ่าน findings เดิม
2. จัดกลุ่ม: error handling, timeouts/retries, resource management, concurrency, failure modes

### 2. Fix Error Handling

> Goal: ทุก failure path ถูกจัดการ

1. unhandled rejections/exceptions → catch ที่ boundary พร้อม meaningful handling
2. error swallowing (empty catch, ignored errors) → log + handle หรือ propagate
3. error boundaries — UI crash ไม่ลากทั้ง app; API errors คืน format ถูกต้อง

### 3. Fix Timeouts And Retries

> Goal: calls ไม่ค้างและ recover ได้

1. outbound calls ทุกตัวมี timeout — ห้าม infinite wait
2. retries: exponential backoff + jitter + max attempts — ห้าม retry มั่วบน non-idempotent ops
3. circuit breaker สำหรับ flaky dependencies ถ้าจำเป็น

### 4. Fix Resources And Concurrency

> Goal: ไม่มี leaks/races

1. connections/handles/subscriptions → cleanup ครบ (finally/dispose)
2. race conditions → proper locking/atomic ops/idempotency keys
3. memory growth (unbounded caches, listeners) → bounds + eviction

### 5. Fix Failure Modes

> Goal: ล้มแล้ว degrade อย่างมีสติ

1. graceful degradation — fallback values, cached data, read-only mode
2. startup failures → clear error + fail fast ไม่ half-initialized
3. graceful shutdown — drain connections, flush buffers

### 6. Verify With Tests

> Goal: stability fixes พิสูจน์ได้

1. เขียน failure-injection tests — dependency down, timeout, partial failure
2. `/run-test` + `/run-check` ผ่าน
3. ถ้าพบ root cause ลึก → `/deep-analyze` หรือ `/resolve-errors`

### 7. Report

> Goal: ส่งมอบ

1. ทำ `/report` — failure modes fixed, tests added, residual risks
2. ทำ `/suggest-next-action`

## Rules

### 1. Fix Root Cause

- ห้าม retry/ignore เพื่อบัง symptoms — แก้สาเหตุจริง
- timeout/retry values ต้องมีเหตุผลจาก latency evidence ไม่ใช่ตัวเลขมั่ว

### 2. No Silent Failures

- ทุก error ต้อง observable — log/metric ที่ boundary เสมอ
- fallback ต้อง documented — caller รู้ว่าได้ degraded response

### 3. Testable Failures

- ทุก stability fix ต้องมี test ที่ทำให้ fail ได้ — ไม่ใช่ code ที่ไม่เคย exercised
- flaky fixes (timing-dependent) ห้าม merge

## Expected Outcome

- failure paths ครบและ handle ถูก — timeouts/retries มีเหตุผล
- ไม่มี leaks/races/swallowed errors
- failure-injection tests ผ่าน — system degrades gracefully

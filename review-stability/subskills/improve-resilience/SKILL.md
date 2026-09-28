---
name: review-stability-improve-resilience
description: Apply resilience findings — timeouts, retries+jitter, breakers, graceful degradation
argument-hint: "[scope-or-findings]"
related:
  - review-stability
  - review-backend
  - run-test
  - report-before-after
  - resolve-errors
---

## Goal

แก้ resilience findings จาก `/review-stability`/`/review-backend` จริง — ทุก outbound call มี failure story และ dep ล้มแล้ว app ยังรอด

## Scope

- ใช้หลัง review เสร็จและ user confirm ให้แก้
- ครอบคลุม: timeouts, retry policies, circuit breakers, fallbacks, graceful degradation, resource cleanup

## Execute

### 1. Baseline

> Goal: รู้ failure surface ก่อนแก้

1. list outbound calls + failure findings จาก review — เทียบ degradation matrix (`../report-degradation/SKILL.md`)
2. เรียงตาม blast radius — dep ที่ทำ app ล้มทั้งตัวก่อน
3. เตรียม failure-injection approach (delay/error injection บน dev/staging)

### 2. Fix Call Resilience

> Goal: ทุก outbound call คุมได้

1. timeouts — explicit ทุก external call (connect/read/total); ไม่มี default อนันต์
2. retries — exponential backoff + jitter + max attempts; เฉพาะ idempotent operations
3. circuit breakers บน flaky deps — fast-fail แทน cascade; bulkheads แยก resource pools

### 3. Fix Degradation

> Goal: dep ล้ม → degrade ไม่ใช่ตาย

1. fallback responses — cached/default/degraded ตาม matrix gaps
2. graceful shutdown — drain connections, finish in-flight work, health-check aware
3. fail-fast startup — missing required config/dep → exit ชัดเจนไม่ใช่ zombie state
4. resource cleanup — connections/listeners/caches มี bounds + cleanup paths

### 4. Verify

> Goal: resilience พิสูจน์ได้ไม่ใช่แค่เขียน

1. failure-injection test — kill dep แล้วดู behavior ตรง expected degradation
2. `/run-test` ผ่าน + `/report-before-after` — matrix ก่อน/หลัง

## Rules

- ห้าม retry non-idempotent writes โดยไม่มี idempotency key
- timeout values ต้องสัมพันธ์กับ caller chain (child < parent)
- preserve behavior เมื่อ dep ปกติ — fallbacks ทำงานเฉพาะตอน fail
- fix-verify loop สูงสุด 3 รอบ → ไม่ผ่าน `/resolve-errors` แล้ว report

## Expected Outcome

- Degradation matrix ก่อน/หลัง — hard-fail entries ลดลงจริง
- Failure-injection evidence ต่อ fixed path

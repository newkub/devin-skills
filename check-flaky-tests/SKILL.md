---
name: check-flaky-tests
description: ตรวจหา flaky tests — re-run variance, timing-dependent failures, retry masking
argument-hint: "[test-path]"
allowed-tools:
  - exec
  - grep
  - find_file_by_name
related:
  - check-test-isolation
  - check-test-quality
  - run-test
  - review-test
  - report
---

## Goal

ตรวจหา tests ที่ผ่าน/fail ไม่สม่ำเสมอ — ทั้งจาก *observed* flakiness (re-run variance) และ *masking config* (retries ที่ซ่อนความไม่เสถียร) — เพื่อให้ suite เชื่อถือได้จริง

## Scope

- ครอบคลุม observed flakiness + masking config + timing-dependent patterns
- Boundary: design-time causes (shared state, order deps) อยู่ที่ `/check-test-isolation` — skill นี้เน้น observed variance และ retry masking
- Read-only: หา flaky แล้ว report — แก้ผ่าน `/update-tests` หรือ `/check-test-isolation`

## Execute

### 1. Detect Retry Masking

> Goal: หา config ที่ซ่อน flakiness

1. หา retry config — `retry:` ใน playwright/vitest config, `jest.retryTimes`, `--retries`, `mocha --retries`, pytest-rerunfailures
2. retry > 0 ที่ไม่มีเหตุผลบันทึกไว้ → Warning — retry ควรเป็น 0 ใน CI เพื่อเปิดโปง flaky

### 2. Detect Timing Patterns

> Goal: หา tests ที่พึ่ง wall-clock timing

1. หา `setTimeout`/`sleep`/`waitForTimeout` ใน test bodies — fixed waits = flaky seeds
2. หา `Date.now()`/`new Date()`/random ใน assertions โดยไม่มี seed/fake timers
3. หา network-dependent calls ที่ไม่ mock — external I/O = nondeterministic

### 3. Verify With Repeat Runs

> Goal: วัด observed variance จริง ไม่ใช่เดา

1. รัน suite หรือ scope ที่ suspect ≥2 ครั้ง — `bunx vitest run --repeat-each=3`, `pytest --repeat`, shuffle flags
2. เปรียบเทียบผล: test ที่ผ่านบ้าง fail บ้าง = confirmed flaky — บันทึกรอบที่ fail
3. รัน ด้วย shuffled order ถ้า runner รองรับ — variance จาก order → `/check-test-isolation`

### 4. Report

> Goal: รายงาน flaky list พร้อม severity

1. ทำ `/report` ตาราง: `No.`, `Test`, `Flaky Signal` (variance/retry-masked/timing), `Severity`, `Fix`
2. Confirmed flaky (observed variance) → Critical; timing patterns ที่ยังไม่ observed → Warning; retry config → Info
3. แนะนำ fix path: แยก state → `/check-test-isolation`; assertions → `/update-tests`

## Rules

- Read-only — ไม่แก้ tests/config ใน skill นี้
- ยืนยันด้วย re-run ก่อน mark flaky — ห้ามตีป้ายจาก code pattern อย่างเดียว (pattern = suspect, variance = confirmed)
- ทุก finding ต้องมี evidence (รอบที่ fail หรือ config line)
- ใช้ /check-test-isolation ถ้าจำเป็น · ใช้ /check-test-quality ถ้าจำเป็น · ใช้ /suggest-next-action ถ้าจำเป็น

## Expected Outcome

- Confirmed flaky tests ถูกระบุพร้อม evidence (รอบ fail)
- Retry masking + timing patterns ถูก report แยกจาก observed flakiness
- Fix path ชัดเจนต่อ finding

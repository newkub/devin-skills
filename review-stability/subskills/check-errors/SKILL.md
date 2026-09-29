---
name: review-stability-check-errors
description: Check error handling — unhandled paths, swallowed errors, boundaries, propagation
argument-hint: "[scope]"
related:
  - review-stability
  - review-test
  - review-backend
  - use-astgrep
  - report
---

## Goal

Run the error-handling dimension of `/review-stability` แบบ focused — ทุก failure path ถูกจับและส่งต่อถูกต้อง

## Scope

- ใช้เมื่อ `/review-stability` dispatch มาที่ `errors`/`error-handling` หรือเรียก standalone
- ครอบคลุม: unhandled paths, swallowed errors, error boundaries, async error handling, error contracts

## Execute

### 1. Error Checks

> Goal: failure paths ครอบคลุม — parent Execute §4

ทำตาม `../../references/error-handling.md` + `../../references/error-patterns.md`

1. unhandled — throws/rejections ที่ไม่มี catch path (`/review-test`, `/review-backend`)
2. swallowed — empty catch, `catch → null/[]` ที่ซ่อน failures
3. boundaries — API/job/request boundaries มี consistent error contract (no raw exceptions leaking)
4. propagation — errors ที่ควร bubble vs handle แยกถูก; retryable vs permanent classified

### 2. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Site`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น — fix ใน parent `## Fix` หรือ `../improve-resilience/SKILL.md`
- ทุก finding มี file path + line + failure scenario
- swallowed error บน critical path / unhandled rejection ที่ crash process = High

## Expected Outcome

- Error findings แยก unhandled/swallowed/boundary/propagation
- Failure scenarios concrete ต่อ finding

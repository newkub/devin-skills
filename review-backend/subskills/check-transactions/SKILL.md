---
name: review-backend-check-transactions
description: Check concurrency/transactions — race conditions, isolation, locking, atomicity
argument-hint: "[scope]"
related:
  - review-backend
  - use-astgrep
  - report
---

## Goal

Run the concurrency/transactions dimension of `/review-backend` แบบ focused — data ไม่ corrupt ภายใต้ concurrent access

## Scope

- ใช้เมื่อ `/review-backend` dispatch มาที่ `transactions`/`concurrency` หรือเรียก standalone
- ครอบคลุม: transaction boundaries, isolation levels, race conditions, locking, distributed consistency

## Execute

### 1. Transaction Checks

> Goal: multi-step writes atomic จริง

ทำตาม `../../references/concurrency.md`

1. atomicity — multi-write flows ที่ไม่ wrap transaction (partial failure → corrupt)
2. isolation — read-modify-write races, missing `SELECT ... FOR UPDATE`/optimistic locking
3. scope — long-running work ใน transaction (locks held เกิน), external calls ใน tx
4. distributed — saga/outbox patterns เมื่อ cross-service, หรือแค่ eventual-consistency documented

### 2. Concurrency Signals

> Goal: race conditions ที่เห็นใน code

1. check-then-act patterns (get-then-create → unique violation races)
2. shared mutable state ใน workers/request handlers
3. connection pool exhaustion paths — nested transactions, leaks

### 3. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Flow/Site`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น — fix ใน parent `## Fix`
- ทุก finding มี file path + line + race scenario สั้นๆ
- money/inventory races = Critical; theoretical races ที่มี unique constraint คั่น = Medium

## Expected Outcome

- Transaction findings แยก atomicity/isolation/scope/distributed
- Race scenarios พร้อม concrete failure path

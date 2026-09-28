---
name: review-backend-check-jobs
description: Check background jobs/consumers — retries, idempotency, DLQ, scheduling
argument-hint: "[scope]"
related:
  - review-backend
  - report
---

## Goal

Run the jobs/consumers dimension of `/review-backend` แบบ focused — async work เชื่อถือได้และ recoverable

## Scope

- ใช้เมื่อ `/review-backend` dispatch มาที่ `jobs`/`workers`/`consumers` หรือเรียก standalone
- ครอบคลุม: queues, workers, cron/scheduled jobs, consumers, retries, DLQ

## Execute

### 1. Jobs Checks

> Goal: async work ไม่หายไม่ซ้ำไม่ค้าง

ทำตาม `../../references/jobs.md`

1. idempotency — consumer รับซ้ำได้โดยไม่ corrupt (dedupe key/upsert)
2. retries — backoff + max attempts; poison messages → DLQ ไม่ retry ตลอด
3. scheduling — cron overlap protection (locks), missed-run policy, timezone-aware
4. visibility — job state inspectable, lag metrics, stuck detection

### 2. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Job/Queue`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น — fix ใน parent `## Fix`
- ทุก finding มี file path + line — handler/consumer location
- no-DLQ บน payment/critical queue = High; missing visibility = Medium

## Expected Outcome

- Jobs findings แยก idempotency/retries/scheduling/visibility
- Poison-message + stuck-job risks flagged

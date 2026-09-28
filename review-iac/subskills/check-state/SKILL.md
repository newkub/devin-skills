---
name: review-iac-check-state
description: Check IaC state safety — backend, locking, secrets in state, prevent_destroy
argument-hint: "[stack-or-scope]"
related:
  - review-iac
  - check-secrets
  - report
---

## Goal

Run the state safety dimension of `/review-iac` แบบ focused — state file ปลอดภัยและไม่เสียหาย

## Scope

- ใช้เมื่อ `/review-iac` dispatch มาที่ `state`/`backend` หรือเรียก standalone
- ครอบคลุม: backend config, state locking, secrets in state, lifecycle protections

## Execute

### 1. State Checks

> Goal: state ไม่ corrupt ไม่ leak — parent Execute §2

1. backend — remote backend (S3/gcs/azurerm) ไม่ใช่ local; encryption at rest
2. locking — DynamoDB/native lock เปิด — concurrent apply กันได้
3. secrets in state — sensitive outputs/attrs จำเป็น; state file ไม่ commit ลง repo (`*.tfstate*` gitignored)
4. protections — `prevent_destroy` บน stateful resources (DBs, buckets ที่มี data)

### 2. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Stack/Backend`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น — ห้าม `state mv`/`import`/`apply` ระหว่าง check
- local state หรือ committed state file = High (leak + corruption risk)
- ทุก finding มี evidence: backend config line หรือ gitignore/status check

## Expected Outcome

- State safety findings พร้อม affected stacks
- Locking/backend/secret-in-state gaps flagged

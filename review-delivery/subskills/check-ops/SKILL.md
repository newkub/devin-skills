---
name: review-delivery-check-ops
description: Check ops surfaces — logging, debugging, versioning, PR process, analytics
argument-hint: "[scope]"
related:
  - review-observability
  - scan-codebase
  - report
---

## Goal

Run the operations dimensions of `/review-delivery` แบบ focused — logging/debugging, versioning, PR process, analytics ใน pass เดียว

## Scope

- ใช้เมื่อ `/review-delivery` dispatch มาที่ `ops`/`logging`/`versioning` หรือเรียก standalone
- ครอบคลุม delivery-unique dims ที่เล็กกว่า: logging-debugging, versioning, pr-review, analytics — observability deep-dive → `/review-observability`

## Execute

### 1. Logging And Debugging

> Goal: debuggability พร้อมใช้ตอน incident

ทำตาม `../../references/logging-debugging.md`

### 2. Versioning

> Goal: release versioning เป็นระบบ

ทำตาม `../../references/versioning.md`

### 3. PR Process

> Goal: PR workflow มีประสิทธิภาพ

ทำตาม `../../references/pr-review.md`

### 4. Analytics

> Goal: instrumentation ครบและถูกต้อง

ทำตาม `../../references/analytics.md`

### 5. Report

> Goal: findings แยกตาม dimension

ทำ `/report` ตาราง: `No.`, `Dimension`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น ไม่แก้ไข code/config — fix ใน parent `## Fix`
- ทุก finding มี evidence: file path, line, หรือ missing instrumentation point
- ข้าม dimension ที่ project ไม่มี (เช่นไม่มี analytics) พร้อมระบุเหตุ

## Expected Outcome

- Ops findings แยก 4 dimensions พร้อม severity
- Findings ที่ต้อง deep-dive route ไป `/review-observability` หรือ parent skill ที่เหมาะ

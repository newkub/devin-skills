---
name: review-observability-check-logging
description: Check logging — structured logs, context, levels, secret/PII redaction
argument-hint: "[scope]"
related:
  - review-observability
  - check-repo-hygiene
  - use-astgrep
  - report
---

## Goal

Run the logging dimension of `/review-observability` แบบ focused — logs structured, มี context, ไม่ leak sensitive data

## Scope

- ใช้เมื่อ `/review-observability` dispatch มาที่ `logging`/`logs` หรือเรียก standalone
- ครอบคลุม: structured logging, levels, request context (trace_id), redaction, log volume/noise

## Execute

### 1. Logging Checks

> Goal: logs ใช้ debug ได้จริง ไม่ leak

ทำตาม `../../references/logging.md`

1. structured — JSON/consistent format ไม่ใช่ string concat; `console.log` leftovers → `/check-repo-hygiene`
2. context — trace_id/request_id/user context propagate ครบ error paths
3. levels — error/warn/info/debug ใช้ถูก; error paths log ครบไม่ swallowed
4. redaction — secrets/tokens/PII ไม่ถูก log (scan patterns: password, token, authorization headers)

### 2. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Location`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น — fix ใน parent `## Fix`
- ทุก finding มี file path + line
- secrets/PII ใน logs = Critical; missing context = Medium; level misuse = Low
- ห้าม paste secret values จริงลง report — ระบุ location เท่านั้น

## Expected Outcome

- Logging findings แยก structure/context/levels/redaction
- Leak findings พร้อม location (ไม่มี secret values)

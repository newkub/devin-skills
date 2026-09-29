---
name: review-compliance-check-breach
description: Check breach readiness — detection, notification flows, audit trail, playbooks
argument-hint: "[scope]"
related:
  - review-compliance
  - review-observability
  - report
---

## Goal

Run the breach-readiness dimension of `/review-compliance` แบบ focused — ถ้าโดน breach วันนี้ detect + notify + prove ได้ไหม

## Scope

- ใช้เมื่อ `/review-compliance` dispatch มาที่ `breach`/`incident` หรือเรียก standalone
- ครอบคลุม: breach detection, notification workflows (72h GDPR ฯลฯ), audit trail, forensic readiness

## Execute

### 1. Breach Readiness Checks

> Goal: incident readiness ครบ — parent Execute §4

1. detection — security event logging + alerting บน auth anomalies, mass export, permission changes
2. notification — flow สำหรับ regulator/user notification มี deadline tracking (72h GDPR)
3. audit trail — who-did-what-when immutable logs (`../../subagents/compliance-reviewer/audit-trail.md`)
4. forensics — log retention พอสำหรับ investigation, access review trails
5. playbook — breach response steps documented + owner assigned

### 2. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Capability`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น — fix ใน parent `## Fix`; alerting gaps → `/review-observability`
- ทุก finding มี evidence: config, log pipeline, หรือ missing artifact
- ไม่มี audit trail / notification path เลย = Critical for regulated scope

## Expected Outcome

- Breach-readiness findings แยก detection/notification/audit/forensics
- Deadline-compliance gaps (72h etc.) flagged

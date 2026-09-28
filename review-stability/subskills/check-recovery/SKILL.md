---
name: review-stability-check-recovery
description: Check recovery — graceful degradation, restart, rollback, backup/restore readiness
argument-hint: "[scope]"
related:
  - review-stability
  - report
---

## Goal

Run the recovery dimension of `/review-stability` แบบ focused — ระบบกลับมาได้เมื่อล้ม ไม่ใช่แค่พยายามไม่ล้ม

## Scope

- ใช้เมื่อ `/review-stability` dispatch มาที่ `recovery`/`degradation` หรือเรียก standalone
- ครอบคลุม: graceful degradation, graceful shutdown, restart behavior, rollback readiness, backup/restore

## Execute

### 1. Recovery Checks

> Goal: failure modes มี recovery path — parent Execute §6 + §8

ทำตาม `../../references/recovery.md` + `../../references/degradation.md`

1. degradation — dep ล้ม → feature degrade gracefully vs hard fail (degradation matrix)
2. shutdown/restart — graceful shutdown (drain connections, finish in-flight), fail-fast startup เมื่อ config ผิด
3. rollback — deploy rollback path, feature flags kill-switch, data migration rollback
4. backup/restore — restore tested จริงไหม (`../../references/verify-backup-restore.md`) ไม่ใช่แค่มี backup

### 2. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Failure Mode`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น — fix ใน parent `## Fix` หรือ `../improve-resilience/SKILL.md`
- ทุก finding มี failure scenario + current behavior evidence
- no rollback path บน destructive deploy / untested restore = High

## Expected Outcome

- Recovery findings แยก degradation/shutdown/rollback/backup
- Degradation matrix gaps flagged

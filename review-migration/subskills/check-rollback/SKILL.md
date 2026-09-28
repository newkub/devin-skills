---
name: review-migration-check-rollback
description: Check rollback/cutover — down migrations, cutover plan, kill switches, rehearsal
argument-hint: "[migration-or-scope]"
related:
  - review-migration
  - check-migrations
  - report
---

## Goal

Run the rollback/cutover dimension of `/review-migration` แบบ focused — migration กลับตัวได้เมื่อพัง

## Scope

- ใช้เมื่อ `/review-migration` dispatch มาที่ `rollback`/`cutover` หรือเรียก standalone
- ครอบคลุม: down migrations, cutover sequence, rollback triggers, feature-flag kill switches, rehearsal evidence

## Execute

### 1. Rollback Checks

> Goal: ทุก irreversible step มี exit plan — parent Execute §4

ทำตาม `../../references/rollback-cutover.md`

1. down migrations — ทุก up มี down ที่ทำงานจริง (ไม่ใช่ stub `pass`)
2. cutover sequence — steps ordering, dual-write/read windows, DNS/traffic switch points
3. triggers — เกณฑ์ abort ชัดเจน (error rate, data mismatch %, latency) ไม่ใช่ "รู้สึกว่าพัง"
4. kill switches — feature flags กลับไป old path ได้ทันที
5. rehearsal — rollback เคย test จริงบน staging copy หรือไม่

### 2. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Step`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น — fix ใน parent `## Fix` หรือ `/review-database` `improve-migrations`
- ทุก finding มี evidence: migration file, cutover doc, หรือ missing artifact
- irreversible step ที่ไม่มี tested rollback = Critical

## Expected Outcome

- Rollback coverage ต่อ migration step
- Untested/missing rollback paths flagged พร้อม severity

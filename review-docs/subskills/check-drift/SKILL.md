---
name: review-docs-check-drift
description: Check docs↔code drift — stale commands/APIs, undocumented features, dead docs
argument-hint: "[docs-dir-or-scope]"
related:
  - review-docs
  - check-content-outdate
  - check-correctness
  - report
---

## Goal

Run the drift dimension of `/review-docs` แบบ focused — docs เล่าเรื่องเดียวกับ code ปัจจุบัน

## Scope

- ใช้เมื่อ `/review-docs` dispatch มาที่ `drift`/`freshness` หรือเรียก standalone
- ครอบคลุม: stale commands/APIs/env vars, undocumented features, docs ของ features ที่ตายไปแล้ว

## Execute

### 1. Drift Checks

> Goal: docs เทียบ source of truth จริง — parent Execute §9

1. commands/APIs — code blocks เทียบ CLI flags, API signatures, env vars กับ source จริง → `/check-correctness`
2. freshness — sections ที่ stale เทียบ changelog/git history → `/check-content-outdate`
3. coverage — features/public APIs ที่ไม่มี docs (`../../references/features-coverage.md`)
4. dead docs — docs ของ features ที่ถูกลบไปแล้ว (orphaned pages)

### 2. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Doc`, `Type`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น — fix ใน parent `## Fix` หรือ delegate `/update-docs`
- ทุก finding มี evidence ทั้งสองฝั่ง: doc line + source line ที่ต่างกัน
- verified-wrong command = High; style freshness = Low

## Expected Outcome

- Drift findings แยก stale-vs-code / missing / dead docs
- Evidence pairs (doc vs source) ต่อ finding

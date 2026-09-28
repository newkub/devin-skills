---
name: review-quality-check-debt
description: Check tech debt — TODOs, deprecated usage, workarounds, stale deps, debt inventory
argument-hint: "[scope]"
related:
  - review-quality
  - check-deprecated-apis
  - review-dependencies
  - use-astgrep
  - report
---

## Goal

Run the tech-debt dimension of `/review-quality` แบบ focused — inventory หนี้ที่มีอยู่จริงพร้อม interest rate

## Scope

- ใช้เมื่อ `/review-quality` dispatch มาที่ `debt`/`tech-debt` หรือเรียก standalone
- ครอบคลุม: TODO/FIXME/HACK markers, deprecated API usage, workaround comments, dead config, stale patterns

## Execute

### 1. Debt Inventory

> Goal: debt list ที่ action ได้ — parent Execute §6

ทำตาม `../../references/tech-debt.md`

1. markers — TODO/FIXME/HACK/XXX พร้อม age (git blame) + owner ถ้ามี
2. deprecated usage — APIs/deps ที่ถูก deprecate (`/check-deprecated-apis`)
3. workarounds — monkey patches, temporary flags, `// eslint-disable` ที่ค้าง
4. stale patterns — old patterns ที่ codebase เลิกใช้แล้วแต่ยังหลงเหลือ

### 2. Classify Interest

> Goal: debt ไหนแพงเมื่อปล่อย

1. high-interest — debt บน hot path/critical flow, blocking upgrades
2. low-interest — cosmetic debt, isolated ไม่ spread
3. compound — debt ที่คน copy pattern ต่อ (bad example)

### 3. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Location`, `Type`, `Age`, `Interest`, `Severity`, `Fix`

## Rules

- Review เท่านั้น — fix ใน parent `## Fix`; dep-level debt → `/review-dependencies`
- ทุก finding มี location + evidence; marker ต้องมี age จาก git history
- ไม่นับ TODO ที่เป็น legit roadmap notes เป็น debt

## Expected Outcome

- Debt inventory พร้อม type/age/interest classification
- Compound-risk items flagged (patterns being copied)

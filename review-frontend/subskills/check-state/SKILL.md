---
name: review-frontend-check-state
description: Check state management — store boundaries, derived state, prop drilling, server state
argument-hint: "[scope]"
related:
  - review-frontend
  - use-astgrep
  - report
---

## Goal

Run the state management dimension of `/review-frontend` แบบ focused — state อยู่ถูกที่ ไม่ duplicate ไม่ stale

## Scope

- ใช้เมื่อ `/review-frontend` dispatch มาที่ `state`/`hooks` หรือเรียก standalone
- ครอบคลุม: local vs global vs server state, derived state, prop drilling, hook patterns, store design

## Execute

### 1. State Checks

> Goal: state architecture สะอาด

ทำตาม `../../references/state-management.md` + `../../references/hooks-composables.md`

1. state placement — server state ใน query cache ไม่ใช่ store, UI state local ก่อน global
2. derived state — computed จาก source ไม่ duplicate sync ด้วย effects
3. prop drilling — chains >2 levels ที่ควร composition/context/store
4. hooks — rules of hooks violations, dependency arrays ผิด, stale closures

### 2. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Component/Store`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น — fix ใน parent `## Fix` หรือ `../improve-rendering/SKILL.md` เมื่อเป็น perf
- ทุก finding มี file path + line
- ห้าม flag จาก style preference — finding ต้องมี correctness/perf consequence

## Expected Outcome

- State findings แยก placement/derived/drilling/hooks
- Evidence ต่อ finding พร้อม fix direction

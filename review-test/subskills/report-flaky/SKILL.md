---
name: review-test-report-flaky
description: สร้าง flaky test report — inventory, quarantine candidates, root-cause patterns
argument-hint: "[scope]"
related:
  - review-test
  - review-test
  - report
  - create-report-in-dot-devin
---

## Goal

แปลง flaky findings ของ `/review-test`/`/review-test` เป็น report — flaky inventory + quarantine recommendations + root-cause patterns

## Scope

- ใช้เมื่อ `/review-test` dispatch มาที่ `flaky`/`report-flaky` หรือเรียก standalone
- Output: ตารางในแชท หรือ persistent artifact ผ่าน `/create-report-in-dot-devin`

## Execute

### 1. Inventory Flaky Tests

> Goal: list จาก history จริงไม่ใช่ code smell เดา

ทำตาม `../../subagents/test-reviewer/analyze-coverage-flaky.md`

1. flaky tests จาก CI retry history, `@flaky` markers, retry config, failure patterns
2. `No.`, `Test`, `Flake Rate`, `First Seen`, `Last Seen`, `Evidence` — real run data
3. ถ้าไม่มี history → ใช้ code patterns (timeouts, `waitFor` missing, shared state) แต่ tag `suspected`

### 2. Root-Cause Patterns

> Goal: group flakes ตาม root cause เพื่อ fix เป็นกลุ่ม

1. timing — `sleep`/`waitFor` races, animation/timing dependent
2. isolation — shared state, leftover data, test order dependency
3. external — real network/db/time-dependent behavior
4. concurrency — race conditions ใน test หรือ code ทดสอบ

### 3. Quarantine Recommendations

> Goal: quarantine list + fix priorities

1. quarantine candidates — flakes ที่ frequent + low-value regression signal
2. fix-first list — high-value coverage ที่ flake บ่อย
3. fix route → `../improve-coverage/SKILL.md` (flaky fixes) หรือ parent `## Fix`

## Rules

- flaky inventory จาก run history เท่านั้น — code smell ให้ tag `suspected` แยก
- quarantine = mitigation ไม่ใช่ fix — ทุก quarantined test ต้องมี root-cause issue link
- artifact อยู่ใน `.devin/` เท่านั้น

## Expected Outcome

- Flaky inventory พร้อม rates + root-cause grouping
- Quarantine + fix-first lists พร้อม evidence

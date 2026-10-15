---
name: review-issues
description: Review a scope for issues — wrong or broken behavior proven from the source — with evidence, then fix after confirm
argument-hint: "[scope-or-area]"
related:
  - review
  - review-gaps
  - deep-review-codebase
  - deep-review-codebase-then-fix
  - report-review
  - create-plan-in-dot-devin
  - refactor
  - ask-me
  - suggest-next-action
  - deep-thinking
  - deep-analyze
  - deep-validate
---

## Goal

Review one dimension only: `issues` — behavior that is provably wrong in the scope (broken action, wrong guard, silent failure, logic/type error, leak, race). Every finding must be proven from the source with `file:line` evidence, then fixed after user confirmation. Complements `/review-gaps` (what should exist but doesn't) and is folded into `/review` for a general pass.

## Scope

- Use when the user asks specifically what is wrong/broken in an area, or from `/review` `### 2` as the issues dimension
- Not missing-capability hunting (→ `/review-gaps`), not a full multi-dimension codebase scan (→ `/deep-review-codebase`), not debugging one known failure (→ `/deep-debug`)
- If the user appends `and fix` → treat as confirmed; fix every finding without asking again (still report before fixing)

## Execute

### 1. Deep Pre-Pass And Scope

> Goal: know the surface before judging its behavior

1. Start with the deep pre-pass: `/deep-thinking` → `/deep-analyze` → `/deep-validate` (convention: `update-devin-global-skills` `## Conventions → Templates` row `review-*`)
2. Take `scope` from the argument — if missing or unclear → `/ask-me`
3. Enumerate the scope's real surface — entry points, routes/handlers, guards, services, stores, components, config, tests — so nothing is judged from a partial view

### 2. Hunt Issues

> Goal: only provably wrong behavior becomes a finding

Check the surface against this issue catalog:

| No. | Issue class | What proves it |
|-----|-------------|----------------|
| 1 | Dead / broken action | Handler, link, route, or button target does not exist or cannot succeed |
| 2 | Wrong guard or check | Condition permits what it should block (or blocks what it should allow) — authz, ownership, state, validation |
| 3 | Silent failure | Error path is swallowed: empty `catch`, ignored rejection, no user-visible feedback |
| 4 | Logic / type error | Branch, comparison, unit, or type contradicts the contract it implements |
| 5 | Async misuse | Missing `await`, unhandled rejection, sequential calls that must be parallel, stale read after write |
| 6 | Resource / memory leak | Subscription, listener, timer, or handle not released on unmount or early return |
| 7 | Race / ordering | Shared state mutated without ordering or idempotency guard |
| 8 | Contract mismatch | Caller and callee disagree on params, defaults, nullability, or error shape |
| 9 | Stale state / cache | Cache or store read where the write invalidates nothing, or key derived from mutable input |
| 10 | Config drift | Code reads a flag/env/path that the config file never defines, or defines one nothing reads |

- Read real code for every claim — never infer from file names or docs alone
- Use `/run-check` (lint, typecheck) and the analyzer output as corroborating evidence, not as the only source
- Intentional demo/mock/stub behavior is not an issue unless the surface pretends it really works

### 3. Evidence, Severity, Report

> Goal: a prioritized, traceable finding list

1. Attach `file:line` + the provable reason to every finding — no evidence, no finding; state uncertainty instead of guessing
2. Classify severity: `Critical` (data loss, security, outage) → `High` (wrong user-visible behavior) → `Medium` (edge case, degradation) → `Low` (noise, maintainability)
3. Produce a `/report-review` table (chat, no files): `No.`, `Area`, `Issue Class`, `Finding`, `Severity`, `Evidence`, `Fix Skill` — ordered Critical first

### 4. Confirm And Fix

> Goal: fix only what was confirmed, correctly

1. If the user did not append `and fix` → ask which items to fix and wait
2. Route each confirmed finding to `/deep-review-codebase-then-fix` by matching domain; unmappable findings are fixed directly from the evidence
3. Behavior-preserving rule: fix the cause, never suppress the symptom (no ignore comments, no widened types, no try/catch that hides)
4. Structural additions → `/create-plan-in-dot-devin` before implementing
5. After fixes → `/refactor` (SRP split) on touched files (≤250 lines, 1 responsibility), then build/lint/test → `/suggest-next-action`

## Rules

### 1. Evidence-Based
- Every finding cites `file:line` and the mechanism that makes it wrong
- Reproduce logically before claiming: state the input that triggers it
- Don't modify files during `### 2`–`### 3` — report first

### 2. One Dimension
- `/review-issues` reports only wrong behavior; anything "missing" goes to `/review-gaps`, anything "done differently in siblings" goes to `/review` `### 2`
- Don't invoke `/review` from inside this skill (it would re-enter the same pass)

### 3. Confirmation And Formatting
- Don't fix without confirmation unless the user puts `and fix` in the command
- Never use `*` bold markers — use backticks for emphasis; every report table starts with a `No.` column

## Expected Outcome

- Every issue in scope is found with class, severity, and `file:line` evidence
- A prioritized `/report-review` table is presented and the fix set is confirmed
- Confirmed issues are fixed at the cause, re-verified by build/lint/test, and touched files keep one responsibility

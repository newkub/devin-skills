---
name: review
description: General review of a named scope — find issues, gaps, and inconsistencies with evidence, then fix after confirm
argument-hint: "[scope-or-area]"
related:
  - review-issues
  - review-gaps
  - deep-review-codebase
  - deep-review-codebase-then-fix
  - follow-parallel
  - report-review
  - create-plan-in-dot-devin
  - refactor
  - improve
  - ask-me
  - suggest-next-action
  - deep-thinking
  - deep-analyze
  - deep-validate
---

## Goal

Review anything the user points at (code, docs, a feature area, a plan, a config) across three dimensions — `issues` (wrong or broken behavior), `gaps` (what should exist but doesn't), and `inconsistencies` (the same thing done differently in different places) — each backed by real evidence, then fix the confirmed items. The two catalogued dimensions are delegated to their own skills, `/review-issues` and `/review-gaps`; `/review` owns scoping, the inconsistency pass, aggregation, and the fix handoff.

## Scope

- Use when the user wants a review of a specific scope/area — a feature, module, flow, doc, or set of files
- When only one dimension matters, call the dimension skill directly: `/review-issues` for what is wrong, `/review-gaps` for what is missing
- For a full codebase-wide multi-dimension scan, hand the heavy lifting to `/deep-review-codebase`, then bring its findings back through `### 2`
- Not feature ideation (→ `/idea-features`) and not pure dependency health (→ `/run-bench-deps`)
- If the user appends `and fix` → treat as confirmed; fix every finding without asking again (still report before fixing)

## Execute

### 1. Deep Pre-Pass And Scope

> Goal: know exactly what is being reviewed before judging it

1. Start with the deep pre-pass: `/deep-thinking` → `/deep-analyze` → `/deep-validate` (convention: `update-devin-global-skills` `## Conventions → Templates` row `review-*`)
2. Take `scope` from the argument — if missing or unclear → `/ask-me`
3. Survey the surface of the scope — related files, routes, guards, components, stores, docs, tests — so hidden spots are not missed
4. If the scope is codebase-wide or multi-dimension → run `/deep-review-codebase` on it and use its findings as the input to `### 2`

### 2. Run The Dimensions

> Goal: every dimension covered, each finding backed by real evidence

1. Issues → run `/review-issues` on the same `scope` (dead action, wrong guard, silent failure, logic/type error, async misuse, leak, race, contract mismatch, stale state, config drift)
2. Gaps → run `/review-gaps` on the same `scope` (promised-but-absent, partial, stub left in place, unwired, declared-but-unused, missing states, dead integration, doc drift, test gap, a11y gap)
3. The two are independent → run them in parallel through `/follow-parallel`; pass the same `scope` plus any `/deep-review-codebase` findings from `### 1` into both
4. Inconsistencies → review here: the same flow done differently across siblings (one side validates while the other doesn't, naming/structure drift), because this dimension needs both sides in view at once

- Every finding must have `file:line` evidence — no evidence, no finding; state uncertainty instead of guessing
- Never count an intentional mock/stub/demo as a finding unless the surface promises it really works
- Use the code-quality checkers (`/run-check`, `/check-long-files`) as evidence sources when reviewing code

### 3. Present And Confirm

> Goal: a prioritized report before any fix

1. Merge the findings from `/review-issues`, `/review-gaps`, and the `### 2` inconsistency pass into one deduplicated list, ordered by severity — Critical/High first
2. Produce a `/report-review` table (chat, no files): `No.`, `Area`, `Type` (issue|gap|inconsistency), `Finding`, `Severity`, `Evidence`, `Fix Skill`
3. If the user did not append `and fix` → ask which items to fix and wait for confirmation

### 4. Fix Confirmed Items

> Goal: fix only what was confirmed, correctly

1. Route each confirmed finding to `/deep-review-codebase-then-fix` by matching domain; findings with no matching domain are fixed directly from the evidence
2. Issue findings → fix at the cause (never suppress the symptom); gap findings → fill through the `/review-gaps` path so no new stub or `TODO` is left behind
3. A finding that turns into a scoped improvement program rather than a single fix → hand it to `/improve <scope>`
4. Large additions → always `/create-plan-in-dot-devin` before implementing; never skip
5. After all fixes → run `/refactor` (step 2, SRP split) on the touched files (≤250 lines, 1 responsibility)
6. Run the project build/lint/test to verify → `/suggest-next-action`

## Rules

### 1. Evidence-Based
- Every finding must have `file:line` or a concrete reference — never conclude without evidence
- Don't modify or implement during the review — report first, fix only what is confirmed

### 2. General Review With Dimension Skills
- `/review` owns scoping, the inconsistency dimension, aggregation, and the fix handoff
- `/review-issues` and `/review-gaps` own their own catalogs — never restate those catalogs here
- `/deep-review-codebase` is a heavy tool it may invoke for wide scans — not the skill's identity
- Don't nest `/review` with other routers; if `/review` is already running, don't invoke it again; the dimension skills must not call back into `/review`

### 3. Confirmation
- Don't fix without confirmation — unless the user puts `and fix` in the command
- Every confirmed addition → `/create-plan-in-dot-devin` before implementing

### 4. Formatting
- Never use `*` bold markers — use backticks for emphasis
- Use heading levels for structure
- Final findings as a table via `/report-review` (chat, no files), `No.` as the first column

- Use /review-issues if needed
- Use /review-gaps if needed
- Use /follow-parallel if needed
- Use /deep-review-codebase if needed
- Use /deep-review-codebase-then-fix if needed

## Expected Outcome

- The scope is reviewed across `issues` (via `/review-issues`), `gaps` (via `/review-gaps`), and inconsistencies (here) with complete type, severity, and evidence
- A prioritized `/report-review` table is presented and the fix set is confirmed by the user
- Confirmed findings are fixed + verified via build/lint, with SRP respected on touched files

---
name: review
description: General review of a scope — issues, gaps, inconsistencies with evidence, then fix
argument-hint: "[scope-or-area]"
related:
  - review-issues
  - review-gaps
  - deep-review
  - update-astgrep-rules
  - update-devin-project-rules
  - follow-parallel
  - report-review
  - create-plan-in-dot-devin
  - refactor
  - improve
  - ask-me
  - use-subagents
  - deep-thinking
  - deep-analyze
  - deep-validate
---

## Goal

Review anything the user points at (code, docs, a feature area, a plan, a config) across three dimensions — `issues` (wrong or broken behavior), `gaps` (what should exist but doesn't), and `inconsistencies` (the same thing done differently in different places) — each backed by real evidence, then fix the confirmed items. The two catalogued dimensions are delegated to their own skills, `/review-issues` and `/review-gaps`; `/review` owns scoping, the inconsistency pass, aggregation, and the fix handoff.

## Scope

- Use when the user wants a review of a specific scope/area — a feature, module, flow, doc, or set of files
- When only one dimension matters, call the dimension skill directly: `/review-issues` for what is wrong, `/review-gaps` for what is missing
- For a full codebase-wide multi-dimension scan, hand the heavy lifting to `/deep-review`, then bring its findings back through `### 2`
- Not feature ideation (→ `/idea-features`) and not pure dependency health (→ `/run-bench-deps`)
- If the user appends `and fix` → treat as confirmed; fix every finding without asking again (still report before fixing)

## Execute

### 1. Deep Pre-Pass And Scope

> Goal: know exactly what is being reviewed before judging it

1. Start with the deep pre-pass: `/deep-thinking` → `/deep-analyze` → `/deep-validate` (convention: `update-devin-global-skills` `## Conventions → Templates` row `review-*`)
2. Take `scope` from the argument — if missing or unclear → `/ask-me`
3. Survey the surface of the scope — related files, routes, guards, components, stores, docs, tests — so hidden spots are not missed
4. If the scope is codebase-wide or multi-dimension → run `/deep-review` on it and use its findings as the input to `### 2`

### 2. Run The Dimensions

> Goal: every dimension covered, each finding backed by real evidence

1. Issues → run `/review-issues` on the same `scope` (dead action, wrong guard, silent failure, logic/type error, async misuse, leak, race, contract mismatch, stale state, config drift)
2. Gaps → run `/review-gaps` on the same `scope` (promised-but-absent, partial, stub left in place, unwired, declared-but-unused, missing states, dead integration, doc drift, test gap, a11y gap)
3. The two are independent → run them in parallel through `/follow-parallel`; pass the same `scope` plus any `/deep-review` findings from `### 1` into both
4. Inconsistencies → review here: the same flow done differently across siblings (one side validates while the other doesn't, naming/structure drift), because this dimension needs both sides in view at once

- Every finding must have `file:line` evidence — no evidence, no finding; state uncertainty instead of guessing
- Never count an intentional mock/stub/demo as a finding unless the surface promises it really works
- Use the code-quality checkers (`/run-check`, `/check-long-files`) as evidence sources when reviewing code

### 3. Present And Confirm

> Goal: a prioritized report before any fix

1. Merge the findings from `/review-issues`, `/review-gaps`, and the `### 2` inconsistency pass into one deduplicated list, ordered by severity — Critical/High first
2. Score the merged set: Critical 0, High 25, Medium 50, Low 75, Info 100 → weighted average; grade A ≥90, B ≥80, C ≥70, D ≥60, F <60 — the summary line carries it
3. Produce a `/report-review` table (chat, no files) with its canonical columns, plus this dimension's extras: `Area`, `Type` (issue|gap|inconsistency) — the owner column is `Owner skill`
4. If the user did not append `and fix` → ask which items to fix and wait for confirmation

### 4. Fix Confirmed Items

> Goal: fix only what was confirmed, correctly

1. Route each confirmed finding to `/deep-review <scope> then-fix fix all` by matching domain (`fix all` because `and fix` already confirmed them); findings with no matching domain are fixed directly from the evidence
2. Issue findings → fix at the cause (never suppress the symptom); gap findings → fill through the `/review-gaps` path so no new stub or `TODO` is left behind
3. A finding that turns into a scoped improvement program rather than a single fix → hand it to `/improve <scope>`
4. Large additions → always `/create-plan-in-dot-devin` before implementing; never skip
5. After all fixes → run `/refactor` (step 2, SRP split) on the touched files (≤250 lines, 1 responsibility)
6. Persist durable findings so the next review catches them instead of re-reporting them: patterns, imports, and API misuse → `/update-astgrep-rules`; conventions and agent guidance → `/update-devin-project-rules`; routing follows `deep-review-codebase-everything` `### 5. Persist`. Confirm every new rule fires on the original `file:line`
7. Run the project build/lint/test to verify → `/suggest-next-action`

## Rules

### 1. Evidence-Based
- Every finding must have `file:line` or a concrete reference — never conclude without evidence
- Don't modify or implement during the review — report first, fix only what is confirmed

### 2. General Review With Dimension Skills
- `/review` owns scoping, the inconsistency dimension, aggregation, and the fix handoff
- `/review-issues` and `/review-gaps` own their own catalogs — never restate those catalogs here
- `/deep-review` is a heavy tool it may invoke for wide scans — not the skill's identity
- `/use-subagents` when the areas are independent — one subagent per area, no overlapping files
- Don't nest `/review` with other routers; if `/review` is already running, don't invoke it again; the dimension skills must not call back into `/review`

### 3. Confirmation
- Don't fix without confirmation — unless the user puts `and fix` in the command
- Every confirmed addition → `/create-plan-in-dot-devin` before implementing

### 4. Formatting
- Never use `**` bold markers — use backticks for emphasis
- Use heading levels for structure
- Final findings as a table via `/report-review` (chat, no files), `No.` as the first column

## Expected Outcome

- The scope is reviewed across `issues` (via `/review-issues`), `gaps` (via `/review-gaps`), and inconsistencies (here) with complete type, severity, and evidence
- A scored, severity-ordered `/report-review` table is presented and the fix set is confirmed by the user
- Confirmed findings are fixed + verified via build/lint, with SRP respected on touched files
- Durable findings are persisted as ast-grep rules or `.devin/rules` conventions, each proven on its original `file:line`

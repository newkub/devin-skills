---
name: simplify
description: Simplify code or docs, review writing quality, and guard against over-engineering
argument-hint: "[code|docs|review|guard] [@files... | dir]"
related:
  - refactor
  - improve
  - deep-review
  - report-review
  - report
  - update-agents-skills-global
  - check-long-files
  - suggest-next-action
  - write-explicit
  - deep-debug
---

## Goal

Make code, docs, and instructions shorter, clearer, and correctly sized — identical behavior, 1:1 meaning — and stop unnecessary complexity before it is written.

## Scope

Four modes over one target: `code` (default), `docs`, `review` (writing quality), `guard` (minimal change / YAGNI).

Applies to source files, docs, `SKILL.md`, prompts, rules, reports, and commit/PR text.

Boundary: restructuring, splitting files, or moving code across boundaries → `/refactor`; multi-dimension audit beyond writing → `/deep-review`; skill-package conventions → `/update-agents-skills-global refactor`; USAGE.md docs-vs-reality → `/improve usage-md`; instruction detail only → `/write-explicit`.

## Execute

### 1. Pick Mode And Targets

> Goal: know what is being simplified and which contract applies

| No. | Mode | Target | Contract |
|-----|------|--------|----------|
| 1 | `code` (default) | source files/dirs | 6 code patterns; minimal diff; identical behavior |
| 2 | `docs` | docs, `SKILL.md`, prose | condense verbosity; merge near-duplicates |
| 3 | `review` | any written artifact | 7 writing criteria per `references/writing-quality.md`; evidence-only; then fix |
| 4 | `guard` | a change plan or diff | minimal-change and YAGNI rules; run before or during the change |

1. Mode = first argument matching a mode name; no match → `code`; targets = remaining `@files...`/dir — no target → `/check-long-files` worst offenders or `/ask-me`
2. `review` → record the reader and purpose (follow steps / understand / act) — they calibrate every criterion
3. `guard` runs before or during a change, never after the fact as cleanup

### 2. Detect Opportunities

> Goal: every simplification has evidence

| No. | Pattern | Fix |
|-----|---------|-----|
| 1 | Duplicated blocks/branches | Extract once or collapse to a shared path |
| 2 | Verbose conditionals / unnecessary nesting (code blocks, never directory trees) | Guard clauses, early returns, ternaries |
| 3 | Dead code, unused vars/imports | Delete |
| 4 | Single-use variables / over-abstraction | Inline |
| 5 | Redundant comments / repeated prose | Remove what the code already says |
| 6 | Verbose docs sections | Condense to tables/lists; merge near-duplicate items |

`guard` contract — apply before writing:

| No. | Rule | Check |
|-----|------|-------|
| 1 | Minimal change | Single-line change when possible; never refactor the codebase for one small problem |
| 2 | Root cause first | Cause unclear → `/deep-debug`; no symptom patches, no guessed fixes |
| 3 | Simple solution | YAGNI — no generic solution for a specific problem, no unused abstraction, no unnecessary dependency |
| 4 | Verify impact | Problem fixed, no side effects, added code removed — before claiming done |

### 3. Apply

> Goal: smallest diff that holds the contract

1. `code`/`docs` — smallest change per pattern; public API, semantics, and behavior unchanged; never compress into cryptic one-liners
2. `review` — fix every finding in context per `references/writing-quality.md`; keep every number, command, name, link, and claim identical
3. `guard` — an abstraction, dependency, or file with no current consumer → stop and reduce to the simplest working form
4. Checkpoint per file before moving to the next

### 4. Validate

> Goal: behavior and meaning proven identical

1. `code` → `/run-check` (lint/typecheck)
2. `docs` → re-read for preserved meaning
3. `review` → all 7 criteria pass; max 3 rounds per finding
4. `guard` → verify the actual change: problem fixed, no side effects

### 5. Report

> Goal: measurable result

1. `/report` table: No. | Mode | File | Before | After | Change — real counts, never estimated
2. `review` findings → one `/report-review` table
3. `/suggest-next-action`

## Rules

| No. | Group | Rule |
|-----|-------|------|
| 1 | Preserve behavior | No semantic changes — Two Hats; simplification is a refactor, not a rewrite |
| 2 | Minimal diff | Touch only what the detected pattern requires — no drive-by edits |
| 3 | Readability first | Shorter only when clearer — never trade clarity for line count |
| 4 | Boundary | Splitting files or moving code across boundaries → `/refactor`, not this skill |
| 5 | Evidence | Report measured before/after counts — never claim a reduction without measuring |
| 6 | Guard | No abstraction, dependency, or file without a current consumer; root cause before fix |
| 7 | Review | Every writing finding quotes the offending text with `file:line`; no evidence, no finding; never inject facts, steps, or style preferences |

## Expected Outcome

- Code and docs measurably shorter and clearer — same behavior, same public API, same meaning
- Review targets pass all 7 writing criteria with evidence per finding
- Guarded changes are the smallest working form — no over-engineering, no unnecessary abstractions
- Before/after report with per-file line counts

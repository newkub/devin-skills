---
name: run-review
description: Run the review CLI, analyze its metrics, route findings to review-* skills, then report
argument-hint: "[scope]"
related:
  - update-review-cli
  - deep-review
  - report-review
  - update-create-analyze-cli
  - resolve-errors
  - run-verify
  - follow-tasks
  - suggest-next-action
---

## Goal

Run the deterministic review CLI once, analyze the metrics it produces, route every finding to its `review-*` owner, and report — the run path that `update-review-cli` builds the analyzer for and `deep-review` slices per dimension

## Scope

Use when a project needs a measured quality gate — the review CLI exists (or is one update round away) and the job is to run, read, and act on `review-report.json`, not to build the analyzer

- the update path (build/fix the CLI, its analyzers, and rule packs) belongs to `/update-review-cli`; this skill delegates to it and never edits analyzer code itself
- the per-dimension deep pass belongs to `/deep-review` — pass the CLI's findings in as evidence instead of re-deriving them
- one full scan per run; rounds 2+ reuse `--domain`/`--severity` slices instead of rescanning everything

## Execute

> Pre-Run: Always run `/deep-review` first — `run-*` requires review/assessment before the main action, never skip; if findings are blockers, fix or report them before running (review)

### 1. Locate And Validate The CLI

> Goal: Prove the analyzer is present and runnable before spending a scan

1. Detect the engine: `tools/review-codebase` in the current workspace, root scripts `review-codebase`/`review-codebase:json`, or the Rust `linter` CLI at `D:\newkub\wpackages\rust-packages\packages\tools\linter`
2. Run `--help` and one table run — missing, broken, or erroring → `/update-review-cli` first, then return here
3. Read `update-review-cli/references/known-issues.md` for open analyzer gaps so a known miss is not re-reported as a new finding

### 2. Run The Scan Once

> Goal: One deterministic scan, written into the reviewed workspace

1. Run the table output for humans and `review-codebase:json` for `reports/review-report.json` inside the reviewed workspace (never a root-level `reports/`)
2. One workspace at a time; a monorepo keeps one report per workspace
3. Record `score`, `grade`, domain breakdown, `categories N/60`, findings count, `analyzerErrors`, `falsePositiveRate`, and the delta against the previous report when a baseline exists
4. Validate the report shape before reading it further — `evidence` (`file:line`) and `severity` on every finding; a malformed report → `/update-review-cli`

### 3. Analyze Against The Metric Triggers

> Goal: Decide whether the CLI is good enough to trust this run

1. Check every trigger: `categories < 60`, overall `score < 70` or grade `D`/`F`, any domain `score < 50`, `analyzerErrors > 0`, `falsePositiveRate > 20%`, `reviewWorkflow` not covering the `review-*` labels resolvable through the `Aliases` column of `deep-review/references/dimension-matrix.md`
2. `analyzerErrors > 0` → `/resolve-errors` first; analyzer logic wrong or missing → `/update-create-analyze-cli`
3. A trigger that needs code changes → `/update-review-cli`, then rerun only the failing slice with `--domain`/`--severity` — max 3 rounds
4. Still failing after 3 rounds → stop, report the metric table and the reason, and hand the gap to `/update-review-cli`

### 4. Route Findings To Review Skills

> Goal: Every finding reaches its owner without remapping by hand

1. Group Critical/High findings per the CLI `reviewWorkflow` map (the `review-*` skill each category belongs to)
2. A category with no mapping → mark it an analyzer gap for `/update-review-cli`; never invent a `review-*` name
3. Hand the evidence-backed set to `/deep-review <scope>` when the fix needs review-grade analysis, or straight to the `review-*` skill when the finding is already actionable
4. Fixing is never implicit — a fix round runs through `/deep-review <scope> then-fix` after the user confirms

### 5. Verify The Project State

> Goal: Confirm the review run did not leave the project unverifiable

1. Run `/run-verify` for build, lint, and typecheck
2. Failures → `/resolve-errors`, then rerun Step 2 only if the report itself is affected
3. Run `/follow-tasks` to record the remaining analyzer gaps and unowned findings as tracked items

### 6. Report And Suggest

> Goal: One chat report, then the next action

1. Report via `/report-review`: domain scores, severity distribution, coverage (`categories N/60`), analyzer errors, false-positive rate, and the delta against the baseline
2. Include the routed `review-*` skill per finding, and the measured before/after when this run followed an `/update-review-cli` round
3. Close with `/suggest-next-action` — `/deep-review <scope> then-fix` for the confirmed set, or `/update-review-cli` when a metric trigger is still open

## Rules

### 1. Run, Don't Rebuild

- This skill runs the analyzer, analyzes its output, and reports — any change to the CLI, analyzers, or rule packs goes through `/update-review-cli`
- Never duplicate analyzer logic in a script, review skill, or this file

### 2. One Scan Per Run

- A full scan happens once; rounds 2+ use `--domain`/`--severity` slices or `--diff`
- Never rerun the scan just to refresh a number that already exists in the report

### 3. Evidence Only

- Every reported finding carries `file:line` and a severity from the CLI — no severity by intuition
- A finding without evidence is a CLI bug, not a review result

### 4. Write Location

- The report lives in the reviewed workspace at `reports/review-report.json`
- Never create or write a root-level `reports/` directory

### 5. Formatting

- Never use `**` (bold markers)
- Report as chat tables via `/report-review` — no report files unless the user asks
- Use `/deep-test` cli when the CLI itself needs test coverage

## Expected Outcome

- One full scan run and read: score, grade, domain breakdown, category coverage, analyzer errors, false-positive rate, and baseline delta
- Metric triggers either cleared within 3 rounds or reported with the exact gap handed to `/update-review-cli`
- Every Critical/High finding routed to a real `review-*` skill through the CLI `reviewWorkflow` map
- Project state verified with `/run-verify`, remaining work tracked with `/follow-tasks`
- One chat report via `/report-review` followed by `/suggest-next-action`

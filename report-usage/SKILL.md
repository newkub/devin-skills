---
name: report-usage
description: Report usage of APIs/functions/skills/dependencies, USAGE.md, or Devin session/cost
argument-hint: "[scope]"
related:
  - report-file-structure
  - report
  - suggest-next-action

---

## Goal

Build a usage report per the specified scope: APIs/functions/skills/dependencies, `USAGE.md` coverage, or Devin session/cost

## Scope

Use for one of three cases:
- Analyze frequency, consumers, and top callers of code APIs/functions/skills/dependencies
- Check `USAGE.md` for complete sections and compare against `README.md`/`package.json`
- Summarize Devin session usage/cost by period or billing tags

## Execute

### 1. Choose Scope

> Goal: Identify the usage type to report

1. Ask the user or detect from the request
2. Pick the scope:
   - `code` — APIs, functions, classes, skills, dependencies
   - `usage-md` — the `USAGE.md` file in the project
   - `devin` — Devin sessions and cost
3. If unclear → run `/ask-me`

### 2. Code Usage

> Goal: Analyze code usage

1. Identify targets: endpoints, functions, classes, skills, or dependencies
2. Find call sites/imports with `grep` or `glob`
3. Identify the files/workspaces using them, versions, signatures
4. Run `/report` summarizing top consumers, frequency, versions
5. Run `/report-file-structure` for the caller tree if useful
6. Identify unused, overused, and deprecated usages

### 3. USAGE.md Coverage

> Goal: Inspect and summarize `USAGE.md`

1. Find `USAGE.md`, `docs/USAGE.md`, `.github/USAGE.md`, or `docs/`
2. If absent → record `missing` with the path
3. If present → read and identify sections: Installation, Quick Start, Usage, Examples, Configuration, CLI, API, Troubleshooting
4. Compare against `README.md` and `package.json` scripts/bin
5. Run `/report` summarizing Section, Status, Evidence

### 4. Devin Session Usage

> Goal: Summarize session usage and cost

1. Use `devin_session_search` or `/list-devin-session` to pull sessions by period/tag
2. Use `devin_billing_tag_manage` to pull billing tags if present
3. Compute sessions per day/week, and the success/failure/stopped distribution
4. Identify tag breakdowns, recurring task patterns, long-running sessions
5. Run `/report` summarizing Period/Tag, Sessions, Success %, Top Task Type, Note
6. Identify automation candidates and waste signals

### 5. Report And Next Action

> Goal: Summarize the result

1. Run `/report` per the chosen scope
2. Summarize key findings, unused/deprecated items, gaps
3. Recommend the suitable next action
4. Run `/suggest-next-action`

## Rules

### 1. Read Only

- Do not modify code, sessions, or billing config
- Do not expose sensitive data

### 2. Evidence Based

- Every metric must have a source: file path, line number, or API response
- State the counting method clearly

### 3. Actionable

- Identify unused, deprecated, and overused usages
- Identify gaps in `USAGE.md`
- Identify automation candidates from Devin usage
- Recommend clear next actions

- Final report via `/report-review` — one chat table (No./Action/Evidence/Severity/Risk/Priority/Owner skill/Status), no report files

## Expected Outcome

- Usage table with frequency and consumers
- `USAGE.md` status: exists/missing, sections present/absent
- Devin usage report by period/tags
- unused/deprecated usages or automation candidates
- Summary and next actions

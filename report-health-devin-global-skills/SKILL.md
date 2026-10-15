---
name: report-health-devin-global-skills
description: Build a health scorecard of the devin global skills repo
argument-hint: "[path]"
related:
  - review-devin-global-harness
  - check-uncommit
  - check-unpush
  - check-git-logs
  - report
  - report-progress
  - suggest-next-action
  - apply
---

## Goal

Build a health scorecard of the devin global skills repository — combining signals from validation, references, git state, and structure

## Scope

Use with `%APPDATA%\devin\skills` or a specified path

- Run `/review-devin-global-harness` to see score, findings, grade
- Run `/review-devin-global-harness` to check broken references
- Check git state: uncommit, unpush, last commit
- Summarize into a single table with a grade

## Execute

### 1. Collect Signals

> Goal: Collect the health signals of the skills repo

1. Run `/review-devin-global-harness`, record `score`, `findings`, `grade`
2. Run `/review-devin-global-harness`, record the broken refs count
3. Run `/check-uncommit`, record modified/untracked files
4. Run `/check-unpush`, record unpushed commits
5. Run `/check-git-logs`, record last commit, frequency, staleness
6. Check skills over 250 lines with a line count scan

### 2. Score Dimensions

> Goal: Score each dimension

| Dimension | Weight | Signal |
|---|---|---|
| Validation | 30% | review score / findings |
| References | 25% | broken refs count |
| Git Clean | 20% | uncommit / unpush status |
| Activity | 15% | last commit, staleness |
| Structure | 10% | line count, naming conventions |

Score 0-100 per dimension → overall grade A-F

### 3. Report Scorecard

> Goal: Summarize the result as a table

1. Run `/report table` with columns: `No.`, `Dimension`, `Score`, `Weight`, `Status`, `Notes`
2. Use status symbols: `✅ pass`, `⚠️ warning`, `❌ fail`, `ℹ️ info`
3. Show the overall grade
4. Identify the top issues dragging the score down
5. If there are multiple repos/rounds, run `/report-progress`

### 4. Recommend

> Goal: Recommend the next actions

1. If grade < B → recommend fixing findings first with `/resolve-errors`
2. If there are broken refs → recommend `/update-references`
3. If there are uncommitted changes → recommend `/git-commit`
4. If there are unpushed commits → recommend `/git-push`
5. If multiple fixes must be applied safely → recommend `/apply` mode `validate`
6. Run `/suggest-next-action`

## Rules

### 1. Evidence-Based

- Every score must come from real tools
- Do not score on assumptions

### 2. Read-Only

- Do not edit files — report only
- Do not commit/push automatically

### 3. Fast

- Do not run overly heavy checks
- Use cache if available

- Final report via `/report-review` — one chat table (No./Action/Evidence/Severity/Risk/Priority/Owner skill/Status), no report files

## Expected Outcome

- Health scorecard of the devin skills repo
- Grade with top issues
- Recommended next actions

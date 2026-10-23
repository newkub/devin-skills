---
name: deep-validate-report-findings
description: Combine findings from all dimensions into one severity matrix — shared report for check-* workflows
argument-hint: "[scope]"
related:
  - report
  - suggest-next-action
  - create-report-to-dot-agents
---

## Goal

Aggregate findings from all `check-*` workflow dimensions into a single report — a severity matrix sorted by impact, with recommendations

## Scope

- Used when `/deep-validate` dispatches to `report`, or when a `check-*` workflow needs to emit findings
- Covers: findings from every dimension, or a single dimension (for a standalone dispatch)

## Execute

### 1. Aggregate Findings

> Goal: pool all dimension findings into one set

1. Collect findings from each `check-*` workflow that ran — with its dimension tag
2. Dedupe findings sharing the same root cause across dimensions (e.g. a type error that is also correctness+type-safety)
3. Normalize the severity scale: Critical / High / Medium / Low

### 2. Build Severity Matrix

> Goal: one table sorted by impact

1. Table: `No.`, `Dimension`, `Finding`, `Severity`, `Location`, `Recommendation`
2. Sort Critical → High → Medium → Low — dimension is the secondary sort
3. Summarize counts per dimension + per severity above the table

### 3. Summarize And Suggest

> Goal: close with what is good + next actions

1. Always summarize what is already good (per dimension)
2. Actionable recommendations sorted by priority
3. To persist the report → run `/create-report-to-dot-agents`
4. Run `/suggest-next-action` (e.g. `/resolve-errors` for Critical findings)

## Rules

- Every finding has evidence (file:line) — per the check-* workflows' contract
- Do not adjust severity during aggregation — keep the value the workflow assigned
- A single-dimension call uses the same matrix format

## Expected Outcome

- Combined severity matrix across all dimensions with counts + recommendations

---
name: deep-validate-check-quality
description: Validate quality dimension — readability, consistency, docs, best practices
argument-hint: "[scope]"
related:
  - deep-review
  - report
---

## Goal

Check the quality dimension of `/deep-validate` — readability, completeness, consistency, documentation, best practices, naming

## Scope

- Used when `/deep-validate` dispatches to the `quality` dimension, or invoked standalone
- Read-only: record findings — do not refactor

## Execute

### 1. Check Code Quality

> Goal: overall quality per standards

1. Run `/deep-review` to check code quality
2. Check readability, completeness, consistency
3. Check that documentation is sufficient or clear

### 2. Check Conventions

> Goal: aligned with project conventions

1. Check that best practices are used and there is no redundancy
2. Check that naming conventions are consistent
3. Record findings with severity + evidence

### 3. Report

> Goal: return findings to the parent

1. Table: `No.`, `Finding`, `Severity`, `Location`, `Recommendation`
2. Always note what is already good

## Rules

- Quality findings default to Medium/Low severity — raise to High only when maintainability is truly affected
- Do not flag style already handled by the formatter/linter

## Expected Outcome

- Findings of the quality dimension with severity and evidence

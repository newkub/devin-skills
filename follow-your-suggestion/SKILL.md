---
name: follow-your-suggestion
description: Follow suggestions from problem analysis and fix code as discussed beforehand
argument-hint: "[suggestion]"
related:
  - review-dot-agents-global-and-fix
  - prioritize
  - resolve-errors
  - implement-to-production
  - simplify
---

## Goal

Systematically follow suggestions from problem analysis and fix code as discussed beforehand

## Scope

Used for applying suggestions from problem analysis discussed beforehand — covers prioritization, fixing, and verification

## Execute

### 1. Review And Prioritize

> Goal: Review And Prioritize

Order suggestions by impact and effort

1. Do `/review-dot-agents-global-and-fix` to read the related workflows
2. Do `/prioritize` to order by priority: `security` > `type errors` > `performance` > `code quality`
3. Check the context and relevance of each suggestion before applying

### 2. Apply Critical Fixes

> Goal: Apply Critical Fixes

Fix issues in priority order

1. Fix `security vulnerabilities` and `type errors` first
2. Fix the remaining `performance` and `code quality` issues

### 3. Resolve Errors

> Goal: Resolve Errors

Note: run only when errors are received from the fixes

1. Do `/resolve-errors` to fix the errors that occurred

### 4. Productionize Implementation

> Goal: Productionize Implementation

1. Do `/implement-to-production` to convert into complete production code

## Rules

### 1. Prioritization

- Order: `security` > `type errors` > `performance` > `code quality`
- Skip suggestions unrelated to the current problem

### 2. Minimal Changes

- Do `/simplify guard` to avoid over-engineering
- Do not change code unrelated to the suggestions
- Keep consistency with the existing code style

### 3. No Ignore Patterns

- Do not use ignore patterns instead of real fixes — fix the source instead

## Expected Outcome

- Suggestions are ordered and applied systematically by priority
- Code quality improves without side effects or over-engineering
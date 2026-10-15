---
name: run-check
description: Run lint, typecheck and scan to verify quality
argument-hint: "[scope]"
related:
  - deep-review-codebase
  - run-lint
  - run-typecheck
  - run-scan

---

## Goal

Run lint, typecheck and scan to verify quality

## Scope

Use `run-check` for tasks and workflows within its coverage (check)

## Execute

> Pre-Run: Always run `/deep-review-codebase` first — `run-*` requires review/assessment before the main action, never skip; if findings are blockers, fix or report them before running (check)

### 1. Run Lint

> Goal: Run Lint

1. Run `/run-lint` to check code style
2. Fix lint errors if any
3. Confirm lint passes

### 2. Run Typecheck

> Goal: Run Typecheck

1. Run `/run-typecheck` to check types
2. Fix type errors if any
3. Confirm typecheck passes

### 3. Run Scan

> Goal: Run Scan

1. Run `/run-scan` to check code patterns
2. Fix scan issues if any
3. Confirm scan passes

## Rules

### 1. Check Order

- Lint: check code style first
- Typecheck: check types
- Scan: check code patterns

### 2. Failure Handling

- Lint fails: fix lint errors
- Typecheck fails: fix type errors
- Scan fails: fix scan issues

### 3. Parallel Execution

- Run lint, typecheck and scan in parallel when possible
- Use cache to speed things up
- Run checks in the CI environment

- Use /deep-optimize if needed

## Expected Outcome

- All lint checks pass
- All typecheck checks pass
- All scan checks pass
- Code is ready for commit/deploy
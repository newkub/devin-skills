---
name: run-until-pass
description: run a command until it passes and fix all errors
argument-hint: "[command]"
related:
  - deep-review-codebase
  - loop-until-complete
  - follow-best-practice
  - suggest-next-action
  - run-check
  - run-verify
  - resolve-errors

---

## Goal

Run a command until it passes; if errors are found, fix them all until none remain.

## Scope

Use `run-until-pass` for tasks and workflows that are covered (until pass).

## Execute

> Pre-Run: Always run `/deep-review-codebase` first — every `run-*` must be reviewed/assessed before the main action; never skip. If findings are blockers, fix or report them before running (until pass).

### 1. Run Command

> Goal: Run Command

Run the command and check the result

1. Run the command
2. Check whether it passes
3. If it fails, continue to the next step

### 2. Fix Errors

> Goal: Fix Errors

Fix all errors

1. Identify all errors
2. Fix the errors one by one
3. Re-run the command
4. Repeat until it passes

## Rules

- Fix all errors until none remain
- Run the command until it passes
- Verify that no errors are left

- Use /loop-until-complete if needed
- Use /follow-best-practice if needed
- Use /suggest-next-action if needed
- Use /run-check if needed
- Use /run-verify if needed
- Use /resolve-errors if needed

## Expected Outcome

- The command passes completely
- No errors left
- Correct code
---
name: fix
description: Fix issues in any context via root cause analysis and validation
argument-hint: "[scope]"
related:
  - resolve-errors
  - analyze-root-cause-analysis
  - follow-your-suggestion
  - deep-validate
  - run-check
  - ask-me
  - scan-codebase
  - run-test
  - run-until-pass
---

## Goal

Fix problems, errors, or defects in any context through root cause analysis and safe correction

## Scope

Use when an error is found or something needs fixing, regardless of domain or technology

## Execute

### 1. Understand Problem

> Goal: understand the problem to be fixed

1. Take the error, symptom, or issue from the user
2. If there is a stack trace or logs → read and summarize them
3. If unclear → run `/ask-me` to request more information

### 1.5 Choose Fix Mode

> Goal: decide how to fix

1. If the user types `fix` without a scope or `fix all` → fix every issue found in the current context
2. If earlier analysis produced suggestions → run `/follow-your-suggestion`
3. If the user specifies a particular scope → fix only that scope

### 2. Analyze Context

> Goal: find the root cause

1. Run `/analyze-root-cause-analysis` for complex problems
2. Read the related files and config
3. Use `/scan-codebase` to find call sites and consumers
4. Identify the root cause with evidence

### 3. Plan Fix

> Goal: plan the fix

1. List the files that need changing
2. Choose a minimal, correct fix
3. Assess the impact
4. If high-risk → ask the user to confirm first

### 4. Apply Fix

> Goal: apply the fix safely

1. Create a checkpoint with `git stash` or a branch
2. Change the code or config per the plan
3. Check that nothing outside the scope was touched
4. If many files change → work in small batches

### 5. Validate

> Goal: confirm the fix is correct

1. Run `/run-check` (lint, typecheck, scan)
2. Run tests if available
3. Run `/deep-validate` for the project
4. If it fails → repeat steps 2-4 (max 3 times)

### 6. Report

> Goal: summarize the result

1. Report what was fixed
2. State the root cause and the fix approach
3. Report the validation result
4. If still unfinished → list what remains

## Rules

- Find the root cause before fixing
- Use a minimal fix
- Never guess causes without evidence
- Create a checkpoint before editing
- Do not edit outside the agreed scope
- If blocked with a TODO → state it clearly in `TODO.md`

- Use /follow-your-suggestion if needed
- Use /resolve-errors if needed
- Use /run-test all if needed
- Use /run-until-pass if needed

## Expected Outcome

- The problem is fixed
- Code passes validation
- Root cause and fix approach are clearly reported

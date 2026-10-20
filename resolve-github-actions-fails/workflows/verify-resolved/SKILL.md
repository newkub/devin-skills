---
name: resolve-github-actions-fails-verify-resolved
description: Confirm after `/resolve-github-actions-fails` that the workflow runs truly return to success on GitHub
related:
  - resolve-github-actions-fails
---

## Goal

Confirm after `/resolve-github-actions-fails` that the workflow runs truly return to success on GitHub

## Scope

- Used when the parent dispatches to `verify` or called after resolving workflow failures
- Read-only: watch/inspect — do not modify

## Execute

### 1. Watch Latest Run

> Goal: Get the result of the run with the fix

1. `gh run list --limit 5` — find the latest run that has the fix commit
2. `gh run watch <run-id> --exit-status` — wait until it finishes with the exit code
3. If there is no new run → `gh run rerun <run-id>` or `gh workflow run` per the trigger

### 2. Verify Success

> Goal: The run passes the whole workflow

1. `gh run view <run-id>` — conclusion = `success` for every job
2. flag jobs that newly fail or are skipped unexpectedly
3. compare the original failure with the new result — the original root cause must not return

### 3. Report

> Goal: Summarize the result

1. Use `/report` columns: `No.`, `Run/Job`, `Result`, `Evidence`
2. Verdict: `resolved` / `not-resolved` along with the run URL

## Rules

- verdict only from `--exit-status` or the actual run conclusion
- If it fails → report back to the parent loop — do not fix it yourself
- Always specify the run URL

## Expected Outcome

- A verdict from the actual run along with the URL
- A list of jobs that still fail, if any

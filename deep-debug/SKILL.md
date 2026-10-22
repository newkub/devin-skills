---
name: deep-debug
description: Detailed multi-dimensional debugging from reproduction to preventing recurrence
argument-hint: "[scope]"
related:
  - apply
  - check-git-logs
  - git-file-history
  - restore-files-from-git-log
  - follow-tool-git
  - git-search
  - analyze-root-cause-analysis
  - resolve-errors
  - deep-thinking
  - report
  - report-progress
  - suggest-next-action
  - run-check
  - run-test
  - run-until-pass
---

## Goal

Follow systematic debugging principles to find the root cause quickly and precisely, reduce guessing, and prevent recurrence

## Scope

Use for every debugging session — runtime errors, test failures, build errors, deployment issues, performance problems; triage competing incidents by severity/impact before starting (`### 3`); git-related problems via `### 8` (bisect, blame, reflog, lost files/commits — merged from `references/git-debug.md`)

## Execute

### 1. Reproduce Consistently

> Goal: build a reproduction case that triggers the problem consistently before debugging

1. Create a minimal reproduction case that triggers the problem every time
2. Specify the exact steps, inputs, and environment that cause the problem
3. If it can't be reproduced, capture logs, screenshots, and environment info first
4. Use `/use-bun-shell` to rerun the reproduction script until it is stable

### 2. Define Problem Clearly

> Goal: state the problem as Expected vs Actual with a clear scope and impact

1. Write the problem as Expected vs Actual
2. Define the scope: file, function, module, API endpoint, or system level
3. Define the frequency: always, intermittent, or under specific conditions
4. Define the impact: blocking, degraded, or cosmetic

### 3. Triage Incident

> Goal: when several incidents compete or urgency is unclear, assign priority before debugging

1. Assess severity: `Critical` (full outage or data loss), `High` (core feature down, system alive), `Medium` (secondary feature down or heavy performance drop), `Low` (UI glitch or minor issue)
2. Assess impact: number of affected users, duration, business impact (revenue, reputation, compliance)
3. Assign priority from the severity × impact matrix:

| Severity | Impact | Priority | Response Time |
|----------|--------|----------|---------------|
| Critical | High/Medium | P0 | 15–30 min |
| High | High/Medium | P1 | 1–2 hours |
| Medium | High/Medium | P2 | 4–8 hours |
| Low | Any | P3 | 24 hours |

4. Assign an owner: P0–P1 → senior or on-call engineer; P2 → domain expert; P3 → the responsible team
5. Communicate by priority: P0–P1 real-time with updates every 15–30 min; P2 scheduled updates every 2 hours; P3 in the next standup
6. Run the remaining steps within the response window — P0: stabilize first with `/resolve-errors`, then root-cause here; unclear impact probability → `/follow-math-concepts`

### 4. Gather Evidence

> Goal: collect all relevant error messages, logs, and context

1. Collect all error messages, stack traces, and logs
2. Use `/run-test` to see which tests fail
3. Review recent changes with `git log` and `git diff`
4. Check the environment: runtime version, dependencies, config
5. If monitoring exists, also collect metrics and traces

### 5. Form And Test Hypotheses

> Goal: generate, rank, then test hypotheses one variable at a time, ruling others out

1. Generate 3-5 plausible hypotheses; rank them by probability and ease of testing
2. Run `/deep-thinking` to apply a Bayesian approach to the ranking
3. Pick the top 1-2 hypotheses that are easy to test and most probable
4. Test one hypothesis at a time — change only one variable, using `/use-bun-shell` to execute each test
5. Record every result: pass, fail, or inconclusive; rule out hypotheses that don't fit and move to the next
6. If all tests miss, go back and generate new hypotheses

### 6. Isolate Root Cause

> Goal: confirm a root cause that reproduces, disappears when fixed, and returns when reverted

1. Run `/analyze-root-cause-analysis` to identify the main cause
2. Use 5 Whys to trace from symptom to root cause
3. Confirm the root cause with 3 conditions: it reproduces, the fix resolves it, and it returns if the fix is reverted
4. Check that it isn't a symptom of a deeper problem

### 7. Debug Git Issues (Conditional)

> Goal: find the root cause of git-related problems systematically — run instead of `### 5`–`### 6` when the symptom is a bad commit, unexpected change, lost commit/file, or unknown git state

1. Classify the symptom and pick the tool:

| Symptom | Tool |
|---------|------|
| Bug introduced by some commit | `git bisect` |
| Who/when changed a line | `git blame` + `git log -p --follow -S "<snippet>" -- <file>` (or `/check-git-logs`, `/git-file-history`) |
| Commit vanished from the branch | `git reflog` → `git cherry-pick <hash>` (or `git reset --hard <hash>` only after `/ask-me`) |
| File missing | `/restore-files-from-git-log`; else `git log --all --diff-filter=D -- <file>` → `git restore --source=<hash>^ <file>` |
| Unknown cause | `git status`, `git log --oneline -20`, `git diff HEAD~1`, `git stash list` (or `/git-search`) |

2. Bisect flow: stash uncommitted changes and back up the branch → confirm the good/bad range with `git log --oneline <good>..<bad>` (via `/ask-me` if unclear) → `git bisect start`, `git bisect bad <bad>`, `git bisect good <good>` → `git bisect run <test-command>` when an automated test exists, otherwise answer `good`/`bad` per checkout → `git show <first-bad>` → `git bisect reset`
3. Safety: never `git reset --hard` without user confirm; use `git restore` instead; verify `git status` is clean after debugging
4. Apply the fix: revert the bug-causing commit (`/follow-tool-git`) and add a regression test (`/update-tests`)

### 8. Validate And Fix

> Goal: fix minimally at the root cause, then verify nothing else breaks

1. Run `/apply` mode `validate` to validate before fixing
2. Run `/resolve-errors` to fix the errors found
3. Fix minimally — the smallest change that resolves the root cause, not the symptom
4. Run `/run-test` to confirm the fix works
5. Verify the fix doesn't break other functionality
6. Run `/run-lint` and `/run-typecheck` to check code quality

### 9. Prevent Recurrence

> Goal: add test cases and improve debuggability to prevent the problem from recurring

1. Add regression-prevention test cases — run `/follow-tool-vitest` or `/follow-tool-playwright`
2. Run `/deep-review` if debugging was hard due to insufficient logging
3. Update documentation if the problem was about config or setup
4. Record the root cause and solution in `docs/` or the commit message

### 10. Report

> Goal: summarize the debug result and next action

1. Run `/report table` with columns: `No.`, `Step`, `Hypothesis`, `Result`, `Status`
2. Summarize root cause, fix, regression tests, preventive measures
3. Run `/report-progress` if there are multiple steps
4. Run `/suggest-next-action`

## Rules

### 1. Core Principles

- No guessing — every hypothesis must have supporting evidence
- Don't fix multiple things at once — change one variable at a time
- Don't fix symptoms — reach the root cause
- No bypasses — don't use `@ts-ignore`, `eslint-disable`, or try-catch to hide errors
- Must be reproducible before fixing
- Every fix must pass `/apply` mode `validate` before apply

### 2. Debug Strategy

- Work top-down: UI → API → Database → Infrastructure
- Work narrow to broad: specific function → module → system
- Use binary search for large codebases
- For intermittent issues, keep logging until the pattern is clear
- For environment-specific issues, compare working vs broken environments

### 3. Logging For Debug

- Use structured logging, not `console.log`
- Include context: function name, input values, state
- Use log levels: `debug`, `info`, `warn`, `error`
- After the fix, remove unnecessary debug logging

### 4. Tool Selection

- Runtime errors → `/resolve-errors` + `/deep-thinking`
- Test failures → `/run-test` + `/follow-tool-vitest`
- E2E failures → `/follow-tool-playwright`
- Build errors → `/run-build` + `/resolve-errors`
- Type errors → `/run-typecheck` + `/follow-lang-typescript`
- Performance → `/run-profiler` + `/deep-review`
- Git issues → `### 7` + `/follow-tool-git` + `/check-git-logs`

### 5. Time Budget And Escalation

- Small problems: ≤ 5 minutes | medium: ≤ 15 minutes | large: ≤ 30 minutes
- If over budget → run `/deep-thinking` or `/deep-research`
- If the root cause isn't found after 3 attempts → run `/deep-thinking` or ask for help
- Use /run-check if needed
- Use /run-test all if needed
- Use /run-until-pass if needed

## Expected Outcome

- Root cause found quickly and precisely
- No guessing and no fixing multiple things at once
- The fix addresses the root cause, not the symptom
- Regression-prevention test cases exist
- Git-level root causes (bad commit, lost file/commit) found and fixed with bisect/blame/reflog
- The debugging experience keeps improving

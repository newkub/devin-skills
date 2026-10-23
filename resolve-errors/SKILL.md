---
name: resolve-errors
description: Fix errors systematically — root cause, minimal fix, scripts to automate
argument-hint: "[scope|verify]"
related:
  - rethink
  - resolve-cicd
  - deep-debug
  - review-dot-agents-global-and-fix
  - scan-codebase
  - refactor
  - use-scripts
  - deep-review
  - run-check
  - run-test
  - run-until-pass
  - check-secrets
  - open-web-for-config-secret
---

## Goal

Fix errors systematically, quickly, and precisely — identify the root cause, make the minimal fix, use scripts to automate the fix, and verify thoroughly

## Scope

Used for fixing errors that arise from running commands, linting, type checking, testing, or builds that can be fixed directly

Not systematic debugging (use `/deep-debug`)

## Execute

Step dependencies: each step depends on the previous step (Step N depends on Step N-1)

### CI/CD Failure Skills

| Topic | Skill |
|-------|-------|
| GitHub Actions workflow runs that failed | `/resolve-github-actions-fails` |
| The specified Cloudflare Worker or Pages project | `/resolve-cloudflare-worker-fails` |
| All Cloudflare Workers/Pages in the account | `/resolve-all-cloudflare-worker-fails` |
| Repo-scoped CI/CD pipeline or single run/URL (watch + dispatch) | `/resolve-cicd` |

### Workflows

| Argument | Workflow |
|----------|----------|
| `verify`, `verify-resolved` | `## Merged Details → verify-resolved` — re-run the same command, no new errors, no suppression |

1. If the argument is `verify` → read `## Merged Details → verify-resolved` then follow the flow — do not fix again
2. If not specified → do Steps 1-6 as usual, where Step 5 reads the `verify-resolved` workflow and executes it

### 1. Prepare Context

> Goal: Prepare context before starting to fix errors

1. Run `/review-dot-agents-global-and-fix` to read the related workflows recursively
2. Run `/scan-codebase` to understand the structure of the files with errors
3. If a file is longer than >250 lines → read `/refactor` before fixing
4. If the workspace cannot be accessed → stop and report without modifying files

### 2. Capture And Triage Errors

> Goal: Collect all errors, classify them, group them, and prioritize the fixes

1. Run the command that caused the error again to capture all output
2. If there are many errors → use `/use-scripts` to capture and parse the error output into structured data (e.g. `bunx biome lint --reporter=json` then group by `file:rule`)
3. Classify errors according to the table in `## Rules → ### 2. Error Classification`
4. Group errors that share the same root cause into a batch
5. Identify the error source and prioritize: `environment` > `config` > `dependency` > `code` > `test-data` — fix in this order because upstream may make downstream disappear on its own
6. Prioritize by dependency: fix upstream before downstream — if error A causes B → fix A first
7. If the error is complex or unclear → run `/deep-review` first

### 3. Identify Root Cause

> Goal: Precisely identify the true cause of the error

1. Read the entire error message including the stack trace and error code
2. Precisely identify the file and line where the error occurs — look at ±20 lines of context
3. Trace the call stack back, check the data flow and dependencies
4. If the root cause is unclear:
   - Use `git diff` and `git log --oneline -5 -- <file>` to check recent changes
   - Use `ast-grep` to search for similar patterns in the codebase
   - If still not found → run `/deep-debug`

### 4. Apply Minimal Fix

> Goal: Fix at the root cause with the smallest possible change — including parallel fixes for independent errors

1. Fix at the single point that is the true root cause — a single-line change when possible
2. If there are many errors → use `/use-scripts` to automate:
   - Batch text replacement — fix typos, renames, import paths across multiple files with `Bun.Glob` + `Bun.file()` + `Bun.write()` or use `/rename` for renaming code identifiers
   - ast-grep structural fix — fix code patterns that need an AST structure change
   - Parallel fix — fix independent errors across multiple files at once with `Promise.all`; if errors have dependencies on each other → fix sequentially instead
3. If the fix affects multiple files → run `/update-references` to update references
4. If the fix creates new errors → run `/resolve-errors` again (loop) until there are no new errors
5. If it cannot be fixed → stop and report along with the cause

### 5. Verify Fix

> Goal: Verify that the fix is correct, creates no side effects, and has no ignore patterns

1. Follow `## Merged Details → verify-resolved` — re-run the same command, check side effects and suppression
2. If the verdict is not `resolved` → go back to Step 4 (loop) — if more than 3 rounds → run `/deep-debug`

### 6. Document And Prevent

> Goal: Record the fix and prevent regression

1. Write a comment explaining the cause of the fix if it is not clear
2. Consider adding a test case to prevent regression — run `/update-tests`
3. Record the problem pattern and the solution in a record file or the project memory
4. Suggest preventive measures if the error is likely to recur: linter rule, type constraint, pre-commit hook

## Rules

### 1. When To Use

- Use when: the error is clear, directly fixable, arises from lint/typecheck/test/build, or there are multiple that can be batch fixed
- Do not use when: it is complex with many points, or the cause must be found first (use `/deep-debug`), requires extensive prioritization (use `/deep-review`), is a race condition (use `/deep-debug`)
- `/resolve-errors` = you already know the cause, make the minimal fix, use scripts to automate | `/deep-debug` = find the root cause, plan the fix and prevent recurrence

### 2. Error Classification

| Type | Source | Common Fix |
|------|--------|-------------|
| `Syntax` | `code` | Fix syntax, typos, missing brackets/quotes |
| `Type` | `code` | Add/fix type annotation, narrowing |
| `Runtime` | `code` | Add null check, optional chaining, try-catch |
| `Logic` | `code` | Fix condition, data flow |
| `Build` | `config`/`dependency` | Fix config, import path, dependency version |
| `Lint` | `code`/`config` | Fix code pattern or adjust config |
| `Test` | `test-data`/`code` | Fix assertion, mock, test setup |
| `Network` | `code` | Fix URL, headers, request format |
| `Config` | `config` | Fix env var, config value, path — if it is env-missing (`Missing required environment variables`, `X environment variable is not set`) → do not hardcode the value; route to `/check-secrets env-vars` + `/open-web-for-config-secret` (the inventory table points to the key/URL/entry point) |
| `Dependency` | `dependency` | Update/install dependency |

Prioritize fixes by source: `environment` > `config` > `dependency` > `code` > `test-data`

### 3. Batch Fix And Script Automation

Use `/use-scripts` when there are many errors:
- Group by root cause — errors with the same cause are fixed together
- Group by rule — lint errors from the same rule are fixed with the same pattern
- Group by file — errors in the same file are fixed together to reduce context switching
- Script patterns: batch text replacement, ast-grep structural fix, parallel file fix with `Promise.all`, error capture and parse, verify loop with `/run-until-pass`

### 4. Fix Principles

- Root cause over symptom — fix the cause, not the symptom
- Minimal over maximal — a single-line change when possible
- Upstream over downstream — fixing upstream is better than downstream (config > dependency > code)
- Batch over sequential — fix related errors as a batch
- Verify before assume — confirm by running
- No ignore — do not suppress errors with ignore patterns; fix at the source instead
- Loop until clean — if a fix creates new errors, loop until there are none

### 5. Time Budget And Loop Limit

- Small error: ≤ 2 minutes | Medium: ≤ 5 minutes | Large: ≤ 15 minutes | Batch: ≤ 10 minutes
- If over time → use `/deep-debug`
- If fixing produces new errors more than 3 rounds → run `/deep-debug`
- If the root cause cannot be found after 3 attempts → run `/deep-debug`

### 6. Integration With Other Workflows

- `/deep-review` — many errors, need prioritization
- `/deep-debug` — root cause not found yet
- `/deep-debug` — complex error, need to plan a fix and prevent recurrence
- `/run-verify` — run lint + typecheck + scan together
- `/run-until-pass` — run the command until it passes
- `/watch-browser fix` — the error comes from the browser console
- `/update-references` — the fix affects references in multiple files
- `/rename` — rename code identifiers that are the root cause of the error
- `/scan-codebase` — search for similar patterns

- Use /rethink if necessary
- Use /run-check if necessary
- Use /run-test all if necessary

- Use /resolve-cicd if necessary

## Merged Details

### verify-resolved

##### Goal

Confirm after `/resolve-errors` that the error is really gone and the fix creates no side effects — call standalone when you need to re-verify the resolution

##### Scope

- Used when the parent dispatches to `verify` or called after the fix is complete
- Covers: original error gone, no new errors, no suppression, tests still green
- Read-only: inspect — do not modify

##### Execute

###### 1. Re-Run Original Command

> Goal: The original error is really gone

1. Run the same command that caused the error — the output must be clean
2. If the original error is still there → verdict `not-resolved`, report immediately
3. Compare the output with the original error capture — the errors claimed fixed must all be gone

###### 2. Check For Side Effects

> Goal: The fix did not break anything else

1. Run `bun run check` (lint + typecheck + scan) or the equivalent
2. Run the related tests — no test that used to pass fails
3. Check that there are no new warnings/errors in other files

###### 3. Check No Suppression

> Goal: The fix fixes at the source, not suppresses

1. `rg '(biome-ignore|ts-ignore|ts-nocheck|type: ignore|eslint-disable)'` in the diff of the fix
2. flag ignore comments added by this fix — if found, the verdict is `suppressed`, not resolved

###### 4. Report

> Goal: Summarize the resolution status

1. Use `/report` columns: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `resolved` / `not-resolved` / `suppressed` / `regressed`

##### Rules

- `resolved` only when the original command is clean + no side effects + no suppression
- If `not-resolved`/`regressed` → report back to `/resolve-errors` to loop on — do not fix it yourself
- Use `/run-until-pass` if it must be re-run until stable (flaky checks)

##### Expected Outcome

- A clear verdict on whether the resolution truly succeeded, with evidence

## Expected Outcome

- Errors are fixed permanently from the root cause
- No new side effects, no ignore patterns
- Code quality is preserved or improved
- Batch errors are fixed quickly with script automation
- There are regression tests and preventive measures for errors likely to recur

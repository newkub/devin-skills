---
name: keepup-source-code
description: Keep source code current — detect staleness signals, then dispatch the update-* matching the domain
argument-hint: "[scope]"
related:
  - update-project
  - update-version-to-latest
  - update-docs
  - update-usage-md
  - update-features-md
  - update-tests
  - update-config
  - deep-review-codebase
  - improve
  - check-should-update
  - run-check
  - deep-validate
  - report
  - suggest-next-action
  - follow-up-to-date

---

## Goal

Keep the source code current and always in sync with dependencies, config, codegen, and docs — detect the parts that are stale, then dispatch to the `update-*`/`check-*` matching the domain until it passes validation (acting as the executor for the source code domain following `/follow-up-to-date`)

## Scope

Use when you want the code not to go out of date — e.g., after bumping deps, changing config, updating upstream, or as periodic maintenance; not for implementing a new feature

## Execute

### 1. Detect Staleness Signals

> Goal: Know what in the project is stale

1. Run `/check-should-update` to look at git changes and assess whether a target needs updating
2. Run `/deep-review-codebase` scope `deprecated-apis` to find code using deprecated APIs/dependencies
3. Run `/deep-review-codebase` scope `content-outdate` to check skills/docs/specs that are outdated
4. Run `/deep-review-codebase` domain `review-config` to check config that has drifted from defaults
5. Check manifest drift — `package.json`/`Cargo.toml`/`go.mod` changed but the lockfile or code did not follow
6. Combine the signals into a list: `{area, signal, severity}`

### 2. Map Signal To Update

> Goal: Choose the update-* that matches each signal

| No. | Signal | Dispatch To |
|-----|--------|-------------|
| 1 | old deps/runtime/tools | `/update-version-to-latest` |
| 2 | config drift or missing | `/update-config` |
| 3 | public API/exports changed | `/update-usage-md` + `/update-features-md` |
| 4 | outdated docs | `/update-docs` |
| 5 | tests do not cover new code | `/update-tests` |
| 6 | stale generated code/artifacts | re-run generator (codegen, ast-grep rules, specs) |
| 7 | several workspaces drift at once | `/update-project` |

### 3. Apply Updates

> Goal: Fix staleness one domain at a time

1. Follow the order: Foundation (deps/config) → Code → Docs/Tests
2. Dispatch according to the mapping table one domain at a time — do not combine several domains in one edit
3. If a signal has no matching update skill → fix it manually with a minimal change
4. Record what was fixed per domain

### 4. Validate

> Goal: Confirm the code is current and not broken

1. Run `/run-check` to lint, typecheck, scan
2. Run `/deep-validate` if several files were edited
3. If it does not pass → `/resolve-errors` then recheck (max 3 rounds → stop/report)

### 5. Report

> Goal: Summarize the staleness found and fixed

1. Run `/report` as a table: `No.`, `Area`, `Signal`, `Action`, `Status`
2. Run `/suggest-next-action` to recommend a periodic keepup or the next step

## Rules

- Always detect before fixing — never update without a signal that it is stale
- Dispatch to the `update-*` skill matching the domain — do not write the update logic yourself if a skill exists
- Minimal change — fix only the stale parts, do not refactor further
- Every domain fixed must pass `/run-check` before finishing

## Expected Outcome

- Every staleness signal is resolved or has a reason for being deferred
- code, config, docs, tests are in sync and pass validation
- The report fully shows which area had what fixed

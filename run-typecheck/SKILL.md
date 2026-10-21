---
name: run-typecheck
description: Run typecheck with config check
argument-hint: "[scope]"
related:
  - deep-review
  - deep-debug
  - resolve-errors
---

## Goal

Run typecheck as defined in the package manifest, with a config check

## Scope

Run typecheck for every workspace in the monorepo as defined in the package manifest

## Execute

> Pre-Run: Always run `/deep-review` dimension `config` first — `run-*` must be reviewed/assessed before the main work, never skip; if findings are blockers, fix or report before running (typecheck)

### 1. Check Config

> Goal: Check Config

1. Run `config` to check the config
2. Do not modify any config

### 2. Run Typecheck

> Goal: Run Typecheck

1. Do not use ignore comments/attributes in any language
2. Pick the command by ecosystem: Bun project (`bun.lock`) → `bun check`; otherwise the manifest `typecheck` script (`tsc --noEmit` where Bun is absent)
3. Run typecheck as defined in the package manifest

### 3. Analyze Errors

> Goal: Analyze Errors

1. Run `/deep-review` to analyze and prioritize the errors from typecheck
2. `/deep-review` decides which workflow to follow next:
   - If they are cascade issues → `/deep-debug` → `/resolve-errors`
   - If they are isolated errors → `/resolve-errors`

## Rules

- Run `config` to check the config, but do not modify it
- Do not use ignore comments/attributes in any language; fix the problem at the source
- Fix the errors produced by typecheck before continuing

## Expected Outcome

Code that passes typecheck with no errors
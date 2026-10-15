---
name: run-lint
description: Run lint and fix code to pass, without ignore patterns and without editing config files
argument-hint: "[scope]"
related:
  - deep-review-codebase
  - resolve-errors
  - run-format
---

## Goal

Run lint and fix code so it passes, without using ignore patterns and handling unused variables appropriately, and never editing config files

## Scope

Run lint for all project types and handle errors/warnings from the linter

## Execute

> Pre-Run: Always run `/deep-review-codebase` first — `run-*` must be reviewed/assessed before the main work, never skip; if findings are blockers, fix or report before running (lint)

### 1. Run Lint

> Goal: Run Lint

1. Check the project type and lint config before running
2. Run lint as defined in the config:
   - For a monorepo: run `bun run lint` or `turbo lint`
   - For a typical project: run the lint command per the config
3. Wait for lint to finish before continuing

### 2. Analyze Errors

> Goal: Analyze Errors

1. Run `/deep-review-codebase` to analyze and prioritize the errors produced by lint
2. Check the types of errors:
   - config-related errors
   - code-related errors
   - unused variables
   - type errors
   - style violations

### 3. Fix Code Issues

> Goal: Fix Code Issues

1. Fix code-related errors in priority order
2. For unused variables:
   - Decide whether to delete them or implement them fully
   - If they are a mock/placeholder, finish the implementation
   - If truly unnecessary, delete them
3. For type errors, fix the types to be correct
4. For style violations, fix them per the conventions

### 4. Verify

> Goal: Verify

1. Run lint again to confirm
2. Check that no errors/warnings remain
3. Run all tests to confirm the code works

## Rules

### 1. No Config Changes

Never edit any config file

- Do not edit biome.jsonc, eslint.config.js, tsconfig.json, or any other config file
- Fix the code to pass the existing lint rules
- If the config is unsuitable, notify the user instead of editing it yourself

### 2. Unused Variables

Handle unused variables appropriately

- Check whether they are a mock/placeholder
- If they are a mock/placeholder, finish the implementation
- If truly unnecessary, delete them
- Avoid using ignore comments

### 3. Error Resolution

Fix problems at the source rather than suppressing them

- Fix the code to pass the lint rules
- Avoid using ignore comments/attributes
- Use `/resolve-errors` when needed

### 4. Verification

Check that the code still works normally

- Run lint again to confirm
- Run all tests
- Check that there are no regressions
- Run `/follow-tool-knip` to check that every file is used
- Never use unsafe / no-verify / bypass flags with linters, formatters, validators, and githooks (e.g. `--unsafe`, `--allow-unsafe`, `--no-verify`, `-n`, `--bypass`)
- Use /run-format if needed

## Expected Outcome

- Code that passes lint with no errors/warnings
- Every file is used, with no unused files
- A report of the lint run

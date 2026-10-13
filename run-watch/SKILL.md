---
name: run-watch
description: Run watch mode for build, test, or typecheck to continuously detect errors
argument-hint: "<build|test|typecheck> [scope]"
related:
  - deep-review
  - resolve-errors
  - deep-debug

---

## Goal

Run watch mode for the specified task (build, test, typecheck) to continuously detect errors/regressions during development

## Scope

- Use during active development when a continuous feedback loop is needed
- Pick the command based on the detected package manager and monorepo tool

## Execute

> Pre-Run: Always run `/deep-review` first — every `run-*` must be reviewed/assessed before the main action; never skip. If findings are blockers, fix or report them before running (watch).

### 1. Detect Command

> Goal: Choose the correct watch command

1. Check `package.json` scripts and the tools in use (bun, turbo, moon, vitest, tsc, cargo)
2. Select by task:
   - `build` → `bun run build --watch` or the tool equivalent (`tsc --watch`, `cargo watch`)
   - `test` → `bun test --watch` / `vitest` (watch is the default) / `cargo watch -x test`
   - `typecheck` → `tsc --noEmit --watch` or the equivalent
3. Monorepo → use the monorepo run command first (`turbo run <task> --watch`)

### 2. Run Watch Mode

> Goal: The watch process runs and captures output

1. Run the command as a background process
2. Check the initial output — errors, warnings, baseline status
3. Report that watch is running and what it is monitoring

### 3. Monitor And Report

> Goal: Track errors that occur while watching

1. Check the output periodically as files are edited
2. If errors are found → run `/resolve-errors` or `/deep-debug`
3. Stop watch when the task finishes or the user asks

## Rules

- Always run as a background process; never block the session
- Report the baseline status immediately after start
- Don't forget to stop the watch process when done

## Expected Outcome

- Watch mode is running with continuous error reporting
- The initial state is clear (pass/fail baseline)

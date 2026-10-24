---
name: run-check
description: Run lint, typecheck and scan to verify quality
argument-hint: "[scope]"
related:
  - deep-review
  - run-lint
  - run-typecheck
  - run-scan
  - follow-tool-ctx-rs

---

## Goal

Run lint, typecheck and scan to verify quality

## Scope

Use `run-check` for tasks and workflows within its coverage (check)

- Vite+ project: `vp check` runs fmt + lint + type-aware check in one pass, but it is not a full typecheck (`tsrs --noEmit`) — still run `/run-typecheck` and `/run-scan` (see `/follow-tool-viteplus`)

## Execute

> Pre-Run: Always run `/deep-review` first — `run-*` requires review/assessment before the main action, never skip; if findings are blockers, fix or report them before running (check)

### 1. Run Lint

> Goal: Run Lint

1. Run `/run-lint` to check code style (a Vite+ project runs `vp lint`, or `vp check --no-fmt` for lint + type-aware)
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

### 4. Compact Noisy Output

> Goal: keep check output readable and inside the token budget (`/follow-tool-ctx-rs`)

1. Output is long (>100 lines) → rerun the read-only check through sift: `ctx sift err -- vp lint`, `ctx sift summary -- vp run typecheck`, `ctx sift test -- bun test`
2. Output already captured in a log → `ctx sift compact <log-file>` instead of rerunning anything
3. `ctx sift gain` — confirm the measured reduction before claiming one; short output passes through unchanged
4. Sift is a reading aid only — diagnostics and fix decisions come from the real command and its exit status, never from the compacted view alone

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
---
name: run-all-tasks
description: Run every task defined in the project manifest sequentially until all pass
argument-hint: "[scope|skip-destructive]"
related:
  - follow-tasks
  - run-verify
  - run-check
  - resolve-errors
  - check-monorepo
  - report
  - use-subagents
  - ask-me
  - suggest-next-action
---

## Goal

Enumerate every task defined in the project's task manifest (`package.json` scripts, `moon.yml`, `justfile`, `Cargo.toml` aliases, `Taskfile.yml`, `mise.toml` tasks), run each in dependency order, fix failures via `/resolve-errors`, and report a pass/fail table with duration and evidence

## Scope

- Use when you want to verify the full project health via its own defined task suite (not just the verify subset that `/run-verify` covers)
- Covers custom tasks beyond the standard chain: `db:migrate`, `security`, `deploy:staging`, `docs:build`, `lint:fix`, and any project-specific scripts
- Monorepo: run root tasks first, then delegate per-workspace via `/all-workspace` or `/use-subagents`; ordering: foundation packages before applications
- Destructive tasks (`deploy:*`, `db:reset`, `clean --force`, `prune`, `drop:*`) → skip unless `skip-destructive` is NOT passed AND the user explicitly confirms
- `skip-destructive` argument → never run destructive tasks, mark them `skipped` in the report
- This skill does NOT create or modify the task definitions — if tasks are missing or incomplete, recommend `/follow-tasks` to set them up first
- Does NOT ship/push/merge — use `/ship` or `/run-verify` for the verification gate

## Execute

### 1. Pre-Run Assessment

> Goal: review the project state before executing tasks

1. Run `/check-monorepo` to determine project scope (single package vs monorepo)
2. Run `/deep-review-codebase` to assess the project state — blockers found → fix or report before proceeding

### 2. Discover Tasks

> Goal: enumerate every task defined in the project

1. Read the task manifest per ecosystem:
   - `package.json` → `scripts` object (each key = task name)
   - `moon.yml` / `.moon/tasks/*.yml` → task definitions (run via `moon run <task>`)
   - `justfile` → recipe names
   - `mise.toml` → `[tasks]` section
   - `Taskfile.yml` → `tasks:` mapping
   - `Cargo.toml` → `[alias]` under `[cargo]` or `.cargo/config.toml`
   - `Makefile` → target names (exclude `.PHONY`-only helpers)
2. If multiple manifests coexist (e.g. root `package.json` + workspace `moon.yml`), prefer the orchestration tool (moon > turbo > plain package.json)
3. Build the task list: `No. | Task | Command | Category | Destructive?`
4. Categorize each task: `setup` (clean, install), `build`, `check` (lint, typecheck, format:check, scan), `test`, `deploy` (db:*, migrate, deploy:*), `custom` (everything else)
5. If no tasks found → stop and recommend `/follow-tasks` to set up the project scripts

### 3. Order Tasks By Dependency

> Goal: run tasks in the right sequence so later tasks depend on earlier ones succeeding

1. Order: `clean` → `install`/`prepare` → `build` → `check` (format → lint → typecheck → scan) → `test` → `db:*` → `custom` → `deploy:*`
2. If a `verify` or `check` composite task exists (`run-verify` pattern): expand into sub-steps OR run the composite — prefer expanding so individual results are visible
3. Tasks with no inter-dependency → mark as parallelizable
4. If the ordering is unclear → `/ask-me` or run in manifest definition order

### 4. Execute Tasks

> Goal: run each task and capture the result

1. For each task in order:
   - Destructive AND `skip-destructive` flag set → mark `skipped`, continue
   - Destructive AND no `skip-destructive` → `/ask-me` confirm before running
   - Run the task command with a timeout (long-running → background; short → foreground, max 5 min default)
   - Capture: exit code, duration (seconds), stdout/stderr tail (last 20 lines on failure)
2. If a task fails:
   - Run `/resolve-errors` on the output — fix the root cause
   - Retry the same task (max 3 attempts per task)
   - Still failing after 3 retries → mark `failed`, continue to the next independent task
3. Parallelizable tasks (from step 3 ordering): run via `/use-subagents` for independent workspace/task sets to reduce wall-clock time
4. If a dependency task fails (e.g. `build` red → `test` needs build output): skip downstream tasks, mark them `blocked`

### 5. Report Results

> Goal: clear pass/fail table with evidence and next actions

1. Run `/report` table: `No. | Task | Category | Result | Duration | Evidence`
   - Result values: `pass` / `fail` / `skipped` (destructive) / `blocked` (dependency failed)
2. Summary line: `N passed / M failed / K skipped / B blocked`
3. If all pass → report green, suggest `/ship` or `/run-verify` for the gate
4. If any fail → list failing tasks with error context, suggest `/resolve-errors` per root cause
5. Run `/suggest-next-action`

## Rules

### 1. Never Modify Task Definitions
- This skill runs tasks, not defines them
- Missing or incomplete tasks → recommend `/follow-tasks`

### 2. Destructive Safety
- Tasks matching `deploy:*`, `db:reset`, `db:drop`, `clean --force`, `prune`, `publish`, `release`, `push` → require explicit user confirm unless `skip-destructive` is set
- `skip-destructive` → auto-skip, never run

### 3. Error Handling
- Per-task retry max 3 via `/resolve-errors`
- After 3 failures → mark failed, move on (do not block the entire run)
- Dependency failure → mark downstream as `blocked`, not `failed`

### 4. Timeout
- Short tasks (lint, typecheck, format:check): 5 min foreground
- Long tasks (build, test, e2e): run background, poll every 30s, max 30 min
- Timeout → kill, mark `fail` with timeout evidence

- Use /run-check if needed
- Use /use-subagents if needed

## Expected Outcome

- Every defined task is either run, skipped (destructive + flag), or blocked (upstream failure) — none silently ignored
- All tasks pass green, OR a clear failure table with root causes and suggested fixes
- A `/report` table with per-task status, duration, and evidence delivered in chat
- No destructive action taken without explicit confirm
- Task definitions remain unchanged (this is an executor, not a setter)

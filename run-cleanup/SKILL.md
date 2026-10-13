---
name: run-cleanup
description: Run cleanup tasks to delete build artifacts and cache
argument-hint: "[scope]"
related:
  - check-long-files
  - cleanup-files-in-computer
  - cleanup-files-in-project
  - cleanup
  - run-check
  - run-verify
  - suggest-next-action
  - run-clean
---

## Goal

Run cleanup

## Scope

Use `run-cleanup` for tasks and workflows within its coverage (cleanup)

## Execute

> Pre-Run: Always check for locked files first — `run-*` requires review/assessment before the main action, never skip; if findings are blockers, fix or report them before running (cleanup)

### 1. Identify Cleanup Targets

> Goal: Identify the artifacts and cache to delete

1. Read `.gitignore` to find ignored paths that are build artifacts
2. Identify targets per language/stack:
   - Node.js: `node_modules/`, `dist/`, `.nuxt/`, `.next/`, `.turbo/`
   - Rust: `target/`
   - Python: `__pycache__/`, `.pytest_cache/`, `*.pyc`
   - Go: `vendor/`, `bin/`
   - General: `.cache/`, `coverage/`, `*.log`
3. If there are stale branches or worktrees → run `/cleanup-git-branch` or `/cleanup-worktree`

### 2. Run Cleanup

> Goal: Delete artifacts safely

1. Delete build artifacts with the appropriate commands (`rm -rf`, `cargo clean`, `bun pm cache rm`, etc.)
2. If system-wide cleanup is needed → run `/cleanup-files-in-computer`
3. If project cleanup is needed → run `/cleanup-files-in-project`
4. If files are locked → close the locking processes, then retry deletion

### 3. Verify

> Goal: Confirm cleanup succeeded

1. Verify the targets have been deleted
2. Run `/run-check` to confirm the project still works
3. Run `/run-verify` if full verification is needed
4. Run `/report` to show the deleted artifacts and reclaimed space

## Rules

- Delete only artifacts listed in `.gitignore` or that are build output
- Never delete source files, config, or user data
- If files are locked → resolve the locks before deleting
- Use `/cleanup-files-in-computer` for system cleanup
- Use `/cleanup-files-in-project` for project cleanup
- Use `/cleanup-git-branch` for branch cleanup
- Use `/suggest-next-action` after finishing to recommend the next step
- Use /run-clean if needed

## Expected Outcome

- Build artifacts and cache deleted
- Disk space reclaimed
- Project still works after cleanup
- Report of deleted artifacts and reclaimed space

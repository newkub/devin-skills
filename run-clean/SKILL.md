---
name: run-clean
description: Clean build artifacts and cache to start fresh
argument-hint: "[scope]"
related:
  - check-long-files
  - follow-best-practice
  - suggest-next-action
  - resolve-errors
  - run-check
  - run-verify
  - run-cleanup
---

## Goal

Clean build artifacts and cache to start fresh

## Scope

Use `run-clean` for tasks and workflows within its coverage (clean)

## Execute

> Pre-Run: Always check for locked files first — `run-*` requires review/assessment before the main action, never skip; if findings are blockers, fix or report them before running (clean)

### 1. Clean Build Artifacts

> Goal: Clean Build Artifacts

1. Delete the `dist`, `build`, `out` folders
2. Delete `.next`, `.nuxt`, `.output` per framework
3. Delete all compiled files

### 2. Clean Cache

> Goal: Clean Cache

1. Delete `node_modules/.cache`
2. Delete `.turbo`, `.cache`
3. Delete framework-specific cache
4. Delete TypeScript cache

### 3. Clean Dependencies

> Goal: Clean Dependencies

1. Delete `node_modules` if needed
2. Delete lock files if needed
3. Delete package manager cache

### 4. Clean Temporary Files

> Goal: Clean Temporary Files

1. Delete `.DS_Store`, `Thumbs.db`
2. Delete log files
3. Delete temporary directories
4. Delete old coverage reports

### 5. Clean Git

> Goal: Clean Git

1. Run `git clean -fdx` to delete untracked files
2. Run `git gc` to optimize the repository
3. Delete stale branches if needed

### 6. Reinstall Dependencies

> Goal: Reinstall Dependencies

1. Run `bun install` or the package manager in use
2. Verify the dependencies install successfully
3. Run build to test

## Rules

### 1. Clean Scope

- Clean only what is necessary
- Back up important data before cleaning
- Never delete source code or config files

### 2. Dependency Reinstall

- Reinstall dependencies only when necessary
- Use lock files for consistency
- Check package manager compatibility

### 3. Git Safety

- Check git status before cleaning
- Commit or stash important changes
- Use `--dry-run` before `git clean`

- Use /follow-best-practice if needed
- Use /suggest-next-action if needed
- Use /resolve-errors if needed
- Use /run-check if needed
- Use /run-verify if needed
- Use /run-cleanup if needed

## Expected Outcome

- All build artifacts deleted
- All cache deleted
- Temporary files deleted
- Git repository optimized
- Dependencies reinstalled correctly
- Build works after cleaning

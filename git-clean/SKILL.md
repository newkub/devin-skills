---
name: git-clean
description: Safely git clean — always dry-run first, remove untracked/ignored files by scope
argument-hint: "[-fd|-fdx|paths...]"
related:
  - git-restore
  - git-stash
  - cleanup-files-in-project
  - ask-me
---

## Goal

Remove untracked files with `git clean` — always dry-run first, because untracked files are not in git history and cannot be recovered

## Scope

- `git clean -fd` (untracked files+dirs), `-fdx` (including ignored — build output), `-n` dry-run
- fills the gap of `/git-restore`, which does not touch untracked files
- general build artifact/dependency cache cleanup → `/cleanup-files-in-project`

## Execute

### 1. Preview (Always Dry-Run)

> Goal: see every file that will be gone before actually deleting

```bash
git clean -nd        # preview untracked files+dirs
git clean -ndx       # preview including ignored files (node_modules, dist, ...)
git clean -nd <path> # preview a specific path only
```

1. `-n` (dry-run) every time, no exceptions
2. review the list — untracked files may be work not yet added (`.env.local`, scratch files, new work)
3. files you might want → `git add -N` (intent-to-add protects from clean) or `/git-stash -u`

### 2. Choose Scope

> Goal: delete only what is intended

| Flag | Removes what |
|------|--------|
| `-fd` | untracked files + dirs |
| `-fdx` | + ignored files (build output, ignored `.env*` — careful) |
| `-fdX` | only ignored files (clear build artifacts while keeping untracked sources) |
| `<path>` | restricted to a path |

1. start from the narrowest scope (`<path>` or `-fdX`) before widening
2. `-fdx` is the riskiest — ignored files include `.env`, local config, and hard-to-recreate IDE files

### 3. Execute And Verify

> Goal: deletion matches the preview and the repo still works

1. run clean at the chosen scope
2. `git status` verify — tracked files are never touched (clean only touches untracked/ignored)
3. if ignored deps were deleted → reinstall/rebuild (`bun install` etc.)

## Rules

- `git clean` has no undo — untracked files are not in the object store, they are gone permanently
- always `-n` dry-run first + show the user the file list to delete when the scope is wide
- second-thought the `-x` flag — it swallows ignored files including local secrets/config
- tracked changes are unrelated to clean — use `/git-restore` to discard or `/git-stash`
- Use /ask-me if needed

## Expected Outcome

- untracked/ignored files removed per the previewed scope
- no important files lost by accident

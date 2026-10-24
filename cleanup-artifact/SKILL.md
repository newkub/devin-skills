---
name: cleanup-artifact
description: Delete build artifacts and dependency caches with a Rust CLI — always dry-run first
argument-hint: "[path] [--yes] [--deep] [--min MB]"
related:
  - cleanup-project
  - cleanup-disk-computer
  - delete-git-branch
  - git-worktree
  - run-check
  - run-verify
  - suggest-next-action
  - ask-me
  - report
---

## Goal

Reclaim disk space and restore a clean state by deleting build artifacts and dependency caches (`node_modules`, `target`, `dist`, `.next`, `coverage`, `__pycache__`, `.venv`, etc.) with the Rust CLI in this skill — always dry-run first and report sizes

## Scope

- Covers artifacts across every ecosystem: JS/Bun (`node_modules`, `dist`, `.next`, `.nuxt`, `.output`, `.turbo`, `coverage`), Rust (`target`), Python (`__pycache__`, `.venv`, `.pytest_cache`, `*.egg-info`, `*.pyc`), Go (`vendor`, `bin`), .NET (`bin`, `obj` — only when the parent has a `.csproj`/`.sln`), Java/Kotlin (`.gradle`, `build`), Swift (`.build`), Zig (`zig-out`, `.zig-cache`), CMake (`cmake-build-*`), iOS (`Pods`, `DerivedData`), and general caches (`.cache`, `coverage`, `*.log`)
- Targets are the paths `.gitignore` already marks as build output — read it first, then confirm against the per-stack list
- `--deep` adds global caches: `~/.bun/install/cache`, `~/.npm`, `~/.cargo/registry`, `~/go/pkg/mod`, pip cache, pnpm store, `~/.m2`, `~/.gradle/caches`
- The inverse of `/cleanup-project`, which deletes source files and never touches artifacts
- Stale branches and worktrees are not artifacts — route them to `/delete-git-branch` and `/git-worktree cleanup`

## Execute

### 1. Build CLI

> Goal: have a ready-to-use binary

1. `cargo build --release` in the skill directory — the binary lands at `target/release/cleanup-artifact` (append `.exe` on Windows)
2. If `cargo` is missing → stop and report

### 2. Identify Targets

> Goal: know which paths are artifacts before scanning

1. Read `.gitignore` — only paths it marks as build output are eligible
2. Confirm the stack targets: Node `node_modules/`, `dist/`, `.next/`, `.nuxt/`, `.turbo/`; Rust `target/`; Python `__pycache__/`, `.pytest_cache/`, `*.pyc`; Go `vendor/`, `bin/`; general `.cache/`, `coverage/`, `*.log`
3. If stale branches or worktrees are the real target → `/delete-git-branch` or `/git-worktree cleanup`, not this skill

### 3. Scan And Report

> Goal: know which artifacts exist and how big they are

1. Run `cleanup-artifact <path>` (default `.`) — output is a table sorted by size plus a total
2. Use `--min <MB>` to filter out small dirs on a broad scan
3. Use `--deep` only when global caches are wanted too
4. Present the dry-run output to the user via `/report`

### 4. Confirm And Delete

> Goal: delete only what the user approves

1. Ask the user with `ask_user_question` — delete the reported artifacts, and in which scope (project only / with `--deep` as well)
2. Run `cleanup-artifact <path> --yes` (or `--yes --deep`) for the real deletion — the CLI reports freed space dir by dir
3. Never delete without confirmation — dry-run is always the default
4. Use the stack-native command when only one ecosystem is in scope: `cargo clean`, `bun pm cache rm`, `rm -rf <dir>`
5. If a file is locked → find and close the locking process, then retry the deletion

### 5. Validate

> Goal: confirm the workspace still works

1. Report the freed space from the CLI output
2. Recommend reinstalling when `node_modules`/`.venv` were deleted: `bun install` / `cargo fetch` / `pip install -r requirements.txt`
3. Run `/run-check` to confirm the project still builds and lints; run `/run-verify` when full verification is needed
4. If the build/tests break after deletion → run `/resolve-errors` (a reinstall almost always fixes it)
5. Finish with `/suggest-next-action`

## Rules

### 1. Dry-Run First

- No `--yes` = report only — never delete without confirmation
- `--deep` must be called out explicitly in the confirmation (it touches global caches outside the workspace)

### 2. .gitignore Is The Boundary

- Delete only paths `.gitignore` marks as build output or that a build clearly generated — when a path is ambiguous, leave it and list it as skipped

### 3. Never Touch

- Never delete `.git`, `.devin`, `.env`, lock files, source files, or config files — the CLI already skips `.git`/`.devin`/`.idea`/`.vscode`
- Delete `bin`/`obj` only when the parent has a `.csproj`/`.fsproj`/`.vcxproj`/`.sln` — this guards against deleting a `bin/` that holds user scripts

### 4. Symlink Safe

- The CLI does not follow symlinks/junctions while scanning, and `remove_dir_all` deletes the reparse point without following it to the target — safe on Windows junctions

### 5. Locked Files

- A locked file is a blocker, not a reason to force — identify the locking process, close it, then retry the deletion

- Use `/cleanup-project` if needed (the source-files side)
- Use `/cleanup-disk-computer` if needed (system-wide)
- Use `/delete-git-branch` or `/git-worktree cleanup` if needed (branches and worktrees)
- Use `/suggest-next-action` after finishing to recommend the next step
- Use /ask-me if needed

## Expected Outcome

- A table of artifacts with sizes before deletion (dry-run)
- Artifacts deleted after confirmation, with a freed-space report
- No source/lockfile/.env/.git files touched
- The project still builds after cleanup (`/run-check`, `/run-verify` when needed)
- Reinstall hints when dependency directories were deleted
- A next-step recommendation from `/suggest-next-action`

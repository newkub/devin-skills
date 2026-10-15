---
name: git-restore
description: Recover files/discard uncommitted changes with git restore — working tree, staged, or an old commit
argument-hint: "[files...|--staged|--source <ref>]"
related:
  - restore-files
  - git-revert
  - check-git-logs
  - git-file-history
  - check-uncommit
  - ask-me
  - resolve-errors
---

## Goal

Use `git restore` to manage uncommitted state — discard working-tree changes, unstage files, or recover a file from an older commit — without touching committed history

## Scope

- discard local modifications (`git restore <path>`)
- unstage files (`git restore --staged`)
- recover files/versions from an older commit (`git restore --source=<ref>`)
- does not cover undoing committed changes that were pushed → `/git-revert`; recovering deleted files from deeper history → `/restore-files`

## Execute

### 1. Assess State

> Goal: know what will change before discarding

1. `git status --short` — separate staged, unstaged, untracked
2. `git diff` (unstaged) / `git diff --cached` (staged) — preview what will be lost
3. if a modified file has a change that might be needed later → offer `git stash` instead of discarding

### 2. Choose Mode

> Goal: pick the restore mode matching the intent

| Intent | Command |
|--------|---------|
| discard changes in the working tree | `git restore <path>` |
| unstage (keep changes in the working tree) | `git restore --staged <path>` |
| recover a file from another commit | `git restore --source=<ref> <path>` |
| recover a deleted file (not yet committed) | `git restore <path>` (returns from HEAD/index) |
| discard everything in the repo | `git restore .` — must confirm |

### 3. Confirm And Execute

> Goal: destructive actions get an explicit confirmation

1. discard modes (`restore <path>`, `restore .`) = remove uncommitted work — list the files that will be lost, then confirm first
2. unstage mode is safe — do it directly without confirmation
3. `--source` mode overwrites the working tree — preview `git diff <ref> -- <path>` first
4. run the command, then verify the result with `git status`

### 4. Verify

> Goal: state matches the intent, nothing lost by accident

1. `git status --short` to confirm the files are back to the HEAD/index state
2. if the wrong file was discarded → recover via editor local history or `/restore-files` (git does not store uncommitted changes — no way to recover from git)

## Rules

- `git restore <path>` is destructive on uncommitted changes — always preview + confirm; there is no undo in git
- untracked files are unaffected by `git restore` — deleting them needs `git clean` (another skill, more destructive)
- `--staged` alone = safe, no confirmation needed
- do not use `git restore` in place of `git revert` — restore does not touch history, revert creates an inverse commit
- unsure whether a change matters → `git stash` instead of discarding, always
- Use /check-uncommit if needed

## Expected Outcome

- working tree/staging back to the desired state without affecting committed history
- no uncommitted work lost without confirmation

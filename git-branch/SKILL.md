---
name: git-branch
description: Create/switch/rename branches per convention — upstream tracking and local branch cleanup
argument-hint: "[create|switch|rename|cleanup] [name]"
related:
  - git-commit
  - git-push
  - cleanup-git-branch
  - delete-git-branch
  - check-unpush
  - ask-me
---

## Goal

Manage branches per convention — clear naming, correct upstream tracking, no accumulating local branches

## Scope

- create (`git switch -c`/`branch`), switch, rename (`-m`), upstream (`-u`), list/prune local
- delete → `/delete-git-branch`; merged cleanup → `/cleanup-git-branch` (this skill covers create/manage)
- worktree branches → `/git-worktree`

## Execute

### 1. Choose Name

> Goal: the branch name conveys scope and follows convention

1. common convention: `<type>/<scope>-<short-desc>` — `feat/`, `fix/`, `chore/`, `refactor/` — check `git branch -a` to see the repo's convention first
2. lowercase + hyphens, no spaces/special chars, short but readable
3. if the repo has lint rules for branch names (CI checks) → follow them

### 2. Create And Switch

> Goal: the new branch forks from the correct base

```bash
git switch -c <name>                    # from the current HEAD
git switch -c <name> origin/main        # from the latest main — always fetch first
git switch <name>                       # switch to an existing branch
```

1. `git fetch origin` before branching from a remote base — never branch from a stale local copy
2. confirm the starting point is correct — accidentally branching from another feature branch = a hidden dependency

### 3. Track And Push

> Goal: upstream is set correctly and the first push is right

1. `git push -u origin <name>` the first time — setting the upstream makes `git push`/`git status` work correctly
2. `/check-unpush` to check branches that still have no upstream
3. the remote branch name matches local — never push under a different name without reason

### 4. Rename And Prune

> Goal: fix wrong names and clear local refs

1. `git branch -m <old> <new>` — rename; if already pushed, push the new name + delete the old remote + reset upstream
2. `git fetch --prune` — clear remote-tracking refs the remote has already deleted
3. merged local branches → `/cleanup-git-branch`; unused ones → `/delete-git-branch` (dry-run first)

## Rules

- always branch from the latest base — `git fetch` before `switch -c`
- renaming a pushed branch = recreate + delete the old one — notify collaborators
- never work directly on `main`/`master` — always create a feature branch
- local branches lingering > a week → review with `/cleanup-git-branch`
- Use /ask-me if needed

## Expected Outcome

- branches follow the naming convention and track upstream correctly
- no stale local refs accumulating

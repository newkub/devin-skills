---
name: git-branch
description: Create/switch/rename branches per convention — naming, upstream tracking, ship
argument-hint: "[create|switch|rename|prune] [name]"
related:
  - delete-git-branch
  - check-unpush
  - git-worktree
  - ship
  - ask-me
---

## Goal

Manage branches per convention — create from the correct base with a clear name, track upstream, and hand off to ship

## Scope

- create (`git switch -c`), switch, rename (`-m`), upstream (`-u`), list/prune local
- delete → `/delete-git-branch` (merged sweep, individual, or abandoned, dry-run first); worktrees → `/git-worktree`
- ship → `/ship` after the branch is created and pushed

## Execute

### 1. Determine Base

> Goal: the branch forks from the latest base

1. `git fetch origin` — never branch from a stale local copy
2. Confirm the default branch (`main`/`master`) and that it is up to date
3. `git switch -c <name> origin/main` for a fresh branch; `git switch -c <name>` only when intentionally stacking on the current HEAD

### 2. Choose Name

> Goal: the branch name conveys scope and follows convention

1. Common convention: `<type>/<scope>-<short-desc>` — `feat/`, `fix/`, `chore/`, `refactor/` — check `git branch -a` to see the repo's convention first
2. Ticket-based alternative when the repo uses tickets: `feature/<ticket>-description`, `bugfix/<ticket>-description`, `hotfix/description`, `experiment/description`
3. Lowercase + hyphens, no spaces/special chars, short but readable
4. Repo lint rules / CI branch-name checks win over any default
5. One branch per concern — never mix unrelated changes in one branch

### 3. Create And Switch

> Goal: the new branch exists at the correct commit

1. `git switch -c <name>` from the current HEAD
2. `git switch -c <name> origin/main` from the latest main
3. `git switch <name>` to switch to an existing branch
4. Verify the starting commit — branching from another feature branch creates a hidden dependency
5. Do not create a duplicate branch — check `git branch -a` first

### 4. Track And Push

> Goal: upstream is set correctly and the first push is right

1. `git push -u origin <name>` the first time — upstream makes `git push`/`git status` work correctly
2. The remote branch name matches local — never push under a different name without reason
3. `/check-unpush` to find branches that still have no upstream

### 5. Rename And Prune

> Goal: fix wrong names and clear local refs

1. `git branch -m <old> <new>` — if already pushed, push the new name + delete the old remote + reset upstream and notify collaborators
2. `git fetch --prune` — clear remote-tracking refs the remote has already deleted
3. Merged or abandoned branches → `/delete-git-branch` (dry-run first)

### 6. Ship

> Goal: deliver the work

1. Run `/ship`
2. If `ship` does not pass → report the status

## Rules

- always branch from the latest base — `git fetch` before `switch -c`
- never work directly on `main`/`master` — always create a feature branch
- one branch per concern; never create duplicate branches
- renaming a pushed branch = recreate + delete the old one — notify collaborators
- local branches lingering > a week → review with `/delete-git-branch --merged`
- Use /ask-me if needed

## Expected Outcome

- the branch exists on the latest base with a name that follows convention
- upstream is tracked and the first push is correct
- no stale local or remote-tracking refs accumulate

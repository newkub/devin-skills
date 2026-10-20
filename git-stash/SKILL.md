---
name: git-stash
description: Manage git stash — safe push/pop/apply/list, with untracked and named stash support
argument-hint: "[push|pop|apply|list|drop] [name|index]"
related:
  - git-restore
  - resolve-errors
---

## Goal

Manage uncommitted work with `git stash` — temporarily store changes, restore them, and clear the working tree without losing anything

## Scope

- stash/push, pop, apply, list, show, drop, clear
- untracked files (`-u`) and ignored files (`-a`)
- named stashes (`git stash push -m`)
- does not cover permanent discard → `/git-restore`; committed changes → `/git-revert`

## Execute

### 1. Assess State

> Goal: know what will be stashed and whether stashes are lingering

1. `git status --short` — separate staged/unstaged/untracked
2. `git stash list` — check for old stashes not yet popped (a lingering stash = debt)
3. decide: short work you'll return to soon → stash; work that should be stored permanently → commit to a branch instead

### 2. Stash

> Goal: store the changes completely and findably

1. `git stash push -m "<meaningful message>"` — always name it
2. untracked files need `-u`; ignored files need `-a` (careful — includes build output)
3. staged only: `git stash push --staged`; specific files only: `-- <paths>`
4. verify with `git status` that the working tree is clean as intended

### 3. Restore

> Goal: bring changes back from the right stash at the right time

1. `git stash list` + `git stash show -p stash@{n}` — review content before applying
2. `git stash apply stash@{n}` — safer than pop (the stash survives a conflict)
3. `git stash pop` only when confident there is no conflict — pop deletes the stash immediately after a successful apply
4. conflict → resolve, then `git stash drop stash@{n}` yourself once the merge is done
5. to keep the original index state (staged vs unstaged) → `--index`

### 4. Cleanup

> Goal: do not accumulate stale stashes

1. `git stash drop stash@{n}` one by one after a successful apply
2. `git stash clear` deletes everything — must confirm and list first, always

## Rules

- always `git stash push -m` — no anonymous stashes (unfindable when you come back)
- prefer `apply` over `pop` — pop deletes the stash immediately, hard to recover if the conflict goes badly
- stash is not permanent storage — work pending >1 day should be committed to a branch
- untracked files are not stashed without `-u` — an easy thing to forget
- Use /resolve-errors if needed

## Expected Outcome

- working tree clean per intent with no uncommitted work lost
- stashes are named, findable, and no stale entries accumulate

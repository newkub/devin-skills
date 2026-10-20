---
name: git-worktree
description: Manage git worktrees — work on multiple branches at once without stash/switch
argument-hint: "[add|list|remove] [path] [branch]"
related:
  - cleanup-worktree
  - delete-git-worktree
  - git-stash
  - ask-me
---

## Goal

Use `git worktree` to check out multiple branches at once in separate directories — parallel work without stash/switch

## Scope

- `git worktree add/list/remove/move/lock`
- use when working on >1 branch at a time (reviewing a PR while a feature is in progress, hotfixing amid pending work)
- cleaning up old worktrees → `/cleanup-worktree`; delete → `/delete-git-worktree`

## Execute

### 1. Decide Need

> Goal: a worktree genuinely fits this task

1. need to run/test another branch while the current working tree has pending work → worktree
2. just viewing a file temporarily → `git show <branch>:<path>` is enough, no worktree
3. each worktree = a real directory + full-copy disk space — consider the repo size

### 2. Add Worktree

> Goal: the new worktree is created at the right path and branch

```bash
git worktree add ../<repo>-<branch-name> <branch>      # existing branch
git worktree add -b <new-branch> ../<repo>-<name> <base>  # create a new branch at the same time
git worktree add --detach ../<repo>-review <sha>        # detached for review
```

1. naming: `<repo>-<purpose>` as a sibling dir — never nest a worktree inside a worktree
2. a branch checked out elsewhere cannot be checked out again — use detached or create a new branch
3. a new worktree has no ignored files (`.env`, `node_modules`) — copy/install as needed

### 3. Work In Worktree

> Goal: working in a worktree is like a normal repo

1. `cd <worktree>` then work normally — all git commands run in that branch's context
2. commits in the worktree go straight to its branch — no sync step
3. `.env`/deps must be set up yourself — the worktree does not copy ignored files

### 4. Remove

> Goal: the worktree is removed properly when done

1. `git worktree remove <path>` — removable when clean (no pending changes)
2. pending changes → commit or `/git-stash` inside that worktree first — or `--force` (destructive, confirm)
3. `git worktree list` + `git worktree prune` — clear the metadata of worktrees deleted by hand

## Rules

- a worktree = a real working directory — changes there are real uncommitted work, not a sandbox
- never check out the same branch in 2 worktrees — git already blocks it; use detached instead
- deleting the worktree directory by hand → must run `git worktree prune` to clear metadata
- lingering worktrees → run `/cleanup-worktree` periodically
- Use /ask-me if needed

## Expected Outcome

- multiple branches worked in parallel without stash/switch
- worktrees are tracked in `git worktree list` and cleaned up when done

---
name: git-worktree
description: Manage git worktrees — add, list, remove, cleanup; work on multiple branches without stash/switch
argument-hint: "[add|list|remove|cleanup] [path] [branch]"
related:
  - use-git-worktrees
  - git-stash
  - delete-git-branch
  - report
  - suggest-next-action
  - ask-me
---

## Goal

Use `git worktree` to check out multiple branches at once in separate directories — parallel work without stash/switch, plus list, remove, and cleanup of existing worktrees

## Scope

| Argument | Mode |
|---|---|
| `add` (default) | create and work in a new worktree — steps 1–3 |
| `list` | show every worktree with path, branch, commit, status — step 4, read-only |
| `remove <path>` | delete one specified worktree safely — step 5 |
| `cleanup` | sweep all unused worktrees and prune stale tracking — step 6 |

- use when working on >1 branch at a time (reviewing a PR while a feature is in progress, hotfixing amid pending work)
- full create→merge-back→cleanup lifecycle guide → `/use-git-worktrees`

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

### 4. List Worktrees

> Goal: know every worktree and its state (read-only)

1. Run `git worktree list`, or `git worktree list --porcelain` for parsing
2. For each record extract: `Path`, `Branch` (or `detached`), `Commit SHA`, `Status` (`locked`, `prunable`, `bare`)
3. Run `git branch --all --contains <commit>` when branch membership matters; state whether the branch is checked out
4. Bare repo → mark the worktree path per the bare structure
5. Report via `/report` with columns `No. | Path | Branch | Commit | Status`; a bullet list when there are few
6. List mode never creates, deletes, or modifies worktrees

### 5. Remove One Worktree

> Goal: the specified worktree is removed without harming the parent repository

1. Identify the target: `git worktree list` (or step 4) → confirm the path with the user
2. Check status: `git -C <worktree-path> status --porcelain` — uncommitted/untracked changes → stop and ask first
3. Run `git worktree remove <path>`; locked or undeductable → `git worktree unlock <path>` first, then `--force` only when a normal remove is impossible and the user accepts the discard — state the reason before forcing
4. Run `git worktree prune` and verify with `git worktree list` again
5. Removing a worktree does not delete its branch — to delete the branch too → `/delete-git-branch`

### 6. Cleanup Unused Worktrees

> Goal: remove unwanted worktrees, reclaim disk, prune stale tracking

1. List all worktrees (step 4); identify the main worktree; candidates = not main AND no uncommitted changes
2. Per candidate: `git status --short` inside it — changes → report and stop unless the user confirms; check the branch has no important unpushed work, or still exists on the remote
3. If any risk → `/suggest-next-action` before touching it
4. Remove each accepted candidate via step 5 (unlock/prune included)
5. Prune orphaned tracking: `git worktree prune --dry-run` to preview → `git worktree prune`; never prune worktrees still in use
6. Verify: report `No. | Path | Branch | Action | Status` via `/report`, confirm the main working directory is unaffected, run `/suggest-next-action`

## Rules

### 1. Worktree Discipline

- a worktree = a real working directory — changes there are real uncommitted work, not a sandbox
- never check out the same branch in 2 worktrees — git already blocks it; use detached instead
- deleting the worktree directory by hand → must run `git worktree prune` to clear metadata
- lingering worktrees → run step 6 (cleanup mode) periodically; for dependency/build cache reclamation use `/cleanup-artifact` and `/run-clean`

### 2. Delete Safety

- remove, `--force`, and prune → dry preview and user confirmation first
- never remove the main working directory
- never remove a worktree with uncommitted changes without asking; recommend commit or `/git-stash` first
- never delete a branch or remote work as part of worktree removal — branch removal is `/delete-git-branch` only
- verify the branch still exists (locally or on the remote) after removing a worktree

- Use /ask-me if needed
- Use /use-git-worktrees if needed
- Use /report if needed
- Use /suggest-next-action if needed

## Expected Outcome

- multiple branches worked in parallel without stash/switch
- `list` mode: a complete worktree table with path, branch, commit, status and no side effects
- `remove` mode: the target worktree is gone from `git worktree list`, the branch still exists, no uncommitted work lost
- `cleanup` mode: unused worktrees removed, stale tracking pruned, main working directory unaffected

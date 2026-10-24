---
name: delete-git-branch
description: Delete git branches — merged sweep, individual, or abandoned, dry-run first
argument-hint: "[branch|filter] [--merged] [base] [--remote]"
related:
  - git-branch
  - cleanup
  - git-worktree
  - check-unpush
  - ask-me
  - report
---

## Goal

Delete branches safely — a merged sweep of everything already in the base branch, or targeted deletion of individual and abandoned branches

## Scope

- Merged sweep (`--merged`): every local branch merged into the base (default `main`), plus remote branches when `--remote` is also given
- Ad-hoc deletion: one branch or a small group matched by `[branch|filter]`, including abandoned (unmerged) branches
- Skip: the base branch, the current checkout, and protected patterns (`main`, `master`, `develop`, `release/*`, `hotfix/*`)
- Destructive: always requires a dry-run report + user confirmation

## Execute

### 1. Survey Branches

> Goal: gather all branches and their status

1. `git fetch --prune` to sync remote refs — stale refs make the list wrong
2. `git branch --merged <base>` for merged local branches; `git branch -r --merged <base>` for remote
3. Ad-hoc target: `git branch --list <filter>` plus `git log -1 --format="%ad %s" --date=iso <branch>` for recent activity
4. Cross-check GitHub with `gh pr list --state merged` (and open PRs when the base is on GitHub)

### 2. Build Deletion List

> Goal: build the list of branches that are safe to delete

1. Skip the base branch, the current checkout, and protected patterns (`main`, `master`, `develop`, `release/*`, `hotfix/*`)
2. Flag branches that are merged but have unmerged commits on their remote counterpart
3. Flag branches that are merged but still have an open PR — it could be reopened
4. Keep only: merged + no open PR + not protected
5. For an abandoned branch: verify there is no unmerged work worth keeping, and back up the ref (`git tag backup/<branch> <branch>`) when there is any risk

### 3. Dry-Run Report

> Goal: show what will be deleted before doing it

1. Report via `/report` with columns: `No.`, `Branch`, `Local/Remote`, `Merged Into`, `Last Commit`, `Safe`
2. State the total count and every skipped branch with its reason
3. Wait for user confirmation via `/ask-me` before deleting anything

### 4. Delete

> Goal: delete exactly what was confirmed

1. Merged local: `git branch -d <branch>` — safe delete, refuses unmerged branches
2. Unmerged/abandoned: `git branch -D <branch>` only with explicit approval for that branch, stating the commits that will be lost
3. Remote (only with `--remote` and confirmation): `git push origin --delete <branch>` (or `git push origin :<branch>`)
4. If `-d` fails → never force `-D` on your own — report it and let the user decide

### 5. Cleanup And Report

> Goal: confirm the repository is clean

1. `git fetch --prune` + `git branch -vv` to verify tracking
2. Result table via `/report`: deleted, skipped, failed — each with its reason
3. Note that deleting a branch does not delete tags pointing at its commits; check with `/list-git-tags` when relevant

## Rules

### 1. Confirmation Required

- Never delete any branch without a dry-run report and user confirmation
- Use `-d` (safe), not `-D` (force), unless the user explicitly approves that specific branch

### 2. Protect Critical Branches

- The base branch, the current branch, and protected patterns must never appear in the deletion list
- Never delete `main`/`master`/the default branch
- Branches with an open PR or unmerged commits must be flagged, not deleted
- Keep `release/*` and `hotfix/*` per project policy

### 3. Sync First

- Always `git fetch --prune` before listing
- Perform remote deletions only when the user passes `--remote` and confirms

- Use /git-worktree cleanup if needed
- Use /check-unpush if needed
- Use /git-branch create if needed

## Expected Outcome

- Merged branches deleted safely, local and remote (when selected)
- Protected and open-PR branches left untouched
- A deleted/skipped report with complete reasons
- No commits lost without explicit intent; refs backed up when there was any risk

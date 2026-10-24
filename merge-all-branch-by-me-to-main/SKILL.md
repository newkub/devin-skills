---
name: merge-all-branch-by-me-to-main
description: Merge only branches created by the user into main, then delete all old branches, leaving only main
argument-hint: "[--dry-run] [--remote] [--force-unmerged]"
related:
  - merge
  - delete
  - resolve-merge-conflicts
  - refactor-commit
  - git-push
  - report
  - resolve-errors
  - ask-me
---

## Goal

Merge only branches created by `git config user.name` / `user.email` or the committer into `main` in order, then delete all old branches leaving only `main`

## Scope

Use when you need to merge branches you created back into `main` and clean up the repo — it is a destructive workflow, so it requires a dry-run and user confirmation before actually deleting. It does not include resolving PRs on the remote (use `/merge-github-pr` or `/resolve-github-pr`)

If you need to merge branches that are not yours → you must check the branch owner and ask permission first. There is no skill that auto-merges everything available by default

## Execute

### 1. Inventory Branches

> Goal: know which branches exist and which ones belong to the user

1. Do `/list-git-branch` or `git branch -a` to collect the full list of names
2. Identify the user identity from `git config user.name` / `user.email` or `gh auth status`
3. Check branches that are already merged with `git branch --merged main`
4. Check unmerged branches with `git branch --no-merged main`
5. Filter down to only branches that are the user's: branch tip or latest commit has an author/committer matching the user
   - Use `git log -1 --format='%an <%ae>' <branch>` compared with `git config user.name` / `user.email`
   - If unclear, look at the majority of commits on the branch to see whether they come from the user

### 2. Preflight Safety Checks

> Goal: confirm the repo is ready before merge

1. Check the working tree is clean with `git status --porcelain` — if there are uncommitted changes → stop and notify
2. `git switch main` then `git pull` so main is current
3. Check that the remote `main` does not diverge from local

### 3. Dry Run Plan

> Goal: show the plan before doing it for real

1. Build a table: branch → commits ahead/behind → merged? → created by → action (merge/delete/skip)
2. Do `/report` to show the plan along with branches that will be deleted
3. If there are unmerged branches → notify that an attempt to merge will be made and where it will conflict
4. Do `/ask-me` to have the user confirm before proceeding

### 4. Merge Branches Into Main

> Goal: merge the user's branches into main in order of risk

1. Order the branches: merged-already → fast-forward-able → unmerged (low conflict risk → high)
2. Do `git merge <branch>` one branch at a time — use `--no-ff` if the project wants history
3. If there is a conflict → do `/resolve-merge-conflicts` or stop and report that branch
4. After each merge, verify build/test per `AGENTS.md` if defined

### 5. Verify Main

> Goal: main must be usable after all merges

1. Run tests/build per project conventions (`/run-verify` or equivalent)
2. If it fails → fix it with `/resolve-errors` or roll back the merge that broke it
3. Confirm main has the commits of every branch that was wanted

### 6. Delete Old Branches

> Goal: delete the user's old branches after a successful merge

1. Delete merged local branches with `git branch -d <branch>` — use `/delete-git-branch --merged`
2. Unmerged branches that have now merged successfully → `git branch -d` is fine; ones not yet merged → do not delete unless the user confirms `--force-unmerged`
3. If `--remote` → delete remote branches with `git push origin --delete <branch>` only for those merged and already confirmed
4. Prune stale remote refs with `git fetch --prune`

### 7. Finalize And Report

> Goal: the repo is left with only main

1. `git branch` to confirm only `main` remains
2. If you need to sync the remote → `/git-push` or `git push origin main`
3. Do `/report` summarizing: merged, deleted, skipped, conflicts, remaining branches

### Subagents

> Goal: delegate merge one branch at a time in the order defined by the plan

- Use the `branch-merger` profile (see `## Subagents` below) in Step 4 to merge a single branch per agent via `/use-subagents` — pass `branch`, `strategy`, `conflict-policy`, `verify-commands` then combine the merged/conflict report one at a time before Step 5
- Caution: merging into `main` must be done one branch at a time in order (shared working tree) — spawn as sequential dispatch only. Never run multiple branches concurrently in the same repo

## Rules

### 1. Author Filter

- Only merge branches whose `git log -1` shows an author/committer matching `git config user.name` / `user.email`
- If a branch does not clearly have the user's identity → skip or ask first
- Never merge or delete a branch created by someone else without separate confirmation

### 2. Destructive Safety

- Always require a dry-run + `/ask-me` before actually merging/deleting
- Never `git branch -D` unless the user confirms `--force-unmerged`
- Never delete `main`, protected branches, or the current branch
- Never delete remote branches without specifying `--remote` and separate confirmation

### 3. No Data Loss

- If a branch has commits that are not yet merged → you must notify the user, do not delete it yourself
- After deleting every branch it must be recoverable via `git reflog`
- Never force-push `main`

### 4. Order And Atomicity

- Merge one branch at a time
- If any merge fails → stop and report
- Delete branches only after main is verified to pass
- If a merged branch has a messy history → do `/refactor-commit` on that branch before merge

## Subagents

> Goal: independent work that can be spawned in parallel — the profile lives right in this section, no separate file needed

### branch-merger — merge a single branch of the user into `main` then return a merged/conflict report

- `Inputs`: `branch` (the single branch to merge, e.g. `feature/x`), `repo-path` (the path of the repo), `strategy` (optional — `merge` default or `rebase` per project convention), `conflict-policy` (optional — `resolve` = agent fixes it itself, `report` = stop and return the conflict, `ours`/`theirs`), `verify-commands` (optional — commands after merge such as `bun run test`, `bun run build`), `delete-after` (optional — `true` = delete the local branch after a successful merge, using `git branch -d` only)
- `Tools`: `exec` — git commands `git switch`, `git merge`, `git rebase`, `git status`, `git diff`, `git log`, `git branch -d`; `read`/`edit` — read and resolve conflict files only when `conflict-policy` = `resolve`; no `git push` — the parent does the push/finalize
- `Execute`:
  1. Confirm the branch belongs to the user: `git log -1 --format='%an <%ae>' <branch>` compared to `git config user.name`/`user.email` — if it does not match return `skipped`
  2. `git switch main` and confirm main is current per the state the parent prepared
  3. Try merging `git merge <branch>` (`--no-ff` if the strategy defines it) or `git rebase main` on the branch then fast-forward
  4. If there is a conflict → per `conflict-policy`: `resolve` = fix the files then `git add` + continue; `report` = `git merge --abort` then return `conflict` with the file list
  5. Run `verify-commands` — on failure → report `failed` and specify how you reverted or left the state
  6. If `delete-after` and the merge succeeded → `git branch -d <branch>` (never `-D`)
- `Output`: a table `| No. | Branch | Strategy | Result | Conflicts | Verify | Deleted |` — `result`: `merged`/`conflict`/`failed`/`skipped`; if `conflict` → attach a conflict files table (`file`, `reason` content/add-delete, `suggested resolution`); close with the merge commit hash and the number of commits that entered main
- `Constraints`: responsible for only a single branch, never merge/delete another branch; never force-push, `git branch -D`, or delete `main`/protected branches; if a merge fails partway → `git merge --abort`/`git rebase --abort` to return to the original state before reporting; `delete-after` uses `-d` only — if unmerged, return `skipped` rather than forcing; every action must be recoverable via `git reflog` — specify reflog hints if `failed`

## Expected Outcome

- Every branch the user created is merged into `main` successfully or has a clear reason
- The user's old branches are deleted as confirmed, leaving only `main`
- `main` passes verification and is recoverable via reflog
- A summary report of merged/deleted/skipped with evidence

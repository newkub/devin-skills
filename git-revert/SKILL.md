---
name: git-revert
description: Safely revert commits with a new inverse commit — no history rewrite
argument-hint: "[sha|range|merge-sha]"
related:
  - git-commit
  - git-push
  - check-git-logs
  - git-file-history
  - check-merge-conflicts
  - run-check
  - resolve-errors
---

## Goal

Undo the effect of commit(s) with `git revert` — create a new inverse commit instead of rewriting history, safe for commits already pushed

## Scope

- revert a single commit, a range of commits, or a merge commit
- use when a pushed change must be undone — if not yet pushed and the commit should really be removed → consider `/restore-files` or reset (requires confirmation)
- does not cover undoing uncommitted changes — use `/git-restore` instead

## Execute

### 1. Identify Target

> Goal: clearly identify the commit(s) to revert

1. if the user gives a sha/range → use it directly; otherwise → run `/check-git-logs` to find the target commit
2. review the content with `git show <sha>` — confirm it is really the change to undo
3. check whether the commit is a merge commit (look at the `Merge:` header in `git show`) and whether later commits touched the same files (conflict risk)

### 2. Dry-Run Preview

> Goal: know the outcome before writing the new commit

1. `git revert --no-commit <sha>` then `git diff --cached` to see the inverse change
2. if it conflicts → `git revert --abort`, then re-plan or resolve per step 3
3. `git reset` to clear the staged state after previewing (if not ready to commit)

### 3. Revert

> Goal: create a correct inverse commit

1. single commit: `git revert <sha>` — auto-generated message, editable to match the project's conventional commits
2. range: `git revert <oldest>^..<newest>` or `--no-commit` one by one then a single squashed message if it is one change set
3. merge commit: `git revert -m 1 <merge-sha>` (parent 1 = mainline) — specify the mainline correctly, never guess
4. if it conflicts: fix the files, `git add`, `git revert --continue` — `git revert --abort` always works to cancel

### 4. Verify And Report

> Goal: the working tree is back to the state before that commit and the build passes

1. `git show HEAD` to check the inverse diff; compare the tree with `git diff <sha>^ HEAD` if this was the latest revert
2. run `/run-check` — a revert can break build/tests (later commits may depend on the reverted code)
3. report via `/report`: reverted commits, conflicts, files touched

## Rules

- never `git reset`/`rebase` to undo commits already pushed — always use revert (history is public)
- merge commits need `-m 1` (or the correct parent) — never revert a merge without specifying the parent
- reverting several consecutive commits → revert newest to oldest to reduce conflicts
- if the revert breaks tests/build → run `/resolve-errors` — never commit a revert that silently breaks main
- revert of a revert = re-apply — if the change should come back, revert the revert commit, do not re-cherry-pick the original
- Use /resolve-errors if needed

## Expected Outcome

- inverse commit(s) created — the linear history is not rewritten
- working tree back to the state before the target change, passing `/run-check`

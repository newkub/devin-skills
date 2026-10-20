---
name: push-all-projects-in-drive-d
description: Push unpushed commits in every git project on drive D via check-unpush + git-push per repo
argument-hint: "[filter]"
allowed-tools:
  - exec
  - read
  - grep
  - find_file_by_name
  - ask_user_question
related:
  - list-projects-git-in-drive-d
  - check-unpush
  - git-push
  - refactor-commit
  - commit-all-projects-in-drive-d
  - report
  - ask-me
  - suggest-next-action
---

## Goal

Safely push the commits that are not yet on the remote for every git project in `D:\` — scan with `/check-unpush` first, then push per repo/branch via `/git-push` without rewriting history

## Scope

Use when you want to push already-committed work for every repo in `D:\` at once. Supports a `filter` by name/keyword — does not include committing (use `/commit-all-projects-in-drive-d` first if still dirty)

## Execute

### 1. List Target Projects

> Goal: Identify the projects to push

1. If the user specifies a `filter` → run `/search-project-in-drive-d <filter>` to filter projects
2. If not specified → run `/list-projects-git-in-drive-d` for the full list
3. Check that the list has at least 1 project; if none → stop and report

### 2. Check Unpush Per Project

> Goal: Keep only the repos/branches with commits waiting to be pushed

1. Run `/check-unpush` on every project in the list — `git status -sb`, `git log '@{u}..HEAD' --oneline`, `for-each-ref` upstream tracking
2. Skip repos that are `clean` — no ahead commits
3. Flag repos that are `no-remote`, `unreachable`, have a `gone` upstream, or `no-upstream` branches — set aside for the report
4. Also flag repos that are behind the remote — the push will be rejected, so a pull is needed first
5. Show the list of repos/branches to push with ahead counts

### 3. Confirm Push Plan

> Goal: The user chooses the scope before pushing

1. Ask the user with `/ask-me`:
   - `current` — push only the current branch per repo (default)
   - `all-branches` — push every local branch that is ahead
   - `select` — the user selects repos
   - `dry-run` — show the push plan without pushing
2. Ask whether `no-upstream` branches should be `git push -u origin <branch>` directly or skipped
3. If the user does not answer → stop and report — never push without confirmation

### 4. Push Each Project

> Goal: Push every selected repo/branch

1. Loop sequentially through the list
2. Run `/git-push` per repo/branch — normal `git push` only
3. For `no-upstream` branches the user allows → `git push -u origin <branch>`
4. For repos that are behind → skip and report that `git pull` is needed first — never force push
5. If the unpushed commits are messy → recommend `/refactor-commit` instead of pushing, and skip that repo
6. If there are more than 5 independent repos → you may use `/use-subagents` to split per repo, then merge the reports

### 5. Verify

> Goal: Confirm that the commits are all on the remote

1. Re-run `/check-unpush` on the repos that were pushed
2. For repos still ahead → state the cause (rejected, unreachable, skipped)

### 6. Report Summary

> Goal: Summarize the push results

1. Use `/report` with columns: `No.`, `Project`, `Path`, `Branch`, `Pushed`, `Status`
2. Status: `pushed`, `clean`, `skipped`, `error`, `no-remote`, `behind`, `flagged`
3. State the count of each type
4. Run `/suggest-next-action`

## Rules

### 1. Drive D Scope Only

- Work only on paths starting with `D:\` or `/mnt/d` (WSL)
- Do not touch other drives without permission
- Check the drive letter before every execution

### 2. Confirm Before Push

- Always pass an `/ask-me` confirmation before pushing — dry run shows the plan first
- Never `git push --force`, `--force-with-lease`, or rewrite pushed history under any circumstances
- Never push a repo that is behind the remote — report that a pull is needed first

### 3. Network Aware

- If the remote is unreachable → flag `unreachable`, skip that repo, do not retry-loop
- Use a short timeout for remote checks — if offline → report from local tracking info

### 4. No Commit

- This skill only pushes — no committing, no modifying the working tree
- If a repo is still dirty → recommend `/commit-all-projects-in-drive-d` first

### 5. Idempotency

- Re-running does not push again — up-to-date repos/branches are always skipped

- Use /check-uncommit if needed
- Use /refactor-commit if needed

## Expected Outcome

- Every repo that is ahead in `D:\` is pushed to the remote (or skipped with a reason)
- No force push or history rewrite occurs
- A summary report of the status of every repo/branch, along with repos needing a pull or having remote problems

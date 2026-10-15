---
name: list-git-commit
description: Report git log — commits, stats, and insights in a readable form
argument-hint: "[ref]"
related:
  - git-commit
  - report
---

## Goal

Report the git log as an easy-to-read summary covering recent commits, statistics, and insights from history

## Scope

Use after `/git-commit` to review the growing history, or when the user wants a git-log summary of a period, without modifying history

## Execute

### 1. Resolve Log Range

> Goal: determine the commit range to report

1. If the user gives a range (e.g. `v1.0.0..v2.0.0`, `HEAD~10`) → use it
2. Otherwise → use `HEAD~10..HEAD` or the default `git log --oneline -10`
3. Validate the range with `git rev-parse` or `git log --quiet`

### 2. Fetch Log Data

> Goal: collect commit data with `git log`

1. Run `git log --oneline --decorate --graph <range>` for the overview
2. Run `git log --pretty=format:"%h|%an|%ad|%s" --date=short <range>` for per-commit data
3. For more detail → run `git log --stat <range>`
4. Store the commit data for the summary

### 3. Categorize Commits

> Goal: group commits by conventional-commits type

1. Split commit messages by prefix: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`, `chore:`
2. Count commits per type
3. Identify frequent scopes (e.g. `api`, `ui`, `config`, `test`)
4. Summarize the top contributors by author

### 4. Report Summary

> Goal: present the git log in an understandable form

1. Use `/report` to build the commits table (# | Hash | Author | Date | Type | Subject)
2. Show overall stats: commit count, files changed (with `--stat`), dominant type
3. Summarize insights: breaking changes, recurring scopes, trends of the commit range

## Rules

### 1. Read Only

- Use `git log` only; never run `git reset`, `git rebase`, or history-changing commands
- Do not modify files or tags while reporting

### 2. Deterministic Output

- Re-running with the same range must produce the same result
- Use `--date=short` or `--date=iso` for a stable format

### 3. Conventional Commits Awareness

- When commit messages don't follow conventional commits → state that
- Extract `scope` from `(<scope>):` when present

### 4. Range Safety

- Verify the range actually exists before running `git log`
- If the range is invalid → stop and report without running

## Expected Outcome

- A git-log report as a readable commits table
- Commit-type statistics and top contributors
- Short insights for the commit range
- No git history modified

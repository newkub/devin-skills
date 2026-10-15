---
name: git-commit-no-verify
description: Commit the changed files while skipping pre-commit hooks with `git commit --no-verify`
related:
  - git-commit
---

## Goal

Commit the changed files while skipping pre-commit hooks with `git commit --no-verify`

## Scope

Use when pre-commit hooks fail, are slow, or block an intended commit — always requires user confirmation first

## Execute

### 1. Check Status

> Goal: check the files to commit

1. Run `git status --short`
2. Run `git diff --cached --name-only` to see staged files
3. If nothing is staged yet → stop and ask to stage first

### 2. Verify Reason

> Goal: confirm `--no-verify` is genuinely needed

1. ask the user why the hooks must be bypassed
2. if the bypass is because pre-commit failed → record the reason for fixing later
3. if the user does not confirm → use `/git-commit` instead

### 3. Review Staged Diff

> Goal: verify correctness before committing

1. Run `git diff --cached --stat`
2. If unrelated files are present → separate them first
3. Review the draft message

### 4. Execute Commit

> Goal: commit while skipping hooks

1. if there is a message from the user run `git commit --no-verify -m "<message>"`
2. if there is no message → run `git commit --no-verify` then edit in the editor
3. check the exit code

### 5. Post-Commit

> Goal: verify and plan the hook fix

1. Run `git log --oneline -3`
2. Run `git status --short`
3. if the bypass was because a hook failed → create a TODO to fix via `/run-check` or `/run-verify` later

## Rules

### 1. No Automatic Add

- never use `git add .` in this skill
- commit only files that are already staged

### 2. User Confirmation

- ask the user before using `--no-verify`
- explain the risk: hooks will not run and the commit may bring unchecked files into the repo

### 3. Message Format

- use conventional commits like `/git-commit`
- subject no more than 72 characters
- use English

### 4. Post-Commit Discipline

- if a hook failed there must be a fix plan
- use `/run-check` or `/run-verify` afterwards to verify
- never use `--no-verify` to hide an error that must be fixed

- Use `/git-commit` when hooks work normally
- Use `/git-commit selected-files` when you want to commit specific files
- Use `/git-commit-and-push` when you want to push at the same time
- Use `/run-check` or `/run-verify` before `--no-verify` when possible
- Use `/resolve-errors` when a hook fails and the root cause must be fixed
- Use `/refactor-commit` if history needs adjusting

## Expected Outcome

- staged files committed without running pre-commit hooks
- the user confirmed the bypass
- a conventional-commits message exists
- a plan to check or fix the hooks later exists
- the working directory is clean for the intended commit files

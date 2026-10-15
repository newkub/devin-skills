---
name: git-commit-and-push
description: Commit files, push to the remote repository, and resolve CI/CD until they pass
argument-hint: "[scope]"
related:
  - git-commit
  - git-push
  - resolve-cicd
  - refactor-commit
  - update-references
  - follow-monorepo
  - scan-codebase
  - scan-security
---

## Goal

Commit files, push to the remote repository, and resolve CI/CD until it passes live or healthy

## Scope

Use to commit, push, and track/resolve CI/CD in one go — an orchestrator that calls `/git-commit`, `/git-push` and `/resolve-cicd`

## Execute

### 1. Commit Changes

> Goal: create a commit for the changed files

1. Follow `/git-commit`
2. Verify with `git log --oneline -3` that the commit was created correctly

### 2. Refactor Commits (Optional)

> Goal: improve the commit history before pushing

1. if the commit history needs refactoring (break down, squash, fixup) → run `/refactor-commit` before push
2. if the branch is already shared with the team → stop and ask the user to confirm before force pushing
3. if no refactor is needed → skip to the next step

### 3. Push Changes

> Goal: Push commits to the remote repository

1. Follow `/git-push` (including the scan gates `/scan-codebase` and `/scan-security` when applicable, per `/git-push`)
2. Verify with `git status` that local and remote are in sync

### 4. Resolve CI/CD

> Goal: track and resolve the CI/CD triggered by the push until it passes

1. Follow `/resolve-cicd` to track the CI/CD pipelines triggered by the push
2. if CI/CD passes → go to the next step
3. if CI/CD fails → `/resolve-cicd` will resolve, re-run, re-deploy until it passes (max 5 rounds)
4. if it exceeds 5 rounds → stop and report with a rollback recommendation

### 5. Update References

> Goal: update all related references

1. Follow `/update-references`

## Rules
> Goal: act as a safe orchestrator that does not break history and resolves CI/CD until green

- act as an orchestrator only — the details live in `/git-commit`, `/git-push` and `/resolve-cicd`
- if the push is rejected, stop and inform the user; do not force push
- if this is a monorepo, run `/follow-monorepo` before committing
- never force-push or rewrite history while resolving CI/CD
- if resolving CI/CD requires code changes → stage only the files related to the root cause

## Expected Outcome

1. Changes committed per conventional commits
2. Changes pushed to the remote repository
3. CI/CD pipeline passes, or CD is live/healthy, or the release succeeds
4. Git history is clean and easy to follow
5. If it does not pass, there is a last green SHA and a clear rollback recommendation

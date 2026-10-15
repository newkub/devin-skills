---
name: git-commit-at-devin-global-skills
description: Commit every changed file in the devin global skills repo after `review-devin-global-harness`, `deep-validate` and `review-devin-global-harness` pass the criteria
related:
  - git-commit
---

## Goal

Commit every changed file in the devin global skills repo after `review-devin-global-harness`, `deep-validate` and `review-devin-global-harness` pass the criteria

## Scope

Use for `%APPDATA%\devin\skills` on Windows or `~/.devin/skills` on Unix

- a wrapper around `/git-commit` that adds pre-commit validation for devin global skills
- not a tool for push, deploy or merge — if you need to push, use `/git-commit-and-push` afterwards
- does not fix code itself — if validation finds Critical/High, stop and hand over to `/resolve-errors`

## Execute

### 1. Navigate And Check Status

> Goal: verify you are in the correct repo and there are real changes

1. Change the working directory to `%APPDATA%\devin\skills`
2. Run `git status --porcelain`
3. If there are no changes to commit → stop and report `no changes to commit`

### 2. Review Devin Global Skills

> Goal: check conventions and cross-skill consistency

1. Run `/review-devin-global-harness`
2. Record findings, severity and category
3. If there are Critical or High → stop, report, recommend `/resolve-errors`

### 3. Deep Validate

> Goal: detailed correctness check of the changed skills

1. Run `/deep-validate` on the changed scope
2. Record findings with severity
3. If there are Critical or High → stop, report, recommend `/resolve-errors`

### 4. Check Skill References

> Goal: find broken references and circular dependencies between skills

1. Run `/review-devin-global-harness`
2. If broken references are found → stop, recommend `/update-references` and wait for the user to fix
3. Run `/follow-tool-madge` if `related` was edited
4. If it passes → continue

### 5. Stage Changes

> Goal: prepare files for a safe commit

1. Run `git diff --name-only` to see the files to stage
2. Run `git add .` inside `%APPDATA%\devin\skills`
3. Run `git diff --cached --stat` to review
4. If there are out-of-scope files or files that should not be committed → separate them first

### 6. Commit

> Goal: create the commit following conventional commits

1. Run `/git-commit`
2. If `git-commit` fails → read the error, fix, then retry
3. If you need to scope to one specific skill → use `/git-commit selected-files` instead

### 7. Verify

> Goal: confirm the commit is correct and the working directory is clean

1. Run `git log --oneline -5`
2. Run `git status --porcelain`
3. If the working directory is clean → report success
4. If files remain → report and recommend the next action via `/suggest-next-action`

## Rules

### 1. Repo Scope

- use only in the devin global skills repo
- never commit files outside `%APPDATA%\devin\skills` or `~/.devin/skills`

### 2. Validation Gate

- must pass `/review-devin-global-harness`, `/deep-validate` and `/review-devin-global-harness` before committing
- if there are Critical/High findings, stop and hand over to `/resolve-errors`
- never use `--no-verify` to bypass validation

### 3. Commit Discipline

- use `/git-commit` to keep the conventional commits standard
- subject no more than 72 characters
- English only in the commit message

### 4. Post-Commit

- if you need to push, use `/git-commit-and-push`
- if you need to refactor history, use `/refactor-commit`
- if there are findings after committing, use `/resolve-errors`

- Use `/run-check` if needed
- Use `/report` if you want a summary
- Always use `/suggest-next-action` when finishing

## Expected Outcome

- every changed skill is reviewed/validated/references checked before committing
- the commit is created with conventional commits
- the working directory is clean
- no Critical/High findings left behind
- a summary report of validation and commit exists

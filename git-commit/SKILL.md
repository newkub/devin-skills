---
name: git-commit
description: Commit every changed file with conventional commits
argument-hint: "[scope]"
related:
  - run-check
  - run-verify
  - follow-tool-hk
  - list-git
  - refactor-commit
  - deep-review-codebase
  - ship

---
## Goal

Commit every changed file in the global devin skills directory following the conventional commits standard

## Scope

- variants: no-verify/selected-files/at-devin-global-skills/commit-quality live in workflows; `and-push` was moved out to the top-level `/git-commit-and-push`; `at-devin-global-skills` has a top-level alias `/git-commit-at-devin-global-skills`

Use only for committing changes in `C:\Users\Veerapong\AppData\Roaming\devin\skills`

- if you want pre-commit validation before committing in devin global skills, use `/git-commit at-devin-global-skills`

## Execute

### Workflows

| Domain                   | Workflow |
|--------------------------|----------|
| `no-verify`              | `workflows/no-verify/SKILL.md` — commit skipping pre-commit hooks with `--no-verify` |
| `selected-files`         | `workflows/selected-files/SKILL.md` — commit only selected files, never `git add .` |
| `and-push`               | `/git-commit-and-push` — the real top-level skill (commit + push + resolve CI/CD) |
| `at-devin-global-skills` | `workflows/at-devin-global-skills/SKILL.md` — pre-commit validation for devin global skills (alias: `/git-commit-at-devin-global-skills`) |
| `commit-quality`          | `workflows/commit-quality/SKILL.md` — lint commit messages against conventional commits |

### 1. Navigate To Global Devin Skills

> Goal: Navigate To Global Devin Skills

Change directory to the global devin skills

1. Change directory to `C:\Users\Veerapong\AppData\Roaming\devin\skills`
2. Verify you are in the correct directory with `pwd`

### 2. Check Git Status

> Goal: Check Git Status

Check the repository status

1. Run `git status --porcelain` to see all modified files
2. Verify you are in the correct repository

### 3. Stage All Changes

> Goal: Stage All Changes

Stage every changed file

1. Run `git add .` to stage all files
2. Verify with `git diff --cached` that the staged files are correct

### 4. Determine Commit Type

> Goal: Determine Commit Type

Pick the appropriate conventional commit type

1. See the Commit Types part of Rules
2. Choose the type per the change:
   - feat: add a new skill
   - fix: fix a skill
   - docs: edit documentation or descriptions
   - refactor: refactor a skill
   - chore: improve configuration or structure

### 5. Write Commit Message

> Goal: Write Commit Message

Write the commit message following the conventional commits format

1. See the Commit Message Format and Body parts of Rules
2. Use the `<type>: <subject>` pattern
3. keep the subject short, no more than 72 characters
4. use imperative mood (e.g. add not added)
5. English only
   - if the content or context makes you think in another language, translate the subject and body into English before committing

### 6. Execute Commit

> Goal: Execute Commit

Perform the commit

1. Run `git commit -m "<message>"` or `git commit`
2. Check the result from git commit
3. If there is an error: fix it and try again

### 7. Verify Commits

> Goal: Verify Commits

Verify the commits are correct

1. Run `git log --oneline -5` to see the latest commits
2. Check that commit messages follow conventional commits and are in English
3. Check that no uncommitted files remain
4. Run `git status` to confirm the working directory is clean

## Rules

### Commit Message Format

Use the conventional commits pattern

- Use the `<type>: <subject>` pattern
- the subject should not start with a capital letter or end with a period
- short and concise, no more than 72 characters
- use imperative mood (e.g. add not added)
- English only
  - if the content or context makes you think in another language, translate the subject and body into English before committing

### Commit Types

Choose the type that fits the change

- feat: add a new skill
- fix: fix a skill
- docs: edit documentation or descriptions
- refactor: refactor a skill
- chore: improve configuration or structure

### Body

Explain the reason and extra context

- explain the reason and context
- separate from the subject with a blank line
- use bullet points for multiple items

- Use /run-check if needed
- Use /run-verify if needed
- Use /follow-tool-hk if needed (only repos not using moonrepo — moon repos use `vcs.hooks`)
- Use /list-git-commit if needed
- Use /refactor-commit if needed
- Use /deep-review-codebase if needed
- Use /ship if needed


## Expected Outcome

- commit messages that follow conventional commits and are entirely in English
- git history that is easy to read and follow
- every changed file in the global devin skills is committed
- the working directory is clean

---
name: git-commit-selected-files
description: Commit only selected files, without using `git add .`
related:
  - git-commit
---

## Goal

Commit only selected files, without using `git add .`

## Scope

- use when you want to commit only some files from the working directory
- do not stage every file automatically
- supports selection by pattern or user confirmation

## Execute

### 1. List Changed Files

> Goal: know which files changed

1. Run `git status --short` to see modified, staged, untracked
2. Run `git diff --name-only` for modified
3. Group files by category: skills, docs, config, scripts
4. Identify pre-existing/unrelated files that should not be committed

### 2. Select Files To Commit

> Goal: pick only the files you want to commit

1. if the user gives an argument (pattern/path) → filter by the pattern
2. if none is given → show the list and let the user choose with `ask_user_question`
3. support multi-select
4. skip unrelated untracked files unless the user selects them

### 3. Stage Selected Files

> Goal: prepare the selected files for commit

1. Run `git add <file1> <file2> ...` for only the selected files
2. do not use `git add .` or `git add -A`
3. verify with `git diff --cached --name-only`

### 4. Determine Commit Type

> Goal: pick the conventional commit type

1. See the Commit Types part of Rules
2. Choose per the change:
   - `feat` for a new skill
   - `fix` for a fix
   - `docs` for documentation
   - `refactor` for a refactor
   - `chore` for config/structure
   - `test` for tests

### 5. Write Commit Message

> Goal: write the commit message

1. Use the `<type>(<scope>): <subject>` pattern
2. subject no more than 72 characters
3. state the scope from the directory/type of the files
4. if there are many files from multiple scopes → separate with `,` or split commits

### 6. Execute Commit

> Goal: commit the selected files

1. Run `git commit -m "<message>"`
2. check the exit code
3. if there is an error → fix and try again

### 7. Verify

> Goal: confirm the commit is correct

1. Run `git log --oneline -3`
2. Run `git status --short` to see files not yet committed
3. check that no unrelated files were staged

## Rules

### 1. No Add All

- never use `git add .` or `git add -A`
- stage file by file per the selection
- if unsure → ask the user

### 2. User Confirmation

- if there is no argument, ask before staging
- show the file list before committing
- let the user confirm the message

### 3. Scope Clarity

- one commit should stay within one scope
- if there are multiple scopes, split commits
- state the scope in the message

### 4. Conventional Commits

- use the correct type
- subject in imperative mood
- no leading capital, no trailing period

- Use /git-commit if needed
- Use /git-commit-and-push if needed
- Use /git-push if needed
- Use /refactor-commit if needed
- Use /deep-validate if needed

## Expected Outcome

- only the selected files are committed
- unrelated files remain in the working directory
- commit message is clear and follows conventional commits
- a report of committed files and remaining files exists

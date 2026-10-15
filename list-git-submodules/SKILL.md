---
name: list-git-submodules
description: List git submodules in the repo with status
argument-hint: "[scope]"
related:
  - list-projects-git-in-drive-d
  - delete
  - convert
  - report
---

## Goal

List all git submodules in the repository with path, URL, branch, commit, and status

## Scope

Use when inspecting or reporting submodules in a project

## Execute

### 1. List Submodules

> Goal: get the submodule list

1. Run `git submodule status` or `git submodule status --recursive`
2. Record the fields: `SHA`, `path`, `commit message`

### 2. Get URLs

> Goal: know each submodule's remote URL

1. Run `git config --file .gitmodules --get-regexp url`
2. Map URL to path by submodule name

### 3. Get Branches

> Goal: know each submodule's current branch

1. For each path run `git -C <path> rev-parse --abbrev-ref HEAD`
2. Detached HEAD → mark `detached`

### 4. Check Status

> Goal: know the working-tree status

1. For each path run `git -C <path> status --porcelain`
2. Mark `clean` or `dirty` with the count of modified/untracked files

### 5. Report

> Goal: summarize the result

1. Use `/report` columns: Path, URL, Branch, Commit, Status
2. Or a bullet list when there are few entries

## Rules

### 1. Safe Read-Only

- Never modify submodules
- Use `git -C <path>` instead of `cd`

### 2. Handle Missing Submodules

- Submodule not initialized → mark `(not initialized)`
- No `.gitmodules` → report that there are no submodules

- Use /list-projects-git-in-drive-d if needed
- Use /delete-git-submodules if needed
- Use /convert-git-submodules if needed

## Expected Outcome

- A complete submodules table
- Known path, URL, branch, commit, status
- No side effects

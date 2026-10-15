---
name: list-git-worktree
description: List git worktrees in the repo with branch and status
argument-hint: "[scope]"
related:
  - use-git-worktrees
  - cleanup
  - report
---

## Goal

List all git worktrees of the repository with path, branch, commit, and status

## Scope

Use when inspecting existing worktrees

## Execute

### 1. List Worktrees

> Goal: get the worktree list

1. Run `git worktree list`
2. Or `git worktree list --porcelain` for easy parsing

### 2. Parse Details

> Goal: extract each worktree's data

1. For each worktree record:
   - `Path`
   - `Branch` (or `detached`)
   - `Commit SHA`
   - `Status` (e.g., `locked`, `prunable`, `bare`)

### 3. Check Branch Status

> Goal: know the branch status

1. Run `git branch --all --contains <commit>` if needed
2. State whether the branch is checked out

### 4. Report

> Goal: summarize the result

1. Use `/report` columns: Path, Branch, Commit, Status
2. Or a bullet list when there are few

## Rules

### 1. Read-Only

- Never create, delete, or modify worktrees
- Never checkout a branch unnecessarily

### 2. Handle Bare Repos

- Bare repo → mark the worktree path per the bare structure

- Use /use-git-worktrees if needed
- Use /cleanup-worktree if needed

## Expected Outcome

- A complete worktrees table
- Known path, branch, commit, status
- No side effects

---
name: follow-git-workflows
description: Set up git flow or switch to the correct workflow branch
argument-hint: "<setup|switch> [scope]"
related: [git-branch, git-commit, git-sync, git-worktree, update-github-metadata, ship]
---

# Follow Git Workflows

## Goal

Establish the git flow once, then always land work on the branch that flow
requires.

## Scope

Two modes:

| Mode | Use when |
| --- | --- |
| `setup` | The repository has no integration branch, no hooks, or no worktree convention yet. |
| `switch` | The flow exists and the current branch is not the one this task needs. |

Applies to any git repository. See also: `/git-branch` for branch operations,
`/git-worktree` for parallel checkouts, `/git-commit` and `/git-sync` to land
work, `/update-github-metadata` for the repository settings `setup` changes,
and `/ship` to finish.

## Execute

### 1. Read Current State

> Goal: know the current branch and whether it is safe to switch

1. Run `git status` and `git branch --all`.
2. If the working tree has uncommitted changes, note them; do not switch yet.
3. If the first argument is missing or not `setup` / `switch`, ask and stop.

### 2. Pick The Workflow

> Goal: choose setup or switch from the actual repository state

| Mode | Workflow |
| --- | --- |
| `setup` | `workflows/setup/SKILL.md` |
| `switch` | `workflows/switch/SKILL.md` |

1. Run `setup` only when an integration branch, hooks, or the worktree
   convention is actually missing. Otherwise go straight to `switch`.
2. Follow the selected workflow from the current state.

### 3. Report

> Goal: the branch change is evidenced and no work was lost

1. State the branch before, the branch after, and why.
2. List any uncommitted path left untouched.

## Rules

### 1. Never Destroy Work

- Never discard uncommitted work to switch branches. Commit, stash with a
  unique tag, or stop and ask.
- Never force-push and never delete a branch that is not merged, unless the
  user explicitly asks for that exact branch.

### 2. Branch Naming

- Branch names follow `restructure/*`, `feature/*`, `fix/*`, `review/*`.
- `setup` runs once per repository; re-running it must be idempotent.

### 3. Scope

- `setup` changes repository settings, hooks, and GitHub metadata; confirm
  before any shared or remote-side change.
- `switch` only moves the working tree; it must not create commits.

## Expected Outcome

- The repository has an integration branch, hooks, and a worktree convention
  that match the project.
- Work always happens on the branch the flow requires, with no lost changes.

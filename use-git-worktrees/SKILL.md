---
name: use-git-worktrees
description: "Full git worktree lifecycle: create, work, merge back, and cleanup"
argument-hint: "[branch-name] [base-branch]"
related:
  - delete
  - cleanup
  - resolve-merge-conflicts
  - refactor-commit
  - report
  - suggest-next-action

---

## Goal

The full git worktree lifecycle: create a worktree under `worktrees/` at the repo root, work on a branch in parallel, then merge back into the source branch when the work is done

## Scope

Use for git repositories that need to work on several branches at once without disturbing the main working tree. Covers creating worktrees, doing the work, merging back, and cleanup
- References: [Package Manifest](references/package-manifest.md)

## Execute

### 0. Setup

> Goal: Confirm git worktrees are ready to use

1. Check git: `git --version` (worktree has been stable since 2.15+; latest stable `2.55.0 (verified 2026-09-12)`)
2. If git is missing → install per OS:
   - macOS: `mise use -g git` or `brew install git`
   - Windows: `winget install Git.Git` or `scoop install git`
   - Linux: `apt install git`
3. Verify the repository has the correct remote: `git remote -v`
4. Verify worktree: `git worktree list`

### 1. Create Worktree

> Goal: Create a worktree for a new branch

1. Find the project root with `git rev-parse --show-toplevel`
2. Create a `worktrees/` directory at the root if it does not exist
3. Take `[branch-name]` from the argument or ask the user
4. Take `[base-branch]` if provided; otherwise use the current branch
5. Verify the working tree is clean, or tell the user otherwise
6. Run `git worktree add worktrees/<branch-name> -b <branch-name> <base-branch>`
7. Verify with `git worktree list`

### 2. Do Work In Worktree

> Goal: Work in the worktree until done

1. Change directory to `worktrees/<branch-name>/`
2. Do the assigned task
3. Run checks/tests per the project's standards
4. Commit the changes in the worktree
5. If the base branch has new changes → `git pull --rebase` or `git merge origin/<base-branch>`

### 3. Prepare To Merge Back

> Goal: Prepare to merge back into the source branch

1. Run `git fetch` to update remote refs
2. In the worktree, verify `git status` shows no uncommitted changes
3. Identify the target branch: `main`, `master`, or the original base branch (option: `gh pr checkout <n> --worktree <path>` to check a PR out directly into a worktree — gh >= 2.98.0)
4. If the target branch has changed → rebase or merge first

### 4. Merge Back

> Goal: Merge the work back into the source branch

1. cd to the main working tree or the worktree holding the target branch
2. `git switch <target-branch>`
3. Run `git status` and make sure the tree is clean
4. If the feature worktree has a messy commit history → switch to the feature worktree and run `/refactor-commit` before merging
5. `git merge <feature-branch>`
6. If there are conflicts → use `/resolve-merge-conflicts`
7. To squash → `git merge --squash <feature-branch>`
8. To rebase → rebase in the feature worktree before merging

### 5. Verify Merge

> Goal: Verify the merge is correct

1. Run `git log --oneline -5`
2. Run `git diff <target-branch>~1..<target-branch>`
3. Run `git status`
4. Run tests/lint/typecheck if present
5. If everything passes → commit, if the squash merge is not committed yet

### 6. Cleanup

> Goal: Remove the worktree after merging if it is no longer needed

1. If the merge succeeded → remove the worktree with `git worktree remove worktrees/<branch-name>`
2. If the directory still exists → delete the directory too
3. Run `git worktree prune`
4. To push → use `git push` (no automatic push)

### 7. Report

> Goal: Summarize results

1. Use `/report` to show: Worktree Path, Branch, Target Branch, Merge Status, Cleanup Status
2. Run `/suggest-next-action`

## Rules

### 1. Worktree Directory Structure

- Create the worktree in `worktrees/<branch-name>/` at the project root
- Use a directory name matching the branch name
- Avoid complex names or names containing spaces

### 2. Working Tree Clean

- Commit or stash uncommitted changes before merging
- Never merge a branch that still has uncommitted changes
- Check status before every major step

### 3. No Force Merge

- Never force push without user confirmation
- Do not merge when CI or tests fail without confirmation
- If there are conflicts → stop and resolve them before continuing

### 4. Merge Strategy

- Use fast-forward or a merge commit per project conventions
- If the project uses squash merge → `git merge --squash`
- If the project uses rebase → rebase before merging

### 5. Cleanup

- Remove the worktree after merging if it is no longer in use
- Run `git worktree prune` to remove leftover tracking
- Do not delete the worktree directory manually before running `git worktree remove`

- Use /git-worktree if needed (list, remove, cleanup modes)

## Expected Outcome

- The worktree is created in `worktrees/<branch-name>/`
- The work is done and committed on the feature branch
- The feature branch is safely merged back into the target branch
- History stays clean per project conventions
- The worktree is removed and pruned after merging when no longer in use
- No leftover uncommitted changes or conflicts

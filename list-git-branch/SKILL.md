---
name: list-git-branch
description: Show local and remote branches with latest info
argument-hint: "[scope]"
related:
  - list-github
  - report
  - follow-tool-git
---

## Goal

List git branches both locally and on the remote with key metadata

## Scope

For viewing branches in the local repository and remote — not the GitHub API (use `/list-github-branch` for GitHub branches)

## Execute

### 1. List Local Branches

> Goal: view local branches

1. Run `git branch -v` to see local branches with last commit
2. Run `git branch -vv` to see local branches with upstream tracking
3. Identify the current branch from the output (prefixed with `*`)

### 2. List Remote Branches

> Goal: view remote branches

1. Run `git branch -r` to see remote branches
2. Run `git fetch --prune` first when the latest data is needed
3. Identify remote branches without a local tracking branch

### 3. List All Branches

> Goal: view all branches

1. Run `git branch -a` to see all branches
2. Run `git branch -a -v` to see them with last commit
3. Identify branches that exist only locally or only remotely

### 4. Collect Branch Metadata

> Goal: gather extra data per branch

1. Run `git log <branch> -1 --format="%H|%ci|%an|%s"` for each branch to see last commit info
2. Identify branches not merged with the current branch via `git branch --no-merged`
3. Identify merged branches via `git branch --merged`
4. Identify stale branches with no update for over 30 days

### 5. Format Output

> Goal: format the result as a table

1. Do `/report` to format a table
2. Define columns:
   - No. sequence
   - Branch branch name
   - Type local / remote / both
   - Last Commit short SHA
   - Date latest commit date
   - Author committer
   - Merged ✅ / ❌
   - Stale yes / no
3. Group by type: local first, then remote-only

## Rules

### Read-Only

- Never create, delete, or switch branches — use `/follow-tool-git` for branch operations
- Do not run `git fetch` by default — read existing data only
- When the user wants the latest data → ask before fetching

### Output Format

- Do `/report` to format the result
- Order local branches first, then remote-only branches
- Show the current branch in bold
- Use symbols: ✅ merged, ❌ not merged

### High Impact Content

- With more than 50 branches → show only the 20 most recently updated
- Highlight stale branches not updated for over 30 days
- Highlight unmerged branches

### Non-Redundancy

- GitHub branches already live in `/list-github-branch`
- Branch operations already live in `/follow-tool-git`
- Stash listing already lives in `/follow-tool-git`

## Expected Outcome

- The local and remote branch list in a readable table
- Complete data: branch name, type, last commit, date, author, merged status, stale status
- Stale and unmerged branches highlighted
- No branch modified — read-only report

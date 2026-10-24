---
name: list-github-branch
description: Show all branches of a given repo on GitHub
argument-hint: "[repo]"
related:
  - report
---

## Goal

List all branches of the specified repository

## Scope

Use to view branches of any repository on GitHub

## Execute

### 1. Get Authenticated User

> Goal: Get Authenticated User

1. Use `mcp7_get_me` to get the GitHub username
2. Get the repository name to list branches for from the user

### 2. List Branches

> Goal: List Branches

1. Use `mcp7_list_branches` with `owner` and `repo` parameters
2. Use `perPage: 100` for pagination
3. Use the `page` parameter when there are more than 100 branches

### 3. Format Output

> Goal: Format Output

1. Use `/report` to format as a table
2. Define columns:
   - No. sequence
   - Branch branch name
   - Last Commit SHA SHA of the latest commit
   - Protected has branch protection or not

## Rules

### 1. API Usage

- Use `mcp7_list_branches` to list branches of the given repo
- Use `mcp7_get_me` to get the authenticated user
- Use `perPage: 100` for pagination

### 2. Output Format

- Use `/report` to format the result
- Show key data: branch name, last commit SHA, protected status

- Use /list-git-branch if needed
- Use /delete-git-branch if needed

## Expected Outcome

- A full branch list of the repository
- Formatted as a readable table
- Complete data: branch name, last commit SHA, protected status

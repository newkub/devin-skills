---
name: list-github-issue
description: List the issues of a given repository on GitHub
argument-hint: "[repo]"
related:
  - create-github
  - deep-review
  - list-github
  - report
---

## Goal

List the issues of the specified repository with key data

## Scope
- For related skills: `open-github`, `create-github`, `deep-review`, `list-github`

Use to view issues of any repository on GitHub that the authenticated user can access

## Execute

### 1. Get Authenticated User

> Goal: Get Authenticated User

1. Use `mcp7_get_me` to get the GitHub username
2. Get the repository name to list issues for from the user

### 2. List Issues

> Goal: List Issues

1. Use `mcp7_list_issues` with `owner` and `repo` parameters
2. Use the `state` parameter to filter:
   - `OPEN` — open issues
   - `CLOSED` — closed issues
   - unspecified — all
3. Use `orderBy: UPDATED` and `direction: DESC` to sort newest first
4. Use `perPage: 100` for pagination
5. Use the `labels` parameter to filter by label

### 3. Format Output

> Goal: Format Output

1. Use `/report` to format as a table
2. Define columns:
   - No. issue number
   - Title issue title
   - Labels all labels
   - State open/closed
   - Author creator
   - Comments number of comments
   - Updated last update date

## Rules

### 1. API Usage

- Use `mcp7_list_issues` to list issues of the given repo
- Use `mcp7_get_me` to get the authenticated user
- Use the `state` parameter to filter open/closed
- Use the `labels` parameter to filter by label
- Use `orderBy` and `direction` for sorting

### 2. Output Format

- Use `/report` to format the result
- Sort by last update date
- Show key data: number, title, labels, state, author, comments, updated

## Expected Outcome

- The issue list of the specified repository
- Formatted as a readable table
- Complete data: number, title, labels, state, author, comments, updated

---
name: list-github-pr
description: Show the pull requests of a given repo on GitHub with state and metadata
argument-hint: "[repo]"
related:
  - create-github
  - review-github-pr
  - report
---

## Goal

List the pull requests of the specified repository with key data

## Scope
- For related skills: `open-github`, `open-github`, `create-github`, `review-github-pr`

Use to view pull requests of any repository on GitHub, filterable by state

## Execute

### 1. Get Authenticated User

> Goal: Get Authenticated User

1. Use `mcp7_get_me` to get the GitHub username
2. Get the repository name to list PRs for from the user

### 2. List Pull Requests

> Goal: List Pull Requests

1. Use `mcp7_list_pull_requests` with `owner` and `repo` parameters
2. Use the `state` parameter to filter: `open`, `closed`, `all`
3. Use `sort: updated` and `direction: desc` to sort newest first
4. Use `perPage: 100` for pagination

### 3. Format Output

> Goal: Format Output

1. Use `/report` to format as a table
2. Define columns:
   - No. PR number
   - Title PR title
   - State open/closed/merged
   - Author creator
   - Branch head branch → base branch
   - Reviews number of reviews
   - Updated last update date

## Rules

### 1. API Usage

- Use `mcp7_list_pull_requests` to list PRs of the given repo
- Use `mcp7_get_me` to get the authenticated user
- Use the `state` parameter to filter open/closed/all
- Use `sort` and `direction` for sorting

### 2. Output Format

- Use `/report` to format the result
- Sort by last update date
- Show key data: number, title, state, author, branch, reviews, updated

## Expected Outcome

- The pull request list of the specified repository
- Formatted as a readable table
- Complete data: number, title, state, author, branch, reviews, updated

---
name: list-github-release
description: Show all releases of a given repo on GitHub
argument-hint: "[repo]"
related:
  - resolve-errors
  - report
  - run-release

---

## Goal

List all releases of the specified repository with key data

## Scope

Use to view releases of any repository on GitHub

## Execute

### 1. Get Authenticated User

> Goal: Get Authenticated User

1. Use `mcp7_get_me` to get the GitHub username
2. Get the repository name to list releases for from the user

### 2. List Releases

> Goal: List Releases

1. Use `mcp7_list_releases` with `owner` and `repo` parameters
2. Use `perPage: 100` for pagination
3. Use the `page` parameter when there are more than 100 releases

### 3. Format Output

> Goal: Format Output

1. Use `/report` to format as a table
2. Define columns:
   - No. sequence
   - Tag tag name
   - Title release title
   - Draft is draft or not
   - Prerelease is prerelease or not
   - Published publish date
   - Author creator

## Rules

### 1. API Usage

- Use `mcp7_list_releases` to list releases of the given repo
- Use `mcp7_get_me` to get the authenticated user
- Use `perPage: 100` for pagination

### 2. Output Format

- Use `/report` to format the result
- Sort by most recent publish date
- Show key data: tag, title, draft, prerelease, published, author

- Use /list-git-tags if needed
- Use /resolve-github-actions-fails if needed
- Use /list-github-branch if needed
- Use /run-release if needed
- Use /resolve-errors if needed


## Expected Outcome

- A full release list of the repository
- Formatted as a readable table
- Complete data: tag, title, draft, prerelease, published, author

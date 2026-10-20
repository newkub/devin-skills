---
name: list-github-repo
description: List all remote repositories on GitHub owned by the user, excluding forks and archived
argument-hint: "[owner]"
allowed-tools:
  - read
  - write
  - edit
  - exec
  - skill
  - report
  - suggest-next-action
  - ask_user_question
triggers:
  - user
  - model
related:
  - all-github-repo
  - list-projects-git-in-drive-d
---

## Goal

List all remote repositories on GitHub owned by the user, filtering out forks and archived

## Scope

Use `gh repo list --source` for the authenticated user or a given owner — show only original (non-fork) repos the user created themselves

See also: /open-github, /list-github-project, /all-github-repo

## Execute

### 1. Get Owner

> Goal: know whose repos to list

1. The user gives an owner via the argument → use it
2. Unspecified → use the authenticated user from `gh api user -q '.login'`
3. Cannot determine the owner → stop and report; ask the user to log in to `gh` first

### 2. List Repositories

> Goal: fetch all non-fork repos

1. Run `gh repo list <owner> --source --no-archived --json name,description,primaryLanguage,stargazerCount,forkCount,updatedAt,visibility,url --limit 1000`
2. `--source` filters out forks
3. `--no-archived` filters out archived
4. Output has 1000 entries → warn that more repos may exist and paginate with `--jq` or `gh api` next

### 3. Format Output

> Goal: present the result readably

1. Sort by most recent `updatedAt` first
2. Convert `updatedAt` to `YYYY-MM-DD`
3. Take `primaryLanguage.name` when present; show `n/a` when absent
4. Use `/report` with columns:
   - No
   - Name
   - Description
   - Language
   - Stars
   - Forks
   - Updated
   - Visibility
   - URL
5. State the total repo count

### 4. Suggest Next Steps

> Goal: suggest the next actions

1. Want to see repos on the machine → use `/list-projects-git-in-drive-d`
2. Want to see latest starred → use `/list-github-star-latest`
3. Want to see a repo's metadata → use `/open-github <owner>/<name>`
4. Use `/suggest-next-action` for more suggestions

## Rules

### 1. GitHub Only

- Use `gh repo list` as the primary tool
- `gh` not authenticated → stop and recommend `gh auth login`
- Never guess the owner when not found

### 2. Exclude Forks And Archived

- Use `--source` to show only original repos
- Use `--no-archived` to hide archived
- The user wants archived included → remove the `--no-archived` flag

### 3. Pagination

- Use `--limit 1000` by default
- More than 1000 repos → warn and extend or paginate with `gh api`/`graphql`

### 4. Output

- Always use `/report`
- Sort by most recent `updatedAt`
- Never show secrets, tokens, or sensitive data

## Expected Outcome

- A full list of repos the user owns on GitHub, excluding forks
- Complete data: name, description, language, stars, forks, updated, visibility, url
- Next actions ready for the selected repo

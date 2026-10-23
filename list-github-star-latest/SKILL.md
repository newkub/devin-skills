---
name: list-github-star-latest
description: List starred repositories on GitHub with latest support, language filter, and search
argument-hint: "[username] [--lang <language>] [--limit <n>]"
related:
  - all-github-repo
  - search-github-star
  - report

---

## Goal

Show the starred repositories of the authenticated user or a given user — supports latest view, language filter, and pagination

## Scope

- Use to view starred repositories for tracking projects of interest
- Supports the current user and other users (`[username]`)
- Supports language filters such as `--lang bun`, `--lang rust`
- Default limit 50 repos

See also: /all-github-repo, /list-github-repo, /search-github-star

## Execute

### 1. Resolve User And Filters

> Goal: get the correct username and filter conditions

1. Use `mcp7_get_me` to get the current user's GitHub username
2. `[username]` given → use that username instead
3. Read `--lang <language>` and `--limit <n>` (default 50) from the arguments

### 2. List Starred Repositories

> Goal: fetch starred repos per filter

1. Viewing the authenticated user's → `gh api user/starred --paginate --jq 'sort_by(.pushed_at) | reverse'`
2. Viewing another user's → `gh api users/<username>/starred --paginate --jq 'sort_by(.pushed_at) | reverse'`
3. `--lang` present → filter with `map(select(.language | ascii_downcase == "<lang>"))`
   - For `--lang bun`, also match Bun-related `TypeScript`/`JavaScript` from the description
4. Cut the result to `--limit`
5. No `gh` CLI → fall back to `mcp7_search_repositories` with `user:{username} stars:>0`

### 3. Format Output

> Goal: show a table

1. Use `/report` columns: No., Owner, Name, Description, Language, Stars, Updated
2. Show a summary: repo count, top languages, filters used

## Rules

- Always use `/report`; never a plain list
- State the filters used in the report header
- No repos match the filter → report 0 with a recommendation
- Never modify any starred state

## Expected Outcome

- A table of starred repositories per the given scope/filter
- A summary of the count and main languages

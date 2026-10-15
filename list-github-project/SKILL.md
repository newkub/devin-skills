---
name: list-github-project
description: List GitHub Projects of a user or org with a filter by source
argument-hint: "[owner] [source]"
related:
  - follow-tool-github-project
  - list-github
  - all-github-repo
  - report
  - ask-me
---

## Goal

List GitHub Projects (Projects v2) of a user or organization, filterable by the relevant source

## Scope
- For related skills: `follow-tool-github-project`, `list-github`, `all-github-repo`

Use `gh project` to list projects and item-list for a given user, org, or repository, filtered by `source`

## Execute

### 1. Verify gh Authentication

> Goal: verify auth and the project scope

1. Run `gh --version`
2. Run `gh auth status`
3. No `project` scope → run `gh auth refresh -s project`
4. Not logged in → use `/ask-me`

### 2. Resolve Owner And Source

> Goal: get the correct owner and source filter

1. Take `owner` from the argument or use `@me` if unspecified
2. Take `source` from the argument when present:
   - `source` is `user` → the user's projects
   - `source` is `org` → the org's projects
   - `source` is `repo:<owner>/<repo>` → projects related to that repo
   - `source` is `all` or unspecified → everything
3. Unclear → use `/ask-me`

### 3. List Projects

> Goal: fetch the GitHub Projects list

1. Run `gh project list --owner <owner> --limit 100`
2. More than 100 → paginate with `--page`
3. Record: number, title, owner, visibility, updated at

### 4. Filter By Source

> Goal: filter projects or items by the given source

1. `source` is `user`/`org` → filter projects by owner
2. `source` is `repo:<owner>/<repo>` → use `gh project item-list <number> --owner <owner> --query "repo:<owner>/<repo>"` to filter items by repo source
3. `source` is `all` → no filter
4. Record the projects/items passing the filter

### 5. Build Report

> Goal: summarize as a table

1. Use `/report` columns:
   - No.
   - Project
   - Owner
   - Source
   - Visibility
   - Updated At
   - URL
2. Sort by most recent updatedAt
3. State the total project count

## Rules

### 1. Authentication

- The `project` scope is required before using `gh project`
- Never expose tokens or credentials

### 2. Source Filter

- Supports `user`, `org`, `repo:<owner>/<repo>`, `all`
- Filter matches nothing → report that nothing was found
- Never modify projects or items

### 3. Output

- Use `/report` by default
- State the `source` used for filtering in the output
- No projects → say so clearly

### 4. Rate Limit

- Use pagination when there are many projects
- API returns 429 → wait and retry

## Expected Outcome

- The GitHub Projects list filtered by source
- A table showing project, owner, source, visibility, updated at, url
- No project or item modified

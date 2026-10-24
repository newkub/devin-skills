---
name: list-github-issue
description: List issues of one repo or of every repo of your user and orgs
argument-hint: "[owner/repo | --all] [--state open|closed] [--label <label>]"
related:
  - ask-me
  - cleanup-github-issue
  - create-github
  - deep-review
  - list-github
  - open-github
  - report
  - resolve-github-issue-by-me
  - review-github-issue
  - suggest-next-action
---

## Goal

List issues in one repository or across every repository of the personal user and their organizations, sorted by latest update

## Scope

- Single repo — `/list-github-issue <owner>/<repo>` uses the GitHub MCP tools directly
- Cross-owner — `/list-github-issue --all` uses `gh search issues --owner <owner>,<owner>`, so all repos of the owners are covered in one call without listing repos first
- Search returns only issues by default; `--include-prs` includes pull requests
- See also: `/list-github` (dispatcher), `/cleanup-github-issue`, `/review-github-issue`, `/resolve-github-issue-by-me`, `/open-github`

## Execute

### 1. Choose The Scope

> Goal: pick the query path before calling any API

1. Argument is `--all` or a list of owners → cross-owner path (step 3)
2. Argument is `owner/repo` → single-repository path (step 2)
3. No argument → ask with `/ask-me` whether to list one repo or all owners, then continue

### 2. Single Repository

> Goal: list one repo's issues through the MCP server

1. Use `mcp7_get_me` to confirm the authenticated user
2. Use `mcp7_list_issues` with `owner` and `repo`
3. Use `state` to filter: `OPEN`, `CLOSED`, or omit for all
4. Use `orderBy: UPDATED` and `direction: DESC` to sort newest first
5. Use `perPage: 100` for pagination
6. Use `labels` to filter by label

### 3. Cross-Owner

> Goal: pull issues from every repo of the selected owners

1. Resolve owners:
   - Use the owners passed as arguments when given
   - Otherwise run `gh api user --jq .login` and `gh api user/orgs --jq '.[].login'`
   - Combine into one comma-separated `owners` list, e.g. `newkub,wrikka`
   - If `gh api user` fails, stop and recommend `gh auth login`
2. Run the main query:

   ```bash
   gh search issues --owner <owners> --state open \
     --sort updated --order desc --limit 200 \
     --json repository,number,title,author,state,labels,assignees,commentsCount,updatedAt,url
   ```

3. `--owner` accepts comma-separated values — one call covers all owners
4. Omit `--state` when both open and closed are wanted; use `--include-prs` when PRs should be included
5. Narrow with `--author`, `--involves`, `--assignee`, `--label`, `--no-label`, `--no-assignee`, `--milestone`, `--project`
6. Add `--mentions`, `--commenter`, `--comments`, `--reactions`, `--created`, `--updated`, `--repo`, `--visibility` when the context needs them

### 4. Merge And Format

> Goal: present the results readably in one table

1. Cross-owner: merge per-owner queries with `jq -s 'add'`, then `unique_by(.url)`
2. Sort by newest `updatedAt` first and convert to `YYYY-MM-DD`
3. Single repo columns — No., Number, Title, Labels, State, Author, Comments, Updated
4. Cross-owner columns — No., Repo (`owner/name`), Number, Title, Author, Assignees, Labels, State, Comments, Updated, URL
5. Render with `/report`; the No. column comes first, numbered 1, 2, 3, ...
6. Summarize the total count and, for cross-owner, the count per owner plus issues with no assignee or label

### 5. Suggest Next Steps

> Goal: recommend the next actions

1. Stale issues to clear → `/cleanup-github-issue <repo>`
2. Readiness assessment → `/review-github-issue <number-or-url>`
3. Resolve the user's own issues → `/resolve-github-issue-by-me <filter>`
4. Open an issue in the browser → `/open-github issue <owner>/<repo> <number>`
5. Widen the repo scope → `/all-github-repo`
6. Further suggestions → `/suggest-next-action`

## Rules

### 1. Authentication

- Single repo relies on the MCP server's own credentials; cross-owner requires `gh auth login`
- Never guess owners or repos when they cannot be resolved

### 2. Scope Selection

- `--all` covers only repos owned by the user and the listed orgs
- Issues the user opened in other people's repos → replace `--owner` with `--author <user>`
- For orgs returning 403/404, skip that org and record the reason

### 3. Search API Limits

- The GitHub Search API returns at most 1,000 results per query — warn when `--limit` reaches this bound, then narrow with `--updated`/`--created` or split per owner
- Many owners → run separate per-owner queries and merge, to bound results per owner
- `gh search issues` returns only issues unless `--include-prs`; check `isPullRequest` to separate PRs

### 4. Output

- Always use `/report` and always state the scope used (owners or repo, state filter, counts)
- Never request or print `--json body`
- Single-repo results keep repo context in the heading, so the Repo column is omitted

## Expected Outcome

- One table of issues for the chosen scope
- Complete data: number, title, labels, state, author, comments, updated — plus repo, assignees, and URL for cross-owner
- Counts per owner for cross-owner, with next actions for the chosen issues

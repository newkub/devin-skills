---
name: list-github-pr
description: List PRs of one repo or of every repo of your user and orgs
argument-hint: "[owner/repo | --all] [--state open|closed|merged] [--author <user>]"
related:
  - ask-me
  - create-github
  - list-github
  - open-github
  - report
  - resolve-github-pr
  - review-github-pr
  - suggest-next-action
---

## Goal

List pull requests in one repository or across every repository of the personal user and their organizations, sorted by latest update

## Scope

- Single repo — `/list-github-pr <owner>/<repo>` uses the GitHub MCP tools directly and carries branch and review metadata
- Cross-owner — `/list-github-pr --all` uses `gh search prs --owner <owner>,<owner>`, so all repos of the owners are covered in one call without listing repos first
- See also: `/list-github` (dispatcher), `/review-github-pr`, `/resolve-github-pr`, `/open-github`

## Execute

### 1. Choose The Scope

> Goal: pick the query path before calling any API

1. Argument is `--all` or a list of owners → cross-owner path (step 3)
2. Argument is `owner/repo` → single-repository path (step 2)
3. No argument → ask with `/ask-me` whether to list one repo or all owners, then continue

### 2. Single Repository

> Goal: list one repo's PRs through the MCP server

1. Use `mcp7_get_me` to confirm the authenticated user
2. Use `mcp7_list_pull_requests` with `owner` and `repo`
3. Use `state` to filter: `open`, `closed`, `all`
4. Use `sort: updated` and `direction: desc` to sort newest first
5. Use `perPage: 100` for pagination

### 3. Cross-Owner

> Goal: pull PRs from every repo of the selected owners

1. Resolve owners:
   - Use the owners passed as arguments when given
   - Otherwise run `gh api user --jq .login` and `gh api user/orgs --jq '.[].login'`
   - Combine into one comma-separated `owners` list, e.g. `newkub,wrikka`
   - If `gh api user` fails, stop and recommend `gh auth login`
2. Run the main query:

   ```bash
   gh search prs --owner <owners> --state open \
     --sort updated --order desc --limit 200 \
     --json repository,number,title,author,state,isDraft,commentsCount,updatedAt,url
   ```

3. `--owner` accepts comma-separated values — one call covers all owners
4. Omit `--state` for both open and closed; use `--merged` for merged PRs only
5. Use `--author <user>` for PRs the user wrote and `--involves <user>` for PRs they wrote, reviewed, or were assigned
6. Drop bots afterwards with `--jq '[.[] | select(.author.is_bot | not)]'` (e.g. `renovate[bot]`)
7. Add `--label`, `--base`, `--head`, `--review`, `--draft`, `--repo`, `--visibility`, `--created`, `--updated` when the context needs them

### 4. Merge And Format

> Goal: present the results readably in one table

1. Cross-owner: merge per-owner queries with `jq -s 'add'`, then `unique_by(.url)`
2. Sort by newest `updatedAt` first and convert to `YYYY-MM-DD`
3. Single repo columns — No., Number, Title, State, Author, Branch (`head` → `base`), Reviews, Updated
4. Cross-owner columns — No., Repo (`owner/name`), Number, Title, Author, State (`open`/`closed`/`merged`/`draft`), Comments, Updated, URL
5. Render with `/report`; the No. column comes first, numbered 1, 2, 3, ...
6. Summarize the total PR count and, for cross-owner, the counts per owner/repo

### 5. Suggest Next Steps

> Goal: recommend the next actions

1. Review a PR → `/review-github-pr <number>` in that repo
2. Handle pending PRs or failing CI → `/resolve-github-pr`
3. Open a PR in the browser → `/open-github pr <owner>/<repo> <number>`
4. Widen the repo scope → `/all-github-repo`
5. Further suggestions → `/suggest-next-action`

## Rules

### 1. Authentication

- Single repo relies on the MCP server's own credentials; cross-owner requires `gh auth login`
- Never guess owners or repos when they cannot be resolved

### 2. Scope Selection

- `--all` covers only repos owned by the user and the listed orgs
- PRs the user opened in other people's repos → replace `--owner` with `--author <user>`
- For orgs returning 403/404, skip that org and record the reason

### 3. Search API Limits

- The GitHub Search API returns at most 1,000 results per query — warn when `--limit` reaches this bound, then narrow with `--updated`/`--created` or split per owner
- Many owners → run separate per-owner queries and merge, to bound results per owner
- `merged` is not a search state — use `--merged` instead of `--state merged`

### 4. Output

- Always use `/report` and always state the scope used (owners or repo, state filter, counts)
- Never show body or sensitive data from `--json body`
- Single-repo results keep repo context in the heading, so the Repo column is omitted

## Expected Outcome

- One table of pull requests for the chosen scope
- Complete data: number, title, state, author, updated — plus branch/reviews for a single repo, or repo/comments/URL for cross-owner
- Counts per owner/repo for cross-owner, with next actions for the chosen PRs

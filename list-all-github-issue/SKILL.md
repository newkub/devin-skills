---
name: list-all-github-issue
description: List all issues of the personal user and the organizations they are a member of
argument-hint: "[owner...] [--state open|closed] [--label <label>]"
allowed-tools:
  - read
  - exec
  - report
  - suggest-next-action
  - ask_user_question
triggers:
  - user
  - model
related:
  - all-github-repo
  - cleanup-github-issue
  - list-github
  - list-github-issue
  - open-github
  - report
  - resolve-github-issue-by-me
  - review-github-issue
  - suggest-next-action
---

## Goal

Aggregate issues from all repositories of the personal user and the organizations they are a member of into one table, sorted by latest `updatedAt`

## Scope

Use `gh search issues --owner <owner>,<owner>` to pull results across all repos of the owners in one call — no need to list repos first — the default returns only issues, excluding PRs (`--include-prs` includes them); unlike `/list-github-issue` which targets one repo at a time

See also: /list-github (dispatcher), /list-github-issue, /all-github-repo, /cleanup-github-issue, /open-github

## Execute

### 1. Resolve Owners

> Goal: know all owners to list (personal + orgs)

1. If the user specifies `owner` from the argument, use it
2. Otherwise run `gh api user --jq .login` as `user_login`
3. Run `gh api user/orgs --jq '.[].login'` to find the organizations the user is a member of
4. Combine into one `owners` list, e.g. `newkub,wrikka` (comma-separated)
5. If `gh api user` fails, stop and recommend `gh auth login`

### 2. List Issues

> Goal: pull issues from every repo of those owners

1. Run the main command (covers both personal and org in one call):

   ```bash
   gh search issues --owner <owners> --state open \
     --sort updated --order desc --limit 200 \
     --json repository,number,title,author,state,labels,assignees,commentsCount,updatedAt,url
   ```

2. `--owner` accepts comma-separated values — no need to loop per owner
3. Omit `--state` when both open and closed are wanted
4. Use `--include-prs` when pull requests should be included in the results (default returns only issues)
5. Use `--author <user>` / `--involves <user>` / `--assignee <user>` to narrow to issues the user wrote, participated in, or was assigned
6. Use `--label <label>`, `--no-label`, `--no-assignee`, `--milestone`, `--project` to filter by work
7. Other filters as the context needs: `--mentions`, `--commenter`, `--comments`, `--reactions`, `--created`, `--updated`, `--repo`, `--visibility`

### 3. Merge And Format

> Goal: present the results readably in one table

1. Merge results from all queries into one JSON array with `jq -s 'add'` or run a single query when possible
2. Remove duplicates with `unique_by(.url)`
3. Sort by newest `updatedAt` first, convert to `YYYY-MM-DD`
4. Take `repository.nameWithOwner` as the Repo column, `author.login` as Author, join `labels[].name` with `,`
5. Do `/report` with columns:
   - No.
   - Repo (`owner/name`)
   - Number
   - Title
   - Author
   - Assignees
   - Labels
   - State
   - Comments
   - Updated
   - URL
6. Summarize the total issue count, the count per owner, and the number of issues with no assignee or label

### 4. Suggest Next Steps

> Goal: recommend the next actions

1. If stale issues need clearing → do `/cleanup-github-issue <repo>`
2. If an issue needs readiness assessment → do `/review-github-issue <number-or-url>` in that repo
3. If the user's own issues need resolving → do `/resolve-github-issue-by-me <filter>`
4. To list one repo's issues → do `/list-github-issue <owner>/<repo>`
5. To open an issue page in the browser → do `/open-github issue <owner>/<repo> <number>`
6. To get the repo list for widening scope → do `/all-github-repo`
7. Do `/suggest-next-action` for further suggestions

## Rules

### 1. GitHub Authentication

- Must login with `gh auth login` first; if `gh api user` returns an error, stop and recommend login
- Never guess owners or repos when they can't be found

### 2. Scope: Personal And Org

- By default only repos owned by the owners are covered (the user's personal repos + each listed org's repos)
- Issues in other people's repos that the user opened → switch from `--owner` to `--author <user>` instead
- For orgs where the API returns 403/404, skip that org and record the reason

### 3. Search API Limits

- The GitHub Search API returns at most 1,000 results per query — if `--limit` hits this bound, warn and narrow the scope with `--updated`/`--created` or split per owner
- Many owners → run separate per-owner queries and merge results, to enforce a per-owner result bound
- `gh search issues` returns only issues unless `--include-prs`; to separate PRs from a combined result, check the `isPullRequest` field

### 4. Output

- Always use `/report`; the No. column comes first, numbered 1, 2, 3, ...
- Do not include `--json body` in the output (content can be long and internal)
- Always state the scope used (owners, state filter, counts)

## Expected Outcome

- All issues of the personal user and their organizations in one table
- Complete data: repo, number, title, author, assignees, labels, state, comments, updated, url
- Counts per owner with next actions for the chosen issues

---
name: list-all-github-pr
description: List all pull requests of the personal user and the organizations they are a member of
argument-hint: "[owner...] [--state open|closed] [--author <user>]"
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
  - list-github
  - list-github-pr
  - open-github
  - report
  - resolve-github-pr
  - review-github-pr
  - suggest-next-action
---

## Goal

Aggregate pull requests from all repositories of the personal user and the organizations they are a member of into one table, sorted by latest `updatedAt`

## Scope

Use `gh search prs --owner <owner>,<owner>` to pull results across all repos of the owners in one call — no need to list repos first; unlike `/list-github-pr` which targets one repo at a time

See also: /list-github (dispatcher), /list-github-pr, /all-github-repo, /open-github, /review-github-pr

## Execute

### 1. Resolve Owners

> Goal: know all owners to list (personal + orgs)

1. If the user specifies `owner` from the argument, use it
2. Otherwise run `gh api user --jq .login` as `user_login`
3. Run `gh api user/orgs --jq '.[].login'` to find the organizations the user is a member of
4. Combine into one `owners` list, e.g. `newkub,wrikka` (comma-separated)
5. If `gh api user` fails, stop and recommend `gh auth login`

### 2. List Pull Requests

> Goal: pull PRs from every repo of those owners

1. Run the main command (covers both personal and org in one call):

   ```bash
   gh search prs --owner <owners> --state open \
     --sort updated --order desc --limit 200 \
     --json repository,number,title,author,state,isDraft,commentsCount,updatedAt,url
   ```

2. `--owner` accepts comma-separated values — no need to loop per owner
3. Omit `--state` when both open and closed are wanted; use `--merged` for merged PRs only
4. Use `--author <user>` when only PRs the user wrote are wanted
5. Use `--involves <user>` when PRs the user participated in (wrote or reviewed or was assigned) are wanted
6. Filter bots out of the result afterwards with `--jq '[.[] | select(.author.is_bot | not)]'` (e.g. `renovate[bot]`)
7. Other filters as the context needs: `--label`, `--base`, `--head`, `--review`, `--draft`, `--repo`, `--visibility`, `--created`, `--updated`

### 3. Merge And Format

> Goal: present the results readably in one table

1. Merge results from all queries into one JSON array with `jq -s 'add'` or run a single query when possible
2. Remove duplicates with `unique_by(.url)`
3. Sort by newest `updatedAt` first, convert to `YYYY-MM-DD`
4. Take `repository.nameWithOwner` as the Repo column and `author.login` as the Author column
5. Do `/report` with columns:
   - No.
   - Repo (`owner/name`)
   - Number
   - Title
   - Author
   - State (`open`/`closed`/`merged`/`draft`)
   - Comments
   - Updated
   - URL
6. Summarize the total PR count and the counts per owner/repo

### 4. Suggest Next Steps

> Goal: recommend the next actions

1. To review a PR → do `/review-github-pr <number>` in that repo
2. To handle pending PRs or CI fails → do `/resolve-github-pr`
3. To list one repo's PRs with branch metadata → do `/list-github-pr <owner>/<repo>`
4. To open a PR page in the browser → do `/open-github pr <owner>/<repo> <number>`
5. To get the repo list for widening scope → do `/all-github-repo`
6. Do `/suggest-next-action` for further suggestions

## Rules

### 1. GitHub Authentication

- Must login with `gh auth login` first; if `gh api user` returns an error, stop and recommend login
- Never guess owners or repos when they can't be found

### 2. Scope: Personal And Org

- By default only repos owned by the owners are covered (the user's personal repos + each listed org's repos)
- PRs in other people's repos that the user went into → switch from `--owner` to `--author <user>` instead
- For orgs where the API returns 403/404, skip that org and record the reason

### 3. Search API Limits

- The GitHub Search API returns at most 1,000 results per query — if `--limit` hits this bound, warn and narrow the scope with `--updated`/`--created` or split per owner
- When there are many member orgs, run separate per-owner queries and merge results, to enforce a per-owner result bound
- Omitting `--state` = both open and closed; `merged` is not a search state — use `--merged` instead

### 4. Output

- Always use `/report`; the No. column comes first, numbered 1, 2, 3, ...
- Do not show body or sensitive data from `--json body`
- Always state the scope used (owners, state filter, counts)

## Expected Outcome

- All PRs of the personal user and their organizations in one table
- Complete data: repo, number, title, author, state, comments, updated, url
- Counts per owner with next actions for the chosen PRs

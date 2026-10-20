---
name: resolve-all-github-actions-fails
argument-hint: "[--owner <user-or-org>]"
description: List and resolve GitHub Actions workflow runs that fail in every repo of the account, then delete the failed runs
related:
  - resolve-github-actions-fails
  - all-github-repo
  - delete-cicd-fails
  - resolve-errors
  - report
  - suggest-next-action
  - ask-me
---

## Goal

List all repos of the account (user + orgs) that have failed GitHub Actions runs, then resolve each repo and delete all failed runs in a single account

## Scope

Use when you need to sweep CI failures across the whole account — every repo the `gh` token can access. For a single repo, use `/resolve-github-actions-fails`

## Execute

### 1. Verify gh CLI

> Goal: Confirm that `gh` is ready and authenticated
1. Run `gh --version`
2. Run `gh auth status`
3. If not authenticated → run `/ask-me` so the user runs `gh auth login`

### 2. List Repos

> Goal: Obtain the list of all repos in the account
1. If there is `--owner` → use that owner (user or org)
2. If not → run `/all-github-repo` or `gh repo list <owner> --limit 100` for the user and each org from `gh api user/orgs --jq ".[].login"`
3. Receive the full list of `owner/repo`

### 3. Scan Failed Runs

> Goal: Find repos that have failed workflow runs
1. For each repo run `gh run list --repo <owner/repo> --status failure --limit 10`
2. If there are many repos, batch them (5-10 repos per round) to avoid rate limits
3. Keep only the repos that have failures, along with the run count
4. If no repo fails → report that the work is done and stop

### 4. Resolve Per Repo

> Goal: Resolve failures one repo at a time
1. For each repo that fails → run `/resolve-github-actions-fails --repo <owner/repo>` (covers analyzing logs, rerun, watch)
2. Find the local project with `/search-project-in-drive-d <repo-name>` if a code fix is needed
3. If the repo has no local clone or cannot be resolved → mark as `manual-fix-required` then move to the next repo
4. Repeat up to 3 rounds per repo

### 5. Delete Failed Runs

> Goal: Delete the failed runs from every repo
1. After resolving each repo → delete the failed runs with `/delete-cicd-fails` or `gh run delete <run-id> --repo <owner/repo>`
2. Record the last green SHA of each repo before deleting
3. If any repo has more than 5 runs to delete or is a production repo → run `/ask-me` to confirm first

### 6. Build Report

> Goal: Report the results as a table
1. Use `/report` with columns: No., Repo, Failing Runs, Status, Action Taken, Deleted, Notes
2. Sort by repo name
3. State the summary: total repos, repos resolved, runs deleted, repos left as manual-fix-required

### 7. Suggest Next Action

> Goal: Suggest the next step
1. Run `/suggest-next-action` to suggest fixing the workflow, viewing logs, or `/resolve-cicd`

## Rules

### 1. Safety
- Ask the user before rerun/deploy if there are many failures or production is affected
- Do not push or merge code automatically
- Do not edit workflow files without permission
- Rollback is possible: record the last green SHA before fixing every repo

### 2. Rate Limit
- Do not query too fast — batch repos and use `--limit`/`--page`
- If `gh` returns a rate limit (403/429), wait and retry

### 3. Local Project Matching
- Use `/search-project-in-drive-d` to find a project in `D:\` that matches the repo name
- If not found → manual-fix-required

### 4. Secret Safety
- Do not expose tokens, secrets, or logs containing credentials in output
- Mask the token in logs

## Expected Outcome

- List of repos with GitHub Actions failures along with their status after resolve
- Failed runs are deleted or marked manual-fix-required
- A table sorted by repo name with the last green SHA per repo

---
name: resolve-github-actions-fails
argument-hint: "[--repo <owner/repo> | verify]"
description: Inspect and fix failed GitHub Actions workflow runs for the current repo or the specified repo
related:
  - resolve-errors
  - search
  - report
  - suggest-next-action
  - ask-me

---

## Goal

List failed GitHub Actions workflow runs for the specified project/repo, then resolve them all

## Scope

Applies to the current repo or the repo specified by the user; covers public/private per the `gh` token permissions

- For list fails see `references/list-fails.md`

## Execute

### Workflows

| Argument | Workflow |
|----------|----------|
| `verify`, `verify-resolved` | `workflows/verify-resolved/SKILL.md` — watch the new run to completion, confirm success on the remote |

1. If the argument is `verify` → read `workflows/verify-resolved/SKILL.md` then follow the flow — do not resolve again
2. If not specified → do Steps 1-8 as usual

### 1. Verify gh CLI

> Goal: Confirm that `gh` is ready and authenticated
1. Run `gh --version`
2. Run `gh auth status`
3. If not authenticated → run `/ask-me` to have the user run `gh auth login`
4. Record the username

### 2. Identify Repo

> Goal: Identify the repo to resolve
1. If `--repo` is present → use that value
2. If not → use `gh repo view --json nameWithOwner` or `git remote -v` from the current directory
3. If the repo cannot be found → run `/ask-me` to have the user specify it

### 3. List Failed Runs

> Goal: Find the failed workflow runs in that repo
1. Run `gh run list --repo <owner/repo> --status failure --limit 30`
2. Receive the list: workflow, branch, commit, event, started at, url
3. If there are no failures → report that the work is done, stop

### 4. Analyze Logs

> Goal: Find the root cause of each failure
1. For each failed run run `gh run view <run-id> --repo <owner/repo> --log-failed`
2. Or view the log from the URL you have
3. Record the main error of each run

### 5. Resolve Each Failure

> Goal: Fix the workflow failures
1. If it is transient/the same error → run `gh run rerun <run-id> --repo <owner/repo>`
2. If it is an issue fixable by a code change → run `/resolve-errors` then let the user decide to commit/push
3. Find the local project with `/search-project-in-drive-d <repo-name>` if a code fix is needed
4. If it is a config/secret issue → suggest the user check `.github/workflows/` or the repository settings
5. Wait for the rerun result if any and recheck
6. Repeat at most 3 rounds per run
7. If it cannot be resolved → mark `manual-fix-required`

### 6. Watch Run Real-time

> Goal: Track the run in real time until it finishes
1. Run `gh run watch <run-id> --repo <owner/repo>` to track in real time
2. If `gh run watch` hangs or times out → run `gh run view <run-id>` to check the status instead
3. If the run fails → go back to the Analyze Logs step and continue resolving
4. loop until all workflows pass — at most 5 rounds; if it still does not pass → stop and report the status
5. Before pushing a fix, record the last green SHA with `git rev-parse HEAD`
6. If the fix round ≥ 3 and it creates a new failure → `git revert` back to the last green SHA

### 7. Delete Failed Runs

> Goal: Delete the failed workflow runs from the repo
1. After resolve/re-run is complete, delete the remaining failed runs with `gh run delete <run-id> --repo <owner/repo>` or `/delete-cicd-fails`
2. Delete both runs already resolved (superseded) and runs still failing — do not leave red runs lingering
3. If the number of runs to delete > 5 → run `/ask-me` to confirm before deleting at once
4. Record the last green SHA before deleting so you can roll back/analyze retroactively

### 8. Build Report

> Goal: Summarize the result as a table
1. Combine the results from the specified repo
2. Use `/report` columns: No., Workflow, Branch, Commit, Event, Started At, Status After Resolve, Deleted, Notes
3. Sort by latest Started At
4. State a summary: total failures, resolved, deleted, remaining manual-fix-required

### 9. Suggest Next Action

> Goal: Suggest the next step
1. Run `/suggest-next-action` to suggest fix workflow, view logs, or `/resolve-cicd`

## Rules

### 1. Safety
- Ask the user before rerun if there are many failures or it affects production
- Do not push or merge code automatically
- Do not modify workflow files without permission

### 2. Rate Limit And Scope
- Use pagination `--limit` and `--page`
- If `gh` is rate limited → wait and retry

### 3. Local Project Matching
- Use `/search-project-in-drive-d` when you need to find the local repo for a code fix
- If no local repo is found → suggest the user fix it themselves

### 4. Privacy
- Supports public/private repositories per the permissions of the `gh` token
- Do not expose secrets or tokens in the output

### 5. Account-wide
- If the user wants to resolve across all repos → use `/resolve-all-github-actions-fails` instead (this skill does one repo at a time)

### 6. Watch Timeouts
- `perRoundTimeout` = `120` seconds for each fix-and-push round
- `ghRunWatchTimeout` = `300` seconds for `gh run watch`
- Stop immediately when the user presses `Ctrl+C` — record the run status before stopping

### 7. Push Failure Handling
- If `git push` fails due to a merge conflict → `git pull --rebase` then push again
- If `git push` fails due to branch protection → run `/ask-me`
- If `git push` fails due to network → retry at most `3` times

### 8. Delete Failed Runs
- Default: delete the failed runs after resolve is complete (`gh run delete` or `/delete-cicd-fails`) — see Step 7
- Always record the last green SHA before deleting so post-incident analysis/rollback is possible
- If there are many (>5 runs) or it is a production repo → run `/ask-me` to confirm before deleting


## Expected Outcome

- A list of failed GitHub Actions runs with their status after resolve for the specified repo
- A table sorted by the date the failure occurred
- workflow, branch, commit, url, action taken data available
- No push/merge or repo modification without permission

- Also used in `git-push`; account-wide scope is at `/resolve-all-github-actions-fails`

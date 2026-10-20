---
name: merge-github-pr
description: Merge a pull request with the appropriate strategy, with validation before merge
argument-hint: "[scope|verify]"
related:
  - resolve-github-pr
  - refactor-commit
  - git-commit
  - git-push
  - deep-validate
  - review-github-pr
  - scan-codebase
  - scan-security
---

## Goal

Merge a pull request with the appropriate method (merge, squash, rebase) along with checking CI, review approval, and conflicts

## Scope
- For related skills: `refactor-commit`, `git-commit`, `git-push`, `deep-validate`, `open-github`, `review-github-pr`

Use when a PR is ready to merge, you need to choose the strategy correctly and merge safely

## Execute

### 1. Read PR Info

> Goal: read the PR information

1. Run `gh pr view <pr>` to see title, body, branch, base, status
2. Record the PR number, branch, author
3. If there is no PR number → do `/ask-me`

### 2. Check Merge Requirements

> Goal: check the conditions before merge

1. Run `gh pr checks <pr>` or `gh pr view <pr> --json statusCheckRollup`
2. Check review approval: `gh pr view <pr> --json reviews`
3. Check conflicts: `gh pr view <pr> --json mergeStateStatus`
4. If CI does not pass → do `/resolve-errors` before merge
5. If there are conflicts → do `/resolve-github-pr` or merge the base branch

### 3. Choose Merge Strategy

> Goal: choose the appropriate strategy

1. Look at project conventions or `CONTRIBUTING.md`
2. Choose:
   - `--merge` if you want to keep the commit history
   - `--squash` if you want a single commit (default for a feature branch)
   - `--rebase` if you want a linear history
3. If unclear → ask the user with `/ask-me`

### 4. Final Checks

> Goal: final verification

1. Do `/scan-codebase` on the PR diff — snapshot the structure/patterns/quality before merge
2. If the PR touches manifest/lockfile or auth/payment/secrets code → do `/scan-security` and resolve Critical/High before merge
3. Do `/run-check` (lint, typecheck, tests)
4. Do `/run-test` for critical paths
5. Check that the branch being merged is complete

### 5. Merge

> Goal: perform the merge

1. Run `gh pr merge <pr> --<strategy>`
2. If admin privilege is needed → add `--admin`
3. If there is auto-merge → use `gh pr merge <pr> --auto`
4. Wait until the merge succeeds

### Workflows

> Goal: dispatch post-merge verification separately from the merge flow

| Argument | Workflow |
|----------|----------|
| `verify`, `verify-merge` | `## Merged Details → verify-merge` — PR merged on the remote, base updated, cleanup complete |

1. If the argument is `verify` → read `## Merged Details → verify-merge` then follow the flow — do not merge again
2. If not specified → do Steps 1-7 as normal, where Step 6 reads the `verify-merge` workflow to execute before cleanup

### 6. Verify And Cleanup

> Goal: confirm and cleanup

1. Follow `## Merged Details → verify-merge` — confirm the PR is merged on the remote first
2. Run `git fetch` and `git pull` on the base branch
3. Delete the local branch if not needed `git branch -d <branch>`
4. Run `gh pr delete-branch <pr>` if wanted

### 7. Report

> Goal: summarize the result

1. Report the PR number, strategy, final status
2. Specify the branches that were deleted or kept

## Rules

- Do not merge if CI does not pass
- Do not merge if the scan gate does not pass — `/scan-codebase` must have no Critical/High findings in the diff; if there are any they must be fixed before merge
- Do not merge if there are unresolved conflicts
- Do not merge without approval (unless the user instructs)
- Use the strategy per project conventions
- Always do the final checks before merge

## Merged Details

### verify-merge

##### Goal

Confirm after `gh pr merge` that the PR is actually merged on the remote, the base branch is updated, and cleanup is complete — call standalone after the merge finishes

##### Scope

- Use when `/merge-github-pr` dispatches to `verify` or calls it after merge
- Covers: PR state on the remote, base branch sync, merge commit on the remote, branch cleanup
- Read-only: verify — do not re-merge

##### Execute

###### 1. Verify PR State

> Goal: the PR is actually merged on GitHub

1. `gh pr view <pr> --json state,mergedAt,mergeCommit` — state = `MERGED`
2. Record the merge commit sha and the strategy used
3. Flag if the state is `CLOSED` without merging or still `OPEN` (auto-merge pending)

###### 2. Verify Base Branch

> Goal: the base branch on the remote has the merge commit

1. `git fetch origin` then `git log origin/<base> --oneline -3` — the merge commit is on the remote
2. `gh pr checks <pr>` or look at the CI run on the base after merge — post-merge CI passes or is running
3. Flag if the merge commit is not on the remote base

###### 3. Verify Cleanup

> Goal: branch hygiene after merge

1. `gh pr view <pr> --json headRefName` → check whether the remote branch has been deleted (`git ls-remote --heads origin <branch>`)
2. local branch cleanup: `git branch --merged <base>`
3. Flag stale branches that are merged but still present

###### 4. Report

> Goal: summarize the merge status

1. Use `/report` columns: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `merged-clean` / `merged-pending-ci` / `not-merged` along with pending items

##### Rules

- Evidence must come from the remote (`gh`/`git ls-remote`), not local state alone
- auto-merge pending ≠ merged — report it as pending
- Do not delete branches in this workflow — report so the caller does it

##### Expected Outcome

- Confirm the PR is merged on the remote with the merge commit sha
- The list of pending cleanup, if any

## Expected Outcome

- The PR is merged successfully
- The base branch is updated
- Branches that are done being used are cleaned up
- A clear summary

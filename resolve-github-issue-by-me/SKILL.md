---
name: resolve-github-issue-by-me
description: Collect issues I created → implement each issue → comment a summary and close correctly
argument-hint: "[issue-or-repo-or-filter]"
related:
  - implement-to-production
  - create-github
  - list-github
  - create-plan-in-dot-devin
  - run-verify
  - resolve-github-pr
  - use-subagents
  - ask-me

---

## Goal

Collect all GitHub issues created by me (`@me`) then implement each issue via `/implement-to-production` until complete, then comment the result and close each issue with correct evidence

## Scope

- Handle only open issues where the authenticated user is the author (`gh issue list --author @me`)
- If an issue number is specified → resolve only that issue (verify the implementation then comment + close)
- Implement each issue with `/implement-to-production` in priority order
- Do not touch others' issues and do not implement beyond the scope of each issue
- If a single issue needs a plan first → use `/create-plan-in-dot-devin` for the single issue
- If an issue is linked to a PR → use `/resolve-github-pr` so the merge closes the issue automatically

## Execute

### 1. Verify Repository And Auth

> Goal: Confirm the repo and identity

1. Run `gh auth status` and `gh repo view`
2. If outside the repo use `--repo owner/repo` for every command
3. Receive `<issue-or-repo-or-filter>` from the argument if present
4. If the repo cannot be accessed → stop and report

### 2. List My Open Issues

> Goal: Collect the issues I created

1. Run `gh issue list --author @me --state open --limit 50 --json number,title,labels,createdAt` or use `/list-github-issue`
2. If an issue number is specified → use `gh issue view <issue>` to check that the author is me
3. Sort by labels/priority if present, otherwise by createdAt old → new
4. Show the list of issues to the user before implementing
5. If there are no open issues → report and finish
6. If issues have dependencies on each other → order so that blocked issues are done later

### 3. Confirm Scope

> Goal: Confirm with the user before implementing multiple issues

1. Summarize the number of issues and the order to be done
2. Use `/ask-me` to let the user choose: do all, select some issues, or cancel
3. Record the list of issues the user approved as the queue

### 4. Implement Each Issue

> Goal: Run `/implement-to-production` for each issue in the queue

1. Read the issue with `gh issue view <issue> --comments` to see the acceptance criteria and context
2. Create a branch per project conventions if the issue requires code changes
3. Run `/implement-to-production` using the issue body and comments as requirements
4. Run `/run-verify` after implementing each issue — if it does not pass, fix before moving to the next issue
5. Record the commits and PR (if any) linked to the issue

### 5. Resolve Each Issue

> Goal: Comment a summary and close the issue after implementation is complete

1. Check that the acceptance criteria are fully met per the linked commits/PRs — if there is a PR not yet merged → run `/resolve-github-pr` first
2. Run `gh issue comment <issue> --body "<summary>"` — summarize what was implemented with evidence (commit hash, PR number, verification results)
3. Run `gh issue close <issue> --reason completed` for issues fully implemented
4. Run `gh issue close <issue> --reason "not planned"` only when the user confirms it will not be done
5. If the PR already has `Closes #<issue>` → check that GitHub closes it automatically after merge
6. If the issue is not yet fully complete → comment the progress instead of closing and keep it in the queue

### 6. Report Summary

> Goal: Report the overall results

1. Summarize the number of issues: implemented, resolved, skipped, failed along with URLs
2. Identify the remaining issues with reasons
3. Suggest the next action if issues remain

### Subagents

> Goal: parallelize implementation when issues are independent

- Use the profile `issue-implementer` (`## Merged Details → issue-implementer`) when the queue has many issues with no dependencies on each other and the user approves parallel — spawn one per issue via `/use-subagents`, with each agent on its own branch, then the parent comments+closes each issue after merge
- If issues have dependencies on each other → do it sequentially per `### 3. Sequential Discipline`, do not spawn parallel

## Rules

### 1. My Issues Only

- Process only issues with `--author @me`
- Do not implement, close, or comment on others' issues without permission
- Verify the author before every issue

### 2. Confirm Before Batch

- The user must confirm the list of issues before implementing multiple
- Do not implement without showing the queue to the user first
- The user can select a subset or cancel

### 3. Sequential Discipline

- Do one issue at a time to completion and verify it passes before moving to the next issue
- If any issue fails → stop, report, and ask the user whether to skip or continue fixing
- Each issue gets its own branch/commits per project conventions

### 4. Evidence Before Close

- Every implemented issue must have a summary comment before closing
- Close an issue only when there is evidence: merged PR, commits, or verification passing
- If `/implement-to-production` fails midway → do not resolve that issue
- `gh issue delete` is destructive and must always ask the user first; suggest using `close` instead

### 5. Scope Per Issue

- Implement only what the issue specifies, do not expand the scope
- If extra work is found → create a new issue via `/create-github-issue` instead of doing beyond the scope

## Merged Details

### issue-implementer

##### Role

A subagent for implementing a single GitHub issue end to end — read the issue and comments, lay out a plan, implement, verify until you have PR-ready changes — used when the queue has many independent issues and the user approves parallel implementation

##### Inputs

- `issue`: issue number or URL such as `#123`
- `repo`: `owner/repo` or use the current repo
- `branch-convention`: the project's naming pattern such as `feat/issue-123-<slug>`
- `verify-commands`: commands for verification such as `bun run test`, `bun run lint`

##### Tools

- `exec` — `gh issue view <n> --comments`, `git checkout -b`, `git add/commit`, verify commands
- `read`, `grep`, `find_file_by_name` — read the related code
- `edit`, `write` — implement changes

##### Execute

1. Read the issue with `gh issue view <issue> --comments` — pull the acceptance criteria and context from the comments
2. Confirm the issue is `--author @me` per the parent's scope — if not, return `skipped`
3. Lay out a short implementation plan from the acceptance criteria — if complex, run `/create-plan-in-dot-devin`
4. Create a branch per `branch-convention`
5. Implement only what the issue specifies — if extra work is found, record it and suggest `/create-github-issue` rather than doing it yourself
6. Run `verify-commands` — lint, typecheck, tests pass before returning
7. Commit per conventional commits — do not push and do not open a PR yourself unless the parent instructs

##### Output Contract

Return the result as the implementation summary of a single issue:

| Field | Value |
|-------|-------|
| Issue | `#123` |
| Branch | `feat/issue-123-x` |
| Commits | `abc1234`, `def5678` |
| Files Changed | list with `added`/`modified` |
| Verify | `lint: pass`, `typecheck: pass`, `test: pass` |
| Status | `done` / `blocked` / `skipped` |
| Acceptance | checklist pass/fail per item |

- If `blocked` → state the reason and what was left unfinished

##### Constraints

- Implement only the issue's scope — do not expand or modify other parts
- Keep this issue's branch/commits separate — do not touch other branches or issues
- Do not push, do not open a PR, do not close the issue yourself — the parent comments+closes after merge
- verify must pass before returning `done` — if it fails more than 3 rounds return `blocked`
- If the issue is not one of `@me` or the requirements are unclear → return `skipped`/`blocked` so the parent asks the user

## Expected Outcome

- All open issues I created are implemented via `/implement-to-production`
- Each completed issue is commented with a summary and closed with the correct reason
- Issues not yet complete receive a progress comment
- Verification passes for every implemented issue
- A complete summary report: implemented, resolved, skipped, failed along with URLs

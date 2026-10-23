---
name: push-all-my-projects
description: Push unpushed commits in every local clone of my GitHub repos via check-unpush + git-push
argument-hint: "[filter | owner/repo]"
allowed-tools:
  - exec
  - read
  - grep
  - find_file_by_name
  - ask_user_question
related:
  - all-github-repo
  - check-unpush
  - git-push
  - git-commit
  - refactor-commit
  - commit-all-my-projects
  - use-subagents
  - report
  - ask-me
  - suggest-next-action
---

## Goal

Push every local clone of my personal and organization GitHub repositories that holds commits not yet on the remote — build the GitHub inventory first, find those clones across the machine, then push per repo/branch with `/git-push` without rewriting history

## Scope

Use when you want committed work published across every machine location at once. The inventory defines the target set: personal repos plus repos in organizations I belong to. Local discovery reuses [commit-all-my-projects/references/roots.md](../commit-all-my-projects/references/roots.md) — read that file for roots, depths, prunes, and the discovery function. Does not commit (use `/commit-all-my-projects` first if a repo is still dirty)

## Execute

### 1. Build The GitHub Inventory

> Goal: Know which remote repos belong to me

1. Check `gh auth status`; when `gh` is missing or unauthenticated → skip to step 2, mark the report coverage `incomplete`, and say why
2. List personal repos: `gh repo list --limit 1000 --json nameWithOwner,isArchived,isFork,defaultBranchRef` — the `/all-github-repo` skill wraps this listing when a broader inventory is wanted
3. List organizations: `gh api user/orgs --paginate --jq '.[].login'`, then `gh repo list <org> --limit 1000 --json nameWithOwner,isArchived,isFork,defaultBranchRef` per org
4. Record `nameWithOwner`, archived, fork, and default branch per repo; exclude archived repos from push targets unless the user opts in
5. Accept an optional argument: `owner/repo` narrows to one repo, any other keyword filters by name

### 2. Discover Local Repositories

> Goal: Find every clone on the machine

1. Read [references/roots.md](../commit-all-my-projects/references/roots.md) and run its `scan_root` for drive D, `~/.agents`, `$HOME`, `$LOCALAPPDATA`, `$APPDATA`, and `~/.local`
2. Resolve each hit with `realpath` and dedupe — `~/.agents` is a symlink to `D:\dot-agents`, so the harness repo appears twice
3. Skip bare repos and any path the roots file excludes
4. Also record clones that belong to worktrees of the same repo, keyed by the main `.git` directory

### 3. Match And Classify

> Goal: Connect each local clone to a GitHub repo

1. Normalize `git -C <repo> remote get-url origin` with `sed -E 's#^(https?://github\.com/|git@github\.com:|ssh://git@github\.com/)##; s#\.git$##; s#/$##'`
2. Classify each local repo:
   - `matched` — origin is in the inventory
   - `missing-locally` — inventory repo with no local clone; reported, never pushed
   - `local-only` — no GitHub origin; reported, never pushed
   - `no-remote` — no `origin` at all; reported
   - `other-owner` — origin exists but is not mine; reported, excluded unless the user asks
3. Present counts per class before touching the network

### 4. Check Unpush Per Project

> Goal: Keep only the repos and branches with commits waiting

1. Run `/check-unpush` on every `matched` repo — `git status -sb`, `git log '@{u}..HEAD' --oneline`, `for-each-ref` upstream tracking
2. Skip repos with no ahead commits
3. Flag `no-upstream`, `gone`, `behind`, `unreachable`, and detached-HEAD repos for the report
4. Show the repos and branches to push together with their ahead counts

### 5. Confirm Push Plan

> Goal: The user chooses the scope before anything leaves the machine

1. Ask with `/ask-me`:
   - `current` — push only the current branch per repo (default)
   - `all-branches` — push every local branch that is ahead
   - `select` — the user picks repos
   - `dry-run` — print the plan without pushing
2. Ask whether `no-upstream` branches become `git push -u origin <branch>` or stay skipped
3. Ask whether archived repos and `other-owner` clones are in scope
4. If the user does not answer → stop and report; never push without confirmation

### 6. Push Each Project

> Goal: Publish every selected branch without rewriting history

1. Loop sequentially through the plan — one repo at a time
2. Run `/git-push` per repo/branch; use `git push -u origin <branch>` only for the `no-upstream` branches the user allowed
3. For a repo that is behind → skip it and report that a pull is needed first
4. For a repo with messy unpushed commits → recommend `/refactor-commit` and skip it
5. For a repo that is dirty → recommend `/commit-all-my-projects` or `/git-commit` and skip it
6. With more than 5 independent repos → use `/use-subagents` to split the batch, then merge the reports

### 7. Verify

> Goal: Confirm the commits reached the remote

1. Re-run `/check-unpush` on the repos that were pushed
2. For each repo still ahead → state the cause: rejected, unreachable, skipped, or awaiting a pull

### 8. Report Summary

> Goal: Summarize inventory coverage and push results

1. Use `/report` with columns `No.`, `Project`, `Path`, `GitHub`, `Branch`, `Pushed`, `Status`
2. Status values: `pushed`, `clean`, `skipped`, `error`, `behind`, `no-remote`, `unreachable`, `other-owner`
3. Add a separate inventory summary: matched, missing-locally, local-only, archived, and any `gh` coverage gap
4. Run `/suggest-next-action`

## Rules

### 1. Inventory Defines The Push Set

- Push only local clones whose `origin` matches a personal or organization repo in the inventory
- `other-owner` and `local-only` repos are reported, never pushed, unless the user explicitly names them
- Archived repos and forks stay out of scope unless the user opts in

### 2. Machine Scope, One Definition

- Roots, depths, and prunes live only in [commit-all-my-projects/references/roots.md](../commit-all-my-projects/references/roots.md); this skill must not restate them
- Never scan `C:\Windows`, `C:\Program Files*`, temp folders, or package-manager stores
- Resolve real paths before planning so no repo is pushed twice

### 3. Confirm Before Push

- Always pass `/ask-me` before pushing — the dry-run plan comes first
- Never `git push --force`, `--force-with-lease`, or rewrite pushed history under any circumstance
- Never push a repo that is behind the remote

### 4. Network Aware

- When the remote is unreachable → flag `unreachable`, skip, and do not retry-loop
- Use a short timeout for remote checks; when offline → report from local tracking data and state that reachability was not verified
- When `gh` cannot list the inventory → report from local origins and mark coverage `incomplete`

### 5. No Commit

- This skill only pushes — no committing, no pull, no working-tree changes
- Dirty repos are handed to `/commit-all-my-projects`

### 6. Idempotency

- Re-running never pushes an up-to-date branch — ahead counts decide, not timestamps
- Inventory repos with no local clone do not block the run

## Expected Outcome

- The GitHub inventory of personal and organization repos is listed with what is missing locally
- Every in-scope local clone that was ahead is pushed, or skipped with a stated reason
- No force push or history rewrite occurs, and the report shows inventory coverage plus per-repo status

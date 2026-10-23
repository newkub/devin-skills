---
name: commit-all-my-projects
description: Commit uncommitted changes in every git repo on the machine via check-uncommit + git-commit
argument-hint: "[root | filter]"
allowed-tools:
  - exec
  - read
  - grep
  - find_file_by_name
  - ask_user_question
related:
  - check-uncommit
  - git-commit
  - git-commit-at-dot-agents-global
  - check-secrets
  - push-all-my-projects
  - use-subagents
  - report
  - ask-me
  - suggest-next-action
---

## Goal

Safely commit pending work in every git repository found on the machine — drive D, the global skills harness, home, local, and appdata — by scanning with `/check-uncommit` first and committing per repo with `/git-commit`

## Scope

Use when you want every dirty repo on the machine committed in one pass. Repo discovery is shared with `/push-all-my-projects` through [references/roots.md](references/roots.md) — read that file for the root table, depths, prunes, and the discovery function; never copy that table here. Accepts an optional root name or filter keyword. Does not push (continue with `/push-all-my-projects`)

## Execute

### 1. Discover Repositories

> Goal: Know every repo on the machine worth scanning

1. Read [references/roots.md](references/roots.md) and run its `scan_root` for each root: drive D, `~/.agents`, `$HOME`, `$LOCALAPPDATA`, `$APPDATA`, `~/.local`
2. If the argument names a root → scan only that root plus its overlaps; if it is a keyword → scan every root and filter hits by path or project name
3. Resolve every hit with `realpath` and dedupe — `~/.agents` is a symlink to `D:\dot-agents`, so the same repo arrives through two roots
4. Skip bare repos (`git -C <repo> rev-parse --is-bare-repository` returns `true`) and any path the roots file says never to scan
5. Sort the remaining list by path depth descending so a submodule is handled before its parent

### 2. Check Uncommit Per Project

> Goal: Keep only repos with pending work

1. Run `/check-uncommit` on every discovered repo — `git -C <repo> status --porcelain`
2. Skip clean repos, and skip repos whose only changes are ignored build output
3. Flag repos with an in-progress `merge`/`rebase`, a detached HEAD, or secret-suspect files, and exclude them from the plan
4. Group the output by root so the user sees where the work sits

### 3. Confirm Commit Plan

> Goal: The user picks the scope and message strategy before work starts

1. Ask with `/ask-me`:
   - `all` — commit every dirty repo (default)
   - `select` — the user picks repos
   - `dry-run` — print the plan without committing
2. Ask for the message strategy: per-repo conventional message from `/git-commit` (default) or one shared message
3. If the user does not answer → stop and report; never commit without confirmation

### 4. Commit Each Project

> Goal: Commit every selected repo without breaking history

1. Loop sequentially through the plan — one repo at a time so the message matches that repo's diff
2. For `D:\dot-agents` and its `skills/` submodule → use `/git-commit-at-dot-agents-global`, which runs the lint, review, and validate gates before committing the child and then the parent pointer
3. For every other repo → run `/git-commit`, letting it stage, write the message, and run hooks
4. Run `/check-secrets` before committing anything containing `.env`, credential, or key files; skip and flag the repo when something is found
5. If a pre-commit hook fails → record the error and skip that repo; never pass `--no-verify`
6. With more than 5 independent repos → use `/use-subagents` to split the batch, then merge the reports

### 5. Verify

> Goal: Confirm no repo was silently left dirty

1. Re-run `/check-uncommit` on every repo the plan touched
2. For each repo still dirty → state the cause: hook failure, secrets flag, merge in progress, or skipped by the user

### 6. Report Summary

> Goal: Summarize the commit results

1. Use `/report` with columns `No.`, `Project`, `Path`, `Root`, `Files`, `Commit`, `Status`
2. Status values: `committed`, `clean`, `skipped`, `error`, `flagged`
3. Count each status and list the flagged repos with the reason
4. Run `/suggest-next-action` — recommend `/push-all-my-projects` when commits are not yet on a remote

## Rules

### 1. Machine Scope, One Definition

- The roots, depths, and prunes live only in [references/roots.md](references/roots.md); this skill must not restate them
- Extra roots are allowed only when the user names them, and the addition must appear in the report
- Never scan `C:\Windows`, `C:\Program Files*`, temp folders, or package-manager stores

### 2. Confirm Before Commit

- Always pass `/ask-me` before committing — show the dry-run plan first
- Never commit a repo with a pending merge/rebase, detached HEAD, or secrets flag
- Never `--no-verify` and never rewrite existing commits in this workflow

### 3. Per-Repo Context

- Commit messages come from that repo's actual diff and its latest `git log` style — no shared generic message unless the user asked for one
- Keep the submodule order: commit `skills/` first, verify the child commit exists, then stage the parent pointer

### 4. No Push

- This skill only commits — no push, pull, or fetch
- Hand off to `/push-all-my-projects` when the user wants the commits published

### 5. Idempotency

- Re-running never creates empty commits — clean repos are always skipped
- A repo skipped for a flag stays skipped until the flag is resolved

## Expected Outcome

- Every dirty repo in scope is committed with a message that matches its own diff, or skipped with a stated reason
- No secret or half-finished merge state is committed
- One report listing each repo with its root, status, and the next action toward `/push-all-my-projects`

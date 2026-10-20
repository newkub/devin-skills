---
name: git-rebase
description: Safely rebase a branch — onto main, autosquash fixups, complete conflict flow
argument-hint: "[onto-branch|abort|continue]"
related:
  - check-merge-conflicts
  - resolve-errors
  - run-check
---

## Goal

Replay commits onto a new base or tidy history with a rebase, without breaking shared history

## Scope

- `git rebase <base>` (linearize), `git rebase --onto`, autosquash (`--autosquash` with `fixup!`/`squash!` commits)
- conflict resolution flow: continue/abort/skip
- does not cover interactive rebase (`-i`) — use non-interactive equivalents: autosquash, `--onto`, `git reset` + recommit

## Execute

### 1. Safety Check

> Goal: confirm the rebase is safe before starting

1. `git status` — the working tree must be clean (or `/git-stash` first)
2. check whether the branch has been pushed/shared — rebasing a pushed branch = rewriting public history → requires confirmation + force-push only, and notify collaborators
3. record a backup ref: `git branch backup/<name>-<date>` always before rebasing
4. run `/check-merge-conflicts` to assess conflict risk if any

### 2. Rebase

> Goal: commits are replayed onto the new base

```bash
git fetch origin
git rebase origin/main                    # linearize onto the latest main
git rebase --onto main <old-base> <branch> # move commits across bases
git rebase --autosquash origin/main       # fold fixup!/squash! commits (requires rebase.autoSquash)
```

1. always fetch the latest base first — rebasing onto a stale base = redoing work
2. if unsure → use `--onto` in smaller segments rather than rebasing the whole branch

### 3. Handle Conflicts

> Goal: conflicts resolved correctly, commit by commit

1. conflict → fix the files, `git add`, `git rebase --continue`
2. that commit is no longer needed → `git rebase --skip`
3. everything goes wrong → `git rebase --abort` always returns to the pre-rebase state
4. a long rebase/many conflicts → consider merge instead (conflicts resolved once)

### 4. Verify

> Goal: history is clean and code is not broken

1. `git log --oneline origin/main..HEAD` — commits are in order with no merge commits mixed in
2. run `/run-check` — semantic conflicts do not show up in `git status`
3. if the branch was pushed → `git push --force-with-lease` only (never `--force`)

## Rules

- never rebase commits others may have based work on (public history) — the golden rule of rebasing
- always create a backup branch before rebasing — reflog exists but an explicit backup is clearer
- `--force-with-lease` only when pushing after a rebase — prevents overwriting others' work
- rebase = rewrite — if a PR is under review and reviewers look at history → notify them first
- Use /resolve-errors if needed

## Expected Outcome

- branch is linear onto the latest base with clean history
- no lost commits (backup ref + reflog) and it passes `/run-check`

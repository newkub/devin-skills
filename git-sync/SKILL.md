---
name: git-sync
description: Sync the local repo with its remote — fetch/pull strategy, submodules and fork sync
argument-hint: "[pull|fetch|fork] [remote/branch]"
related:
  - git-branch
  - git-rebase
  - git-submodule
  - check-unpush
  - check-uncommit
  - resolve-errors
---

## Goal

Safely sync the local repository with its remote(s) — choose the correct pull strategy, and sync submodules and forks

## Scope

- `git fetch`/`pull` strategies (merge, rebase, ff-only), `--prune`, `--all`
- submodule sync (`--recurse-submodules`), fork sync (upstream remote)
- push direction → `/git-push`; conflicts → `/check-merge-conflicts`

## Execute

### 1. Assess State

> Goal: know how local differs from remote before pulling

1. `git status` — uncommitted changes? → `/git-stash` or commit before syncing
2. `git fetch --all --prune` — always fetch before deciding (does not touch the working tree)
3. `git log --oneline HEAD..@{u}` and `@{u}..HEAD` — see incoming/outgoing commits
4. diverged (both sides have commits) → choose the strategy in step 2

### 2. Choose Pull Strategy

> Goal: pick the merge method matching the team convention

| Situation | Command |
|-----------|---------|
| local has no new commits | `git pull --ff-only` — fast-forward only, the safest |
| diverged, team uses linear history | `git pull --rebase` (see `/git-rebase`) |
| diverged, team uses merge commits | `git pull` (merge) |
| unsure | `git pull --ff-only` — fail first, then choose; no auto-merge |

1. `--ff-only` is the safe default — a failure = real divergence; then pick rebase/merge per the convention
2. check `git config pull.rebase` / the project's branch convention first

### 3. Sync Extras

> Goal: submodules and other refs follow along

1. `git pull --recurse-submodules` or `git submodule update --init --recursive` after pulling (see `/git-submodule`)
2. `git fetch --tags` if releases use tags
3. fork: `git fetch upstream && git merge upstream/main` (or rebase) — the upstream remote must exist (`git remote -v`)

### 4. Verify

> Goal: local matches remote with nothing lost

1. `git status` — ahead/behind = 0 against the upstream
2. `/check-unpush` — the intended local commits still exist
3. `git stash list` — if you stashed before syncing → `git stash pop` to bring it back

## Rules

- always fetch + inspect before pulling — a blind pull = unnecessary merge conflicts
- uncommitted changes + pull = risky — always stash/commit first
- `--ff-only` when in doubt — unintended merge commits smear the history
- `git pull` on an already-rebased branch → use `--rebase`, not merge
- Use /resolve-errors if needed

## Expected Outcome

- local synced with the remote using the convention-matching strategy
- submodules/tags all followed along, no uncommitted work damaged

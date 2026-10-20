---
name: git-reset
description: Safely git reset — soft/mixed/hard modes; understand the impact before running
argument-hint: "[--soft|--mixed|--hard] [ref|paths]"
related:
  - git-restore
  - git-revert
  - git-stash
  - ask-me
---

## Goal

Use `git reset` to move HEAD/index/working tree back with the right mode — understand what each mode touches before running it

## Scope

- `--soft` (moves HEAD only), `--mixed` (default — unstage), `--hard` (deletes — destructive)
- reset to a given ref, uncommit, unstage — does not cover per-file `git restore` (use `/git-restore`)

## Execute

### 1. Know The Modes

> Goal: pick the mode matching the intent — a wrong reset mode loses work

| Mode | HEAD | Index | Working tree | Use case |
|------|------|-------|--------------|----------|
| `--soft` | moves | keeps | keeps | squash the latest commits into one commit |
| `--mixed` | moves | resets | keeps | uncommit but keep changes as unstaged |
| `--hard` | moves | resets | resets | delete everything back to the ref — `destructive` |

### 2. Safety Check

> Goal: lose no work and do not rewrite shared history

1. `git status` + `git stash list` — if there is uncommitted work that might be needed → `/git-stash` first
2. check whether the commits to be reset away have already been pushed — pushed → use `/git-revert` instead
3. record the current sha: `git rev-parse HEAD` — reflog can recover but a saved sha is clearer

### 3. Reset

> Goal: HEAD goes to the right ref and the state matches the mode

```bash
git reset --soft HEAD~1      # uncommit the latest, keep everything staged
git reset HEAD~1             # uncommit + unstage (--mixed default)
git reset --hard HEAD~2      # delete 2 commits + changes — confirm first
git reset --hard origin/main # sync local with remote — destructive
```

1. `--hard` always requires confirmation — state what will be lost (commits + working changes)
2. reset a single file: `git reset <path>` (unstage) or `/git-restore` for per-file

### 4. Verify And Recover Path

> Goal: the state matches the intent and you know the way back

1. `git log --oneline -5` + `git status` — HEAD and working tree are as intended
2. recover: `git reflog` to find the old sha → `git reset --hard <sha>` — reflog keeps ~90 days
3. run `/run-check` if the reset changed code state

## Rules

- `--hard` is always destructive — preview + confirm, no exceptions
- never reset pushed commits — use `/git-revert` (reset = rewriting public history)
- record `git rev-parse HEAD` before every reset — a clear recovery path
- unsure → use `--soft`/`--mixed` first (non-destructive), then escalate
- Use /ask-me if needed

## Expected Outcome

- HEAD/index/working tree are in the intended state per the chosen mode
- no committed work is lost without a recovery path (sha recorded)

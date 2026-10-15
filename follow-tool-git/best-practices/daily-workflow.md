# Git Daily Workflow Best Practices

Guidance for using git day to day — disciplined branching, committing, and syncing

## Recommended Patterns

### 1. Always a feature branch

```bash
git switch -c feat/add-login main
```

- never commit straight to `main`/`dev` — all work lives on a branch, merged via PR
- name per team convention: `feat/`, `fix/`, `chore/`, `refactor/`

### 2. Review before commit

```bash
git status          # see changed files
git diff            # unstaged changes
git diff --staged   # staged changes — always read before committing
git add -p          # stage hunk by hunk — not a blind git add -A
```

- `git add -p` helps split unrelated changes into separate commits instead of one catch-all commit
- watch for files that must not be committed: `.env`, credentials, `*.local`, build output — check `git status` every time

### 3. Readable commits

- one commit does one thing — atomic, easy to revert
- message format: `<type>: <what>` + a body explaining `why` when unclear, e.g. `fix: handle null user in checkout`
- write in imperative mood: "add feature", not "added feature"
- if the message needs several "and"s → split the commit

### 4. Sync with the remote safely

```bash
git fetch --all --prune        # update refs + remove stale branches
git pull --rebase              # take others' work without junk merge commits
git push -u origin feat/x      # first push sets upstream
git push --force-with-lease    # safe force push (your own branches only)
```

- `--force-with-lease` > `--force` — fails if the remote has new unknown commits, protecting against overwriting others' work
- default `git pull` = merge → creates junk merge commits; `pull --rebase` keeps history linear

### 5. Worktrees for parallel work

```bash
git worktree add ../repo-hotfix hotfix/critical-bug
```

- instead of `git stash` + switching branches — do a hotfix without disturbing the main working tree
- good for: reviewing someone else's PR, long-running builds on the main branch

## Do / Don't

| Do | Don't |
|---|---|
| `git status` + `git diff` before every commit | `git add -A && git commit` without looking at what is staged |
| small frequent commits on a feature branch | one giant commit at the end of the day |
| `pull --rebase` when syncing a branch | plain `pull` merges creating merge-commit noise |
| `git stash push -m "wip: x"` with a message | bare `git stash` then forgetting what it holds |
| `git switch` / `git restore` (modern commands) | `git checkout` for everything (ambiguous semantics) |
| delete merged branches with `git branch -d` | let stale branches pile up |

## Common Pitfalls

- Accidentally committing secrets: `.env`, API keys in the diff — use gitleaks in pre-commit (see `/follow-tool-hk`) + check `git diff --staged`
- `git add -A` stages everything including unintended files: build artifacts, `node_modules`, OS files (`.DS_Store`, `Thumbs.db`) — set up `.gitignore` fully from the start
- Amending a pushed commit: `git commit --amend` changes the hash → push conflict — amend only commits not yet pushed
- Stashing and forgetting: make `git stash list` a habit — old stashes applied onto new code cause conflicts
- Resolving merge conflicts wrong: hastily marking resolved without reading — `<<<<<<<` conflict markers survive into the commit; always search for markers before committing
- `git clean -fd` deletes files not yet committed: always run `git clean -nd` dry-run first

## CI / Team Notes

- hooks: pre-commit = fast checks (format, lint staged files); pre-push = heavier (typecheck, tests) — never put the full test suite in pre-commit
- `.gitattributes`: pin `eol` and binary files (`*.png binary`) — cuts diff noise and line-ending flip on Windows
- set `git config pull.rebase true` as a personal default if the team uses linear history
- `git config core.hooksPath` or hk/moon hooks — don't rely on manual `.git/hooks` that can't be shared

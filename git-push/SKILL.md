---
name: git-push
description: Safely push commits from the local repository and git submodules to the remote repository
argument-hint: "[scope]"
related:
  - git-commit
  - refactor-commit
  - update-github-metadata
  - resolve-errors
  - scan-codebase
  - scan-security

---

## Goal

Safely push commits from the local repository and git submodules to the remote repository

## Scope

Use to push commits to the remote repository for both the root repo and git submodules

## Execute

### 1. Check Status And Commits

> Goal: Check Status And Commits

- run `git branch --show-current`, `git status`, and `git submodule status` to see the current state
- run `git log --oneline origin/<branch>..HEAD` to see the commits to push
- run `/scan-codebase` on the scope to be pushed to snapshot the structure/patterns/quality of what changed
- if the diff touches manifest/lockfile or auth/payment/secrets code → also run `/scan-security` and resolve Critical/High before pushing
- always consider `/refactor-commit` before push — check that commits are appropriately sized, with clear messages and logical order — if commits are too large or messages unclear, run `/refactor-commit` before pushing

### 2. Push

> Goal: Push

- run `git push origin <branch>` and `git submodule foreach --recursive git push origin <branch>` — never use `--no-verify` or flags that skip any kind of git hook
- if a git hook reports an error, fix the root cause instead of skipping the hook — run `/resolve-errors` if needed
- if the push is rejected, stop and inform the user; do not force push

### 3. Validate

> Goal: Validate

- run `git log --oneline origin/<branch> -5` to confirm the commits appear on the remote
- run `git status` to confirm local and remote are in sync

### 4. Check GitHub Actions

> Goal: Check GitHub Actions

- run `gh workflow list` to check whether the repo has GitHub Actions
- if yes, run `/resolve-github-actions-fails` to check and re-run until they pass

### 5. Update GitHub Repo Metadata

> Goal: Update GitHub Repo Metadata

Update repository metadata to reflect the real project — use `/update-github-metadata` as the canonical workflow

1. run `/update-github-metadata` to update description, homepage, topics, default branch
2. check that `package.json` has the `repository`, `homepage`, `bugs`, `license` fields complete
3. for a public repo, set `--enable-issues=true` and `--enable-wiki=false` (use docs instead)

### 6. Open Repo

> Goal: Open Repo

- run `git remote get-url origin` to see the remote URL
- convert the SSH URL to an HTTPS URL, then run `/open-web` to open the repo in the browser

### 7. Ensure Repository Ready (Optional)

> Goal: Ensure Repository Ready (Optional)

Do this only when `git` reports an error that there is no repository or no remote

- if there is no `.git`, run `git init`, `git add -A`, `git commit -m "Initial commit"`, and run `/update-gitignore`
- if there is no remote, run `gh repo create <repo-name> --private --source=. --remote=origin --push` using the folder name as the repo name

## Rules

### 1. Repository Initialization

- this is an optional step, done only when `git` reports an error
- if there is no remote, create one with `gh repo create` as `--private` initially
- use the current folder name as the repo name automatically
- run `/update-gitignore` after `git init` to ensure `.gitignore` is complete

### 2. Safety

- never use `--no-verify` or any other flag that skips git hooks (e.g. `--no-verify`, `HOOK_SKIP=true`) — git hooks must always run
- always pass the scan gate (`/scan-codebase` + `/scan-security` when applicable) before pushing — never push with unresolved Critical/High
- if a git hook reports an error, fix the root cause instead of skipping the hook — run `/resolve-errors` if needed
- always consider `/refactor-commit` before push to keep commits clean and appropriate
- do not force push unless truly necessary
- if the push is rejected, stop and inform the user; do not force push

### 3. Submodules

- always push both the root repo and the submodules
- use `git submodule foreach --recursive` for all operations

### 4. GitHub Repo Metadata

- use `/update-github-metadata` as the canonical workflow for metadata
- set the metadata every time after creating a new repo or the first push
- check that `package.json` has `repository`, `homepage`, `bugs`, `license` complete
- for a public repo, set `--enable-issues=true` and `--enable-wiki=false`

- Use /git-commit if needed
- Use /git-commit-and-push if needed

## Expected Outcome

- the repository is ready to push even without an existing `.git` or remote
- the push scope passes the scan gate (`/scan-codebase`, `/scan-security` when applicable) before pushing
- commits pushed to the remote successfully (both root and submodules)
- local and remote are in sync
- all GitHub Actions pass
- the repo opens in the browser automatically after a successful push
- show a clickable URL of the commit on the remote

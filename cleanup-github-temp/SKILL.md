---
name: cleanup-github-temp
description: Delete every file in the GitHub temp repo and leave it empty
argument-hint: "[--purge]"
related:
  - save-to-github-temp
  - delete-git-branch
  - git-push
  - check-secrets
---

## Goal

Remove every file from the private scratch repository `newkub/temp` so it holds no content.

## Scope

- Empties the working tree of the temp repo's `main` branch
- Optionally purges history with `--purge`, which requires a second confirmation
- Does not delete the repository itself and does not touch any other repository
- Does not remove secrets already leaked into history; `--purge` does

## Execute

### 1. Validate Target

> Goal: Confirm the exact repo and branch before anything is removed

1. Resolve the repo from `GITHUB_TEMP_REPO`, defaulting to `newkub/temp`
2. Run `gh auth status`; stop if not logged in
3. Run `gh repo view <repo> --json name,visibility,defaultBranchRef`; stop if missing or not `PRIVATE`
4. Read the default branch, defaulting to `main`; stop if it differs and the user has not confirmed the name

### 2. Dry Run

> Goal: The user sees exactly what will be deleted

1. List every path with `gh api repos/<repo>/git/trees/<branch>?recursive=1 --jq '.tree[] | select(.type=="blob") | .path'`
2. Count files and sum sizes from the same response
3. Print the repo, branch, file count, total size, and the first 20 paths
4. If the repo is already empty, report `already empty` and stop
5. Ask for explicit confirmation naming the repo and file count; without it, stop and change nothing

### 3. Empty The Working Tree

> Goal: `main` contains no files

1. Clone shallowly into a temp directory from `mktemp -d`
2. Run `git rm -r --cached .` then remove the remaining files so no untracked leftovers stay
3. Create an empty commit: `git commit --allow-empty -m "cleanup: empty temp repository"`
4. If `--purge` was requested, branch from `--orphan clean-main`, add no files, commit `cleanup: purge temp history`, then continue to step 4
5. Push with `git push origin HEAD:<branch>`
6. Never use `--force` unless `--purge` is confirmed, and never touch another branch

### 4. Purge History (only with `--purge`)

> Goal: Old contents are unreachable, not just deleted from the tip

1. Show the current commit count and the oldest commit date, then require a second confirmation stating the history will be rewritten
2. Force push the orphan commit: `git push --force origin HEAD:<branch>`
3. Run `gh api -X DELETE repos/<repo>/git/refs/tags/<tag>` for every tag listed by `gh api repos/<repo>/tags`
4. Report that forks and cached views may retain old objects until GitHub garbage-collects

### 5. Verify And Report

> Goal: The repo is verifiably empty

1. Run `git ls-tree -r HEAD` in the scratch clone; it must print nothing
2. Run `gh api repos/<repo>/contents --jq 'length'`; it must return `0` or the endpoint must report no content
3. Run `gh repo view <repo> --json isEmpty` and report the value, noting that a repo with an empty commit reports `false` while holding no files
4. Print the repo URL, the pushed commit, and the mode used (`content` or `purge`)
5. Delete the temp directory

## Rules

### 1. Repository

- Target is `newkub/temp` (private) unless `GITHUB_TEMP_REPO` overrides it
- Never delete the repository itself; use `gh repo delete` only on explicit request with its own confirmation
- Never operate on a public repo, and stop if visibility is not `PRIVATE`

### 2. Safety

- Dry run is mandatory: list the repo, branch, file count, size, and sample paths first
- Deletion needs the file count confirmed back by the user before the first write
- `--purge` needs a second confirmation because it rewrites history and force pushes
- Never force push without `--purge`; never delete the default branch, which GitHub rejects
- Keep every action scoped to the temp repo's default branch

### 3. Determinism

- Running cleanup on an already empty repo makes no commit and reports `already empty`
- Same arguments produce the same end state: a branch with no files
- Leave no local temp directory behind, including on failure

### 4. Boundaries

- Content removal keeps history unless `--purge` is used; state this in the report
- Do not attempt to reclaim GitHub storage quota; it is out of scope
- Restoring deleted content is out of scope; use `/restore-files-from-git-log` before purging if needed

## Expected Outcome

- The temp repo's default branch holds zero files
- History contains no file blobs when `--purge` was used and confirmed
- The report states the mode, commit, file count before and after, and the `isEmpty` value
- No other repository, branch, or local workspace is modified

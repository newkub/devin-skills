---
name: save-to-github-temp
description: Copy workspace material into the private GitHub temp repo
argument-hint: "[path] [slug]"
related:
  - check-secrets
  - create-github-repo
  - git-commit-and-push
  - git-push
  - cleanup-github-temp
---

## Goal

Save workspace material into the private scratch repository `newkub/temp` without touching any project repository or remote.

## Scope

- Copies a chosen path (default: current directory) into `<slug>/` at the root of the temp repository
- One folder per workspace — saving the same slug replaces only that folder, never other slugs
- Excludes ignored, vendored, and heavy build artifacts
- Does not cover permanent backups, secrets, or versioning of the source project

## Execute

### 1. Validate Target

> Goal: Confirm the repo, the source path, and the slug before copying anything

1. Resolve the repo from `GITHUB_TEMP_REPO`, defaulting to `newkub/temp`
2. Run `gh auth status`; if not logged in, stop and tell the user to run `gh auth login`
3. Run `gh repo view <repo> --json name,visibility,isEmpty`; stop if the repo is missing or not `PRIVATE`
4. Resolve the source path from the argument, defaulting to the current directory
5. Set the slug from the second argument, else `basename <source>` lowercased with non `[a-z0-9._-]` replaced by `-`
6. Refuse a slug of `.`, `..`, or one containing `/` or `\`

### 2. Stage A Scratch Clone

> Goal: A clean working copy in the OS temp directory, never inside the source

1. Create a temp directory with `mktemp -d`
2. If the repo is empty: `git init`, `git remote add origin git@github.com:<repo>.git`, `git checkout -b main`
3. Otherwise `git clone --depth 1 git@github.com:<repo>.git <tmp>`
4. Never point the source directory at this clone, and never add a remote to the source repo

### 3. Export The Files

> Goal: The selected material is staged under `<slug>/` with junk excluded

1. Remove the existing `<slug>/` inside the scratch clone so stale files do not survive
2. If the source is a git repo, export tracked files with `git -C <source> archive HEAD | tar -x -C <tmp>/<slug>`
3. Otherwise copy the tree, excluding `node_modules`, `.git`, `dist`, `build`, `.next`, `.turbo`, `.venv`, `target`, `*.log`, and files larger than 50 MB
4. Fail with a clear message if the staged size exceeds 500 MB; tell the user to narrow the path

### 4. Scan For Secrets

> Goal: No credential reaches the scratch repo

1. Run `/check-secrets` against the staged `<slug>/` directory
2. If any finding is `high` or `critical`, delete the staging directory, stop, and report the files — never push
3. Confirm `.env`, `*.pem`, `*.key`, `id_rsa*`, and credentials files are absent; if present, stop

### 5. Commit And Push

> Goal: The snapshot is on `main` on GitHub

1. `git add <slug>`
2. Commit as `save(<slug>): <YYYY-MM-DD HH:mm>`; if nothing changed, report `already up to date` and stop
3. `git pull --rebase origin main` when the remote branch exists
4. `git push origin main`
5. Never force push; on a rejected push, rebase once and retry once, then stop and report

### 6. Verify And Report

> Goal: The files are reachable on GitHub

1. Run `gh api repos/<repo>/contents/<slug> --jq 'length'` and confirm the count is non-zero
2. Print the repo URL, the slug folder link, the file count, and the staged size
3. Delete the temp directory

## Rules

### 1. Repository

- Target is `newkub/temp` (private) unless `GITHUB_TEMP_REPO` overrides it
- Never create the repo here; a missing repo is an error, use `/create-github-repo` first
- Never write to any repository other than the temp repo

### 2. Isolation

- Keep the scratch clone in the OS temp directory
- Never modify, stage, or commit inside the source workspace
- Only `<slug>/` may be written; other slugs are read-only during a save

### 3. Safety

- Dry run first: list the slug, file count, excluded paths, and total size, then get explicit confirmation before pushing
- Push only after the secret scan passes
- Never force push, never delete other slugs, never delete the branch

### 4. Contents

- Exclude secrets, dependencies, build output, and files over 50 MB
- Keep the staging size under 500 MB
- Do not embed absolute local paths in committed files; strip them when writing metadata

## Expected Outcome

- `<slug>/` exists on `main` of the private temp repo with the selected files
- No secret, dependency directory, or build artifact is committed
- The source workspace is unchanged
- The user receives the repo URL, folder link, file count, and staged size

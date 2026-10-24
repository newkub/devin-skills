---
name: save-to-github-temp
description: Copy files or a packed Repomix snapshot into the private GitHub temp repo
argument-hint: "[copy|pack] [path] [slug]"
related:
  - follow-tool-repomix
  - check-secrets
  - create-github-repo
  - git-commit-and-push
  - git-push
  - cleanup-github-temp
---

## Goal

Save workspace material into the private scratch repository `newkub/temp` without touching any project repository or remote — either the real files (`copy`) or one AI-friendly packed snapshot (`pack`).

## Scope

- Target is one folder `<slug>/` at the root of the temp repository; one folder per workspace
- `copy` (default) — export the tracked source tree into `<slug>/`
- `pack` — run Repomix, then commit only the packed output (`repomix-output*.md`) into `<slug>/`
- Saving the same slug replaces only that folder, never other slugs
- Does not cover permanent backups, secrets, or versioning of the source project
- Packing follows `/follow-tool-repomix`; publishing is `/git-commit-and-push`
  (or `/git-push` for an existing commit); clearing old slugs is
  `/cleanup-github-temp`

## Execute

### 1. Validate Target

> Goal: Confirm the mode, repo, source path, and slug before writing anything

1. Read the mode from the first argument: `copy` or `pack`; anything else means `copy` and counts as the path
2. Resolve the repo from `GITHUB_TEMP_REPO`, defaulting to `newkub/temp`
3. Run `gh auth status`; if not logged in, stop and tell the user to run `gh auth login`
4. Run `gh repo view <repo> --json name,visibility,isEmpty`; stop if the repo is missing or not `PRIVATE`
5. Resolve the source path from the next argument, defaulting to the current directory
6. Set the slug from the last argument, else `basename <source>` lowercased with non `[a-z0-9._-]` replaced by `-`
7. Refuse a slug of `.`, `..`, or one containing `/` or `\`

### 2. Pack Mode

> Goal: One reviewed packed file with the secret check enabled

Run only when mode is `pack`; skip to Step 3 otherwise.

1. Create a `mktemp -d` staging directory outside the source
2. Pack into it; keep Secretlint on and exclude dependencies and build output:

```bash
bunx repomix@latest <source> \
  --style markdown \
  --compress \
  --ignore "node_modules/**,.git/**,dist/**,build/**,.next/**,.turbo/**,.venv/**,target/**,*.log" \
  --token-count-tree 500 \
  --output <stage>/repomix-output.md
```

3. Read the security summary — Repomix excludes files that look like secrets; list them in the dry-run report
4. If the output exceeds about 5 MB, re-run with `--split-output 1mb` instead of truncating
5. Never pass `--no-security-check`; if the pack fails the security gate, stop and report the files
6. Fail with a clear message when the packed total exceeds 500 MB; tell the user to narrow the path or add `--include`

### 3. Stage A Scratch Clone

> Goal: A clean working copy in the OS temp directory, never inside the source

1. Create a temp directory with `mktemp -d`
2. If the repo is empty: `git init`, `git remote add origin git@github.com:<repo>.git`, `git checkout -b main`
3. Otherwise `git clone --depth 1 git@github.com:<repo>.git <tmp>`
4. Never point the source directory at this clone, and never add a remote to the source repo

### 4. Place The Content

> Goal: Only the chosen content is staged under `<slug>/`

1. Remove the existing `<slug>/` inside the scratch clone so stale files do not survive
2. `copy` mode:
   - If the source is a git repo, export tracked files with `git -C <source> archive HEAD | tar -x -C <tmp>/<slug>`
   - Otherwise copy the tree, excluding `node_modules`, `.git`, `dist`, `build`, `.next`, `.turbo`, `.venv`, `target`, `*.log`, and files larger than 50 MB
3. `pack` mode: create `<tmp>/<slug>/` and copy only the packed output files (`repomix-output*.md`); never copy the source tree, the Repomix config, or any temporary file
4. Keep Repomix on `target-relative` paths so no absolute local path is committed
5. Fail with a clear message if the staged size exceeds 500 MB; tell the user to narrow the path

### 5. Scan For Secrets

> Goal: No credential reaches the scratch repo

1. Run `/check-secrets` against the staged `<slug>/` directory
2. If any finding is `high` or `critical`, delete the staging directory, stop, and report the files — never push
3. Confirm `.env`, `*.pem`, `*.key`, `id_rsa*`, and credentials files are absent; if present, stop
4. In `pack` mode, treat the Repomix security summary and the secret scan as two separate gates — both must pass

### 6. Dry Run And Confirmation

> Goal: The user approves exactly what will be published

1. Print the repo, the mode, the slug, the file names, the staged size, and the total token count for `pack`
2. List every excluded file and why
3. Get explicit confirmation before pushing

### 7. Commit And Push

> Goal: The snapshot is on `main` on GitHub

1. `git add <slug>`
2. Commit as `save(<slug>): <YYYY-MM-DD HH:mm>` for `copy`, `pack(<slug>): <YYYY-MM-DD HH:mm>` for `pack`; if nothing changed, report `already up to date` and stop
3. `git pull --rebase origin main` when the remote branch exists
4. `git push origin main`
5. Never force push; on a rejected push, rebase once and retry once, then stop and report

### 8. Verify And Report

> Goal: The snapshot is reachable on GitHub

1. Run `gh api repos/<repo>/contents/<slug> --jq 'length'` and confirm the count is non-zero
2. Print the repo URL, the slug folder link, the file count, the staged size, and the token count for `pack`
3. Delete the temp and staging directories

## Rules

### 1. Repository

- Target is `newkub/temp` (private) unless `GITHUB_TEMP_REPO` overrides it
- Never create the repo here; a missing repo is an error, use `/create-github-repo` first
- Never write to any repository other than the temp repo

### 2. Isolation

- Keep the pack staging directory and the scratch clone in the OS temp directory
- Never modify, stage, or commit inside the source workspace
- Only `<slug>/` may be written; other slugs are read-only during a save

### 3. Safety

- Dry run first: report the mode, slug, file names, size, and token count, then get explicit confirmation before pushing
- Push only after both the Repomix security check and `/check-secrets` pass
- Never force push, never delete other slugs, never delete the branch

### 4. Contents

- Exclude secrets, dependencies, build output, and files over 50 MB
- Keep the staged size under 500 MB
- Do not embed absolute local paths in committed files; strip them when writing metadata

### 5. Packing

- Keep Secretlint enabled; excluded files are reported, not scrubbed
- Compress the snapshot and split it when large; never truncate silently
- `pack` never copies the real source tree; use `copy` when the files themselves must be preserved

## Expected Outcome

- `<slug>/` exists on `main` of the private temp repo with either the selected files or the packed snapshot
- Both secret gates pass and excluded files are reported
- The source workspace is unchanged
- The user receives the repo URL, folder link, file count, staged size, and token count

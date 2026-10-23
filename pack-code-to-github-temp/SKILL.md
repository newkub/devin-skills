---
name: pack-code-to-github-temp
description: Pack a codebase with Repomix into the private GitHub temp repo
argument-hint: "[path] [slug]"
related:
  - follow-tool-repomix
  - save-to-github-temp
  - cleanup-github-temp
  - check-secrets
  - git-push
---

## Goal

Pack a workspace into one AI-friendly file with Repomix and publish that snapshot to a slug folder in the private scratch repository `newkub/temp`.

## Scope

- Packs a chosen path (default: current directory) with Repomix, then commits the packed file(s) to `<slug>/` on `main` of the temp repo
- One folder per workspace — packing the same slug replaces only that folder, never other slugs
- Does not copy the real source tree; use `/save-to-github-temp` when the files themselves must be preserved
- Does not cover permanent backups, secrets, or versioning of the source project

## Execute

### 1. Validate Target

> Goal: Confirm the repo, the source path, and the slug before packing anything

1. Resolve the repo from `GITHUB_TEMP_REPO`, defaulting to `newkub/temp`
2. Run `gh auth status`; if not logged in, stop and tell the user to run `gh auth login`
3. Run `gh repo view <repo> --json name,visibility,isEmpty`; stop if the repo is missing or not `PRIVATE`
4. Resolve the source path from the argument, defaulting to the current directory
5. Set the slug from the second argument, else `basename <source>` lowercased with non `[a-z0-9._-]` replaced by `-`
6. Refuse a slug of `.`, `..`, or one containing `/` or `\`

### 2. Pack With Repomix

> Goal: One reviewed packed file with the secret check enabled

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

### 4. Place The Packed Files

> Goal: The snapshot is staged under `<slug>/` with nothing else

1. Remove the existing `<slug>/` inside the scratch clone so stale files do not survive
2. Create `<clone>/<slug>/` and copy only the packed output files (`repomix-output*.md` or the split parts)
3. Do not copy the source tree, the Repomix config, or any temporary file
4. Confirm the packed file uses `target-relative` paths so no absolute local path is committed

### 5. Scan For Secrets

> Goal: No credential reaches the scratch repo

1. Run `/check-secrets` against the staged `<slug>/` directory
2. If any finding is `high` or `critical`, delete the staging directory, stop, and report the files — never push
3. Confirm `.env`, `*.pem`, `*.key`, `id_rsa*`, and credentials files are absent; if present, stop
4. Treat the Repomix security summary and the secret scan as two separate gates — both must pass

### 6. Dry Run And Confirmation

> Goal: The user approves exactly what will be published

1. Print the repo, the slug, the pack command, the output file names, the packed size, and the total token count
2. List any files Repomix excluded and why
3. Get explicit confirmation before pushing

### 7. Commit And Push

> Goal: The snapshot is on `main` on GitHub

1. `git add <slug>`
2. Commit as `pack(<slug>): <YYYY-MM-DD HH:mm>`; if nothing changed, report `already up to date` and stop
3. `git pull --rebase origin main` when the remote branch exists
4. `git push origin main`
5. Never force push; on a rejected push, rebase once and retry once, then stop and report

### 8. Verify And Report

> Goal: The packed snapshot is reachable on GitHub

1. Run `gh api repos/<repo>/contents/<slug> --jq 'length'` and confirm the count is non-zero
2. Print the repo URL, the slug folder link, the file count, the packed size, and the token count
3. Delete both temp directories

## Rules

### 1. Repository

- Target is `newkub/temp` (private) unless `GITHUB_TEMP_REPO` overrides it
- Never create the repo here; a missing repo is an error, use `/create-github-repo` first
- Never write to any repository other than the temp repo

### 2. Isolation

- Keep the pack staging directory and the scratch clone in the OS temp directory
- Never modify, stage, or commit inside the source workspace
- Only `<slug>/` may be written; other slugs are read-only during a pack

### 3. Safety

- Dry run first: report the slug, file names, size, token count, and excluded files
- Push only after both the Repomix security check and `/check-secrets` pass
- Never force push, never delete other slugs, never delete the branch

### 4. Packing

- Keep Secretlint enabled; excluded files are reported, not scrubbed
- Exclude dependencies, `.git`, build output, and files over 50 MB
- Compress the snapshot and split it when large; never truncate silently
- Keep the staged size under 500 MB
- Do not embed absolute local paths; keep Repomix on `target-relative` output paths

## Expected Outcome

- `<slug>/` exists on `main` of the private temp repo containing only the packed snapshot
- Both secret gates pass and excluded files are reported
- The source workspace is unchanged
- The user receives the repo URL, folder link, file count, packed size, and token count

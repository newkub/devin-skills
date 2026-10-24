---
name: delete-temp
description: Delete temp dirs for project, OS, or agent harness with dry-run and confirm
argument-hint: "[project|os|harness|artifacts|cache|all|<path>] [--older-than <days>] [--yes]"
related:
  - delete-project-temp
  - cleanup-disk-computer
  - cleanup-artifact
  - cleanup-project
  - clean-empty-dirs
  - create-files-in-os-temp
  - cleanup
  - apply
  - ask-me
  - report
  - suggest-next-action
---

## Goal

Delete temporary files from one entry point — project temp, OS temp, and agent-harness leftovers — with a dry-run preview and confirmation before anything is removed

## Scope

- Owns the temp-deletion contract: resolve → preview → confirm → delete → verify
- Build artifacts and package-manager caches are delegated to their owner skills, never re-implemented here
- Does not delete a single explicit file (`/apply` mode `delete`), source code, config, secrets, or a whole project (`/delete-projects`)

| Arg | Deletes | Default rule |
| --- | --- | --- |
| `project` | `.devin/temp/`, `.agents/temp/`, `tmp/`, `.tmp/` at the workspace root | untracked files only, no age filter |
| `os` | entries in `%TEMP%` (Windows), `$TMPDIR` or `/tmp` (Unix) | older than 7 days |
| `harness` | agent leftovers — `%TEMP%\qoder-cli`, `%TEMP%\devin*`, stale `~/.qoder/projects/*/tasks/*.output` | older than 1 day, never the live session |
| `artifacts` | build output (`dist/`, `target/`, `.next/`, …) | delegates to `/cleanup-artifact` — dry-run first |
| `cache` | package-manager caches | delegates to `/cleanup-disk-computer` |
| `all` | `project` → `os` → `harness`, then `artifacts` + `cache` | same rules per scope, in this order |
| `<path>` | one explicit directory | must resolve inside the workspace, OS temp, or a harness root |

### Callers

Skills that should route their temp cleanup here instead of carrying their own delete steps.

| No. | Caller | Invoke | Why |
| --- | --- | --- | --- |
| 1 | `delete-project-temp` | `/delete-temp project` | same `.devin/temp/` scope — keep the name as a thin alias, one implementation |
| 2 | `create-files-in-os-temp` `### 4` | `/delete-temp <path>` for the dir it created, or `/delete-temp os --older-than 1` at the end | its own step 4 duplicates this contract |
| 3 | `cleanup-project` | `/delete-temp project` before the source-file pass | temp artifacts are not source candidates |
| 4 | `clean-empty-dirs` | `/delete-temp project` before scanning | removes temp empty trees at the source |
| 5 | `cleanup` dispatcher | add a `temp` route → `/delete-temp all` | the dispatcher has no temp route today |
| 6 | `cleanup-disk-computer` `### 2` | `/delete-temp os --older-than 7` before `mise run cleanup` | `mise run cleanup` does not clear the OS temp dir |
| 7 | `report-idea-cleanup-files-in-computer` | use `/delete-temp all --dry-run` as its temp-candidate rows | same candidate set, one source of truth |
| 8 | `apply-this-project` | option `temp` → `/delete-temp project` | gives per-project temp cleanup a verified gate |

Do not route here: `/apply` mode `delete` (single file), `/cleanup-artifact` (build output), `/cleanup-docker`, `/delete-projects` (whole project).

## Execute

### 1. Resolve Argument And Guard

> Goal: turn the argument into a concrete, safe path list

1. Split the argument into scope and flags — `--older-than <days>` (default per the arg table), `--yes` (skip the prompt, still print the preview)
2. No argument → `/ask-me` with the arg table as options; never guess between `project`, `os`, and `all`
3. Accept several scopes in one call (`project os`) — resolve each independently and keep the output grouped per scope
4. Resolve every path to its canonical absolute form before deleting anything
5. Refuse and abort that scope when a resolved path equals, or is outside, a guard: a drive root (`C:\`), the home root, `%USERPROFILE%`, `C:\Windows`, `C:\Program Files`, or the workspace root
6. `<path>` must sit inside the workspace, the OS temp dir, or a harness root — otherwise stop and report

### 2. Preview

> Goal: show exactly what will be deleted, with size, before any deletion

1. Walk each scope and collect: file count, total size, oldest and newest `LastWriteTime`
2. Classify each entry as `delete`, `keep` (younger than the age filter, locked, or git-tracked), or `skip` (guard hit, live session, symlink target)
3. Measure size per platform — PowerShell `Get-ChildItem -Recurse -File | Measure-Object Length -Sum`; bash `du -sb`
4. Print the preview grouped by scope: `No.`, `Scope`, `Path`, `Files`, `Size`, `Newest`, `Action`, `Reason`
5. Always print the preview, even with `--yes`

### 3. Confirm

> Goal: get an explicit go-ahead for the destructive step

1. `/ask-me` with `proceed` / `cancel`, restating the total file count and size
2. Warning when a scope includes `plan/` or `report/` under `.devin/temp/` — those artifacts are lost permanently
3. Cancel → finish with no change
4. `/dont-ask-me` mode → keep the preview and proceed with `delete` rows only

### 4. Delete

> Goal: remove the confirmed rows and nothing else

1. Delete deepest-first so nested temp trees clear in one pass
2. PowerShell: `Remove-Item -Recurse -Force <path>`; bash: `rm -rf <path>`
3. On a locked or permission-denied path → record it, skip it, and continue with the remaining paths
4. A symlink or junction → remove the link itself, never recurse into the target
5. After `project` deletion, re-check its parent dirs and remove the ones left empty

### 5. Verify And Report

> Goal: prove the deletion happened and nothing else changed

1. Confirm every `delete` row no longer exists; list anything still present with the reason
2. Report files removed, size reclaimed, and skipped paths
3. For a large reclaim, compare free space before and after (`Get-PSDrive C,D` or `df -h`)
4. Run `/report` as a chat table and `/suggest-next-action`

## Rules

### 1. Dry-Run And Confirmation

- Never delete before the preview and an explicit confirmation
- `--yes` skips the prompt only — it never skips the preview or the classification
- No backup for temp — temp is disposable by definition; a path worth keeping must be copied out before confirming

### 2. Temp Only

- Delete only inside the arg-table roots and the resolved `<path>`
- Never delete git-tracked files, `.git/`, `node_modules/`, lockfiles, `.env*`, credentials, or anything under a guard path
- Prefer the owner skill's own command over a raw delete for caches and artifacts
- One locked file is not a reason to force; a scope that resolves outside its root aborts that whole scope

### 3. Liveness

- Skip the active harness temp root and the current session's files, whatever their age
- Skip anything still open by a running process; report it instead of retrying with force
- Do not delete `%TEMP%\qoder-cli` or `%TEMP%\devin*` while a session is running — use `harness` scope with the age filter instead

### 4. Safe Resolution

- Canonicalize before comparing against guards; a path containing `..` never bypasses the check
- Symlinks and junctions are unlinked, never followed
- Long paths: use the platform's long-path form (`\\?\` prefix on Windows) when a walk fails on depth

### 5. Determinism And Evidence

- Same scope, same age filter, same machine state → the same preview rows
- Report file counts and sizes from measured values, never estimates
- If a scope cannot be measured → stop that scope and report why

## Expected Outcome

- The requested temp scope is deleted, or nothing changed when the user cancels
- A preview and a result report with file counts, size, and every skipped path with its reason
- Source code, config, secrets, and guarded paths are untouched
- Callers listed in `### Callers` delegate here, so the delete contract lives in one place

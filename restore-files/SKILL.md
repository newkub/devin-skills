---
name: restore-files
description: Recover files/state — from git log, devin history, dotfiles, or deleted files via top-level skills
argument-hint: "[domain|verify]"
related:
  - check-git-logs
  - git-file-history
  - git-restore
  - git-revert
  - ask-me

---

## Goal

Dispatch to the destination skill according to the restore source — the parent only does routing

## Scope

- The argument is a domain; if not specified → `/ask-me` to choose a domain

## Execute

### Skills

| Domain | Skill |
|---|---|
| `uncommitted`, `working-tree`, `discard` | /git-restore — discard changes/unstage/recover from HEAD via `git restore` |
| `revert-commit` | /git-revert — undo a committed change with an inverse commit |
| `deleted-file` | /restore-files-deleted-file — recover a deleted file |
| `from-devin-history` | /restore-files-from-devin-history — recover from Devin session history |
| `from-git-log` | /restore-files-from-git-log — recover from git log walking backward until found |
| `from-my-dotfiles` | /restore-files-from-my-dotfiles — recover config from the dotfiles repo |
| `verify` | `## Merged Details → verify-restore` — confirm restored files match the source (hash/fidelity) |

1. Identify the domain from the argument (e.g. `/restore-files-from-git-log`)
2. If the domain is supported → follow the full `/restore-files-<domain>` flow then follow `## Merged Details → verify-restore` to confirm fidelity
3. If the argument is `verify` → follow only `## Merged Details → verify-restore` (standalone re-verify)
4. If the domain is not specified or unknown → `/ask-me` to choose a domain

## Rules

- The parent only dispatches — do not duplicate the destination skill's workflow
- A restore that overwrites the current file must always be confirmed first

- Use /check-git-logs if necessary
- Use /git-file-history if necessary

## Merged Details

### verify-restore

##### Goal

Confirm after a restore that the files came back completely and match the actual source — a fidelity check that every restore skill should call at the end

##### Scope

- Used when `/restore-files` dispatches to `verify`, or called after a restore finishes
- Covers: file presence, content fidelity (hash), expected paths, partial restore detection
- Read-only: check — do not re-restore

##### Execute

###### 1. Check Presence

> Goal: Every file that should be restored is present

1. Compare the list of restored files against the expected list (from the restore output or source manifest)
2. flag files that are missing or were restored to the wrong path

###### 2. Check Fidelity

> Goal: content matches the source

1. If restored from git → compare `git hash-object <file>` against the blob in the source commit
2. If restored from a copy/backup → compare `Get-FileHash` SHA256 against the source
3. If restored from Devin history → compare the content against the recorded snapshot
4. flag files with a mismatched hash — partial write or encoding drift

###### 3. Check Consistency

> Goal: Restored files work together with the repo

1. If the restore is code → `bun run typecheck` or best-effort build
2. Check that the imports/references the new files refer to still exist
3. flag a restored file that references paths/deps that no longer exist

###### 4. Report

> Goal: Summarize restore fidelity

1. Use `/report` columns: `No.`, `Path`, `Status`, `Expected`, `Actual`, `Notes`
2. Verdict: `faithful` / `partial` / `mismatched` along with the list that needs re-restore

##### Rules

- hash mismatch = report immediately — do not assume the restore succeeded
- If there is no source to compare against (e.g. a deleted file with no original left) → specify the verification method used instead (e.g. git show)
- Do not edit restored files — if editing is needed, report back for a new restore

##### Expected Outcome

- A per-file fidelity table with a verdict
- A list of files that need re-restore if partial

## Expected Outcome

- The caller is dispatched to the destination skill that matches the source and recovers according to that flow

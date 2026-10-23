---
name: restore-files-deleted-file
description: Recover deleted files — from the recycle bin, git history, or editor backups
argument-hint: "<path-or-name>"
related:
  - git-restore
  - check-uncommit
---

## Goal

Recover accidentally deleted files — try multiple channels in order: recycle bin, git history, editor/IDE local history, backups — until the file comes back or its loss is confirmed

## Scope

- Use when a file was deleted and needs to come back — whether it was committed or never committed
- Channels in likelihood order: recycle bin → git history → editor local history → backups → undelete tools (last resort)
- Does not cover filesystem-level recovery (photorec, etc.) — suggest it separately if needed
- Related: `/git-restore` restores tracked files, `/check-uncommit` finds repositories with recoverable changes

## Execute

### 1. Gather Facts

> Goal: Understand how the file went missing

1. Determine the path/name from the argument or ask the user
2. Check: was it ever committed to git, when was it deleted, and deleted via what (shell, IDE, git clean, script)
3. Note: `Shift+Delete`/shell `rm` skip the recycle bin — git is the main hope if it was ever tracked

### 2. Try Recycle Bin

> Goal: Easiest channel first

1. Search the recycle bin for the file: PowerShell `(New-Object -ComObject Shell.Application).NameSpace(0xA)` enumerate items
2. If found → restore to the original path
3. If not found → next channel

### 3. Try Git History

> Goal: Recover from git objects

1. Run `/restore-files-from-git-log` — find commits where the file still existed: `git log --all --diff-filter=D -- <path>` or `-- "**/<name>"`
2. `git show <commit>:<path>` to restore the content, or `git checkout <commit>~1 -- <path>`
3. Also check stash and reflog — `git stash list`, `git fsck --unreachable` for dangling objects
4. If the file was never committed → next channel

### 4. Try Editor Local History

> Goal: Recover from IDE/editor backups

1. VS Code local history: `%APPDATA%\Code\User\History` — search entry names for the filename
2. JetBrains Local History: inside the IDE — Local History is kept per file
3. Auto-save/temp files: `*.tmp`, `~*`, `.bak`, swap files in the original directory
4. Cloud sync: OneDrive/Dropbox version history if the directory is in a sync folder

### 5. Try Backups / Last Resort

> Goal: Final channels

1. Windows: Previous Versions (shadow copies) — right-click properties or `vssadmin list shadows`
2. `.devin/` artifacts: bug captures, reports that may still hold the content
3. If every channel fails → report honestly: the file is permanently lost + suggest filesystem recovery tools as a last resort, with a warning that success rates are low once time has passed

### 6. Verify And Report

> Goal: Confirm the recovered file is usable

1. Check the content is complete — not an older version/truncated
2. Report: the channel it was recovered from, the version date, the restore path
3. Suggest prevention: commit more often, a backup policy, `git add` important files even before committing

## Rules

### 1. Fastest Path First

- Try channels in order: recycle → git → editor → backup — stop as soon as one works
- Each channel must be actually verified before declaring "not found"

### 2. No False Hope

- If recovery isn't possible, say so plainly — don't recommend undelete tools as the main answer (very low reliability)
- State the version/date of the recovered file — it may not be the latest

### 3. Verify Content

- A recovered file must have its content checked — partial recovery must be reported
- Restore to the original path unless the user specifies otherwise

## Expected Outcome

- The file comes back via the most appropriate channel, or its permanent loss is confirmed
- A report of the channels tried and their results
- Recommendations to prevent future data loss


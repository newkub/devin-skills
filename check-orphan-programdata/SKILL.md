---
name: check-orphan-programdata
description: Find leftover app data from uninstalled programs, read-only
argument-hint: "[scan-root|app-name]"
related:
  - check-system-env
  - check-my-global-cli
  - use-scripts
  - report
  - report-idea-cleanup-files-in-computer
  - cleanup-disk-computer
  - cleanup
  - ask-me
allowed-tools:
  - exec
  - grep
  - glob
  - find_file_by_name
---

## Goal

Find folders left behind by uninstalled programs (`ProgramData`, `Program Files`, `AppData`) and report each one with its size, the evidence that no program owns it, and a confidence level — read-only, so the user decides before anything is deleted.

## Scope

- Detects app data with no owner: the program is gone from the uninstall registry and no service, task, process, or shortcut references the folder
- Argument: `C:\ProgramData` (scan that root), `app-name` (inspect one program only), or nothing (default roots below)
- Default roots on Windows: `%ProgramData%`, `%ProgramFiles%`, `%ProgramFiles(x86)%`, `%LOCALAPPDATA%\Programs`, `%APPDATA%`, `%LOCALAPPDATA%` — top level only
- Read-only: never deletes, moves, or renames — removal handoff goes to `/cleanup`, caches to `/cleanup-disk-computer`, a broader candidate list to `/report-idea-cleanup-files-in-computer`
- Not for package caches and temp files (`/cleanup-disk-computer`), project source (`/cleanup-project`), or a program that is still installed

## Execute

### 1. Confirm Scope And Roots

> Goal: fix the roots and make the read-only contract explicit

1. Detect the OS and shell; Windows runs PowerShell, macOS/Linux run bash
2. Resolve the roots from the argument or from the default list
3. State that the run is read-only and nothing will be deleted
4. Run `/check-system-env` for the real path variables; run `/check-my-global-cli` only when unsure whether `dua` is installed
5. If the argument is ambiguous (a vendor name, a partial path) → `/ask-me` for the exact root

### 2. Inventory Installed Programs

> Goal: build the owner list to match against

1. Read the three Windows uninstall hives into one JSON snapshot:

   ```powershell
   $keys = 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*',
           'HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*',
           'HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*'
   Get-ItemProperty $keys -ErrorAction SilentlyContinue |
     Where-Object DisplayName |
     Select-Object DisplayName, Publisher, InstallLocation |
     ConvertTo-Json -Compress
   ```

2. Keep `DisplayName`, `Publisher`, and `InstallLocation` for every entry
3. Add Store/MSIX apps: `Get-AppxPackage | Select-Object Name, PackageFullName`
4. macOS/Linux: `brew list --formula --cask`, `dpkg-query -W`, `rpm -qa`, `pacman -Q`, plus `ls /Applications` and `ls ~/Library/Application Support`
5. Build the snapshot once and reuse it — never re-query the registry per folder

### 3. Measure Candidate Folders

> Goal: attach a real size to every top-level folder under the roots

1. Enumerate top-level directories only (depth 1) under each root
2. Measure with `dua aggregate -A <path>` (apparent size, one line per path); fall back to `(Get-ChildItem -LiteralPath <path> -Recurse -Force -File -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum`
3. If there are more than 50 folders → run `/use-scripts` to loop, aggregate, and emit one table; never print raw per-folder output
4. Record `LastWriteTime` per folder
5. Keep rows for folders ≥ 50 MB; keep smaller folders as a count only

### 4. Match Folder To Installed Program

> Goal: decide whether a folder still has an owner

1. Normalize both sides: lowercase; drop `(x64)`, `(x86)`, version strings, and vendor suffixes (`inc`, `ltd`, `llc`, `gmbh`, `corp`, `software`, `technologies`); collapse punctuation
2. `owner found` — a normalized `DisplayName` matches the folder, or the folder is inside any `InstallLocation`
3. `no owner` — no `DisplayName` and no `InstallLocation` matches
4. `possible owner` — only the publisher token matches (same vendor, different product); never treat this as `no owner`

### 5. Verify No Live Owner

> Goal: prove nothing is still using the folder

1. Running processes: `Get-Process | Select-Object Path` — any path inside the folder means live
2. Services: `Get-CimInstance Win32_Service | Select-Object Name, PathName` — `PathName` inside the folder means live
3. Scheduled tasks: `(Get-ScheduledTask).Actions.Execute` — a path inside the folder means live
4. Shortcuts: match names under `%ProgramData%\Microsoft\Windows\Start Menu\Programs` and `%APPDATA%\Microsoft\Windows\Start Menu\Programs`
5. Installer values (`UninstallString`, `ModifyPath`) pointing inside the folder mean live

### 6. Apply Protected And Shared Guards

> Goal: never flag a folder that Windows or a shared runtime needs

1. Never flag `C:\ProgramData\Microsoft`, `Package Cache`, `Packages`, `regid.*`, `chocolatey`, `scoop`, `Common Files`, `WindowsApps`, `Windows Defender`, or anything under `C:\Windows`
2. Never flag anything inside an installed `InstallLocation`
3. Folder modified within the last 90 days → cap confidence at `medium`
4. Access denied or a partially unreadable tree → cap confidence at `low`
5. A vendor folder shared with an installed product from the same publisher → cap confidence at `medium`

### 7. Assign Confidence

> Goal: one verdict per folder that the user can act on

| No. | Confidence | Required evidence |
|-----|------------|-------------------|
| 1 | `high` | no owner match + no live owner + no guard hit + last write older than 90 days |
| 2 | `medium` | no owner match + no live owner, but the name/vendor match is partial or the folder was modified within 90 days |
| 3 | `low` | name-only heuristic, or part of the tree was unreadable |

### 8. Report

> Goal: present a ranked list, never a deletion

1. Build a `/report` with columns: `No.`, `Path`, `Size`, `Confidence`, `Owner Match`, `Live Owner`, `Last Write`, `Suggested Action`
2. Sort by `Size` descending, then `Confidence` high → low
3. Summarize: total size per confidence bucket, folders scanned, unreadable folders
4. Suggested action per row is `quarantine` (rename first, delete later) or `manual review`; never emit a delete command as the first step

### 9. Hand Off Without Deleting

> Goal: keep the skill read-only and route the action

1. Do not delete — this skill stops at the report
2. After explicit confirmation, removal renames the folder to `<path>.orphan-backup-<yyyymmdd>` first and deletes only after the user verifies the program still works
3. Route caches and temp files to `/cleanup-disk-computer`, a broader candidate list to `/report-idea-cleanup-files-in-computer`, other resources to `/cleanup`
4. If the user asks to delete inside this run → confirm with `/ask-me`, then restate the exact paths, sizes, and the rename-first step

## Rules

### 1. Read-Only

- Never delete, move, rename, or modify a folder
- Every removal is a proposal the user confirms, and a rename-quarantine always comes before deletion

### 2. Evidence Before Verdict

- A `high` verdict needs all four: no owner match, no live owner, no guard hit, stale by 90 days
- Missing evidence degrades confidence — it never upgrades it
- Never call a folder orphaned from its name alone

### 3. Deterministic

- Same snapshot, roots, and thresholds → the same table
- Thresholds are fixed: report at ≥ 50 MB, stale at 90 days, depth 1
- State the measurement method (`dua` apparent size or the PowerShell fallback) in the report

### 4. Portable

- Windows: the PowerShell commands above
- macOS/Linux: `/Applications`, `~/Library/Application Support`, `/opt`, `~/.config`, `~/.local/share`, matched against the package database
- No package database on the OS → report names and sizes only, capped at `medium`

### 5. No Guessing About Users

- Do not assume a folder is unused because it is old, small, or oddly named
- When two candidates could be the same program → report both rows and note the overlap

## Expected Outcome

- A table of leftover folders with size, confidence, and the evidence behind every verdict
- Total reclaimable size per confidence bucket
- Nothing deleted, moved, or renamed
- A clear handoff to `/cleanup` or `/cleanup-disk-computer` after the user confirms

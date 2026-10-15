---
name: report-idea-cleanup-files-in-computer
description: Report ideas of files and folders on the machine that can be deleted or cleaned
argument-hint: "[scope]"
related:
  - check-system-env
  - check-my-global-cli
  - use-scripts
  - report
  - report-file-structure
  - suggest-next-action
  - cleanup-files-in-project
  - run-clean
  - run-cleanup
---

## Goal

Analyze and report files/folders on the machine that can be deleted or cleaned, to support decision-making before actual cleanup

## Scope

Use on any user computer (not limited to a workspace), covering package caches, temp files, logs, editor caches, browser caches, and old artifacts
- It is a `report`, no automatic deletion
- Excludes deleting personal files, source code, or secrets

## Execute

### 1. Plan And Confirm Scope

> Goal: Prepare the scope and safety before starting

1. Confirm with the user that this workflow `report`s
2. Define the scope: home directory, temp, package caches, editor/browser caches, or all
3. Pick OS commands per shell (PowerShell, bash, zsh)
4. Run `/check-system-env` to see the main paths
   - Run `/check-my-global-cli` to see installed CLI tools

### 2. Scan System Caches And Temp Files

> Goal: Collect candidates per system and installed tools

1. Find large directories in home:
   - `~/.cache`, `~/.cargo`, `~/.bun/install/cache`, `~/.pnpm-store`, `~/.npm`
   - `%TEMP%`, `%LOCALAPPDATA%`, `%APPDATA%`
   - `scoop/cache`, `mise cache`, `uv tool dir`, `pip cache`
2. Find editor/IDE caches:
   - `.nvim-swap`, `nvim-data/swap`, `.codeium`, `.windsurf`
   - `sccache`, `ccache`, `cargo target` in home
3. Find browser caches:
   - Chrome/Edge/Brave/Firefox profile caches
4. Find logs and old artifacts:
   - `*.log`, `*.old`, `Downloads/*.exe`, `Downloads/*.zip`
5. If there is a lot of data ∥ that must be aggregated, run `/use-scripts` to process it

### 3. Analyze And Classify

> Goal: Group candidates and assess each one's safety

1. Group by category: package cache, temp, logs, editor cache, browser cache, old artifacts
2. Compute the approximate size of each group
3. Assign the safety level:
   - `safe` = temp/cache that can be deleted after closing the programs
   - `review` = old but needs checking first
   - `risky` = related to config or may contain data
4. Check whether a process is still running (use `Get-Process` or `ps`) for active caches
5. Create a suggested cleanup command for each item

### 4. Format Report

> Goal: Format the report to show both the overview and the details

1. Run `/report` with columns:
   - `No.`, `Category`, `Path/Pattern`, `Estimated Size`, `Safety`, `Suggested Command`, `Notes`
2. Run `/report-file-structure` for the top 10 largest directories
3. Summary:
   - Number of candidates
   - Total size that can be reclaimed
   - `safe` items deletable immediately
   - Items needing review

### 5. Suggest Next Actions

> Goal: Present the next options

1. Run `/suggest-next-action` from the report
2. Recommend suitable workflows:
   - `/cleanup-files-in-project` for deleting unnecessary source files
   - `scoop cleanup *`, `mise prune`, `bun pm cache clean`, `pip cache purge`, `sccache --stop-server` + delete cache
3. Only run the real cleanup after the user agrees (use dry-run first)

## Rules

### Report UX/UI

> Goal: report easy to read, key findings summarized at the top, leading to action (idea cleanup files in computer)

1. Summarize key findings at the top before details (idea cleanup files in computer)
2. Use `/report` for comparison tables with multiple columns (idea cleanup files in computer)
3. Use `/report` for status/progress/logs reports
4. Use the "No." column as the first column, ordered 1, 2, 3, ... with clear headers, grouped/ordered by importance (idea cleanup files in computer)
5. Use symbols ✅ ❌ ⚠️ for status indicators
6. Always run `/suggest-next-action` at the end of the report

### 1. Report-Only

- Never delete, move, or auto-edit files
- Every suggested command must be shown to the user first
- Actual deletion requires explicit confirmation from the user

### 2. Safety First

- Never recommend deleting source code, config files, `.env`, secrets, credentials
- Do not delete a cache that a running process is using
- Use tool-specific cleanup commands when available, e.g. `scoop cleanup *` instead of `rm -rf scoop/cache`

### 3. Accuracy

- State the approximate size and how it was computed
- State why each item is a candidate
- If unsure, note `manual review required` in `Notes`

### 4. Cross-Platform

- Use commands per detected OS
- Windows: use PowerShell commands
- macOS/Linux: use bash/zsh commands
- Use `dua`, `duf`, `ncdu`, `gt5` if installed
- Use /run-clean if needed
- Use /run-cleanup if needed

- Final report via `/report-review` — one chat table (No./Action/Evidence/Severity/Risk/Priority/Owner skill/Status), no report files

## Expected Outcome

- Candidate report table for cleanup on the machine
- Approximate total size that can be reclaimed
- Safety level per item
- Recommended cleanup commands
- Clear next actions

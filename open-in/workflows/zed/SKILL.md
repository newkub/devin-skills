---
name: open-in-zed
description: Open a file or directory in the Zed editor via the correct OS-specific CLI
argument-hint: "[path]"
related:
  - follow-create-plugins
  - open-file-in-gitui
---

## Goal

Open the specified file or directory in the Zed editor with the correct CLI, checking the binary, target path, and OS before acting

## Scope

Use when the user wants to open a file or directory in Zed from the current context — a given path, the selected file, or the current working directory. Supports Windows, macOS, and Linux; does not support opening files from a URL

## Execute

### 1. Prepare Context

> Goal: Identify target paths and the correct Zed CLI

1. Identify target paths by priority: the user-specified path, the file open in the IDE, or the current working directory
2. Check the OS
   - Verify the Zed binary is in PATH
3. If no Zed CLI is found, inform the user with install guidance, then stop
4. If the target path does not exist, inform the user and stop

### 2. Open Files

> Goal: Open the target in Zed safely

1. Pick the Zed CLI per OS (the binary is `zed` on every platform — verified Zed 1.18.1, 2026-09-12):
   - macOS: `zed <path...>` (if not in PATH, install via the Zed menu → "Install CLI")
   - Linux: `zed <path...>`
   - Windows: `zed <path...>` — the installer places the CLI at `%LOCALAPPDATA%\Programs\Zed\bin\zed`
   - WSL on Windows: use `zed` inside WSL (supports the `--wsl` flag) or invoke `zed.exe` through an accessible path
2. Open multiple paths in a single command; do not call repeatedly
3. For a directory, open it as a workspace by passing one path
4. Support `path:line:column` to open at a specific position, and the flags: `-n`/`--new` new window, `-e`/`--existing` existing window, `-w`/`--wait` wait until closed, `-a`/`--add` add to the current workspace

### 3. Verify And Report

> Goal: Confirm the files opened and report results

1. Check the exit code or status of the spawned process
2. On failure, show stderr and recommend checking the Zed CLI or path
3. Report the opened paths with the CLI command used

## Rules

### 1. Safety

- Do not auto-create files when the target is missing
- Do not run the command when the Zed CLI is not found in PATH
- If the user gives no path, ask first — never guess

### 2. OS Specific

- Use `zed` on all platforms (macOS, Linux, Windows) — older docs claiming `zeditor` on Windows do not match the current CLI
- On WSL, check the Windows PATH or `*.exe` before using the Linux binary

### 3. Determinism

- Locate the Zed binary from `PATH` first; never hardcode absolute paths
- With multiple targets, keep input order
- Run one command for multiple files

### 4. Output

- Report the result as a path list with the commands used (in zed)
- On failure, state the cause and next steps

- Use /follow-create-plugins (zed) if needed
- Use /open-in devin if needed
- Use /open-in explorer if needed
- Use /open-file-in-gitui if needed — view the file's git status/diff in the gitui TUI instead of the editor

## Expected Outcome

- The file or directory opens in Zed, or the reason it failed is reported
- Output is a list of opened paths with the Zed CLI command used

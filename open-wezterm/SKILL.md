---
name: open-wezterm
description: Open a directory in a WezTerm terminal with wezterm start --cwd
argument-hint: "[path]"
related:
  - open-in-devin
  - open-file-in-gitui
---

## Goal

Open a directory in a WezTerm terminal with `wezterm start --cwd`

## Scope

Use when opening a directory or file in a WezTerm terminal on Windows, macOS, or Linux

## Execute

### 1. Prepare Context

> Goal: Identify the target path and check the WezTerm CLI

1. Identify target paths from user input, the open file, or the current working directory
2. Check for the `wezterm` CLI in PATH with `where wezterm` or `which wezterm` (verified `wezterm 20240203-110809-5046fc22`, 2026-09-12)
3. If `wezterm` is not found, inform the user with install guidance, then stop
4. If the target path does not exist, inform the user and stop

### 2. Open In WezTerm

> Goal: Open the target in WezTerm safely

1. For a directory: run `wezterm start --cwd "<path>"`
2. For a file: open its parent directory with `wezterm start --cwd "<parent>"`
3. For multiple paths, run the command once per path or call `wezterm start` repeatedly
4. Extra options: `--new-tab` opens a tab in an existing window, `--always-new-process` forces a new GUI process spawn, `-- <prog>` runs a specific program instead of the shell (e.g. `wezterm start --cwd "<path>" -- pwsh`)

### 3. Verify And Report

> Goal: Confirm WezTerm opened

1. Check that the `wezterm` process was spawned
2. On failure, show stderr and recommend checking the WezTerm CLI or path
3. Report the opened paths with the commands used

## Rules

### 1. Safety

- Do not create new files or directories when the target is missing
- Do not run the command when the `wezterm` CLI is not found in PATH
- If the user gives no path, ask first

### 2. Path Handling

- Use absolute paths when the working directory is uncertain
- Always quote paths to handle spaces
- For files, open the parent directory

### 3. Output

- Report the result as a path list with the `wezterm` commands used (in wezterm)
- On failure, state the cause and next steps

- Use /open-in-devin if needed
- Use /open-in-explorer if needed
- Use /open-file-in-gitui if needed — open `gitui -f <file>` in a new WezTerm window

## Expected Outcome

- The directory (or a file's parent directory) opens in a new WezTerm window/tab
- Output is the list of opened paths with the commands used

---
name: open-in-devin
description: Open a directory or file in a new Devin session
argument-hint: "[path]"
related:
  - create-report-in-dot-devin
---

## Goal

Start a Devin session with the target path as the starting point

## Scope

Use when opening a directory or file in the Devin CLI from the terminal or current context

## Execute

### 1. Prepare Context

> Goal: Identify the target path and check the Devin CLI

1. Identify the target path from user input, the open file, or the current working directory
2. Check for the `devin` CLI in PATH with `where devin` or `Get-Command devin` (verified `devin 3000.6.14`, 2026-09-12)
3. If `devin` is not found, inform the user with install guidance, then stop
4. If the target path does not exist, inform the user and stop

### 2. Open In Devin

> Goal: Open a Devin session with the target context

1. For a directory: run `Set-Location "<path>"; devin` (PowerShell) or `cd "<path>" && devin` to start an interactive session
2. `devin "<path>"` (positional `[PATH]...`) opens Devin Desktop on that path — use when a GUI is wanted
3. For a file: open the parent directory and pass the file as the initial prompt with `Set-Location "<parent>"; devin -- "edit <file>"` or `cd "<parent>" && devin -- "edit <file>"`
4. For non-interactive use, run `devin -p "<prompt>"` (`--print`) or `devin --prompt-file "<file>"`; resume the previous session with `devin -c` (`--continue`) or `devin -r [session-id]` (`--resume`)
5. Avoid passing secrets or sensitive paths as prompts

### 3. Verify And Report

> Goal: Confirm Devin started the session

1. Check that the `devin` process was spawned and did not exit immediately
2. On failure, show stderr and recommend running `devin doctor` or checking workspace trust (non-interactive mode fails in untrusted directories — use `--respect-workspace-trust false` if required)
3. Report the path and command used

## Rules

### 1. Safety

- Do not create new files or directories when the target is missing
- Do not run the command when the `devin` CLI is not found in PATH
- If the user gives no path, ask first

### 2. Path Handling

- Use absolute paths when the working directory is uncertain
- Always quote paths to handle spaces
- For files, open the parent directory and pass the file in as context

### 3. Output

- Report the result as a path list with the `devin` commands used (in devin)
- On failure, state the cause and next steps

- Use /create-report-in-dot-devin if needed
- Use /list-request-devin-session if needed
- Use /open-in-explorer if needed

## Expected Outcome

- A Devin session starts with the target path as workspace or context
- Output is the list of opened paths with the commands used

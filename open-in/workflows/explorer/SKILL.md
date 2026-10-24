---
name: open-in-explorer
description: Open a file or directory in Windows Explorer with explorer <path>
argument-hint: "[path]"
---

## Goal

Open a file or directory in Windows Explorer with `explorer <path>`

## Scope

Use on Windows to open a target path in File Explorer; supports both files and folders

## Execute

### 1. Prepare Context

> Goal: Identify the target path and check the environment

1.  Identify target paths from user input, the open file, or the current working directory
2.  Confirm the OS is Windows
3.  If the target path does not exist, inform the user and stop
4.  `explorer` is not supported on macOS/Linux

### 2. Open In Explorer

> Goal: Open the target in Windows Explorer safely

1. Use the command `explorer "<path>"`
2. For a directory, File Explorer opens at that directory
3. For a file: `explorer "<file>"` opens it via the file association; to select the file in Explorer instead, use `explorer /select,"<file>"`
4. For multiple paths, run the command once per path for clarity

### 3. Verify And Report

> Goal: Confirm the open succeeded

1. Check the exit code of the spawned process
2. On failure, show stderr and recommend verifying the path
3. Report the opened paths with the commands used

## Rules

### 1. Safety

- Do not auto-create files or directories when the target is missing
- Do not run the command on non-Windows systems
- If the user gives no path, ask first

### 2. Path Handling

- Use absolute paths when the working directory is uncertain
- Always quote paths to handle spaces
- For paths outside local drives, give the full UNC/absolute path

### 3. Output

- Report the result as a path list with the `explorer` commands used (in explorer)
- On failure, state the cause and next steps

- Use /open-in devin if needed
- Use /open-in wezterm if needed

## Expected Outcome

- The file or directory is opened or selected in Windows Explorer
- Output is a list of opened paths with the commands used

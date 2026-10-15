---
name: list-program-in-computer
description: List programs installed on the machine from all package managers
argument-hint: "[filter]"
related:
  - download-program
  - use-pwsh-shell
  - report
  - uninstall-program-in-computer
  - enhance-prompt
  - ask-me
  - run-program
---

## Goal

List programs installed on the machine, combining data from the various package managers

## Scope

- Used mainly on Windows
- Query from `mise`, `scoop`, `winget`
- Supports filtering by program name
- Show results with `/report`
- Never modifies/deletes a program

## Execute

### 1. Identify Filter

> Goal: identify the program to filter

1. Take `filter` from the argument (unspecified → list everything)
2. `filter` is ambiguous → use `/enhance-prompt` or `/ask-me`

### 2. Detect Package Managers

> Goal: find the available package managers

1. Use `/download-program` or check directly whether `mise`, `scoop`, `winget` exist
2. Record the available package managers

### 3. Query Mise

> Goal: get the program list from mise

1. Run `mise list` or `mise ls`
2. `filter` present → use `mise list | Select-String -Pattern <filter>`
3. Record the result

### 4. Query Scoop

> Goal: get the program list from scoop

1. Run `scoop list` or `scoop list <filter>`
2. No `filter` → keep the full list
3. Record the result

### 5. Query Winget

> Goal: get the program list from winget

1. Run `winget list` or `winget list <filter>`
2. Keep only programs the user installed (not system components unless needed)
3. Record the result

### 6. Query PowerShell Get-Command

> Goal: find programs on PATH that may not be in a package manager

1. Run `Get-Command <filter>` (when a filter exists)
2. Or `Get-Command -All` then pick common tools
3. Record path and version (when `--version` works)

### 7. Merge And Deduplicate

> Goal: combine results from all sources into one list

1. Merge the lists from `mise`, `scoop`, `winget`, `Get-Command`
2. Deduplicate by the primary program name
3. Duplicate name → record every package manager that installed it

### 8. Format Output

> Goal: show a readable result

1. Use `/report` to build a table
2. Columns: `Name`, `Version`, `Package Manager`, `Source/Path`
3. Sort by name

## Rules

### 1. No Modify

- Never install, update, or remove a program
- List only

### 2. Respect Filter

- The user gives a filter → show only what matches
- Unspecified → show everything, but keep the list from getting too long

### 3. Combine Sources

- Show the package manager for each program
- Installed via multiple package managers → list them all

### 4. Performance

- Run commands in parallel when possible
- A command slower than 30 seconds → skip or timeout

### 5. Output

- Use `/report` or a markdown table
- No program found → report that nothing was found

- Use /use-pwsh-shell if needed
- Use /download-program if needed
- Use /uninstall-program-in-computer if needed
- Use /run-program if needed

## Expected Outcome

- A complete list of installed programs
- Version, package manager, and path stated
- No duplicate entries in the result
- No modification to the system

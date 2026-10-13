---
name: uninstall-program-in-computer
description: Remove a program from the machine by picking the appropriate package manager
argument-hint: "[program-name]"
related:
  - download-program
  - list-program-in-computer
  - use-pwsh-shell
  - enhance-prompt
  - resolve-errors
  - report
  - run-install
  - run-program
---

## Goal

Remove a program from the machine by picking the appropriate package manager

## Scope

- Primarily for Windows
- Find which package manager installed the program
- Uninstall with that package manager's correct command
- If it is not in any package manager, report and stop
- If the program is system-critical, notify the user before removing it

## Execute

### 1. Identify Program

> Goal: Identify the program to remove

1. Take `program-name` from the argument
2. If the name is ambiguous → use `/list-program-in-computer <program-name>` or `/enhance-prompt`
3. Find the exact match among installed programs

### 2. Find Package Manager Source

> Goal: Determine which package manager installed the program

1. Follow `download-program/workflows/package-manager` with `<program-name> uninstall`
2. Or call `/list-program-in-computer <program-name>` to see the package manager
3. Check `mise list`, `scoop list`, `winget list` with a filter
4. Record the package manager found

### 3. Uninstall Via Mise

> Goal: Remove a program installed by mise

1. If `mise list` has the program → run `mise uninstall <program>`
2. If `mise` does not → move to the next package manager
3. Check `Get-Command <program>` after uninstall

### 4. Uninstall Via Scoop

> Goal: Remove a program installed by scoop

1. If `scoop list <program>` has it → run `scoop uninstall <program>`
2. If it is a global app (`scoop install -g`) → use `scoop uninstall -g <program>`
3. Check `Get-Command <program>` after uninstall

### 5. Uninstall Via Winget

> Goal: Remove a program installed by winget

1. Find the package id from `winget list <program>`
2. Run `winget uninstall --id <package-id> --accept-source-agreements`
3. If the package requires UAC, notify the user
4. Check `winget list --id <package-id>` to confirm removal

### 6. Verify Uninstall

> Goal: Confirm the removal succeeded

1. Run `Get-Command <program>` — must not find it
2. Run `scoop list <program>`, `winget list --id <id>`, `mise list <program>` — must not find it
3. If still found → run `/resolve-errors` or notify the user

### 7. Report

> Goal: Summarize results

1. Use `/report` to show the program removed, package manager, status
2. If removal failed → state the cause and next steps

## Rules

### 1. Find Source First

- Never uninstall without knowing the package manager
- If it is not in any package manager, stop and suggest removing via Windows Settings or use `/open-web` to find an uninstaller

### 2. Confirm Destructive Action

- Before uninstalling, state the program that will be removed
- If it is a critical tool (shell, editor, dev tools), ask the user to confirm
- Never remove `mise`, `scoop`, `winget` themselves without an explicit command

### 3. Use Correct Command

- `mise`: `mise uninstall <program>`
- `scoop`: `scoop uninstall <program>` or `scoop uninstall -g <program>`
- `winget`: `winget uninstall --id <package-id>`
- `brew`: `brew uninstall <program>`
- `apt`: `sudo apt remove <program>`

### 4. Idempotent

- If the program is already gone, report it as removed/not found
- Do not delete repeatedly

### 5. Error Handling

- If uninstall fails, capture the error message
- Suggest a fix or fallback

- Use /use-pwsh-shell if needed
- Use /download-program if needed
- Use /run-install if needed
- Use /run-program if needed

## Expected Outcome

- The program is removed from the system
- Confirmed the program is not found after uninstall
- Report the package manager used and the status
- Programs not installed via a package manager are never removed without confirmation

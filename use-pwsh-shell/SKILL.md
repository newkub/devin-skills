---
name: use-pwsh-shell
description: Use PowerShell for shell commands, scripting, and automation
argument-hint: "[command]"
related:
  - use-bun-shell
  - use-nu-shell
  - follow-best-practice
  - use-scripts

---

## Goal

Use PowerShell or PowerShell Core (`pwsh`) effectively for shell commands, scripting, and automation

## Scope

Use for Windows system administration, file operations, automation, and cross-platform scripting with `pwsh`

## Execute

### 1. Check Pwsh Installation

> Goal: Check and install pwsh

1. Run `pwsh --version` to verify PowerShell Core
2. If missing, install:
   - Windows: `winget install --id Microsoft.PowerShell`
   - macOS: `brew install --cask powershell`
   - Linux: install per distro following the official docs
3. If `pwsh` cannot be installed, fall back to `powershell` or `cmd` depending on context

### 2. Run Commands With Pwsh

> Goal: Run commands with pwsh

1. Single command: `pwsh -Command '<command>'`
2. Script: `pwsh -File script.ps1`
3. Use `Get-Command <cmd>` to check command availability
4. Use `Get-Help <cmd>` to view help
5. Check the exit code with `$LASTEXITCODE`

### 3. Use Pwsh For File Operations

> Goal: Manage files and folders

1. Create a directory: `New-Item -ItemType Directory -Path <path>`
2. Copy a file: `Copy-Item -Path <src> -Destination <dst>`
3. Move a file: `Move-Item -Path <src> -Destination <dst>`
4. Delete a file: `Remove-Item -Path <path> -Recurse -Force` (careful, destructive)
5. Read a file: `Get-Content -Path <file>`
6. Write a file: `Set-Content -Path <file> -Value <content>`
7. List contents: `Get-ChildItem -Path <path>`

### 4. Write Pwsh Scripts

> Goal: Write scripts for automation

1. Use a `param` block for parameters
2. Use `try/catch/finally` for error handling
3. Use `Write-Output`, `Write-Verbose`, `Write-Error` as appropriate
4. Use `Select-String` for text search instead of grep on Windows
5. Use `Where-Object`, `ForEach-Object`, `Sort-Object` for pipelines
6. Use `ConvertFrom-Json`, `ConvertTo-Json` for JSON
7. Keep the script in `.devin/scripts/` if reusable, or `$env:TEMP` if temporary, per `/use-scripts`

### 5. Integrate With Use Scripts

> Goal: Integrate with `/use-scripts`

1. Use pwsh for Windows-specific work or .NET integration
2. Set a `dryRun` option in every script
3. State the reason if choosing pwsh over another shell
4. Refer to `/use-scripts` for shell-selection decisions

## Rules

### 1. When To Use Pwsh

- Windows system administration, registry, WMI, COM
- .NET API calls
- Complex error handling with try-catch
- Environments where pwsh is already installed
- Commands that require PowerShell syntax

### 2. Cross-Platform Considerations

- `pwsh` supports Windows, macOS, and Linux
- `powershell` on Windows is Windows PowerShell (legacy)
- Check `$PSVersionTable.PSVersion` when needed
- Use `Join-Path` instead of hardcoded path separators

### 3. Safety

- Verify paths before `Remove-Item -Recurse -Force`
- Use `-WhatIf` for a dry run when executing risky commands
- Do not create temporary `.ps1` files just to run a command; if unavoidable, delete them after running
- Do not expose credentials in scripts
- Use `Set-ExecutionPolicy` with caution

### 4. Script Location

- Use `.devin/scripts/` for permanent scripts
- Use `$env:TEMP` for throwaway scripts (OS temp directory, never created inside the project)
- Use `.ps1` for PowerShell scripts

- Use /use-bun-shell if needed
- Use /use-nu-shell if needed
- Use /follow-best-practice if needed

## Expected Outcome

- `pwsh` is installed and working
- Commands run correctly with pwsh
- Scripts are in the right location
- No accidental destructive operations
- Error handling is comprehensive

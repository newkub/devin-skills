---
name: list-projects-git-in-drive-d
description: Show a template shell script listing git projects on drive D
argument-hint: "[filter]"
related:
  - create-new-project-in-drive-d
  - list-uncommit-unpush-in-drive-d
---

## Goal

Create a shell script template for listing git projects on drive D that have a `.git` directory

## Scope

Use `/list-projects-git-in-drive-d` for the tasks and workflows it actually covers (git projects on drive D)

## Execute

### 1. Create Shell Script Template

> Goal: Create Shell Script Template

1. Create a shell script to list git projects
2. Use the `find` command or a PowerShell equivalent
3. Filter to only directories that have `.git`
4. Show the result as a list with the path

### 2. Script Options

> Goal: Script Options

1. Support PowerShell (Windows)
2. Support Bash (WSL/Linux)
3. Support extra options (depth, pattern)
4. Show output in a readable form

### 3. Save Template

> Goal: Save Template

1. Save the script template in the workspace
2. Tell the user the script was created
3. Show how to use it

## Rules

### 1. Git Detection

Check whether a directory is a git repository:

- Check for the `.git` directory
- Use the `find` command with the `-name ".git"` option
- Use PowerShell `Test-Path` for `.git`

### 2. Path Filtering

Filter to only projects on drive D:

- Search only within `D:\`
- Exclude hidden directories
- Exclude system directories

### 3. Output Format

Show output in a readable form:

- Show the full path
- Show the project name (directory name)
- Support a table format or list format

- Use `/create-new-project-in-drive-d` if needed
- Use `/list-uncommit-unpush-in-drive-d` if needed

## Expected Outcome

- The shell script template is created
- The script can list git projects on drive D that have `.git`
- The user can copy and run the script immediately
- Output is shown in a readable form

## Script Template

### PowerShell Version

```powershell
# List all git projects in drive D
Get-ChildItem -Path "D:\" -Directory -Recurse -Depth 3 |
    Where-Object { Test-Path (Join-Path $_.FullName ".git") } |
    Select-Object FullName |
    Format-Table -AutoSize
```

### Bash Version (WSL/Linux)

```bash
# List all git projects in drive D
find /mnt/d -maxdepth 3 -type d -name ".git" -printf "%h\n" 2>/dev/null
```

### Advanced PowerShell Version

```powershell
# List git projects with details
Get-ChildItem -Path "D:\" -Directory -Recurse -Depth 3 |
    Where-Object { Test-Path (Join-Path $_.FullName ".git") } |
    Select-Object `
        @{Name="Project"; Expression={$_.Name}},
        @{Name="Path"; Expression={$_.FullName}} |
    Format-Table -AutoSize
```

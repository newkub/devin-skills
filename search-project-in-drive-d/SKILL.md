---
name: search-project-in-drive-d
description: Find projects on drive D matching a keyword or pattern
argument-hint: "[keyword]"
related:
  - ask-me
  - report
---

## Goal

Find git projects in `D:\` matching the keyword or pattern the user specifies, and present the results as a table

## Scope

Use when the user wants to search for projects on drive D without listing all of them

## Execute

### 1. Take Search Criteria

> Goal: Find Criteria
1. If the user did not give a keyword → ask via `/ask-me`
2. Support wildcards `*` and `?`
3. The search scope is `D:\` only

### 2. Search Git Projects

> Goal: Search Git Projects
Run the PowerShell command:

```powershell
Get-ChildItem -Path "D:\" -Directory -Recurse -Depth 3 |
  Where-Object { $_.Name -like "<keyword>" -and (Test-Path (Join-Path $_.FullName ".git")) }
```

- If the keyword should match the whole path, use `$_.FullName -like "*<keyword>*"`
- Matching is case-insensitive by default
- If the pattern is invalid → notify the user and ask for a new keyword

### 3. Display Results

> Goal: Display results
1. Use `/report` to build the table
2. columns: `No.`, `Project Name`, `Path`, `Match Type`
3. Order `No.` as 1, 2, 3, ...
4. Wrap paths in backticks
5. Summarize the match count and the keyword used

## Rules

- Read-only; no writing, no deleting, no changing project state
- Search only `D:\` or `/mnt/d` for WSL
- If nothing is found → report that no project matches the criteria

## Expected Outcome

- A table of git projects in `D:\` matching the keyword
- No projects missing or extra beyond the criteria
- Summary of the match count and the keyword used

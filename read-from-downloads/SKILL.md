---
name: read-from-downloads
description: Read and list files from the home downloads folder
argument-hint: "[pattern-or-filename]"
allowed-tools:
  - read
  - find_file_by_name
  - exec
  - ask_user_question
  - report

  - suggest-next-action
triggers:
  - user
  - model
related:
  - check-screenshots-dir
  - use-agents-capture
  - deep-review
---

## Goal

Read and list files from the home downloads folder for use in other workflows

## Scope

Use with files located in `~/Downloads` such as screenshots, images, documents, archives — by listing, filtering and reading the chosen files

See also: /check-screenshots-dir, /use-agents-capture, /deep-review, /open-in-explorer

## Execute

### 1. Resolve Downloads Path

> Goal: Resolve Downloads Path
1. Windows: `C:\Users\<username>\Downloads`
2. macOS: `~/Downloads`
3. Linux: `~/Downloads`
4. If the user gives another path → use that one

### 2. List Files

> Goal: List Files
1. Use `/find_file_by_name` with pattern `*` on the downloads path
2. If the user gives a pattern → use that pattern
3. Sort by file name or last modified
4. If no files found → stop and report

### 3. Filter And Select

> Goal: Filter And Select
1. If there are many files → ask the user which files they want
2. If the user names files clearly → pick those files
3. Support glob patterns like `*.png`, `screenshot*`

### 4. Read File

> Goal: Read File
1. If it's an image (png, jpg, jpeg, gif, webp, bmp, svg) → use `/read`
2. If it's text (txt, md, json, csv, yml, yaml) → use `/read`
3. If it's a binary that can't be read → report its size and type

### 5. Report

> Goal: Produce the Report
1. Run `/report` showing the files found: No, Name, Size, Type, Modified
2. Run `/report` for the chosen files
3. Run `/suggest-next-action`

## Rules

- Never auto-read files that may contain secrets or credentials
- If a file looks sensitive → ask the user first
- Do not move or delete files in Downloads without permission
- Use `/find_file_by_name` for listing files
- Supports Windows, macOS and Linux

## Expected Outcome

- A listing of the files in the downloads folder
- The chosen files read or reported
- Information ready for use in other workflows

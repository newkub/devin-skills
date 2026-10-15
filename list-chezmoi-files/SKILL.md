---
name: list-chezmoi-files
description: List files managed by chezmoi (chezmoi managed)
argument-hint: "[scope]"
related:
  - download-program
  - report
  - suggest-next-action
  - update-chezmoi
---

## Goal

List the files and directories chezmoi manages, showing both destination and source paths with status

## Scope

Use when you need to know which files were `chezmoi add`-ed, or to inspect dotfiles synced by chezmoi

## Execute

### 1. Verify Chezmoi

> Goal: check chezmoi

1. Run `chezmoi --version`
2. If missing → do `/download-program` to install
3. Run `chezmoi source-path` to find the source directory
4. Run `chezmoi dest-dir` or `chezmoi data` to find the destination directory

### 2. List Managed Files

> Goal: list the files chezmoi manages

1. Run `chezmoi managed` to see every managed file/directory
2. For files only → use `chezmoi managed --include=files`
3. For everything → use `chezmoi managed --include=all`
4. Save the result as a list

### 3. Map Source And Destination

> Goal: find the source path for each destination

1. For each managed file run `chezmoi source-path <dest-path>`
2. Or run `chezmoi target-path <source-path>` for the reverse direction
3. Record the pairs: `destination-path` and `source-path`
4. When `apply` status differs → record `out-of-sync`

### 4. Check Status

> Goal: check the status of managed files

1. Run `chezmoi status` to see changed files
2. Identify files that are `Modified`, `Added`, `Deleted`
3. Run `chezmoi diff` for files needing detail
4. Record each file's status

### 5. Report

> Goal: present the file list

1. Use `/report` with columns:
   - No
   - Managed File (destination path)
   - Source Path
   - Type (`file`, `dir`, `symlink`)
   - Status (`sync`, `modified`, `unstaged`)
   - LastUpdate (when available from `chezmoi state`)
2. Sort by destination path
3. Do `/suggest-next-action`

## Rules

### 1. Read Only

- Do not modify source or destination
- Do not run `chezmoi apply` or `chezmoi readd` without instruction
- Use only `chezmoi managed`, `chezmoi source-path`, `chezmoi status`

### 2. Path Accuracy

- Show both destination and source paths
- Use absolute paths
- State the entry type

### 3. Status

- Use `chezmoi status` to identify differences
- Do not guess status when data is missing
- If a file is out of sync → recommend `/update-chezmoi`

## Expected Outcome

- The full list of files chezmoi manages
- Destination/source path pairs
- The status of each file
- A table with next actions

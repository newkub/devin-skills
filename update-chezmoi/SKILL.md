---
name: update-chezmoi
description: Update dotfiles with chezmoi, including chezmoi readd
argument-hint: "[scope]"
related:
  - download-program
  - git-commit
  - report
  - suggest-next-action

---

## Goal

Update the dotfiles managed by chezmoi, in particular running `chezmoi readd` when local files change, and keep the source state in sync

## Scope

Use when you want to update chezmoi-managed dotfiles from local changes or pull the latest changes

## Execute

### 1. Verify Chezmoi Installation

> Goal: Check chezmoi

1. Run `chezmoi --version`
2. If missing → run `/download-program` to install it
3. Run `chezmoi doctor` to check the health status
4. Identify the source directory and the destination directory

### 2. Review Local Changes

> Goal: Understand what changed in the local files

1. Run `chezmoi status` to see the changes
2. Run `chezmoi diff` to see the details
3. Identify the files that need readd or apply
4. If there are unwanted changes → skip or revert them

### 3. Readd Changed Files

> Goal: Bring local changes back into the source state

1. Run `chezmoi readd` for every file with local changes
2. Or run `chezmoi readd <file>` for a specific file
3. Check `chezmoi diff` after the readd
4. If there are new files to add → use `chezmoi add <file>`

### 4. Apply Updates

> Goal: Sync the dotfiles

1. Run `chezmoi apply` to apply the source state to the destination
2. To pull the latest from the remote → run `chezmoi update`
3. Check `chezmoi status` once more
4. If there is a conflict → resolve it per the chezmoi docs

### 5. Commit And Report

> Goal: Summarize the results

1. Run `chezmoi git status`, or `chezmoi cd` then `git status`
2. Run `/git-commit` if the source dir is a repo
3. Use `/report` showing: File, Action, Status
4. Run `/suggest-next-action`

## Rules

### 1. Readd Before Apply

- When there are local changes worth keeping → run `chezmoi readd` first
- Never apply over local changes without a backup
- If unsure → let the user confirm

### 2. No Data Loss

- Back up important files before readd/apply
- Check `chezmoi diff` before applying
- Never delete dotfiles without approval

### 3. Deterministic

- Run the commands in order: status → diff → readd → apply → status
- Verify both before and after every step
- Do not skip diff

## Expected Outcome

- Local dotfile changes are readded into the source state
- The source state is synced with the destination
- No data loss
- A report of the files readded/applied with their status

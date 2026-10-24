---
name: restore-files-from-my-dotfiles
description: Restore dotfiles from the git log of the chezmoi repo then chezmoi apply
argument-hint: "[scope]"
related:
  - follow-tool-git
  - git-file-history
  - deep-debug
  - ask-me
  - report
  - git-commit
---

## Goal

Restore dotfiles on the machine from the git log of the chezmoi source repo then apply them back to the target path

## Scope

Used when dotfiles on the machine are lost or damaged and need to be restored from the history of a dotfiles repo managed with chezmoi

See also: /restore-files-from-git-log, /follow-tool-git, /git-file-history find, /deep-debug, /git-commit

## Execute

### 1. Locate Dotfiles Repo

> Goal: Find the local chezmoi source repo

1. Run `chezmoi source-path` to find the source directory
2. If chezmoi is not available → try the common paths:
   - Windows: `$env:USERPROFILE\.local\share\chezmoi`
   - macOS/Linux: `~/.local/share/chezmoi`
3. Check that it is a git repo with `git rev-parse --is-inside-work-tree`
4. If it is not a git repo → stop and report

### 2. Identify Target Dotfile

> Goal: Identify the dotfile to restore

1. Take the target from the argument (file name or chezmoi target path)
2. If not provided → run `/ask-me` to have the user specify it
3. Convert the target to a chezmoi source path with `chezmoi source-path <target>`
4. If the source path is not found → report that the target is not managed by chezmoi

### 3. Check Git Log

> Goal: See the change history of the target

1. Run `git log --oneline -- <source-path>` in the dotfiles repo
2. If there is no history → report that the file was never in git
3. Run `git log --diff-filter=D --oneline -- <source-path>` if the commit that deleted the file needs to be found
4. Show the 10 latest commits with date and message

### 4. Choose Commit

> Goal: Choose the commit to restore

1. If the user specifies a commit hash → use that hash
2. If the user specifies a keyword/date → search for a matching commit
3. If not specified → use the latest commit that still has the file
4. Confirm with the user before restoring with `/ask-me` or `/suggest-next-action`

### 5. Backup Current State

> Goal: Back up the current file before overwriting

1. Find the target path on the machine with `chezmoi target-path <source-path>`
2. Back up with `Copy-Item <target> <target>.<timestamp>.bak` or `cp <target> <target>.<timestamp>.bak`
3. Record the backup path

### 6. Restore Source

> Goal: Recover the source file from the commit

1. Run `git restore --source=<commit> <source-path>` in the dotfiles repo
2. Check `git diff` that the source changed as desired
3. If restoring multiple files → repeat per file

### 7. Apply Dotfile

> Goal: Apply back to the machine

1. Run `chezmoi apply --dry-run <target>` to see the result
2. If the user confirms → run `chezmoi apply <target>`
3. If chezmoi is not available → copy the source file to the target path with `Copy-Item`/`cp`
4. Check that the target path has the restored content

### 8. Build Report

> Goal: Summarize the results

1. Use `/report` columns:
   - No.
   - Target
   - Source Path
   - Commit
   - Backup Path
   - Status
2. Specify a summary of the number of files restored

## Rules

### 1. Safety

- Ask the user before every overwrite
- Back up the current file before applying
- Do not use `git reset --hard`
- Always use `git restore --source=<commit>`

### 2. Scope

- Use only with dotfiles managed by chezmoi
- If the dotfiles repo is not chezmoi → use `git restore` then copy manually

### 3. Cross Platform

- Windows: use `chezmoi` or `Copy-Item`
- macOS/Linux: use `chezmoi` or `cp`

### 4. Verify

- Check the target file after applying
- Run `chezmoi diff <target>` if the apply is incomplete

## Expected Outcome

- The dotfile is restored from the git log of the dotfiles repo
- The target path on the machine has the content of the chosen commit
- There is a backup of the original file
- A complete report of the restore result

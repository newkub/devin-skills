---
name: restore-files-from-git-log
description: Restore files from git log, starting from the latest commit and walking backward until found
argument-hint: "[scope]"
related:
  - deep-debug
  - git-file-history
  - follow-tool-git
  - ask-me
  - git-commit
---

## Goal

Restore a deleted or modified file by looking at the latest commit first; if not found, walk back through `git log` until the desired file is found

## Scope

Used to restore a file from a commit in the git history, starting from the latest commit and walking back one commit at a time
Not used to restore from stash or reflog — use `/follow-tool-git` instead

See also: /restore-files-from-my-dotfiles

## Execute

### 1. Identify Target Files

> Goal: Identify the file to restore from context or by asking the user

1. Identify the file to restore from context
2. If the context is unclear → ask the user with `/ask-me`
3. If the user does not answer → stop

### 2. Check Latest Commit

> Goal: See whether the latest commit contains the desired file

1. Run `git log -1 --name-status` to see the files changed in the latest commit
2. Run `git show HEAD:<file-path>` to check whether the file exists in the latest commit
3. If the file is found → go to Step 4 Restore Files
4. If not found → go to Step 3 Walk Back Through Log

### 3. Walk Back Through Log

> Goal: Walk back through git log one commit at a time until the desired file is found

1. Run `git log --oneline --all -- <file-path>` to see the commits that changed the target file
2. If no commit is found → the file may never have been in git → stop and report
3. Identify the latest commit hash that has the target file
4. Run `git show <commit-hash>:<file-path>` to confirm that the file exists in that commit

### 4. Restore Files

> Goal: Recover the file from the commit that was found

1. Run `git restore --source=<commit-hash> <file-path>` to restore the file from the commit that was found
2. If restoring multiple files → run `git restore --source=<commit-hash> <file-1> <file-2> ...`
3. Verify with `git status` that the files have been restored

### 5. Verify Restoration

> Goal: Check the correctness of the restored files

1. Run `git diff <file-path>` to see what changed after the restore
2. Check the file content for correctness
3. Run `git status` to confirm the state of the working directory

## Rules

### Restore Strategy

> Goal: Restore files safely without destroying the working directory

- Always use `git restore --source=<commit-hash>`, do not use `git checkout <commit-hash> -- <file>` because restore is easier to undo
- If the file has changes in the working directory → ask the user before restoring to confirm
- Do not use `git reset --hard` because it is a destructive action

### Walk Back Strategy

> Goal: Walk back through git log efficiently

- Use `git log -- <file-path>` to filter only the commits that changed the target file, no need to walk every commit
- If the file was deleted → use `git log --diff-filter=D -- <file-path>` to find the commit that deleted the file
- Always specify a clear commit hash before restoring

- Use /deep-debug if necessary
- Use /git-file-history find if necessary

## Expected Outcome

1. The desired file is restored back to the working directory
2. The file comes from the nearest commit that has that file
3. The working directory has changes that can be verified with `git status`
4. The user can commit the restored file with `/git-commit`

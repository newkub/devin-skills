# Git Debug

## Goal

Systematically find the root cause of git-related problems using git debugging tools (bisect, blame, reflog, log, diff)

## Scope

Use for debugging git-related issues, e.g. finding the commit that introduced a bug, who changed which line, recovering lost commits, and diagnosing conflicts
Not for debugging runtime/code logic — use `/deep-debug` instead

## Execute

### 1. Identify Git Problem

> Goal: pinpoint the git problem to debug

1. Identify the symptom: a bug introduced after some commit, a missing file, a lost commit, an unexpected conflict
2. Classify the problem:
   - bug introduced: find the commit that caused the bug → go to Step 2
   - unexpected change: find who/when changed the code → go to Step 3
   - lost commit: recover the missing commit → go to Step 4
   - lost file: recover the missing file → go to Step 5
   - unknown cause: cause unknown → go to Step 6

### 2. Find Bug Commit With Bisect

> Goal: use git bisect to find the commit that caused the bug via binary search

#### 2.1 Prepare

> Goal: check the repo and its state

1. If it is a remote repo → clone into a temp directory
2. Run `git status` to check the working tree
3. If there are uncommitted changes → ask the user whether to stash them
4. Back up the current branch before starting bisect

#### 2.2 Identify Range

> Goal: determine the good commit and the bad commit

1. Get the bad commit from the user (default `HEAD`)
2. Get the good commit from the user (default or a tag)
3. Run `git log --oneline <good>..<bad>` to view the commits in range
4. If unclear → run `/ask-me` before starting

#### 2.3 Start Bisect

> Goal: begin the bisect

1. Run `git bisect start`
2. Run `git bisect bad <bad>`
3. Run `git bisect good <good>`
4. Run `git bisect run <test-command>` if there is an automated test script
5. If not → do a manual bisect:
   - Run `git bisect next` or answer `git bisect good`/`bad` based on test results

#### 2.4 Find Bad Commit

> Goal: pinpoint the commit that caused the bug

1. With `git bisect run` → wait for results and record the commit hash
2. If manual → test each checkout until the bisect completes
3. Run `git show <bad-commit>` to view the changes
4. Record the commit hash, author, date, and message

#### 2.5 Reset Bisect

> Goal: return to the normal state

1. Run `git bisect reset`
2. Restore the original branch if in detached HEAD
3. Run `git status` to confirm

#### 2.6 Report And Analyze

> Goal: summarize and analyze the result

1. Run `/report` showing: Good Commit, Bad Commit, First Bad Commit, Author, Date
2. Show the diff of the first bad commit
3. Analyze which change caused the bug
4. Run `/suggest-next-action`, e.g. revert, fix, or test

### 3. Trace Change With Blame

> Goal: use git blame and log to review change history

1. Run `/follow-tool-git` to view the blame of the suspect file or lines
2. Run `git log -p --follow -S "<code-snippet>" -- <file-path>` to see commits that added/removed that code
3. Run `/check-git-logs` to trace the file in git log until the condition is found, or `/git-file-history` for a UI viewer
4. Analyze the reason for the change from the commit message and diff

### 4. Recover Lost Commit With Reflog

> Goal: use git reflog to recover lost commits

1. Run `/follow-tool-git` to view the reflog and find the lost commit
2. Identify the commit hash to recover from the reflog
3. Run `git cherry-pick <commit-hash>` to bring the commit back, or `git reset --hard <commit-hash>` if HEAD should be reset
4. Verify with `git log --oneline -5` that the commit is back

### 5. Restore Lost File

> Goal: recover the missing file from a commit in history

1. Run `/restore-files-from-git-log` to restore the file from the latest commit that contained it
2. If not found → run `git log --all --diff-filter=D -- <file-path>` to find the commit that deleted the file
3. Run `git show <commit-hash>^:<file-path>` to view the file's content before deletion
4. Run `git restore --source=<commit-hash>^ <file-path>` to restore the file

### 6. Investigate Unknown Cause

> Goal: explore an unexplained problem using several git tools

1. Run `git status` to check the working directory state
2. Run `git log --oneline -20` to see recent commits
3. Run `git diff HEAD~1` to view the latest commit's changes
4. Run `git stash list` to check for stashed changes that might be involved
5. If a stash exists → run `git stash show -p stash@{n}` to view its content
6. If the cause is still unclear → run `/deep-debug` for general debugging

### 7. Apply Fix

> Goal: fix the problem found

1. If the bug-causing commit is found → run `/follow-tool-git` to revert that commit
2. If the file was restored → run `/git-commit` to commit the restored file
3. If a commit was recovered → verify the code works before pushing
4. Run `/update-tests` to create a regression test for the problem found

## Rules

### Debug Strategy

> Goal: debug systematically, don't guess

- Start by clearly identifying the problem before using git tools
- Use bisect when the good and bad commits are clearly known
- Use blame when tracing the change history of a specific line
- Use reflog when a commit vanished from the current branch
- If the cause is unknown → use Step 6 Investigate Unknown Cause

### Safety

> Goal: debug without destroying the working directory

- Back up the working directory with `git stash` before debugging if there are uncommitted changes
- Don't use `git reset --hard` unless necessary — use `git restore` instead
- If `git reset --hard` is required → confirm with the user first via `/ask-me`
- After debugging → check `git status` that the working directory is clean

### Tool Selection

> Goal: pick the git tool that fits the problem

- bug introduced by commit → `git bisect`
- trace who changed what → `git blame` + `git log -S`
- lost commit → `git reflog`
- lost file → `git log --diff-filter=D` + `git restore`
- unknown cause → `git status` + `git log` + `git diff` + `git stash list`

- Use /search-in-git if needed

## Expected Outcome

1. The git problem's root cause found systematically
2. The bug-causing commit identified or reverted
3. Lost files or commits recovered
4. A regression test for the problem found
5. A clean working directory after debugging
---
name: refactor-commit
description: Refactor commits with rebase (break down, edit, squash, fixup, autosquash, force push, rollback)
argument-hint: "[scope]"
related:
  - update-references
  - resolve-merge-conflicts
  - ask-me
---

## Goal

Refactor commits that have already been committed in order to break down, edit, reorganize, squash, fixup, and rollback as appropriate

## Scope

Used for amending commits that have already been committed with `git rebase` (interactive or non-interactive) to:
- Break down large commits into smaller commits
- Edit commit messages per conventional commits
- Reorder commits in logical order
- Squash multiple commits into one
- Fix erroneous commits with fixup and autosquash
- Move commits between branches with cherry-pick
- Rebase commits onto upstream automatically (non-interactive)
- Force push and rollback after refactor

## Execute

### 1. Check Status

> Goal: Check Status

Check the status before refactoring

1. Run `git branch --show-current` to see the current branch
2. Run `git status` to check that there are no uncommitted changes
3. Run `git log --oneline -10` to see the latest commits
4. Run `git log --oneline origin/<branch>..HEAD` to see commits that have not been pushed

### 2. Check Shared Status

> Goal: Check Shared Status

Check that the branch has not been shared with the team

1. Run `git branch -r` to see remote branches
2. Run `git log --oneline origin/<branch>..HEAD` to see commits that have not been pushed
3. If there are commits that have already been pushed, warn the user about the risk of force push
4. Recommend using a private branch for the refactor

### 3. Backup Branch

> Goal: Backup Branch

Create a backup branch before refactoring

1. Run `git branch backup-<branch>-<timestamp>` to create a backup
2. Run `git branch -a` to confirm that the backup branch was created
3. Record the backup branch name for rollback if needed
4. Run `git reflog` to confirm that the reflog has data for recovery

### 4. Choose Rebase Mode

> Goal: Choose Rebase Mode

Choose the rebase mode according to the requirement

1. If commits need to be broken down or commit messages need to be edited, use Interactive Rebase (step 5)
2. If commits need to be rebased onto upstream automatically, use Non-Interactive Rebase (step 6)
3. If commits need to be squashed with fixup, use Autosquash (step 7)

### 5. Execute Rebase

> Goal: Execute rebase according to the chosen mode (interactive, non-interactive, or autosquash)

1. Interactive: run `git rebase -i HEAD~N` or `git rebase -i <commit-hash>` then edit the rebase todo list:
   - Change `pick` to `edit` for commits that need to be broken down
   - Change `pick` to `reword` for commits whose message needs editing
   - Change `pick` to `squash` for commits that need to be combined
   - Reorder commits if reordering is needed
2. Non-interactive: run `git rebase <upstream>` or `git rebase --onto <new-base> <upstream>`
3. Autosquash: create fixup commits with `git commit --fixup <commit-hash>` then run `git rebase -i --autosquash HEAD~N`
4. If conflicts occur → resolve them and run `git rebase --continue`
5. If a commit needs to be skipped → run `git rebase --skip`
6. If you need to abort → run `git rebase --abort` and restore from the backup branch
7. Save and close the editor

### 6. Break Down Commits

> Goal: Break Down Commits

Break down large commits into smaller commits

1. When the rebase stops at a commit marked `edit`, run `git reset HEAD~` to unstage everything
2. Run `git status` to see the unstaged files
3. Stage and commit separately into smaller commits as desired:
   - `git add <file>` and `git commit -m "message"` for each commit
4. Run `git rebase --continue` when the break down is done

#### 8.2 Validate Refactor

> Goal: Validate Refactor

Check that the refactor succeeded

1. Run `git log --oneline -10` to see the new commits
2. Run `git status` to confirm that there are no conflicts
3. Run `git diff backup-branch HEAD` to see the changes that occurred
4. Run tests if available to confirm that there is no regression

### 7. Handle Conflicts

> Goal: Handle Conflicts

Resolve conflicts if they occur

1. If there are conflicts, run `git status` to see the files with conflicts
2. Resolve conflicts in the problematic files
3. Run `git add <file>` for the resolved files
4. Run `git rebase --continue` to proceed
5. If you need to abort, run `git rebase --abort` and restore from the backup branch
6. Use `git reflog` to see the history and recover if needed

#### 9.2 Force Push

> Goal: Force Push

Push the refactored commits to the remote safely

1. Check that a force push is actually necessary (commits have been rewritten)
2. Check that nobody else has already pulled the old commits
3. Use `git push --force-with-lease` as it is safer than `--force`
4. Notify the team before doing a force push

### 8. Rollback

> Goal: Rollback

Return to the pre-refactor state if needed

1. Use `git reflog` to see the work history
2. Use `git reset --hard backup-<branch>-<timestamp>` to return to the backup
3. Or use `git reset --hard HEAD@{1}` to return to the state before the rebase
4. Delete the backup branch with `git branch -D backup-<branch>-<timestamp>` once it has been verified as correct

#### 10.2 Update References

> Goal: Update References

Update all related references

1. Follow `@[/update-references]`

### 9. Quick Amend Or Rename

> Goal: Quickly edit the message of the latest commit or a previous commit

1. If the latest commit has not been pushed yet → run `git commit --amend --message="<new-message>"`
2. If the message of a previous commit needs to be edited → find N from `git log --oneline` then `git rebase -i HEAD~N`
3. Change `pick` to `reword` for the target commit then save
4. If the rebase has a conflict → use `/resolve-merge-conflicts`
5. Verify with `git log --oneline -n 10`

### 10. Check And Rewrite Non-English Commit Messages

> Goal: Check and fix non-English commit messages

1. Run `git log --oneline` to see all commit messages
2. Identify commits that contain characters or words from another language (e.g. Thai)
3. If found → use `git rebase -i HEAD~N` then change `pick` to `reword` for those commits
4. Convert the messages to English with the same meaning, using imperative mood and conventional commits
5. If unsure about the translation → stop and use `/ask-me` before reword
6. Verify with `git log --oneline -n 10` that all messages are in English

## Rules

### 1. Safety

- Always create a backup branch before refactoring
- Do not refactor commits that have already been pushed to the remote unless necessary
- If a force push is needed after the refactor, notify team members first
- Always use `--force-with-lease` instead of `--force`
- Use `git rebase --abort` if a problem occurs and restore from the backup

### 2. Commit Quality

- Break down commits according to logical changes (not too large)
- Use clear commit messages that follow conventional commits and are in English
- Each commit should be self-contained and buildable
- Do not include unrelated changes in the same commit
- Use `fixup` and `autosquash` for handling complex commits
- Use `git commit --amend` only when the latest commit has not been pushed

### 3. Submodules

- If there are submodules, commits in the submodules must be refactored as well
- Use `git submodule foreach --recursive` for all operations
- Check that the submodules are in sync with the parent repository

### 4. Verification

- Check that the refactor actually succeeded
- Run tests if available to confirm that there is no regression
- Check that there are no conflicts or errors
- Confirm that the new commits are correct
- Use `git diff --stat` to see a summary of the changes
- Check that no files were deleted unintentionally

### 5. Language

- All commit messages must be in English
- If messages in another language are found in the git history, reword them into English
- Preserve the original meaning and context when translating
- If a commit has already been pushed, follow the Safety part of the Rules before rewording

## Expected Outcome

- Commits are refactored appropriately (break down, edit, reorganize, squash, fixup)
- All commit messages are in English
- The commit history is clean and follows best practices
- There are no conflicts or errors after the refactor
- All tests pass (if any)
- Force push succeeds with `--force-with-lease` (if necessary)
- A backup branch is ready for rollback if needed

---
name: git-amend
description: Safely amend the latest commit — check pushed first, staged changes, and message edit
argument-hint: "[--no-edit|message]"
related:
  - git-rebase
  - ask-me
---

## Goal

Fix the latest commit with `git commit --amend` — add changes or edit the message — without rewriting pushed history

## Scope

- amend staged changes into the latest commit, edit the commit message, `--no-edit`
- covers only the HEAD commit — to fix older commits → `/git-rebase` (autosquash)

## Execute

### 1. Safety Check

> Goal: Confirm the amend does not rewrite public history

1. `git status` — has the latest commit been pushed already (`git status` shows ahead/behind, or `git log origin/<branch>..HEAD`)
2. already pushed → never amend — create a new commit, or `/git-revert` if it must be undone
3. if others may have pulled this branch already → do not amend either

### 2. Stage And Amend

> Goal: the changed content/message is merged into the original commit

```bash
git add <files>
git commit --amend --no-edit      # add changes without editing the message
git commit --amend -m "new msg"   # edit the message
git commit --amend                # edit both (opens editor)
```

1. stage only the changes that belong to that commit — amend includes all staged content
2. amend changes the sha — commits that depend on the old sha (cherry-picks, notes) keep stale references

### 3. Verify

> Goal: the commit is correct and history stays clean

1. `git show HEAD` — content + message match the intent
2. `git log --oneline -3` — no duplicate/broken commits
3. if the branch is already pushed and amend is required (e.g. a local-only branch pushed as preview) → `git push --force-with-lease` only

## Rules

- amend only commits that have not been pushed — pushed = rewriting public history
- `--force-with-lease` only if pushing is required after amend — never `--force`
- do not amend to fix a change that should be a new commit — amend corrects the existing commit, it is not a way to avoid new history
- amending while a rebase/merge is in progress → resolve that state first
- Use /ask-me if needed

## Expected Outcome

- the HEAD commit has the correct changes/message with a new sha
- no shared history was rewritten

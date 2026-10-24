---
name: git-cherry-pick
description: Cherry-pick commits across branches correctly — single, range, merge-safe
argument-hint: "[sha|range]"
related:
  - git-revert
  - git-file-history
  - resolve-errors
---

## Goal

Bring commit(s) from one branch to another with `git cherry-pick` — without merging the whole branch

## Scope

- pick a single commit, multiple commits, or a range
- `-x` record source, `-n`/`--no-commit` batch, merge commit picks (`-m`)
- pairs with `/git-revert` — revert = inverse apply, cherry-pick = re-apply

## Execute

### 1. Identify Source

> Goal: clearly identify the commits to pick

1. `git log --oneline <source-branch>` or `/git-file-history find` to find the sha
2. `git show <sha>` — confirm content and dependencies (a commit may rely on earlier commits)
3. check whether that change already exists in the target (`git cherry <target> <source>` or `git log --grep`)

### 2. Pick

> Goal: apply the commits across in the right order

```bash
git cherry-pick <sha>                  # single
git cherry-pick -x <sha>               # single + record "(cherry picked from ...)"
git cherry-pick <oldest>^..<newest>    # range — always old to new
git cherry-pick -n <sha1> <sha2>       # batch into one commit (--no-commit)
git cherry-pick -m 1 <merge-sha>       # merge commit — specify mainline
```

1. a range must be ordered old→new — commit dependencies are usually forward-only
2. commits that must stay together: batch with `-n` then make one commit

### 3. Handle Conflicts

> Goal: conflicts resolved correctly in the target branch context

1. conflict → fix the files, `git add`, `git cherry-pick --continue`
2. give up → `git cherry-pick --abort`
3. a conflict means the branches diverge a lot — consider a manual port instead

### 4. Verify

> Goal: the change works on the target branch

1. `git show HEAD` to check the diff; run `/run-check` — a different branch context can break it
2. report: original sha → new sha (a pick always creates a new commit with a different sha)

## Rules

- cherry-pick creates duplicate commits — a later merge-back may conflict, be aware before using
- use `-x` when picking between public branches — traceability matters
- do not pick part of a logical change — pick the complete set or none
- Use /resolve-errors if needed

## Expected Outcome

- the target changes are on the target branch as new commits with traceability (`-x`)
- passes `/run-check` in the destination branch context

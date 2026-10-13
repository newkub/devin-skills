---
name: resolve-merge-conflicts
description: Safely resolve git merge conflicts without losing changes
argument-hint: "[scope|verify]"
related:
  - idea
  - merge
  - git-commit
---

## Goal

Resolve git merge conflicts by choosing the correct side, keeping the good parts from both sides, and never losing work

## Scope

Use when a pull/rebase/merge produces conflicts in code, config, or docs

## Execute

### 1. Identify Conflicts

> Goal: Know which files have conflicts before resolving

1. Run `git status` to see `Unmerged` files
2. Run `git diff --name-only --diff-filter=U`
3. Record the list of files with conflicts

### 2. Understand Conflicting Changes

> Goal: Understand what each side changed

1. Run `git log --merge --left-right --oneline`
2. Compare ` ours` and `theirs` for each file
3. Read the `<<<<<<<`, `=======`, `>>>>>>>` markers in the file
4. If unsure which side is correct → stop and ask the branch owner

### 3. Resolve Each File

> Goal: Each file has no conflict markers and still works

1. Read the files with conflicts
2. Choose: keep `ours`, `theirs`, or merge manually
3. If both sides have good parts → keep the best of both
4. Remove all `<<<<<<<`, `=======`, `>>>>>>>` markers
5. Record in the commit message why that resolution was chosen

### Workflows

| Argument | Workflow |
|----------|----------|
| `verify`, `verify-resolved` | `workflows/verify-resolved/SKILL.md` — no markers, both sides' intent preserved, build/test passing |

1. If the argument is `verify` → read `workflows/verify-resolved/SKILL.md` and follow its flow — do not re-resolve
2. If no argument is given → run Steps 1-5 normally, with Step 4 reading and executing the `verify-resolved` workflow

### 4. Validate

> Goal: Verify the conflict resolution didn't break anything

1. Follow `workflows/verify-resolved/SKILL.md` — check markers, intent preservation, and build/test
2. If the verdict isn't `clean` → go back and resolve again

### 5. Stage And Commit

> Goal: Capture the resolution result

1. `git add` every resolved file
2. `git commit` or run `/git-commit`
3. If rebasing → `git rebase --continue`
4. If merging → complete the merge

## Rules

### 1. Never Lose Work

- Never delete changes without understanding them
- If unsure, abort first (`git merge --abort` or `git rebase --abort`)

### 2. Use Tools

- Use `git mergetool` if available
- Use `git diff` to compare versions
- Don't hand-edit complex conflicts

### 3. Test After Resolve

- Always run tests before committing
- If there are no tests, build or run typecheck

### 4. Clean History

- The commit message must state that conflicts were resolved
- If a rebase had many conflicts, squash where appropriate

- Use /idea-merge if needed
- Use /merge-github-pr if needed

## Merged Details

### verify-resolved

##### Goal

Confirm after `/resolve-merge-conflicts` that conflicts are truly gone, no markers were left behind, neither side's changes were lost, and the project is still green

##### Scope

- Use when the parent dispatches to `verify` or when called after resolving finishes
- Covers: conflict markers, unmerged paths, intent preservation, build/test
- Read-only: verification only — no re-resolving

##### Execute

###### 1. Check No Conflict Residue

> Goal: Markers and unmerged paths are gone

1. `rg '^(<<<<<<<|=======|>>>>>>>)'` across the whole tree — must find nothing
2. `git status` → no unmerged paths (`UU`, `AA`)
3. `git diff --check` → no conflict artifacts

###### 2. Check Intent Preservation

> Goal: Neither side of the conflict was lost

1. `git diff` the files that had conflicts — verify both ours/theirs changes remain per the intent the user confirmed
2. Flag hunks where the resolution unintentionally deleted one side's changes

###### 3. Verify Project Green

> Goal: The merge result works

1. Run typecheck/build best-effort (`bun run typecheck`, `bun run build`)
2. If the conflict touched critical paths → run `/run-verify`
3. If it fails → verdict `broken-merge` with the list of files needing re-resolution

###### 4. Report

> Goal: Summarize resolution status

1. Use `/report` with columns: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `clean` / `residue-found` / `intent-lost` / `broken-merge`

##### Rules

- A marker actually found = `residue-found` — report immediately
- intent-lost = changes dropped unintentionally — higher severity than a build fail
- Don't fix conflicts in this workflow — report back to the parent

##### Expected Outcome

- A verdict, with evidence, that the merge resolution is truly clean
- A list of files needing re-resolution, if any

## Expected Outcome

- No leftover conflict markers
- Every file builds/tests successfully
- No changes lost from either side
- Clean, clearly explained commit history

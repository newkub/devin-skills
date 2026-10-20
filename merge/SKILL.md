---
name: merge
description: merge files or folders together and delete the original source
argument-hint: "[domain] | @files [destination]"
allowed-tools:
  - read
  - edit
  - write
  - grep
  - find_file_by_name
  - exec
  - ask_user_question
  - todo_write
triggers:
  - user
  - model
related:
  - read-all-files
  - update-references
  - edit-relative
  - deep-validate
  - ask-me
  - deep-analyze
  - apply
  - report
  - report-progress

---

## Goal

merge source files or folders together into a single destination file or folder, then delete the original source

## Scope

Use when you need to combine content from multiple files or folders together and delete the source after merge — or when you need to merge a git branch/PR by domain

- `git-branch` → merge a feature branch into the target branch with `--no-ff`
- `github-pr` → merge a pull request with the appropriate strategy
- `all-branch-by-me-to-main` → merge every branch created by the user into `main` then delete the branches

## Execute

### 1. Identify Sources And Destination

> Goal: know what is the source and the destination

1. Accept `@files` as the list of sources (files or folders) from the argument or context
2. Accept `destination` from the prompt or context
3. A source may be multiple files or folders
4. The destination may be a new file, an existing file, or a target folder
5. If there is no `@files` → do `/ask-me` to request the list of sources
6. If it is unclear → do `/ask-me` before proceeding

### 2. Analyze Sources

> Goal: understand the content before merge

1. Do `/read-all-files` on each source first — read all content into context (concat related files, engine: `/check-file-relation`) then do `/deep-analyze` — never analyze from file names alone
2. If a source is a folder → `/read-all-files` covers every `SKILL.md` or main file in the folder
3. Record the structure, relationships, and redundancy

### 3. Plan Merge

> Goal: plan the merge safely

1. Do `/apply` mode `validate` to validate before merge
2. Identify references that point to the source
3. Plan the update of references toward the destination
4. If there are complex references → do `/update-references` in advance

### 4. Merge Content

> Goal: combine the sources together correctly

1. If a source is a file → read all content then merge into the destination
2. If a source is a folder → gather the important files, remove redundancy, then merge the content
3. Use `git mv` or `git rm` if inside a git repo
4. Check that the merge is correct and there is no data loss

### 5. Delete Old Sources

> Goal: delete the original source after merge

1. Delete the original source files or folders after the merge succeeds
2. Use `git rm -r` for folders or `git rm` for files
3. Check that no old references remain if the source was referenced

### 6. Update References

> Goal: ensure no broken references from the deleted source

1. Do `/update-references` to update every skill that references the source
2. Do `/edit-relative` when the merge affects relative paths, imports, markdown links, or semantic references (skill names, `related` lists) of other files — covering both path-level and symbol-level updates
3. Check for skills related to file ops (`move-to`, `rename`, `all-this-patterns`, `edit-only`, `refactor`, `flatten-directory`) and update references to point to the destination
4. Use `grep` to re-check for leftover old references

### 7. Validate

> Goal: verify correctness

1. Do `/deep-validate` to check the merge
2. Check for broken references
3. Check for data loss
4. Do `/report table` summarizing: `No.`, `Source`, `Destination`, `Status`, `Notes`
5. If there are multiple pending steps → do `/report-progress`

### Skills

> Goal: dispatch to the destination skill by domain when the merge is a git branch/PR workflow

| Domain | Skill |
|--------|----------|
| `git-branch` | `git merge --no-ff <branch>` — direct command (the former `merge-git-branch` skill was removed) |
| `github-pr` | /merge-github-pr — merge the PR with the appropriate strategy |
| `all-branch-by-me-to-main` | /merge-all-branch-by-me-to-main — merge every branch of the user into `main` |

1. If the argument matches a domain in the table → follow the `Skill` column (read the skill file first when it is a `/skill`) — do not execute directly from this table
2. If it is an `@files` merge → follow steps 1-7 above

## Rules

- Verify the merge is correct before deleting the source
- Support both files and folders as sources
- Use git for file operations when possible
- If there are references pointing to the source → do `/update-references` before deleting
- If you must decide between multiple options → do `/deep-validate` then choose the best one
- Every merge must pass `/apply` mode `validate` first

## Expected Outcome

- Files or folders are merged together
- The original source is deleted
- No data loss
- No broken references

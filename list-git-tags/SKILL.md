---
name: list-git-tags
description: List tags and releases — version, date, author, notes, SemVer status
argument-hint: "[scope | pattern]"
related:
  - follow-tool-git
  - git-tag
  - list-github-release
  - report
---

## Goal

List the repository's tags as releases — version, date, author, notes, and semantic versioning status

## Scope

Use for repositories that version with git tags, covering annotated tags and lightweight tags, plus the release notes reachable from `CHANGELOG.md` or the tag message — excludes creating, deleting, and pushing tags (use `/follow-tool-git`) and GitHub-hosted releases (use `/list-github-release`)

## Execute

### 1. Verify The Repository

> Goal: confirm the current directory is a git work tree

1. Run `git rev-parse --is-inside-work-tree`
2. Not a git repo → stop and report
3. Note the current branch and HEAD

### 2. List Tags

> Goal: fetch the full tag list

1. Run `git tag` to see all tags
2. Run `git tag -l --sort=-version:refname` to sort latest version first
3. Run `git for-each-ref --sort=-creatordate --format '%(refname:short)|%(objectname:short)|%(taggerdate:short)|%(subject)' refs/tags` to list by creation date
4. Need a subset → filter with `git tag -l 'v*'` or the requested pattern
5. No tags → report "No tags found" and finish
6. State the total tag count

### 3. Collect Tag Details

> Goal: gather metadata and notes for each tag

1. Run `git show <tag> --no-patch --format="%H|%ci|%an|%s"` for each tag
2. Run `git tag -l --format='%(refname:short) %(objecttype)'` to identify annotated vs lightweight
3. Run `git tag -n10 <tag>` to read the annotated tag message
4. Check remote tags with `git ls-remote --tags origin`
5. Resolve notes by priority: `CHANGELOG.md` section for the version → annotated tag message → commit subject; read `RELEASE.md` or `CHANGES.md` when present

### 4. Find The Latest Release

> Goal: identify the newest release

1. Run `git describe --tags --abbrev=0` to find the latest tag
2. No tags → report that there is no release yet
3. Show the latest release with date, author, and notes

### 5. Analyze Semantic Versioning

> Goal: analyze tags per semantic versioning

1. Identify semantic-version tags (`v` + MAJOR.MINOR.PATCH)
2. Identify non-semantic-version tags
3. Identify pre-release tags (suffixes such as `-alpha`, `-beta`, `-rc.1`)
4. Identify the latest stable version and the latest pre-release version
5. Check the version sequence for gaps

### 6. Format Output

> Goal: format the result as a table

1. Use `/report` to format as a table
2. Define columns:
   - No. sequence
   - Tag tag name
   - Type annotated / lightweight
   - Commit SHA (short)
   - Date the tag was created
   - Author who created the tag
   - Notes preview by notes priority
   - SemVer ✅ / ❌
3. Sort latest version first
4. Identify the latest release and upcoming changes from `CHANGELOG.md` when present

## Rules

### Read-Only

- Never create, delete, or push tags — use `/follow-tool-git` for tag operations
- Never modify repository state — report only

### Tag Types And Notes

- Annotated tag: has tagger, date, and message
- Lightweight tag: no extra information; use the commit date and subject instead
- Notes priority: `CHANGELOG.md` section → annotated tag message → commit subject
- Always state the tag type in the report

### Output Format

- Use `/report` to format the result
- Sort latest version first and highlight the latest stable plus the latest pre-release
- Use symbols: ✅ SemVer compliant, ❌ non-SemVer

### High Impact Content

- More than 50 tags → show only the latest 20
- Highlight non-semantic-version tags and missing version gaps

### Non-Redundancy

- Tag operations live in `/follow-tool-git`
- GitHub-hosted releases live in `/list-github-release`
- Branch listing lives in `/list-git-branch`

## Expected Outcome

- A full tag/release list in a readable table
- Complete data: tag name, type, commit, date, author, notes preview, SemVer status
- Latest release, latest stable, latest pre-release, and non-SemVer tags highlighted
- No tag modified — a read-only report

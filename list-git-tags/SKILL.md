---
name: list-git-tags
description: List all tags with metadata and semantic versioning status
argument-hint: "[scope]"
related:
  - follow-tool-git
  - report
---

## Goal

List all git tags with metadata and semantic versioning status

## Scope

Use to view tags in the local repository and remote — excludes create, delete, push (use `/follow-tool-git` for tag operations)

## Execute

### 1. List Tags

> Goal: see all local tags

1. Run `git tag` to see all tags
2. Run `git tag -l --sort=-version:refname` to sort latest version first
3. No tags → report "No tags found" and finish
4. State the total tag count

### 2. Collect Tag Details

> Goal: gather extra data for each tag

1. Run `git show <tag> --no-patch --format="%H|%ci|%an|%s"` for each tag
2. Identify tag type: annotated (has tagger info) or lightweight
3. Run `git tag -l --format='%(refname:short) %(objecttype)'` to see tag type
4. Check remote tags with `git ls-remote --tags origin`

### 3. Analyze Semantic Versioning

> Goal: analyze tags per semantic versioning

1. Identify semantic-version tags (start with `v` + MAJOR.MINOR.PATCH)
2. Identify non-semantic-version tags
3. Identify pre-release tags (suffixes such as `-alpha`, `-beta`, `-rc.1`)
4. Identify the latest stable version and the latest pre-release version
5. Check the version sequence for gaps

### 4. Format Output

> Goal: format the result as a table

1. Use `/report` to format as a table
2. Define columns:
   - No. sequence
   - Tag tag name
   - Type annotated / lightweight
   - Commit SHA (short)
   - Date the tag was created
   - Author who created the tag
   - Message short commit message
   - SemVer ✅ / ❌
3. Sort latest version first

## Rules

### Read-Only

- Never create, delete, or push tags — use `/follow-tool-git` for tag operations
- Never modify repository state
- Report only — a read-only operation

### Output Format

- Use `/report` to format the result
- Sort latest version first
- Highlight latest stable and latest pre-release
- Use symbols: ✅ SemVer compliant, ❌ non-SemVer

### High Impact Content

- More than 50 tags → show only the latest 20
- Highlight non-semantic-version tags
- Highlight missing version gaps

### Non-Redundancy

- Tag operations already live in `/follow-tool-git`
- GitHub releases already live in `/list-github-release`
- Branch listing already lives in `/list-git-branch`

## Expected Outcome

- A full tag list in a readable table
- Complete data: tag name, type, commit, date, author, message, SemVer status
- Latest stable, latest pre-release, and non-SemVer tags highlighted
- No tag modified — a read-only report

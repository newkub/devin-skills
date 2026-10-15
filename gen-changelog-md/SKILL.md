---
name: gen-changelog-md
description: Generate CHANGELOG.md from git tags with a Bun Shell script, never hand-edited
argument-hint: "[scope]"
related:
  - run-release
  - report
  - deep-review-codebase
  - follow-tool-changelogen
  - follow-tool-semantic-release
---

## Goal

Generate `CHANGELOG.md` from `git tag --sort=-version:refname` with a Bun Shell script without hand editing, using the Keep a Changelog format and conventional commits grouping

## Scope

Use for projects that need an automatic `CHANGELOG.md` from git tags — excluding publishing to platforms (use `run-release`) and excluding reporting the changelog (use `report`)

## Execute

### 1. Run Generator

> Goal: Generate CHANGELOG.md from git tags

1. Run the script to gen `CHANGELOG.md`:
```bash
bun run skills/gen-changelog-md/scripts/gen-release-md.ts
```
2. For a dry run (print to stdout, write no file):
```bash
bun run skills/gen-changelog-md/scripts/gen-release-md.ts --dry
```
3. For a custom output path:
```bash
bun run skills/gen-changelog-md/scripts/gen-release-md.ts --output PATH
```

### 2. Verify Output

> Goal: Check the generated CHANGELOG.md

1. Read the generated `CHANGELOG.md` to verify version numbers and dates are correct
2. Check that conventional commits are categorized: Breaking Changes, Features, Bug Fixes, Other
3. Check that the Unreleased section shows commits after the latest tag
4. Check that the Release History table shows every tag

### 3. Update If Needed

> Goal: Update CHANGELOG.md when a new tag exists

1. If an update is needed → re-run the script; never edit `CHANGELOG.md` by hand
2. Always run the script after a new `git tag`
3. Commit `CHANGELOG.md` together with the release commit

## Rules

### 1. Generation Only

- `CHANGELOG.md` is generated only by `scripts/gen-release-md.ts` from `git tag --sort=-version:refname`
- Never edit `CHANGELOG.md` by hand — to update, re-run the script
- Use `Bun.$` for shell commands and `Bun.write()` for writing the file

### 2. Format

- Use the Keep a Changelog format: `## vX.Y.Z (YYYY-MM-DD)`
- Use conventional commits grouping: Breaking Changes, Features, Bug Fixes, Other
- Show the short commit hash (7 chars) in parentheses at the end of each item
- Show the top 10 releases in detail format, the rest in the Release History table
- Show an Unreleased section for commits after the latest tag

### 3. Version Format

- Use semantic versioning format: `vX.Y.Z` (e.g. `v1.0.0`, `v1.2.3`)
- Use annotated tags for releases
- Date from `git log -1 --format=%ad --date=short <tag>`

### 4. Non-Redundancy

- Publishing to platforms already lives in `run-release`
- Reporting the changelog already lives in `report`
- Reviewing changelog completeness already lives in `deep-review-codebase`
- For projects using changelogen or semantic-release, use `follow-tool-changelogen` or `follow-tool-semantic-release` instead

## Expected Outcome

- `CHANGELOG.md` is generated from git tags by the script, never hand-edited
- Conventional commits are categorized: Breaking Changes, Features, Bug Fixes, Other
- The Unreleased section shows commits after the latest tag
- The Release History table shows every tag with its date
- Format conforms to Keep a Changelog

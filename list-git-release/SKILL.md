---
name: list-git-release
description: List git tags and releases from the local repo with version, date, notes
argument-hint: "[scope]"
related:
  - report
  - run-release
---

## Goal

List git tags and releases in the local repository with version, date, message, and release notes

## Scope

Use for repositories that use git tags as versions — supports both annotated tags and lightweight tags

## Execute

### 1. Ensure Git Repository

> Goal: verify we are inside a git repository

1. Run `git rev-parse --is-inside-work-tree`
2. Not a git repo → stop and report
3. Identify the current branch and HEAD

### 2. List Tags

> Goal: fetch the full tag list

1. Run `git tag --list` to list tags alphabetically
2. Run `git for-each-ref --sort=-creatordate --format '%(refname:short)|%(objectname:short)|%(taggerdate:short)|%(subject)' refs/tags` to list by creation date
3. Identify annotated vs lightweight tags from the output
4. Need a filter → use `git tag --list 'v*'` or the desired pattern

### 3. Extract Release Notes

> Goal: show notes for each tag

1. Run `git tag -n10 <tag>` to see the annotated tag message
2. `CHANGELOG.md` exists → read the sections per version
3. `RELEASE.md` or `CHANGES.md` exists → read the release notes
4. Use `git show <tag> --quiet` to see the commit the tag points to

### 4. Find Latest Release

> Goal: identify the latest release

1. Run `git describe --tags --abbrev=0` to find the latest tag
2. No tags → report that there is no release yet
3. Show the latest release with date, author, and notes

### 5. Report

> Goal: present the result in a readable form

1. Use `/report` columns: No, Tag, Commit, Date, Author, Notes Preview
2. Sort by creation date, newest first
3. Identify the latest release and upcoming changes from `CHANGELOG.md` if present

## Rules

### 1. Read Only

- Never create, delete, or modify tags without instruction
- Use only `git tag`, `git for-each-ref`, `git show`

### 2. Tag Types

- Annotated tag: has tagger, date, message
- Lightweight tag: no extra information; use the commit date instead
- State the tag type in the report

### 3. Notes Priority

1. `CHANGELOG.md` section for the version
2. Annotated tag message (`git tag -n`)
3. Commit subject (`git show --quiet`)

- Use /list-git-branch if needed
- Use /list-git-commit if needed
- Use /run-release if needed

## Expected Outcome

- A list of tags/releases in the repo
- Version, date, author, and notes preview data
- The latest release and the upcoming release identified when `CHANGELOG.md` has data

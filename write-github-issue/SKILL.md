---
name: write-github-issue
description: Write or update GitHub issue title, body, and metadata
allowed-tools:
  - read
  - edit
  - write
  - grep
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
---

## Goal

Edit issue title, body, labels, assignees, and other metadata

## Scope

Use when an existing issue needs content or metadata updates

## Execute

### 1. Identify issue
> Goal: identify issue

1. Run gh issue view <number>
1. Confirm issue number and repo

### 2. Update content
> Goal: update content

1. Edit title and body with gh issue edit
1. Add or remove labels and assignees
1. Update milestone or project

### 3. Verify
> Goal: verify

1. View issue again to confirm changes
1. Check linked PRs or sub-issues

### 4. Report
> Goal: report

1. Summarize changes
1. Return issue URL

## Rules

- Do not overwrite body without user confirmation if it has comments
- Use --add-label and --remove-label to manage labels
- Keep edits focused and minimal

## Expected Outcome

- Issue content and metadata updated
- Changes verified

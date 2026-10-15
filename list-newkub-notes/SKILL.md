---
name: list-newkub-notes
description: List the notes in the D:\newkub\notes repo
argument-hint: "[--limit N]"
related:
  - save-to-new-notes
  - report
---

## Goal

List the notes that exist in `D:\newkub\notes` with a content summary

## Scope

- Read `.md` files from `D:\newkub\notes`
- Supports a limit
- Never modifies a note

## Execute

### 1. Verify Notes Repo

> Goal: check the repo matches what is expected

1. Check `D:\newkub\notes` must have a `README.md`
2. Missing → tell the user to create the repo first

### 2. List Notes

> Goal: fetch the note list

1. Take `--limit` from the argument (default 30)
2. Find `*.md` files in `D:\newkub\notes` sorted by most recent `LastWriteTime`
3. Read the first line as the title

### 3. Fetch Summaries

> Goal: summarize each note's content

1. Count the headings / key lines
2. Keep the path in the repo

### 4. Format Output

> Goal: show the result readably

1. Use `/report`
2. Columns: File, Title, Updated, URL
3. URL uses `https://github.com/newkub/notes/blob/main/<file>`

## Rules

### 1. Output

- Use `/report` when there is a lot of data
- Sort by most recent updated

### 2. Pagination

- More than the limit → tell the user to raise the limit

### 3. Safety

- Never delete or edit a note from the list

### 4. Empty State

- No note found → suggest using `/save-to-new-notes`

- Use /save-to-new-notes if needed

## Expected Outcome

- A list of notes
- A summary of each note's content
- A URL to open each note

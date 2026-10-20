---
name: move-to
description: Move files and update references
argument-hint: "[source] [target]"
related:
  - follow-best-practice
  - suggest-next-action
  - resolve-errors
  - update-references
---

## Goal

Move a file to a new location and update references

## Scope

Use `move` for tasks and workflows that specifically cover (to)

## Execute

### 1. Move File

> Goal: Move File

Move the file to a new location

1. Identify the file that needs to be moved
2. Move the file to the new location
3. Check that the move is correct

### 2. Update Reference

> Goal: Update Reference

Update references

1. Run `/update-references`
2. Check that the references are updated

## Rules

- Use git for file operations when possible
- Check that there is no data loss
- Update references after moving the file

- Use /follow-best-practice if necessary
- Use /suggest-next-action if necessary
- Use /resolve-errors if necessary

## Expected Outcome

- The file is moved to the new location
- References are updated
- No data loss

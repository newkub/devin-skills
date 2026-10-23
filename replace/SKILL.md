---
name: replace
description: Replace content in files or code with regex or AST-based patterns
argument-hint: "[scope]"
related:
  - use-astgrep
  - update-references
  - deep-validate
---

## Goal

Replace content in files or code correctly and safely

## Scope

Use `replace` to replace content in files or code, choosing the method by the nature of the task:

- Plain text / regex replacement: for general content such as docs, config
- AST-based replacement: for code that needs high precision

- See also: /use-astgrep

## Execute

### 1. Identify Content To Replace

> Goal: Identify the content to be replaced

1. SEARCH for the content x to be replaced
2. MARK the location to be replaced
3. PREPARE the content y that will replace it
4. If it is a code replacement → run the `/use-astgrep` programmatic workflow to find patterns with AST

### 2. Execute Replacement

> Goal: Perform the content replacement

1. If it is plain text or regex → use `edit` or `write` to replace
2. If it is complex code or needs precision → use the `/use-astgrep` programmatic workflow for AST-based rewrite
3. REPLACE x with y in the specified file or code
4. VERIFY that the replacement is correct
5. CHECK that there are no side effects from the replacement

### 3. Update References

> Goal: Update references after replace

1. If the replacement changes an identifier, path, or skill name → run `/update-references`
2. Run `/review-dot-agents-global-and-fix` or `/deep-validate` to check

## Rules

- Use the `/use-astgrep` programmatic workflow when replacing in source code to avoid false positives
- Use the `/use-astgrep` programmatic workflow when batch replacing multiple files or integrating with scripts
- Follow the project conventions and global rules (replace)
- Use the allowed tools only when needed

## Expected Outcome

- The content to be replaced is replaced correctly
- No broken references
- No unwanted side effects

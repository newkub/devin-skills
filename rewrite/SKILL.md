---
name: rewrite
description: Rewrite one or more files completely from scratch without referencing prior context
argument-hint: "[scope]"
related:
  - reset-context
  - deep-validate
  - scan-codebase
  - review-dot-agents-global-and-fix
  - follow-best-practice
  - use-scripts
  - update-references
---

## Goal

Rewrite one or more files completely from scratch, without referencing prior context, and deliver complete content

## Scope

Use when the user asks to rewrite a file or several files, wanting all content written fresh from an empty slate

## Execute

### 1. Reset Context

> Goal: Reset Context

Start with `/reset-context` to clear prior context

1. Invoke `/reset-context` before every edit
2. Do not reference conclusions, analyses, or decisions from earlier conversations
3. Treat the target files as new files that must be written from scratch

### 2. Identify Targets

> Goal: Identify Targets

Clearly identify the files to rewrite

1. Ask or determine target files from the user request
2. Use `scan-codebase` to find related files
3. Check the dependencies and references of the target files

### 3. Read Targets Fresh

> Goal: Read Targets Fresh

Read the target files and all references anew

1. Read each target file in full
2. Read imports, exports, and dependencies
3. Read reverse dependencies
4. Run `review-dot-agents-global-and-fix` for related workflows

### 4. Analyze Requirements

> Goal: Analyze Requirements

Analyze all requirements anew

1. Identify what each file does
2. Identify public APIs, interfaces, and contracts
3. Identify standards, conventions, and best practices to preserve
4. Run `follow-best-practice` for related topics

### 5. Rewrite From Scratch

> Goal: Rewrite From Scratch

Write each file completely from an empty slate

1. Do not merge or append with the old content
2. Do not reference prior context
3. Use `write` to overwrite the original file with new content
4. If there are many files, use `use-scripts` for automation
5. Run `update-references` if file names or paths change

### 6. Validate

> Goal: Validate

Check the results

1. Run `/deep-validate` to verify correctness
2. Run `run-verify` to execute lint, typecheck, and scan
3. Read the new files again to verify

## Rules

### 1. Always Reset Context

- Always invoke `/reset-context` before every rewrite
- Never reference conclusions or analysis from earlier conversations
- Never assume the original code is correct

### 2. Full Rewrite

- Files are written completely from scratch, never merged with old content
- Never copy-paste from the old content without review
- Never leave unused old sections behind

### 3. Evidence-Based

- Every decision must be based on the actual files read fresh
- Every assumption must have evidence
- Do not guess from context or memory

### 4. Preserve Contracts

- Preserve the public APIs and interfaces the user specified
- Preserve file paths and naming conventions
- If a contract must change, run `update-references` to update all references

### 5. Complete Delivery

- All files must be complete, with no unnecessary TODO, MOCK, or STUB
- Verify that all references actually exist
- Run `run-verify` before delivery

## Expected Outcome

- Target files are fully rewritten from scratch
- No stale context influenced the decisions
- New content matches the current requirements
- Passes validation and run-verify
- All references updated correctly
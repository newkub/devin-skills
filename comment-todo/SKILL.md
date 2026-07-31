---
name: comment-todo
description: Add TODO comments to identify issues without making code changes
---

## Goal

Add TODO comments to identify issues without making code changes

## Scope

Use for adding TODO comments to identify issues that need to be fixed in any context

## Execute

### 1. Identify Issues

1. Analyze code or task to identify issues
2. Prioritize issues by severity
3. Determine which issues need TODO comments

### 2. Add TODO Comments

1. Add TODO comments in files with issues
2. Specify issue type and priority
3. Use consistent format
4. Do not modify code

## Rules

### 1. TODO Format

Use consistent format based on language:

- `// TODO: [priority] description` for single-line (C-style)
- `/* TODO: [priority] description */` for multi-line (C-style)
- `<!-- TODO: [priority] description -->` for HTML/XML
- `# TODO: [priority] description` for Python/Shell/Markdown
- `-- TODO: [priority] description` for Lua/SQL
- `(* TODO: [priority] description *)` for ML/F#
- `(* TODO: [priority] description *)` for Haskell

### 2. Priority Levels

Define priority levels:

- `HIGH` - critical issues that need immediate attention
- `MEDIUM` - important issues that should be fixed soon
- `LOW` - minor issues that can be fixed later

### 3. Comment Placement

Place comments appropriately:

- Near the problematic code
- On the same line or before the code
- Clearly explain what needs to be fixed

### 4. Comment Quality

Write quality comments:

- Action-oriented (what needs to be done)
- Clearly specify what needs to be fixed
- Concise but understandable
- Not redundant with code

## Expected Outcome

- [ ] Codebase has TODO comments identifying all issues
- [ ] TODO comments have clear priority levels
- [ ] TODO comments use consistent format
- [ ] No code modifications made

## Common Mistakes

Common mistakes:

- Comment TODO without specifying priority
- Unclear TODO comments
- Redundant TODO comments
- Accidentally modifying code

## Anti-Patterns

Patterns to avoid:

- ❌ Too many TODO comments making code hard to read
- ❌ Meaningless TODO comments
- ❌ TODO comments that are not action-oriented
- ❌ TODO comments that don't specify what needs to be done

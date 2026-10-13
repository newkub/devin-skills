---
title: Frontmatter Validation
description: Validation rules for subagent frontmatter
---

# Frontmatter Validation

## Required Fields

Check that the frontmatter contains all 4 fields:

1. `name` — the subagent name must match the directory name
2. `description` — a short description, at most 100 characters
3. `model` — specifies the model used
4. `allowed-tools` — the list of permitted tools

## Validation Rules

### Name

- Must match the subagent's directory name
- Use lowercase and kebab-case
- No spaces or special characters

### Description

- Length must not exceed 100 characters
- Clearly describes the subagent's responsibility
- Thai or English is acceptable

### Model

- Must specify a supported model
- Must not be left empty

### Allowed-Tools

- Must list the tools the subagent uses
- Use backticks for tool names
- Must fit the subagent's scope

### Permissions

- Must have a `permissions` section
- Must specify `deny` for risky system paths
- See `references/safety.md` for additional risky paths

## Severity Mapping

| Finding | Severity |
|---|---|
| Missing `name`, `description`, `model`, `allowed-tools` | Critical |
| `name` doesn't match the directory | Critical |
| `description` exceeds 100 characters | Low |
| Missing `permissions` or `deny` | High |

## Evidence Format

Record each finding with:

- file path of `AGENT.md`
- the problematic field
- the actual value found
- recommended action

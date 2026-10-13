---
title: Style Conventions
description: Rules for validating AGENT.md style conventions
---

# Style Conventions

## Backticks

Use backticks for:

- `tools` — tool names such as `grep`, `edit`
- `commands` — command names such as `/list-devin-global-subagents`
- `file paths` — paths such as `AGENT.md`
- `skill names` — skill names such as `update-devin-global-subagents`

### Rules

- never use backticks for general prose
- use backticks only for identifiers

## Bold Markers

- never use `` bold markers at all
- use backticks for emphasis instead of bold
- if `` found → flag as Medium

## Heading Format

### English Headings

- use Title Case such as `## Check Frontmatter`
- never use ALL CAPS or all lowercase
- if a heading is not Title Case → flag as Low

### Thai Content

- Thai-language content is acceptable
- English headings must be Title Case only

## Severity Mapping

| Finding | Severity |
|---|---|
| Not using backticks for `tools`/`commands`/`paths` | Medium |
| Using `**` bold markers | Medium |
| Heading not in Title Case | Low |

## Evidence Format

Record each finding with:

- the `AGENT.md` file path
- the line number where found
- the offending content
- what it should be corrected to

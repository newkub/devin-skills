---
title: Section Order Validation
description: Rules for validating section order and file size
---

# Section Order Validation

## Required Section Order

`AGENT.md` must contain sections in exactly this order:

1. `## Goal` — the subagent's objective
2. `## Scope` — intended usage scope
3. `## Execute` — working steps
4. `## Rules` — rules and constraints
5. `## Expected Outcome` — expected result

## Validation Rules

### Order

- sections must follow the order above
- never swap or skip a section
- never add a section beyond the defined ones

### Line Count

- the entire `AGENT.md` file must not exceed 250 lines
- count both frontmatter and content
- if over 250 lines → flag as High

### Placeholder Check

- no `TODO` in content
- no `MOCK` in content
- no placeholder text such as `lorem ipsum`, `xxx`, `foo bar`
- if found → flag as Medium

## Severity Mapping

| Finding | Severity |
|---|---|
| Missing a required section | High |
| Wrong section order | High |
| Over 250 lines | High |
| Contains `TODO`/`MOCK`/placeholder | Medium |

## Evidence Format

Record each finding with:

- the `AGENT.md` file path
- the problematic section, or line number
- the content found
- the recommended action

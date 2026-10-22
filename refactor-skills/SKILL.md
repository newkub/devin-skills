---
name: refactor-skills
description: alias → /update-devin-global-skills refactor (restructure skill packages)
argument-hint: "[skill | family-prefix | all]"
related:
  - update-devin-global-skills
---

## Goal

Alias of `/update-devin-global-skills` argument `refactor` — the workflow lives in `update-devin-global-skills/workflows/refactor/SKILL.md`

## Scope

Use when the user or another skill calls `/refactor-skills` — the real workflow is the `refactor` argument of `update-devin-global-skills`

- Default: forward the full workflow with the `<skill | family-prefix | all>` scope verbatim
- A caller that targets project code instead of a skill package → route to `/refactor`

## Execute

Run `/update-devin-global-skills refactor`, forwarding the scope argument exactly as the caller specified

## Rules

- Never duplicate the `workflows/refactor` workflow in this file
- If the alias misses steps → always read `update-devin-global-skills/workflows/refactor/SKILL.md`
- A skill package rewritten here follows the same authority as `/refactor-skills` did — `update-devin-global-skills` `## Conventions`

## Expected Outcome

- `update-devin-global-skills/workflows/refactor/SKILL.md` is executed through every step until the packages pass the conventions

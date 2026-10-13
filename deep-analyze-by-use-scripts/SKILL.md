---
name: deep-analyze-by-use-scripts
description: alias → /deep-analyze (deep project analysis across every dimension via tools, scripts, CLI)
argument-hint: "[scope|report]"
related:
  - deep-analyze

---

## Goal

Alias of `/deep-analyze` — deep project analysis across every dimension (extracted from the old `deep-analyze/workflows/by-use-scripts`, which was an alias stub)

## Scope

Use when the user invokes `/deep-analyze-by-use-scripts` — this skill is only an alias stub; the real workflow lives in `deep-analyze`

## Execute

Run the full `/deep-analyze` workflow

## Rules

- Never duplicate the `/deep-analyze` workflow in this file
- If the alias lacks steps → always read `deep-analyze/SKILL.md`
- Preserve backward compatibility of the alias name

## Expected Outcome

- `/deep-analyze` is executed through every step

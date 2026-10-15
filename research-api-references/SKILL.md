---
name: research-api-references
description: alias → /deep-research api-references (search API references from multiple sources)
argument-hint: "[api-or-library]"
related:
  - deep-research
---

## Goal

Alias of `/deep-research api-references` — find trustworthy API references summarized with cited sources

## Scope

Use when the user calls `/research-api-references` — this skill is an alias stub only; the real workflow lives in `deep-research/workflows/api-references/`

## Execute

Run the full `/deep-research api-references` workflow

## Rules

- Never duplicate the `/deep-research api-references` workflow in this file
- If the alias lacks steps → always read `deep-research/workflows/api-references/SKILL.md`

## Expected Outcome

- `/deep-research api-references` is executed completely, every step

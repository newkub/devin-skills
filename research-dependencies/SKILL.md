---
name: research-dependencies
description: alias → /deep-research dependencies — analyze manifest, compare, fast/modern deps
argument-hint: "[package or manifest]"
related:
  - deep-research
---

## Goal

Alias of `/deep-research dependencies` — research dependencies/libraries: analyze manifest, compare alternatives, find fast/modern deps

## Scope

Use when the user calls `/research-dependencies` — this skill is an alias stub only; the real workflow lives in `deep-research/workflows/dependencies/`

## Execute

Run the full `/deep-research dependencies` workflow

## Rules

- Never duplicate the `/deep-research dependencies` workflow in this file
- If the alias lacks steps → always read `deep-research/workflows/dependencies/SKILL.md`

## Expected Outcome

- `/deep-research dependencies` is executed completely, every step

---
name: research-setup
description: alias → /deep-research setup (research setup/config/CI of a tool/service from multiple sources)
argument-hint: "[tool-or-service]"
related:
  - deep-research
---

## Goal

Alias of `/deep-research setup` — find and summarize setup, config, CI/CD and boilerplate by cross-checking multiple sources

## Scope

Use when the user calls `/research-setup` — this skill is an alias stub only; the real workflow lives in `deep-research/workflows/setup/` — integrations/plugins/extensions → `/research-setup-integrations`

## Execute

Run the full `/deep-research setup` workflow

## Rules

- Never duplicate the `/deep-research setup` workflow in this file
- If the alias lacks steps → always read `deep-research/workflows/setup/SKILL.md`

## Expected Outcome

- `/deep-research setup` is executed completely, every step

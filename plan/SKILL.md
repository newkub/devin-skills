---
name: plan
description: alias → /create-plan-in-dot-agents (canonical analyze + plan)
argument-hint: "[scope] [chat-only]"
related:
  - create-plan-in-dot-agents
---

## Goal

Alias of `/create-plan-in-dot-agents` — analyze + plan persisted to `.devin/temp/plan/<workspace>/` (the plan content itself is produced by `/deep-plan`; this skill owns the file storage)

## Scope

Use when the user or another skill calls `/plan` — the real workflow lives in `create-plan-in-dot-agents`

- Default: forward the full workflow (create the plan file)
- A caller that wants chat-only → forward with `chat-only` specified

## Execute

Run the full `/create-plan-in-dot-agents` workflow — forward the `<scope>` and the `chat-only` hint as specified by the caller

## Rules

- Never duplicate the `/create-plan-in-dot-agents` workflow in this file
- If the alias misses steps → always read `create-plan-in-dot-agents/SKILL.md`

## Expected Outcome

- `/create-plan-in-dot-agents` is executed through every step until an implementation-ready plan is produced

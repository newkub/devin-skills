---
name: follow-debugging
description: alias → /deep-debug (step-by-step debugging — reproduce → fix → prevent recurrence)
argument-hint: "[scope]"
related:
  - deep-debug
---

## Goal

Alias of `/deep-debug` — debug step by step until the root cause is found, fixed, and recurrence is prevented

## Scope

Use when the user invokes `/follow-debugging` — this skill is only an alias stub; the real workflow lives in `deep-debug`

## Execute

Run the full `/deep-debug` workflow

## Rules

- Never duplicate the `/deep-debug` workflow in this file
- If the alias is missing steps → always read `deep-debug/SKILL.md`

## Expected Outcome

- `/deep-debug` is executed in full, every step

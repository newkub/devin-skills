---
name: deep-plan
description: alias → /create-plan-in-dot-devin (canonical analyze + plan)
argument-hint: "[scope] [chat-only]"
related:
  - create-plan-in-dot-devin
---

## Goal

Alias of `/create-plan-in-dot-devin` — analyze + plan persisted to `.devin/temp/plan/<workspace>/` (already merged into the canonical — `deep-plan` is a stub with no workflow of its own)

## Scope

Use when the user or another skill invokes `/deep-plan` — the real workflow lives in `create-plan-in-dot-devin`

- Default: forward the full workflow (create the plan file)
- A caller that wants chat-only (e.g. `/bench-competitors`) → forward with an explicit `chat-only` to skip Steps 6-8

## Execute

Run the full `/create-plan-in-dot-devin` workflow — pass through `<scope>` and the `chat-only` hint as the caller specifies

## Rules

- Never duplicate the `/create-plan-in-dot-devin` workflow in this file
- If the alias is missing steps → always read `create-plan-in-dot-devin/SKILL.md`
- A chat-only caller must always pass the hint through — never create the plan file itself in this file

## Expected Outcome

- `/create-plan-in-dot-devin` is executed through every step until an implementation-ready plan is produced

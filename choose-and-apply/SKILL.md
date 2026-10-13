---
name: choose-and-apply
description: alias → /apply choose (pick from N options, then apply the best fit)
argument-hint: "[options...]"
related:
  - apply
---

## Goal

Alias of `/apply` mode `choose` — takes N options, then analyzes them, picks, and carries out the most suitable one

## Scope

Use when the user calls `/choose-and-apply` — this skill is only an alias stub; the real workflow lives in `apply` (`### Mode: Choose`)

## Execute

Run the full `/apply` mode `choose` workflow

## Rules

- Never duplicate the `/apply` workflow in this file
- If the alias lacks steps → always read `apply/SKILL.md`

## Expected Outcome

- `/apply` mode `choose` executed through every step — an options comparison table + a recommended option + a successful apply

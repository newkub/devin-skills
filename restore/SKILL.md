---
name: restore
description: alias → /restore-files (restore files/state — git log, devin history, dotfiles)
argument-hint: "[domain|verify]"
related:
  - restore-files
---

## Goal

Alias of `/restore-files` — restore files/state via git log, devin history, dotfiles or deleted files of the top-level skills

## Scope

Use when the user calls `/restore` — this skill is an alias stub only; the real workflow lives in `restore-files`

## Execute

Run the full `/restore-files` workflow

## Rules

- Never duplicate the `/restore-files` workflow in this file
- If the alias lacks steps → always read `restore-files/SKILL.md`

## Expected Outcome

- `/restore-files` is executed completely, every step

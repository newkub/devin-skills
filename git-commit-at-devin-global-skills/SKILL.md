---
name: git-commit-at-devin-global-skills
description: alias → /git-commit at-devin-global-skills (commit devin skills after validation passes)
argument-hint: "[message]"
related:
  - git-commit

---

## Goal

Alias of `/git-commit at-devin-global-skills` — commit every changed file in the devin global skills repo after `/review-devin-global-harness`, `/deep-validate` and reference checks pass the criteria

## Scope

Use when the user calls `/git-commit-at-devin-global-skills` — this skill is only an alias stub; the real workflow lives in `git-commit/workflows/at-devin-global-skills`

## Execute

Run the full `/git-commit at-devin-global-skills` workflow (read ``git-commit/SKILL.md → at-devin-global-skills``)

## Rules

- never duplicate the `git-commit/workflows/at-devin-global-skills` workflow in this file
- if the alias lacks steps → always read ``git-commit/SKILL.md → at-devin-global-skills``
- if you want to push next → use `/git-commit-and-push` afterwards

## Expected Outcome

- `/git-commit at-devin-global-skills` is executed through every step until the commit succeeds and the working directory is clean

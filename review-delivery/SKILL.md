---
name: review-delivery
description: alias → /review-release (review the delivery path — release, versioning, changelog)
argument-hint: "[scope]"
related:
  - review-release
---

## Goal

Alias of `/review-release` — the `delivery` label resolves to the same matrix rows (`delivery`, `versioning-changelog`) as `release`, so this directory no longer carries its own review

## Scope

Use when a caller still passes `/review-delivery` — this skill is only an alias stub; the real workflow lives in `review-release`

## Execute

Run the full `/review-release` workflow

## Rules

- Don't duplicate the `/review-release` workflow in this file
- If the alias is missing steps → always read `review-release/SKILL.md`
- Keep the directory — `deep-review/scripts/verify-matrix.ts` requires every `improve`/`optimize` label to have a `review-<label>/SKILL.md`

## Expected Outcome

- `/review-release` executed through every step

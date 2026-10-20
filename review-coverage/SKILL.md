---
name: review-coverage
description: alias → /review-test (review test coverage — gaps, thresholds, untested paths)
argument-hint: "[scope]"
related:
  - review-test
---

## Goal

Alias of `/review-test` — the `coverage` label resolves to the `tests` row, the same dimension `test` owns, so this directory no longer carries its own review

## Scope

Use when a caller still passes `/review-coverage` — this skill is only an alias stub; the real workflow lives in `review-test` (`coverage` is its argument for the coverage-specific pass)

## Execute

Run the full `/review-test` workflow with the `coverage` argument

## Rules

- Don't duplicate the `/review-test` workflow in this file
- If the alias is missing steps → always read `review-test/SKILL.md`
- Keep the directory — `deep-review/scripts/verify-matrix.ts` requires every `improve`/`optimize` label to have a `review-<label>/SKILL.md`

## Expected Outcome

- `/review-test` executed through every step, coverage pass included

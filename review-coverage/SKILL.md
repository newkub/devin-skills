---
name: review-coverage
description: alias → /review-test (review test coverage — gaps, thresholds, untested paths)
argument-hint: "[scope]"
related:
  - review-test
---

## Goal

Alias of `/review-test` — `coverage` is listed on the matrix `tests` row alongside `test`, and untested paths are that row's subject, so this directory carries no review of its own

## Scope

Use when a caller still passes `/review-coverage` — this skill is only a forwarding stub; the real workflow lives in `review-test`

- `coverage` and `test` resolve to the same `tests` row, so forwarding keeps the resolution exact and adds nothing
- the `improve` scopes that reach this label are `coverage` (gap filling) and `tests`; the act of raising coverage itself stays `/update-tests` + `/deep-test coverage`, as the `improve` scope-map states
- no argument of its own — the caller's `<scope>` is forwarded verbatim

## Execute

Run the full `/review-test` workflow with the caller's `<scope>` — coverage thresholds, untested paths, and flaky evidence are its rows, not a second catalog here

## Rules

- Never duplicate the `/review-test` workflow in this file
- If the alias misses steps → always read `review-test/SKILL.md`
- Keep the directory — `deep-review/scripts/verify-matrix.ts` fails the change when a scope-map label has no `review-<label>/SKILL.md`

## Expected Outcome

- `/review-test` executed through every step, with coverage gaps scored and owned by `/improve tests`
- one report via `/report-review`, the same as calling the canonical directly

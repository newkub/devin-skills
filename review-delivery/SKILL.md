---
name: review-delivery
description: alias → /review-release (review the delivery path — release, versioning, changelog)
argument-hint: "[scope]"
related:
  - review-release
---

## Goal

Alias of `/review-release` — `delivery` is a matrix row name in its own right and `review-release` already lists it, so this directory carries no review of its own

## Scope

Use when a caller still passes `/review-delivery` — this skill is only a forwarding stub; the real workflow lives in `review-release`

- stripping `review-` leaves the `delivery` row, which `review-release` lists next to `versioning-changelog` — a superset of what this label promises
- the `optimize` scope that reaches this label is `ci` (pipeline time and cost); the measure-then-improve work itself stays `/optimize ci`
- no argument of its own — the caller's `<scope>` is forwarded verbatim

## Execute

Run the full `/review-release` workflow with the caller's `<scope>` — `delivery` owns end-to-end pipeline health, `versioning-changelog` is the extra row the canonical adds

## Rules

- Never duplicate the `/review-release` workflow in this file
- If the alias misses steps → always read `review-release/SKILL.md`
- Keep the directory — `deep-review/scripts/verify-matrix.ts` fails the change when a scope-map label has no `review-<label>/SKILL.md`

## Expected Outcome

- `/review-release` executed through every step, with release-path findings scored and owned by `/improve delivery`
- one report via `/report-review`, the same as calling the canonical directly

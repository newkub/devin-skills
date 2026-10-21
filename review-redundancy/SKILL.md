---
name: review-redundancy
description: alias → /review-code-quality (review redundancy — duplicate logic, dead code, overlap)
argument-hint: "[scope]"
related:
  - review-code-quality
---

## Goal

Alias of `/review-code-quality` — `redundancy` is listed on the matrix `code-quality` row, where duplicate logic, dead code, and overlap are already checks, so this directory carries no review of its own

## Scope

Use when a caller still passes `/review-redundancy` — this skill is only a forwarding stub; the real workflow lives in `review-code-quality`

- `redundancy` resolves to the `code-quality` row itself, so forwarding keeps every check the label promised
- the `improve` scopes that reach this label are `code-quality` and `consistency`; both also name `review-code-quality`, so a batch run does not double-review
- no argument of its own — the caller's `<scope>` is forwarded verbatim

## Execute

Run the full `/review-code-quality` workflow with the caller's `<scope>` — the duplication and dead-code evidence comes from its step 2 (`/follow-tool-jscpd`, `/follow-tool-knip`), not from a second catalog here

## Rules

- Never duplicate the `/review-code-quality` workflow in this file
- If the alias misses steps → always read `review-code-quality/SKILL.md`
- Keep the directory — `deep-review/scripts/verify-matrix.ts` fails the change when a scope-map label has no `review-<label>/SKILL.md`

## Expected Outcome

- `/review-code-quality` executed through every step, with duplication findings scored and owned by `/improve code-quality`
- one report via `/report-review`, the same as calling the canonical directly

---
name: review-alignment
description: alias → /review-code-quality (review alignment — naming, patterns, layers, docs consistency)
argument-hint: "[scope]"
related:
  - review-code-quality
---

## Goal

Alias of `/review-code-quality` — naming, pattern, layer, and doc consistency are code-quality findings, so this directory carries no review of its own

## Scope

Use when a caller still passes `/review-alignment` — this skill is only a forwarding stub; the real workflow lives in `review-code-quality`

- the `alignment` word sits on the matrix `correctness` row, and `correctness` is one of the six `always` rows `/deep-review` adds to every run — nothing is dropped by forwarding
- the `improve` scope that reaches this label is `consistency`, whose other entries (`review-redundancy`, `review-code-quality`, `review-writing`) stay callable on their own
- no argument of its own — the caller's `<scope>` is forwarded verbatim, exactly like `/review-code-quality`

## Execute

Run the full `/review-code-quality` workflow with the caller's `<scope>` — no extra pass is added here

## Rules

- Never duplicate the `/review-code-quality` workflow in this file
- If the alias misses steps → always read `review-code-quality/SKILL.md`
- Keep the directory — `deep-review/scripts/verify-matrix.ts` fails the change when a scope-map label has no `review-<label>/SKILL.md`

## Expected Outcome

- `/review-code-quality` executed through every step, with the `correctness` always row still covered by `/deep-review`
- one report via `/report-review`, the same as calling the canonical directly

---
name: review-alignment
description: alias → /review-code-quality (review alignment — naming, patterns, layers, docs consistency)
argument-hint: "[scope]"
related:
  - review-code-quality
---

## Goal

Alias of `/review-code-quality` — naming, pattern, layer, and doc consistency are code-quality findings (the `correctness` row already aliases `alignment`), so this directory no longer carries its own review

## Scope

Use when a caller still passes `/review-alignment` — this skill is only an alias stub; the real workflow lives in `review-code-quality`

## Execute

Run the full `/review-code-quality` workflow

## Rules

- Don't duplicate the `/review-code-quality` workflow in this file
- If the alias is missing steps → always read `review-code-quality/SKILL.md`
- Keep the directory — `deep-review/scripts/verify-matrix.ts` requires every `improve`/`optimize` label to have a `review-<label>/SKILL.md`

## Expected Outcome

- `/review-code-quality` executed through every step

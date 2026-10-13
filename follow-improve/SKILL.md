---
name: follow-improve
description: Improvement convention — route via improve-* → deep-review findings → deep-review-then-fix
argument-hint: "[scope]"
related:
  - improve
  - optimize
  - follow-optimize
  - follow-single-of-source
  - deep-review
  - deep-review-then-fix
  - report
---

## Goal

Define the standard way to do improvements — no ad-hoc fixes; every improvement starts from evidence-backed review findings, then goes through the single shared fix path

## Scope

Use when improving any scope — feature, quality, security, performance, docs — by routing to the matching `improve-*` domain skill per the mapping in `references/scope-map.md` (the single SSOT for skill → review domain + ownership boundary), or the `/improve` thin entry when unclear — metric-driven scope belongs to `optimize-*` (`/follow-optimize`)

## References

- `references/scope-map.md` — the SSOT table: every `improve-*` → review domain(s) + ownership/boundary notes — never copy this table into another skill (`/follow-single-of-source`)

## Execute

### 1. Route To Domain

> Goal: Pick the improve-* skill matching the scope

1. Scope matches a domain → look up `references/scope-map.md` and use `improve-{domain}` per the matching row (including the boundary/ownership note of overlapping clusters such as events, stability, data)
   - metric-driven scope → use `optimize-*` instead (for all 18 domains see `follow-optimize/references/scope-map.md`) — the convention lives at `/follow-optimize`
2. Scope unclear → use the `/improve` thin entry and let it dispatch
3. Every `improve-*` is a thin entry → the `/deep-review` domain of the same name — never reimplement review logic yourself

### 2. Review And Confirm

> Goal: Get prioritized findings the user has confirmed

1. Run `/deep-review` on that domain to collect findings + severity + evidence
2. Use `/report` as a prioritized list — let the user choose before starting; never fix immediately

### 3. Fix Via Canonical Path

> Goal: Always fix with the same fixer

1. Run `/deep-review-then-fix` on the confirmed findings — fix the root cause, not the symptom
2. Max 3 fix-loop rounds per finding — if it still fails → stop + report

## Rules

- Every improvement needs a review finding + evidence first — no guess-fixes
- Thin entries must not hold logic of their own — delegate only to the `/deep-review` domain
- Always confirm with the user before fixing, unless the user explicitly asked for auto-fix

## Expected Outcome

- Every improvement goes through one path: domain review → prioritized report → confirm → canonical fix
- No ad-hoc fixes without a supporting finding

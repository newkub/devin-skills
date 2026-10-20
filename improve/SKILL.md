---
name: improve
description: Find what to improve in the scope, then fix every finding via deep-review then-fix
argument-hint: "[scope]"
related:
  - deep-review
  - optimize
  - report-review
  - suggest-next-action
  - ask-me
  - follow-tool-unlighthouse
  - follow-tool-takumi
  - follow-lib-unocss
  - follow-lib-shiki
  - follow-lib-comark
  - follow-tool-knip
  - follow-tool-jscpd
  - follow-tool-gitleaks
  - follow-tool-semgrep
---

## Goal

Answer the question "what can be improved" for the scope the user specifies — a thin entry that forwards to `/deep-review` to collect all findings, then routes them to `/deep-review <scope> then-fix` per domain immediately; it does not review itself and does not fix anything in this skill

## Scope

Use when the user asks what this scope "should improve" without naming a domain — or when former `improve-*` domains were merged here (any scope word can be used as a domain, e.g. `/improve a11y`, `/improve security`)

- `/deep-review` is the sole reviewer — every dimension that matches the scope comes from `references/scope-map.md` (SSOT: scope → review domain + boundary); do not copy the table elsewhere
- If the scope is metric-driven (bundle, latency, cost, cache hit...) → use `/optimize` instead; never fix perf ad-hoc in the improve path
- If you want to fix with per-item confirmation → run `/deep-review <scope> then-fix` directly

### Tools And Libraries

Hints per scope — run the tool for deterministic evidence before judging a finding; not every row is mandatory:

| Scope | Skills |
|-------|--------|
| `a11y`, `form` | `follow-tool-unlighthouse` |
| `seo`, `web` | `follow-tool-unlighthouse`, `follow-tool-takumi` |
| `uxui` | `follow-lib-unocss`, `follow-lib-shiki`, `follow-lib-comark` |
| `code-quality`, `consistency` | `follow-tool-knip`, `follow-tool-jscpd` |
| `security`, `privacy` | `follow-tool-gitleaks`, `follow-tool-semgrep` |

## References

- `references/scope-map.md` — the SSOT table: every scope → review domain(s) + ownership/boundary (merges the single `/follow-improve` that was folded into this skill)

## Execute

### 1. Review

> Goal: get prioritized findings from deep-review

1. Take `scope` from the argument — if absent → use the current project; if unclear → `/ask-me`
2. Look up the scope in `references/scope-map.md` to identify the matching review domain (boundary cluster events/stability/data per the table)
3. Run `/deep-review` on that scope — report via `/report-review`; never scan it again yourself

### 2. Present And Fix

> Goal: fix every finding immediately without waiting for confirmation

1. Show the improvements with the `/report-review` table (No./Finding/Action/Evidence/Severity/Risk/Priority/Owner skill/Status) — `Owner skill` is the fix domain; this entry adds no columns
2. Send each finding to `/deep-review <scope> then-fix fix all` per domain — `fix all` skips the per-finding confirm, the skill still fixes the root cause and loops at most 3 rounds/finding
3. If a metric-driven finding is found → forward it to `/optimize` per `optimize/references/scope-map.md`
4. Run `/suggest-next-action` after everything is fixed

## Rules

- Never review yourself — delegate to `/deep-review` only — a thin entry holds no domain logic
- Every improvement must always start from a review finding + evidence — no guess-fixes
- Fix every finding immediately without waiting for confirmation — that is what `fix all` does in `/deep-review <scope> then-fix fix all`; if the user asked to confirm per finding instead, drop `fix all`
- Every improvement must map to a skill that can actually do it — no owner = report it as residual

## Expected Outcome

- A prioritized improvement list from `/deep-review` with a coverage matrix
- All findings are routed to `/deep-review <scope> then-fix` per domain and either fixed completely or given a reason for not fixing
- Metric-driven findings are forwarded to `/optimize` — never mixed into the improve path

---
name: improve-usage-md
description: Find improvements to USAGE.md — docs promises vs reality, examples actually run — fix immediately
argument-hint: "[scope]"
related:
  - design-usage-with-me-first
  - improve
  - update-usage-md
  - report-usage
  - deep-review
  - report
  - suggest-next-action
  - ask-me
---

## Goal

Answer the question "what should improve in USAGE.md / the usage surface" for the scope the user specifies — collect findings from the `/deep-review` `usage` dimension into a prioritized list, then send them to `/deep-review <scope> then-fix fix all` to fix immediately (thin entry — it does not review itself and does not edit directly in this skill)

## Scope

Use when the user asks what "usage docs should improve" in this scope

- `usage` dimension coverage — usage surface parity (`USAGE.md`/README promises match what the API/CLI/web can actually do), discoverability of commands/API, onboarding friction, broken/outdated examples, public surface with no example at all
- Write/rewrite the whole file → `/update-usage-md`; summarize the surfaces actually used → `/report-usage`; run example verification → `/deep-test usage`
- A finding that needs a new structure/wording/example designed before writing (not yet discussed with the user) → `/design-usage-with-me-first` in chat, then forward to `/update-usage-md`
- Full boundary criteria: `improve/references/scope-map.md` (SSOT)

## Execute

### 1. Review

> Goal: get prioritized findings

1. Take `scope` from the argument — if absent → use the current project; if unclear → `/ask-me`
2. Run `/deep-review` on that scope (dimension `usage`)
3. Collect the findings into a prioritized list with severity and evidence — P0: an example that breaks when run, a docs promise that cannot actually be fulfilled

### 2. Present Findings

> Goal: show the findings before fixing

1. Run `/report` to show the improvements: No., Finding, Severity, Fix Skill
2. Proceed to fix immediately — do not wait for user confirmation

### 3. Fix All Findings

> Goal: fix every finding found

1. Send each finding to `/deep-review <scope> then-fix fix all` (domain `usage` in `deep-review/references/checks.md` `### Domain Map`)
2. For a parity fix (docs promise does not match reality) → verify with `/deep-test usage` after fixing; if a whole section is missing/outdated → `/update-usage-md`
3. Run `/suggest-next-action` after everything is fixed

## Rules

- Never review yourself — delegate to `/deep-review` dimension `usage`
- Fix every finding immediately without waiting for confirmation
- Every improvement must map to a skill that can actually do it
- Never write docs from an assumption — every example must actually run on the project's stack

## Expected Outcome

- A prioritized usage-md improvement list from `/deep-review`
- No confirm gate — fix every finding immediately via `/deep-review <scope> then-fix fix all`
- Every example in `USAGE.md` passes `/deep-test usage` — docs promises equal reality

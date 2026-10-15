---
name: review-issue
description: Review issue areas the user names: find issues, gaps, inconsistencies — fix after confirm
argument-hint: "[areas]"
related:
  - deep-review
  - deep-review-then-fix
  - improve
  - refactor
  - create-plan-in-dot-devin
  - report
  - ask-me
  - suggest-next-action
  - deep-thinking
  - deep-analyze
  - deep-validate
---

## Goal

Focused review of the issue/concern areas the user names (e.g. `uxui rbac navigation routing`, `auth session`, `payment refund`) — find three things: **issues** (wrong behavior/bugs), **gaps** (what should exist but doesn't), **inconsistencies** (the same behavior done differently in different places) — combine into a prioritized list with evidence, then fix after user confirmation

## Scope

- Use when the user clearly points at an "issue area" — not a full codebase review (→ `/deep-review`) and not feature gap analysis (→ `/improve features`)
- Areas are free-form — map each to the nearest `/deep-review` domain; if it can't be mapped, review the source directly
- If the user appends `and fix` to the command → treat it as confirmed; fix every finding without asking again (still report before fixing)

## Execute

### 1. Scope Areas

> Goal: know what is being reviewed

1. Take `areas` from the argument — if missing or unclear → `/ask-me`
2. Map each area to a `/deep-review` domain (e.g. `uxui` → `review-uxui`, `rbac`/`auth` → `review-auth`, `routing`/`navigation` → `review-frontend` + manual route analysis); if unmappable → review the source directly
3. Survey the codebase for each area's surface — related routes, guards, components, stores — before reviewing, so hidden spots aren't missed

### 2. Review Each Area

> Goal: every finding backed by real evidence

Check every area across 3 dimensions:

1. **Issues** — wrong behavior provable from the code (dead action, wrong guard, broken link, silent failure)
2. **Gaps** — capabilities the surface promises but don't exist (a button that does nothing, an empty state with no way to fill it, a permission that is declared but never checked)
3. **Inconsistencies** — the same flow with different behavior (side A validates while side B doesn't; one side refunds on cancel while the other doesn't)

Every finding must have `file:line` evidence — no guessing; never count an intentional mock/stub as a finding unless the UI promises the user it really works

### 3. Present And Confirm

> Goal: prioritized report before any fix

1. Produce a `/report-review` table (chat, no files): `No.`, `Area`, `Type` (issue|gap|inconsistency), `Finding`, `Severity`, `Evidence`, `Fix Skill`
2. If the user didn't append `and fix` → ask which items to fix and wait for confirmation

### 4. Fix Confirmed Items

> Goal: fix only what was confirmed

1. Route each finding to `/deep-review-then-fix` by matching domain — findings that can't be mapped are fixed directly per the evidence; areas with a dedicated entry → use that entry (rbac → `/improve auth`, form → `/improve form`, validation → `/improve data`, tests → `/improve tests`)
2. Large additions → always `/create-plan-in-dot-devin` before implementing
3. After all fixes → always run `/refactor` (step 2, SRP split) on the touched files (≤250 lines, 1 responsibility)
4. Run the project build/lint to verify → `/suggest-next-action`

## Rules

- Every run starts with the deep pre-pass — `/deep-thinking` → `/deep-analyze` → `/deep-validate` before scoping any area (convention: `update-devin-global-skills` `## Conventions → Templates` row `review-*`)
- Delegate to `/deep-review` domains when a mapping exists — review yourself only for areas with no matching domain
- Every finding must have `file:line` evidence — no evidence = no finding
- Don't fix without confirmation — unless the user puts `and fix` in the command
- Intentional demo/mock behavior doesn't count as a finding unless the UI pretends it really works
- Every confirmed addition → always `/create-plan-in-dot-devin` before implementing; never skip

## Expected Outcome

- Prioritized findings per area with complete type, severity, and evidence
- Confirmed findings fixed + verified via build/lint + SRP complete

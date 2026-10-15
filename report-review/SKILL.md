---
name: report-review
description: Report review findings as a chat table (No./Action/Evidence/Severity/Priority/Status), no files
argument-hint: "[scope-or-findings-source]"
related:
  - deep-review-codebase
  - run-review
  - report
  - create-report-in-dot-devin
  - deep-review-codebase-then-fix
  - suggest-next-action
---

## Goal

Report review results as one chat table — every row has an actionable step and real evidence; no report files

## Scope

- The final report of every `review-*`/`deep-review-codebase`/`report-*` — canonical format per `update-devin-global-skills` `## Conventions → Templates` rows `review-*`/`report-*`
- Called standalone with no findings data → collect first with `/deep-review-codebase`
- Files are created only when the user explicitly asks → `/create-report-in-dot-devin`; artifacts per the skill's nature (HTML/slides/diagram/schema file) can still be created via the owner skill

## Execute

1. Collect findings from the source — `review-report.json` (findings table), domain `review-*` results, or the scope the user specified; none → run `/deep-review-codebase` first
2. Dedup key = `file + rule/message-normalized + domain` (merge into the highest severity + the more specific fixSkill), then order by severity → priority (P0→P4 per `deep-review-codebase` `## Domain Pipeline`)
3. Summarize at the report header: score/grade (if any), finding counts per severity, mode (full/diff) + the scope run, confidence
4. Report as one chat table with fixed columns:

   | No. | Action | Evidence | Reason | Severity | Risk | Priority | Owner skill | Status |
   |-----|--------|----------|--------|----------|------|----------|-------------|--------|
   | 1 | Move the secret to an env var | `src/api/x.ts:12` | hardcoded secret in code | 🔴 High | breach | P0 | `/improve security` | ❌ open |

   - `Action` = what must be done (imperative, 1 action per row) — `Evidence` = file:line or real evidence (mandatory on every row, never invented)
   - `Reason` = the rule that failed — `Severity`: 🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low
   - `Owner skill` = the `fixSkill` field — `Priority` includes status new/existing/fixed/regressed (✅ fixed / ❌ open / 🔄 in progress / ⏭️ skipped)
5. Close with the execution order: Foundation → Dependencies → High impact → Critical path (approximate effort per item — not a flat TODO) and the coverage of domains/workspaces run (done/skipped(reason)/failed from the ledger)
6. Run `/suggest-next-action` — findings that must be fixed → `/deep-review-codebase-then-fix`

## Rules

- Chat only — never create `.devin/temp/report/` files unless the user explicitly asks
- Every row must have real evidence (spot-check by reading the referenced file:line for at least 1 item per domain) — no guessing, no vacuous rows
- One table covering every domain — do not split into many redundant tables; group rows by severity→priority
- Too many findings → report the highest-priority list first, then clearly state "remaining skipped (n)"; never silently truncate
- Do not change code in the report step — report only; bind a fixSkill to every action

## Expected Outcome

- A complete table in chat — every row with a real `Action` + `Evidence` + summary + execution order
- Coverage clearly stated — every domain done/skipped/failed
- No report files created (unless the user asks → `/create-report-in-dot-devin`)

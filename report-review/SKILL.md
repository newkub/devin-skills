---
name: report-review
description: Report review findings as one chat table (No./Action/Evidence/Severity/Status)
argument-hint: "[scope-or-findings-source]"
related:
  - deep-review
  - report
  - create-report-to-dot-agents
  - suggest-next-action
---

## Goal

Report review results as chat tables — every row has an actionable step and real evidence; no report files

## Scope

- The final report of every `review-*`/`deep-review`/`report-*` — canonical format per `update-agents-skills-global` `## Conventions → Templates` rows `review-*`/`report-*`
- Called standalone with no findings data → collect first with `/deep-review`
- Files are created only when the user explicitly asks → `/create-report-to-dot-agents`; artifacts per the skill's nature (HTML/slides/diagram/schema file) can still be created via the owner skill

## Execute

1. Collect findings from the source — `review-report.json` (findings table), dimension `review-*` results, or the scope the user specified; none → run `/deep-review` first
2. Dedup key = `file + rule/message-normalized + dimension` (merge into the highest severity + the more specific `fixSkill`), then order by severity → priority: P0 🔴 Critical (fix now, blocks ship) → P1 🟠 High (fix before ship) → P2 🟡 Medium (fix in this cycle) → P3 🟢 Low (nice to have) → P4 informational/hygiene
3. Score at the report header — the SSOT every `review-*` cites instead of restating the formula: severity weights Critical 0, High 25, Medium 50, Low 75, Info 100 → weighted average; grade A ≥90, B ≥80, C ≥70, D ≥60, F <60. Also state finding counts per severity, mode (full/diff) + the scope run, confidence
4. Report one findings table PER dimension (grouped severity→priority inside each) with fixed columns:

   | No. | Finding | Action | Evidence | Severity | Risk | Priority | Owner skill | Status |
   |-----|---------|--------|----------|----------|------|----------|-------------|--------|
   | 1 | Hardcoded secret in code | Move the secret to an env var | `src/api/x.ts:12` | 🔴 High | breach | P1 | `/improve security` | ❌ open |

   - `Finding` = what is wrong, stated with the rule that failed — `Action` = what must be done (imperative, 1 action per row)
   - `Evidence` = file:line or real evidence (mandatory on every row, never invented)
   - `Severity`: 🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low — `Risk` = the blast radius (breach, outage, drift, UX, cost)
   - `Owner skill` = the `fixSkill` field — `Status` = new/existing/fixed/regressed (✅ fixed / ❌ open / 🔄 in progress / ⏭️ skipped)
   - A caller that is a single dimension (e.g. `/review-issues`) renders one table; `/deep-review` renders one table per dispatched dimension
   - When the caller is `/deep-review`, append the `in update-review-cli` (Y/N) column — the analyzer-gap flag from its step 3.6
5. Close with the execution order: Foundation → Dependencies → High impact → Critical path (approximate effort per item — not a flat TODO) and the coverage of dimensions/workspaces run (done/skipped(reason)/failed from the ledger)
6. Run `/suggest-next-action` — findings that must be fixed → `/deep-review <scope> then-fix`

## Rules

- Chat only — never create `.devin/temp/report/` files unless the user explicitly asks
- Every row must have real evidence (spot-check by reading the referenced file:line for at least 1 item per dimension) — no guessing, no vacuous rows
- One table per dispatched dimension, rows grouped severity→priority — never one table per finding, and never redundant near-duplicate tables
- Too many findings → report the highest-priority list first, then clearly state "remaining skipped (n)"; never silently truncate
- Do not change code in the report step — report only; bind a fixSkill to every action

## Expected Outcome

- Complete tables in chat — every row with a real `Finding` + `Action` + `Evidence` + summary + execution order
- Coverage clearly stated — every dimension done/skipped/failed
- No report files created (unless the user asks → `/create-report-to-dot-agents`)

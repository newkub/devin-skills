# Review Findings Report

Source: [review-report.json | review-* dimension output | user-specified scope]
Scope: [scope run + mode: full | diff]
Date: [YYYY-MM-DD]

Score [0-100] — Grade [A|B|C|D|F] — Counts: Critical [n], High [n], Medium [n], Low [n], Info [n] — Confidence [high|medium|low]

## Findings — [dimension name]

| No. | Finding | Action | Evidence | Severity | Risk | Priority | Owner skill | Status |
|---|---|---|---|---|---|---|---|---|
| 1 | `[what is wrong, named with the rule that failed]` | `[one imperative action]` | `[file:line or captured output]` | `[🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low]` | `[breach / outage / drift / UX / cost]` | `[P0–P4]` | `[fixSkill]` | `[✅ fixed / ❌ open / 🔄 in progress / ⏭️ skipped]` |

## Execution Order

1. `[Foundation item]` — approx effort [t]
2. `[High-impact item]` — approx effort [t]

Coverage: [dimension] done | [dimension] skipped (reason) | [dimension] failed

## Fill Rules

- Repeat the `## Findings` table once per dispatched dimension; a single-dimension caller renders one table only.
- `No.` starts at 1 in every table with no gaps; rows grouped severity → priority inside each table.
- `Evidence` is mandatory on every row — spot-check by reading the referenced `file:line` for at least one row per dimension; never invent it.
- `Severity` 🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low drives `Priority`: P0 blocks ship → P4 informational/hygiene.
- `Owner skill` is the finding's `fixSkill` — one action per row; the report step changes no code.
- Caller is `/deep-review` → append the `in update-review-cli` (Y/N) analyzer-gap column after `Status`.
- Too many findings → report the highest-priority list first, then state "remaining skipped (n)"; never silently truncate.

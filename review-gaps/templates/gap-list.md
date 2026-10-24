# Gap list — capability the scope promises but does not deliver

Scope: [area reviewed] · Baseline: `/review-implement-to-production` inventory, each entry re-verified
Order: Critical first; `No.` is the first column

| No. | Finding | Action | Promise Evidence | Absence Evidence | Severity | Risk | Priority | Owner skill | Status | Area | Gap Class |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `[the promised capability that is missing]` | `[fill it, no new stub]` | `[file:line of the claim]` | `[search proving no impl, or the stub location]` | `[Critical/High/Medium/Low]` | `[rank]` | `[rank]` | `[Fill-by skill]` | `[Open/Fixed/Accepted]` | `[module]` | `[one of the 10 gap classes]` |

## Fill Rules

- `Promise Evidence` + `Absence Evidence`: both are required — no promise, no gap; absence proven by search over the real surface, not by not having seen it
- `Gap Class`: one of the ten classes in `### 2` (promised-absent, partial, fake/stub, unwired, declared-unused, missing-state, dead-integration, docs-vs-reality, test, accessibility)
- `Owner skill`: the row's `Fill by`; `Status`: `Open`/`Fixed`/`Accepted`

## Fix Route

- Route each confirmed gap to its `Fill by`: net-new code → `/implement-to-production`; unwired → wire end to end; test gap → `/update-tests` + `/deep-test`; docs gap → `/update-usage-md`
- Domain-matched findings → `/deep-review <scope> then-fix fix all`; multi-file fills → `/create-plan-in-dot-agents` first
- Filling a gap never introduces a new stub, `TODO`, or hardcoded return

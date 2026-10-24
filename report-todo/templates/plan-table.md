# Plan Table

Source: [user request | actions from the calling skill]
Scope: [what the plan covers]
Date: [YYYY-MM-DD]

| No. | Task | How | Why | Before | After | Skills | Dependencies | Verification |
|---|---|---|---|---|---|---|---|---|
| 1 | `[short imperative phrase]` | `[concrete method, command, or change]` | `[reason the task exists]` | `[current state as evidence]` | `[observable end state]` | `[`/first` → `/second`]` | `[No. n or —]` | `[check that proves the row]` |

## Detail Table — only when the main table would exceed 9 columns

| No. | [Overflow Column] |
|---|---|
| 1 | `[value keyed to the main table row]` |

Summary
1. `[task — how — reason — resulting state]`

Start at No. [N]: [row to run first]

## Fill Rules

- Required 7 columns: `No., Task, How, Why, Before, After, Skills`; the only optional columns are `Dependencies` and `Verification`, added when they carry information for this plan.
- Cap the main table at 9 columns; any further overflow moves into the detail table keyed by `No.`.
- `No.` is the first column and counts from 1 with no gaps; one responsibility per row.
- When the plan touches code, read `/refactor` first and make row `No. 1` the baseline `/run-verify` row recording the baseline sha (or clean-tree state); no implementation row precedes it.
- `Before` states real evidence — path, symbol, count, or observed behavior, `TBD` when not yet knowable; `After` says how to tell the row is done; the two never say the same thing.
- `Skills` names skills that exist in run order; a missing one is replaced by the nearest in the same family.
- Use backticks for paths, commands, and skill names; no `**` bold and no emoji in any cell.

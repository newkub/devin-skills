# Session Progress Report

Source: [session summary / git status / todo-roadmap / validation results]
Scope: [what the session covers]
Date: [YYYY-MM-DD]

Progress: [completed] / [total] = [NN%] `[████████░░ NN%]` — trend [↑ improving / ↓ regressing / → stable]

Key findings: [one or two lines: overall state + the single most important blocker or next step]

## Work Items

| No. | Item | Status | Detail | Priority |
|---|---|---|---|---|
| 1 | `[short task / checkpoint name]` | `[✅ done]` | `[evidence: commit / file:line / test result]` | `[P1]` |

## Fill Rules

- `No.` starts at 1 and is continuous; sort rows by status `completed` → `in_progress` → `pending` → `blocker`.
- `Status` ∈ ✅ done, ⚠️ pending, ❌ blocked; mark done only when git has committed and it is verified — never a floating checkmark.
- `Detail` is real evidence (commit, changed file, failing test, or the decision awaited); state `unknown` when it cannot be verified.
- `Priority` orders pending work only; use `—` for completed rows.
- Do not reveal secrets or read unrelated files into `Detail`.

# Findings — general review of the scope across `issues`, `gaps`, and `inconsistencies`

Scope: [scope/area reviewed] · Sources: `/review-issues`, `/review-gaps`, the inconsistency pass
Order: Critical/High first; `No.` is the first column, numbered 1, 2, 3, ...

| No. | Finding | Action | Evidence | Severity | Risk | Priority | Owner skill | Status | Area | Type |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `[one-line statement of the issue/gap/inconsistency]` | `[what to do about it]` | `[file:line]` | `[Critical/High/Medium/Low]` | `[rank]` | `[rank]` | `[skill that runs the fix]` | `[Open/Fixed/Accepted]` | `[module]` | `[issue/gap/inconsistency]` |

## Fill Rules

- `Evidence`: `file:line` or observed output — no evidence, no finding; state uncertainty instead of guessing
- `Type`: `issue` (wrong behavior), `gap` (promised but absent), or `inconsistency` (same thing done differently across siblings)
- `Severity`/`Risk`/`Priority`: scored and graded per `/report-review` step 3, never restated here
- `Owner skill`: the skill that runs the fix; `Status`: `Open`/`Fixed`/`Accepted`

## Fix Route

- Confirmed findings → `/deep-review <scope> then-fix fix all` by matching domain
- Gap fills → through the `/review-gaps` path so no new stub or `TODO` is left behind
- Durable findings → `/update-astgrep-rules` (patterns/API), `/update-dot-agents-project` (conventions)

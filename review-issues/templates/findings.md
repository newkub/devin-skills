# Findings — provably wrong behavior in the scope

Scope: [area reviewed] · Source: [real code read, corroborated by `/run-check`/analyzer]
Order: Critical first; `No.` is the first column

| No. | Finding | Action | Evidence | Severity | Risk | Priority | Owner skill | Status | Area | Issue Class |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `[one-line statement of the wrong behavior]` | `[fix at the cause]` | `[file:line + the mechanism that makes it wrong]` | `[Critical/High/Medium/Low]` | `[rank]` | `[rank]` | `[skill that runs the fix]` | `[Open/Fixed/Accepted]` | `[module]` | `[one of the 10 issue classes]` |

## Fill Rules

- `Evidence`: `file:line` plus the provable reason and the input that triggers it — no evidence, no finding; read real code, never infer from file names or docs
- `Issue Class`: one of the ten catalog classes in `### 2` (dead action, wrong guard, silent failure, logic/type error, async misuse, leak, race, contract mismatch, stale state, config drift)
- `Severity`: `Critical` (data loss/security/outage) → `High` (wrong user-visible) → `Medium` (edge) → `Low` (noise); `Owner skill`: runs the fix; `Status`: `Open`/`Fixed`/`Accepted`

## Fix Route

- Route each confirmed finding to `/deep-review <scope> then-fix fix all` by matching domain; unmappable findings fixed directly from the evidence
- Fix the cause, never suppress the symptom (no ignore comments, widened types, or hiding try/catch)
- Structural additions → `/create-plan-in-dot-agents` before implementing; after fixes → `/refactor` (SRP) on touched files

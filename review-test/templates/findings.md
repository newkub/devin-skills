# Findings — the `test` dimension (tests, test-data-hygiene) of the scope

Scope: [artifact reviewed] · Rows: `tests`, `test-data-hygiene` (+ `always` tier from `/deep-review`)
Order: Critical first; `No.` is the first column

| No. | Finding | Action | Evidence | Severity | Risk | Priority | Owner skill | Status |
|---|---|---|---|---|---|---|---|---|
| 1 | `[untested main path / coverage theater / PII in fixture / flaky path]` | `[route to the test owner]` | `[file:line or coverage/flake result]` | `[Critical/High/Medium/Low]` | `[rank]` | `[rank]` | `/improve tests` | `[Open/Fixed/Accepted]` |

## Fill Rules

- `Evidence`: `file:line` or a coverage/flake result — a claim without evidence is dropped; cross-checked in the real file via `/deep-test`/`/check-flaky-tests`/PII grep
- `Severity`: the row's `Default severity` plus its stated upgrade/downgrade trigger; a row skipped only under its `N/A condition`, quoted as the reason
- `Owner skill`: `/improve tests`; `Status`: `Open`/`Fixed`/`Accepted`

## Fix Route

- Fixes are out of scope here — the owner route is `/improve tests`, applied only after confirmation via `/deep-review <scope> then-fix`
- Analyzer slice or rule-pack gap → `/update-review-cli`; never patch analyzer logic in this skill

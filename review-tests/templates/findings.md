# Findings — test-suite confidence in the scope

Scope: [package/workspace/app/diff reviewed] · Baseline: [pass/duration/coverage before]
Order: `false-green` → `gap` (money/auth/data) → `flaky` → `brittle` → `slow` → `hygiene` → `dead`

| No. | Finding | Action | Evidence | Severity | Risk | Priority | Owner skill | Status |
|---|---|---|---|---|---|---|---|---|
| 1 | `[class: false-green/gap/flaky/brittle/slow/hygiene/dead — one-line finding]` | `[fix through the test owners]` | `[spec file:line + run result / re-run inversion / assertion that cannot fail]` | `[Critical/High/Medium/Low]` | `[rank]` | `[rank]` | `[skill that runs the fix]` | `[Open/Fixed/Accepted]` |

## Fill Rules

- `Evidence`: a failing run, a re-run inversion, or an assertion proven unable to fail — a coverage number alone is not a finding
- `Finding`: prefix the class; one missing fixture cleanup explaining several flaky specs → one item listing every affected spec
- `Owner skill`: `/update-tests` (specs) or `/improve tests` (suite health); `Status`: `Open`/`Fixed`/`Accepted`/`Quarantined`

## Fix Route

- Hand the confirmed set to `/update-tests`; suite-level health (speed, structure, fixtures, mutation) → `/improve tests`; browser flows → `/deep-test e2e`, coverage floors → `/deep-test coverage`
- A flaky spec is quarantined with owner + expiry via `/check-flaky-tests` before it is fixed; a failing spec caused by a real bug → route to the code owner, keep the failure as evidence
- Never weaken or delete a failing assertion to make the suite green

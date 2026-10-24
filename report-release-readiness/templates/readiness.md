# Release Readiness Report

Source: [git state + version check + quality gates + release artifacts run this session]
Scope: [version-or-tag] — branch: [name]
Date: [YYYY-MM-DD]

Verdict: [ready / ready-with-warnings / blocked]

## Checks

| No. | Check | Status | Detail | Blocker |
|---|---|---|---|---|
| 1 | `[Git state: no uncommitted changes]` | `[pass]` | `[real result: command / file read]` | `[—]` |

Fix before release: [list of blocker rows, or "none"]

## Fill Rules

- `No.` starts at 1, continuous; one row per check across every dimension (git, version, tests/build/lint/typecheck/audit, changelog, migrations, docs, breaking changes).
- `Status` ∈ pass / fail / unknown / skipped — never assume pass; unverifiable items say `unknown`.
- `Detail` is the real result from running or reading a file — no floating checkmarks.
- `Blocker` names the concrete fix path for a failing check; use `—` when the row does not block release.
- `skipped` requires a reason in `Detail` (e.g. no DB → migrations not applicable).
- Verdict is `blocked` if any blocker row exists; `ready-with-warnings` only when no row is a blocker.

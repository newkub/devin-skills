# Usage Report

Source: [call-site scan / USAGE.md / devin_session_search + billing tags]
Scope: [code | usage-md | devin]
Date: [YYYY-MM-DD]

## Code Usage — APIs, functions, classes, skills, dependencies

| No. | Target | Consumers | Frequency | Version | Evidence | Status |
|---|---|---|---|---|---|---|
| 1 | `[symbol or package]` | `[files or workspaces using it]` | `[count + counting method]` | `[declared version]` | `[file:line or API response]` | `[in use / unused / overused / deprecated]` |

## USAGE.md Coverage

| No. | Section | Status | Evidence |
|---|---|---|---|
| 1 | `[Installation / Quick Start / Usage / Examples / Configuration / CLI / API / Troubleshooting]` | `[present / missing / stale]` | `[file:line, or the searched path when missing]` |

## Devin Session Usage

| No. | Period/Tag | Sessions | Success % | Top Task Type | Note |
|---|---|---|---|---|---|
| 1 | `[day / week / billing tag]` | `[count]` | `[n% with success/failure/stopped split]` | `[recurring task pattern]` | `[waste signal or automation candidate]` |

## Fill Rules

- Render only the table for the chosen scope; `No.` is first and starts at 1.
- Every metric carries a source — file path, line number, or API response — and `Frequency`/`Sessions` states the counting method used.
- `Evidence` for a missing `USAGE.md` records `missing` with the paths searched.
- Never expose sensitive data or secrets in any cell; the report changes no code, session, or billing config.
- Close with the `/report-review` findings table (No./Action/Evidence/Severity/Risk/Priority/Owner skill/Status) for gaps and unused or deprecated items, then `/suggest-next-action`.

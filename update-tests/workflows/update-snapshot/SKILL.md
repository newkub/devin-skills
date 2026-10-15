---
name: update-tests-update-snapshot
description: Update test snapshots (inline, file, visual) after output changes intentionally — review every snapshot diff before accepting, never blind-update
related:
  - update-tests
---

## Goal

Update test snapshots (inline, file, visual) after output changes intentionally — review every snapshot diff before accepting, never blind-update

## Scope

- Use when output/markup/serialization changes cause snapshot tests to fail
- Covers: serializer snapshots (Vitest/Jest), component snapshots, visual snapshots
- General unit tests → `workflows/update-unit/SKILL.md`; e2e → `workflows/update-e2e/SKILL.md`

## Execute

### 1. Collect Snapshot Failures

> Goal: Know which snapshots fail and why

1. Run `/run-test` — collect all snapshot mismatches
2. Map each mismatch to a code change — intended change vs unintended regression
3. Distinguish clearly: outdated snapshot (can accept) vs genuinely broken output (fix code separately)

### 2. Review Diffs Before Accept

> Goal: Accept only the intended changes

1. Read the diff of every snapshot about to be updated — file by file, never mass-accept
2. Verify the diff matches only the intended change — keys added/missing, ordering, whitespace, non-deterministic ids/timestamps
3. If the diff has non-deterministic values → fix the test to serialize stably (mock time/ids) before re-snapshotting

### 3. Regenerate

> Goal: New snapshots are clean and deterministic

1. Regenerate with the update flag of the runner the project uses (e.g. `vitest -u`, `jest -u`) — only for the reviewed scope
2. Visual snapshots → update via `/run-test visual`, then review the image diffs one by one
3. Delete orphan snapshot files (test deleted but snapshot left behind)

### 4. Verify

> Goal: The suite is green and snapshots are stable

1. `/run-test` passes, then re-run 2-3 times — snapshots must match the original every time
2. git diff the snapshot files — exactly what was reviewed, no extra changes
3. `/report-before-after` — snapshots updated/removed, intended changes confirmed

## Rules

- Never blind `-u` the whole suite — review every snapshot diff before accepting
- Snapshots must be deterministic — no timestamps, random ids, env-dependent values
- Never accept a diff that doesn't match the intended change — flag it as a regression separately
- A snapshot too large to review → recommend splitting into assertions instead, in the report
- Fix-verify loop up to 3 rounds → if it still fails, stop and report

## Expected Outcome

- Snapshots match the new intended output — no unintended diffs slipped in
- The suite passes deterministically, with no orphan snapshot files
- The report summarizes the snapshots accepted/deleted along with regressions flagged

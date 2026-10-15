---
name: report-release-readiness
description: Report readiness before release — tests, changelog, version, migrations, and deploy readiness
argument-hint: "[version-or-tag]"
related:
  - follow-release
  - deep-review-codebase
  - run-test
  - check-uncommit
  - check-unpush
  - report
  - run-release
---

## Goal

Report the release readiness state completely — tests passing, version/changelog aligned, migrations ready, git state clean — as a single go/no-go checklist

## Scope

- Use before `tag`/`release`/`deploy` — an automatic checklist instead of manual checks
- Covers: git state, version consistency, tests, build, changelog, migrations, security checks, deploy prerequisites
- Read-only: report readiness — do not fix or release yourself

## Execute

### 1. Git State

> Goal: the repo is ready to release

1. Run `/check-uncommit` — no uncommitted changes
2. Run `/check-unpush` — all local commits pushed
3. Verify the correct branch (release from the main/release branch per convention) and that it is up-to-date with the remote

### 2. Version Consistency

> Goal: the version matches everywhere

1. Run `/deep-review-codebase` — manifest version vs latest tag vs changelog
2. Verify the version bump is appropriate (semver per the actual changes)
3. Flag pre-release versions if a stable release is intended

### 3. Quality Gates

> Goal: full verification before release

1. `/run-test all` — everything passes, no lingering skipped/failed tests
2. `/run-build` — the production build succeeds
3. `/run-lint` + `/run-typecheck` — clean
4. `/run-audit` — no critical vulnerabilities

### 4. Release Artifacts

> Goal: documents and data are ready

1. The changelog has an entry for this version — use `/report` to check completeness
2. Run `/deep-review-codebase` — pending migrations with a clear deploy order
3. Docs/readme match the release if there are user-facing changes
4. Breaking changes are documented

### 5. Report Verdict

> Goal: go/no-go with blockers

1. Use `/report` with columns: `No.`, `Check`, `Status`, `Detail`, `Blocker`
2. Verdict: `ready` / `ready-with-warnings` / `blocked` with the list of things to fix
3. Recommend next steps: `/follow-release`, `/run-release` when ready

## Rules

### 1. Evidence-Based

- Every check has a real result from running/reading files — no floating checkmarks
- If something cannot be verified → state `unknown`, never assume pass

### 2. Read-Only

- Do not fix findings and do not release — report only
- Blockers must state a clear fix path

### 3. Project Aware

- Non-applicable checks (no DB → skip migrations) are skipped with a reason
- Use the release process the project defines (`.github`, `AGENTS.md`) if present

- Final report via `/report-review` — one chat table (No./Action/Evidence/Severity/Risk/Priority/Owner skill/Status), no report files

## Expected Outcome

- A readiness checklist covering every dimension with real results
- A clear verdict + actionable blockers
- Confidence the release misses no step

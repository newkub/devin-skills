---
name: report-health-repo
description: Build a per-repo health scorecard — hygiene, deps, CI, activity, and risks in one table
argument-hint: "[repo-or-all]"
related:
  - resolve-errors
  - git-file-history
  - list-dependencies
  - run-audit
  - check-uncommit
  - report
  - report-progress
  - suggest-next-action
  - apply

---

## Goal

Build a health scorecard of a repository — combining signals from multiple checks (hygiene, dependencies, CI, activity, security) into a single score/grade comparable across repos

## Scope

- Composite read-only: call existing check/list skills and aggregate them into a scorecard
- Covers: repo essentials, dependency health, CI status, commit activity, security signals, open issues/PRs
- Use on a single repo or sweep all repos (e.g. in drive D)

## Execute

### 1. Collect Signals

> Goal: Collect the health signals per repo

1. Hygiene: check repo essentials — LICENSE, README, SECURITY.md, CODEOWNERS, `.github/` templates
2. Dependencies: `/list-dependencies` + `/run-audit` — outdated/vulnerable counts
3. CI: `/resolve-github-actions-fails` — latest run status, failure rate
4. Activity: `/git-file-history find` — last commit, commit frequency, staleness
5. Working state: `/check-uncommit` — dirty working tree?

### 2. Score Dimensions

> Goal: Score each dimension

| Dimension | Weight | Signal |
|---|---|---|
| Hygiene | 20% | essential files complete |
| Dependencies | 20% | vulns + outdated % |
| CI Health | 20% | latest status + fail rate |
| Activity | 15% | recency + consistency |
| Security | 15% | secrets leak, audit, branch protection |
| Cleanliness | 10% | uncommitted work, stale branches |

3. Score 0-100 per dimension → overall grade A-F

### 3. Report Scorecard

> Goal: Table comparable across repos

1. Run `/report table` with columns: `No.`, `Repo`, `Hygiene`, `Deps`, `CI`, `Activity`, `Security`, `Clean`, `Grade`
2. Use status symbols: `✅ pass`, `⚠️ warning`, `❌ fail`, `ℹ️ n/a`
3. Per-repo detail: top issues dragging the score down
4. Summary: repos needing attention, ordered by grade
5. If there are multiple repos/rounds, run `/report-progress`

### 4. Recommend

> Goal: Actions per repo

1. Identify quick wins per repo (e.g. add LICENSE, enable CI, delete stale branches)
2. Flag repos that should be archived or revived
3. Link to related skills: `/deep-review`
4. If multiple fixes must be applied safely → recommend `/apply` mode `validate`
5. Run `/suggest-next-action`

## Rules

### 1. Evidence-Based

- Every score backed by a real signal — no scoring on feeling
- If a signal is absent (no CI) → `n/a`, not 0

### 2. Comparable

- Same scoring rubric for every repo — comparable across repos
- Weights stated clearly and adjustable

### 3. Read-Only

- Change nothing — report + recommend only
- Do not run heavy checks (big audit) unless needed for the scorecard
- Use /resolve-errors if needed


- Final report via `/report-review` — one chat table (No./Action/Evidence/Severity/Risk/Priority/Owner skill/Status), no report files

## Expected Outcome

- Per-repo scorecard with comparable grades
- Top issues and quick wins per repo
- Overall picture of which repos need attention

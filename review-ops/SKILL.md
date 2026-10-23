---
name: review-ops
description: Review deps, CI, cloud and delivery for operational risk, then fix findings
argument-hint: "[scope] [--diff] [then-fix] [fix all|follow-your-suggestion]"
related:
  - deep-review
  - deep-review-codebase-everything
  - deep-thinking
  - improve
  - optimize
  - update-version-to-latest
  - follow-tool-github-actions
  - follow-service-cloudflare
  - check-deployment-fails
  - follow-tool-mise
  - report-review
  - use-subagents
  - suggest-next-action
  - ask-me
---

## Goal

Review the operational surface of a scope — dependencies, build, CI/CD, cloud resources, observability, and delivery — confirm each risk against real configuration or output, then drive the fixes through the owning skills

## Scope

Use before a release, after a failed deploy, or when the runtime or supply chain moved — a repository, workspace, pipeline, or deployed environment

- Entered through `/deep-review` with the `ops` signal or called by name; scope and flags are passed through as given
- This preset seeds exactly its labels from `deep-review-codebase-everything/references/presets.md` (`## Preset Map`): dependencies, dependency-health, runtime-eol, lib-usage, ci-cd, iac-cloud-config, infra-drift, observability, delivery, runbook-oncall, slo-error-budget, cost, containers, dns-certificate, versioning-changelog, build-reproducibility. The matrix row `Check` stays the proof — this skill never restates a check
- Siblings: a dependency vulnerability that is exploitable in code → `review-security`; a slow pipeline that is a test-suite problem → `review-tests`; schema or data movement → `review-data`
- Proof tools: the manifests and lockfiles, `/follow-tool-github-actions` for workflow hardening, `/check-deployment-fails` for real CI history, `/follow-service-cloudflare` for the deployed target, and `/follow-tool-mise` for pinned runtimes
- Without `then-fix` the run is report-only: confirmed risks with evidence and a fix sequence

## Execute

### 1. Think

> Goal: map what runs the product and what could take it down

1. Run `/deep-thinking` on the scope — enumerate the build, test, deploy, and runtime path, every external dependency, and the failure that would page someone
2. Read `references/presets.md` (`## Preset Map`) for this door's labels, then let the engine's `/deep-thinking` decide which rows apply; a row with no pipeline or cloud surface is skipped only under its `N/A condition`
3. Compare the declared operational promises (SLO, runbook, rollback, cadence) with what the repository and CI actually implement

### 2. Scan

> Goal: one evidence pass against real manifests and pipeline output

1. Run `/deep-review-codebase-everything` on the scope with the labels above, passing `--diff` when diff-scoped — read its report, do not rerun the analyzer
2. Run the capture tools the rows name — dependency audit and outdated checks, workflow linting, `/check-deployment-fails` for failure history, an IaC plan or drift check when infrastructure is in scope
3. Record versions, pins, and the supported-window evidence; an unpinned action or an EOL runtime is proven by the file, not by memory

### 3. Confirm

> Goal: only risks with a real failure path

1. Every finding cites the manifest, workflow, IaC file, or captured CI output and the path it affects
2. Assign severity from the matrix `Default severity` and its upgrade/downgrade trigger only; a stale-but-supported pin is not the same as an EOL runtime
3. Separate a maintenance preference from an operational risk — cosmetic version bumps are not findings

### 4. Order The Fix

> Goal: restore the delivery path first, then reduce long-term risk

1. Order: secret and permission exposure in CI → broken or unverifiable delivery → EOL runtime and vulnerable dependency → drift between IaC and live → observability and runbook gaps → cost and hygiene
2. Cross-reference: one unpinned action or one shared workflow often explains several findings — fix it once and re-check every workflow it touches
3. Large or cross-workspace set → `/create-plan-in-dot-agents`; without `then-fix` stop here with the ordered table

### 5. Fix Through The Owners

> Goal: each fix is applied by the skill that owns that surface

1. Confirm the fix list with `/ask-me` — per finding, `/follow-your-suggestion`, or `fix all`; `dont-ask-me`/`/ship` follows the report as-is
2. Dispatch through `/improve deps`, `/improve platform`, `/improve delivery`, `/optimize ci`, and `/update-version-to-latest` — one surface at a time, minimal diff
3. CI/CD and infrastructure changes are shared-state changes — show the diff and get confirmation before applying, and never disable a gate to make a pipeline pass
4. Independent surfaces → parallel workers via `/use-subagents`; an error mid-fix → `/resolve-errors`

### 6. Verify

> Goal: the pipeline and runtime are proven healthy again

1. Re-run the workflow, audit, or drift check that produced each finding
2. Re-review touched files with `--diff` through the engine — remaining items are `blocked` with a reason
3. Run `/deep-validate` on touched files and the project's `/run-check`

### 7. Report

> Goal: operational risk is visible before and after

1. Run `/report-review`: findings per matrix row with severity, fix status, and verification result
2. Name anything accepted as risk (linked issue plus expiry) and anything blocked
3. Close with `/suggest-next-action`

## Rules

- Evidence first — every finding cites the manifest, workflow, IaC file, or CI output
- Severity comes from the row, never from intuition; moving off the default needs the cited trigger
- Report-only unless `then-fix`; only the confirmed set is changed, and each change is verified before the next
- Shared-state changes (CI, cloud, DNS, deploy) need explicit confirmation and a rollback path
- Never weaken a gate, skip a check, or widen a permission to make a finding disappear
- Use `/use-subagents` if needed — independent pipelines or workspaces reviewed in parallel with disjoint file sets
- Never commit or push unless asked

## Expected Outcome

- Every in-scope row is `done`/`covered-capture`/`covered-manual`/skipped-by-`N/A condition` in the engine ledger, proven by its coverage matrix
- Dependencies, runtime pins, workflows, and cloud resources match what the product needs, with the evidence cited
- Each confirmed finding has a fix and a verification result, and shared-state changes were confirmed
- Without `then-fix`: a prioritized fix sequence and no edits

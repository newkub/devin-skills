---
name: review-security
description: Review attack surface, auth, secrets and tenant isolation, then fix by severity
argument-hint: "[scope] [--diff] [then-fix] [fix all|follow-your-suggestion]"
related:
  - deep-review
  - deep-review-codebase-everything
  - deep-thinking
  - improve
  - run-audit
  - check-secrets
  - follow-tool-semgrep
  - follow-tool-gitleaks
  - scan-security
  - report-review
  - use-subagents
  - suggest-next-action
  - ask-me
  - review-ops
---

## Goal

Review a scope over the security rows of the dimension matrix, confirm each finding with evidence, then drive the fixes through the owning skills until the exposure is closed

## Scope

Use before a release, after an auth or data change, or when a trust boundary moved — a path, workspace, diff, whole repository, or deployed surface

- Entered through `/deep-review` with the `security` signal or called by name; scope and flags are passed through as given
- This preset seeds exactly its labels from `deep-review-codebase-everything/references/presets.md` (`## Preset Map`): security, injection, ssrf-open-redirect, path-traversal, prototype-pollution, untrusted-deserialization, redos, auth, authz-policy, tenant-isolation, csrf, cors, password-storage, oauth-flow, secret-lifecycle, secrets-in-artifacts, crypto-hygiene, http-headers-csp, uploads, llm-security, privacy, mass-assignment, xxe. The matrix row `Check` stays the proof — this skill never restates a check
- Siblings: ordinary logic errors outside a trust boundary → `/deep-review-codebase-everything`; dependency, CI, and cloud hardening → `review-ops`; runtime probing of a live target → `/run-audit` or `/scan-security`
- Fix owners: `/improve security`, `/improve auth`, `/improve privacy`; secrets hygiene runs through `/check-secrets`, `/follow-tool-semgrep`, and `/follow-tool-gitleaks`
- Without `then-fix` the run is report-only: confirmed findings with severity, evidence, and a fix sequence

## Execute

### 1. Think

> Goal: know which trust boundaries the scope actually has

1. Run `/deep-thinking` on the scope — enumerate entry points (HTTP route, webhook, upload, job, CLI), who can call each one, what it reaches, and which credentials exist
2. Read `references/presets.md` (`## Preset Map`) for this door's labels, then let the engine's `/deep-thinking` decide which rows apply; a row with no matching artifact is skipped only under its `N/A condition`
3. Map the declared model (tenant scope, roles, session, secrets) against the code that enforces it — a documented control with no enforcing code is a finding

### 2. Scan

> Goal: one evidence pass, no second scanner

1. Run `/deep-review-codebase-everything` on the scope with the labels above, passing `--diff` when diff-scoped — read its report, do not rerun the analyzer
2. Run `/check-secrets` plus the applicable static tools (`/follow-tool-semgrep`, `/follow-tool-gitleaks`) for rows that need capture; the engine owns the ledger
3. A row with no CLI slice goes through the engine's `capture`/`manual` route; never invent a finding its `Check` cannot prove

### 3. Confirm

> Goal: no false positives and no severity inflation

1. Every finding states the sink or control, the reachable path, and the `file:line` or captured output
2. Assign severity from the matrix `Default severity` and its upgrade/downgrade trigger only
3. Reject a finding the code does not prove, with the reason; a reachable sink with no attacker path is downgraded, not dropped silently

### 4. Order The Fix

> Goal: close the widest exposure first

1. Order: secret removal and credential rotation → auth/authz bypass → injection and deserialization → tenant isolation and data exposure → transport and headers → defense in depth
2. Cross-reference: one missing guard often explains several findings — fix the guard once and re-run every rule it covers
3. Large or cross-workspace set → `/create-plan-in-dot-agents`; without `then-fix` stop here with the ordered table

### 5. Fix Through The Owners

> Goal: each finding is fixed by the skill that owns the domain

1. Confirm the fix list with `/ask-me` — per finding, `/follow-your-suggestion`, or `fix all`; `dont-ask-me`/`/ship` follows the report as-is
2. Dispatch through `/improve security`, `/improve auth`, and `/improve privacy` — one file or small batch at a time, minimal diff, behavior preserved except the intended control
3. Never weaken a control, disable a rule, or delete a test to make a finding disappear; a false positive is rejected with evidence
4. Independent trust boundaries → parallel workers via `/use-subagents`; an error mid-fix → `/resolve-errors`, never a half-applied state

### 6. Verify

> Goal: the same instrument that found the issue confirms it is gone

1. Re-run the specific rule, secret scan, or authz test that produced each finding
2. Re-review the touched files with `--diff` through the engine — remaining items are `blocked` with a reason
3. Run `/deep-validate` on touched files and the project's `/run-check`

### 7. Report

> Goal: exposure is visible before and after

1. Run `/report-review`: findings per matrix row with severity, fix status, and verification result
2. Name anything accepted as risk (linked issue plus expiry) and anything blocked
3. Close with `/suggest-next-action`

## Rules

- Evidence first — every finding cites `file:line` or captured output and the matrix `Check` it answers
- Severity comes from the row, never from intuition; moving off the default needs the cited trigger
- Report-only unless `then-fix`; only the confirmed set is fixed, and each batch is verified before the next
- No security theater — a control nobody enforces is reported as missing, not assumed
- Use `/use-subagents` if needed — independent boundaries reviewed in parallel with disjoint file sets
- Confirm through `/ask-me`, follow the report with `/follow-your-suggestion`, or `fix all`; `dont-ask-me`/`/ship` skips the gate
- Never touch files outside the confirmed set; never commit or push unless asked

## Expected Outcome

- Every in-scope row is `done`/`covered-capture`/`covered-manual`/skipped-by-`N/A condition` in the engine ledger, proven by its coverage matrix
- Confirmed findings carry matrix severity, evidence, and a before → after fix
- Secrets, injection sinks, and authz paths checked with real tools, not guessed
- Without `then-fix`: a prioritized fix sequence and no edits

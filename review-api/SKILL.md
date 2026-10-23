---
name: review-api
description: Review API contracts, webhooks and idempotency, then fix confirmed findings
argument-hint: "[scope] [--diff] [then-fix] [fix all|follow-your-suggestion]"
related:
  - deep-review
  - deep-review-codebase-everything
  - deep-thinking
  - improve
  - follow-tool-scalar
  - follow-tool-hurl
  - follow-tool-bruno
  - report-review
  - use-subagents
  - suggest-next-action
  - ask-me
  - review-security
---

## Goal

Review a scope over the API and integration rows of the dimension matrix, prove each contract risk against the published surface or a live call, then drive the fixes through the owning skills

## Scope

Use when an endpoint, schema, webhook, or client integration changes, or before a breaking release — a route set, service, SDK, or API specification

- On-demand preset: entered through `/deep-review` with the `api` signal or called by name; scope and flags are passed through as given
- This preset seeds exactly its labels from `deep-review-codebase-everything/references/presets.md` (`## Preset Map`): api, contract-compat, graphql-oas-surface, pagination-correctness, idempotency, inbound-webhooks, webhook-lifecycle, api-deprecation-policy, input-limits, mass-assignment, error-handling. The matrix row `Check` stays the proof — this skill never restates a check
- Siblings: auth and secrets behind an endpoint → `review-security`; response-time budgets → `review-performance`; ordinary logic errors → `/deep-review-codebase-everything`
- Proof tools: the published spec and handlers, `/follow-tool-scalar` for the rendered API surface, and `/follow-tool-hurl` or `/follow-tool-bruno` for replayable requests that show the real status, body, and headers
- Without `then-fix` the run is report-only: confirmed contract findings with evidence and a fix sequence

## Execute

### 1. Think

> Goal: know who calls what and what they are promised

1. Run `/deep-thinking` on the scope — enumerate public endpoints, consumers, versioning, and the promises in the spec, docs, or SDK
2. Read `references/presets.md` (`## Preset Map`) for this door's labels, then let the engine's `/deep-thinking` decide which rows apply; a row with no API surface is skipped only under its `N/A condition`
3. Compare the spec, the handler, and a real response — a field, status, or error shape that exists in only one of the three is a finding

### 2. Scan

> Goal: one evidence pass against the real surface

1. Run `/deep-review-codebase-everything` on the scope with the labels above, passing `--diff` when diff-scoped — read its report, do not rerun the analyzer
2. Run the capture route for contract rows — render the spec with `/follow-tool-scalar`, replay representative requests with `/follow-tool-hurl` or `/follow-tool-bruno`, and capture the actual responses
3. Record the consumer side when it is in scope — an SDK or client that still sends a removed field is part of the same finding

### 3. Confirm

> Goal: only breaks a consumer can actually hit

1. Every finding cites the endpoint, spec or handler `file:line`, and the request/response that proves the mismatch
2. Assign severity from the matrix `Default severity` and its upgrade/downgrade trigger only; an internal-only endpoint is downgraded with the reason
3. Separate a contract break from a taste preference — naming or formatting opinions are not findings

### 4. Order The Fix

> Goal: stop active breaks before improving the surface

1. Order: active consumer break → idempotency and webhook duplication → mass-assignment and input limits → pagination correctness → deprecation policy and lifecycle → error-shape consistency
2. Cross-reference: one missing validation boundary often explains several mass-assignment and input-limit findings — fix it once and re-run every request it covers
3. Large or cross-workspace set → `/create-plan-in-dot-agents`; without `then-fix` stop here with the ordered table

### 5. Fix Through The Owners

> Goal: every change keeps the published promise or versions it

1. Confirm the fix list with `/ask-me` — per finding, `/follow-your-suggestion`, or `fix all`; `dont-ask-me`/`/ship` follows the report as-is
2. Dispatch through `/improve api`, `/improve events`, and `/improve auth` — one contract at a time, with the spec, handler, and client updated together
3. A breaking change ships behind a new version or a documented deprecation window; never silently change the shape of a live endpoint
4. Independent endpoints → parallel workers via `/use-subagents`; an error mid-fix → `/resolve-errors`

### 6. Verify

> Goal: the replayed request matches the documented promise

1. Replay the same request that proved the finding and compare status, body, and headers
2. Re-render the spec and cross-check every field the change touched
3. Re-review touched files with `--diff` through the engine and run `/deep-validate` plus the project's `/run-check`

### 7. Report

> Goal: contract state is visible before and after

1. Run `/report-review`: findings per matrix row with severity, fix status, and the replayed proof
2. State each breaking change, its deprecation window, and anything accepted or blocked
3. Close with `/suggest-next-action`

## Rules

- Evidence first — every finding cites the endpoint, spec or handler, and a replayed request or response sample
- Severity comes from the row, never from intuition; moving off the default needs the cited trigger
- Report-only unless `then-fix`; only the confirmed set is changed, and each change is verified before the next
- No silent breaking change — version it or deprecate it with a window, and never remove a field a live client still reads
- Use `/use-subagents` if needed — independent endpoint groups reviewed in parallel with disjoint file sets
- Never touch files outside the confirmed set; never commit or push unless asked

## Expected Outcome

- Every in-scope row is `done`/`covered-capture`/`covered-manual`/skipped-by-`N/A condition` in the engine ledger, proven by its coverage matrix
- Spec, handler, and real response agree after the fix, and every break has a versioned or deprecation path
- Each confirmed finding has a replayed proof and a verification result
- Without `then-fix`: a prioritized fix sequence and no edits

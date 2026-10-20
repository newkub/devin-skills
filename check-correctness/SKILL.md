---
name: check-correctness
description: Check anything is correct against its spec — claims, code, types, config, data, tests; route fixes
argument-hint: "[target]"
related:
  - check-reference
  - check-types-definition
  - check-code-structure
  - check-secrets
  - review-issues
  - deep-test
  - deep-review
  - deep-validate
  - follow-tool-data-validation
  - run-check
  - use-subagents
  - report-review
  - update-tests
  - ask-me
  - suggest-next-action

---

## Goal

Answer one general question — `is this actually correct?` — for any artifact by comparing it against its authority (spec/requirement/contract/standard), with `file:line` evidence and a fix route; this skill owns the method, the per-artifact workflow stays with the domain owner

## Scope

Use for any correctness question when the artifact type is not yet decided, or when several artifact types must be checked in one pass. Route by artifact type:

| Artifact | The correctness question | Owner workflow |
|---|---|---|
| Doc claim (README/USAGE/docs statement, link) | does the doc state what is really true | `/check-reference` |
| Test assertion | would this test fail if the implementation were wrong | `/deep-test test-correctness` |
| Code behavior | provably wrong behavior against the requirement | `/review-issues` (+ `/deep-review`) |
| Type/API/config surface | name, type, options, default correct | `/check-types-definition` |
| Data/schema values | payload, row, config file matches the schema | `/follow-tool-data-validation` |
| Structure/metrics | SRP, size, cohesion against the repo rules | `/check-code-structure`, `/run-check` |
| Secrets/env | present, non-leaked, sourced correctly | `/check-secrets` |

- Not a correctness question → route elsewhere directly: strategy/quality → `/deep-review`, validation gate before applying → `/deep-validate`, "not implemented yet" inventory → `/report-not-implement`
- Check only — this skill never edits; every fix goes to the owner skill (`## Rules ### 3`)
- No owner covers the artifact → run the generic method inline (`### 2` last bullet)

## Execute

### 1. State The Claim And Find The Authority

> Goal: correctness is only measurable against an authority

1. Take `target` from the argument — file, symbol, doc section, config key, test, dataset; unclear → `/ask-me`
2. Write the claim as one falsifiable sentence: what must be true, for whom, proven by what
3. Find the authority for that claim: issue/ticket, spec, API contract, upstream source, official docs, standard (`Baseline`/RFC), or a written requirement
4. No authority exists → mark the target `unverified` and name the authority needed; never silently assume the current implementation is the truth

### 2. Pick The Domain And Run The Owner's Check

> Goal: reuse the workflow that already exists instead of restating it

1. Classify the target's artifact type against the `## Scope` table; several types → check each type in turn, one evidence set each
2. Run the owner skill's flow and collect its findings
3. Type not in the table and no skill owns it → run the generic method here: read the target → compare each stated behavior/value against the authority → record match/mismatch with `file:line`
4. Cross-check the risky ones against real behavior when it is cheap to do so (`/run-check`, `/run-test`, run the command with `--help`) — a claim verified only by reading stays marked `assumption`

### 3. Collect Evidence Per Finding

> Goal: every finding provable without re-opening the files

- `file:line` of the target, the authority location (or quote), the expected value, the actual value, and why they differ
- Name the failure class: `stale`, `wrong value`, `wrong type/shape`, `unverified`, `vacuous`, `drift from upstream`, `broken link`, `missing negative case`
- Never merge two findings into one row; never report a suspicion without its evidence

### 4. Verdict And Report

> Goal: one table, one verdict per target

1. Report in chat via `/report-review` — columns `No. | Target | Authority | Expected | Actual | Verdict | Severity | Fix owner`; no report files unless the user asks (`/create-report-in-dot-devin`)
2. Verdict per target: `correct` / `incorrect` / `unverified`; Severity: `high` (locks in a bug or nothing is verified), `medium` (drift, weak coverage), `low` (wording/naming)
3. Summarize: checked count, correct count, incorrect count, unverified count, and the single highest-severity finding

### 5. Route Fixes And Re-Check

> Goal: findings become work, not leftover noise

1. Send each finding to the fix owner from the `## Scope` table (`/update-tests`, `/resolve-errors`, `/update-docs`, `/update-config`, …)
2. After the fixes land, re-run `### 2` on just the failed targets; repeat up to 3 rounds, then report the blocker instead of looping
3. Run `/suggest-next-action`

## Rules

### 1. Spec First

- The authority decides correctness — the current implementation is evidence of what is, not of what should be
- `unverified` is a valid, honest result; state which authority is missing instead of guessing one

### 2. Evidence-Based

- Every finding needs `file:line` on both sides: the target and the authority
- Anything proven only by reading is labeled `assumption` until something runs it

### 3. Report Only

- Never modify files in this skill — fixes route to the owner skill and are confirmed by the user
- Do not duplicate an owner's workflow here; link to it and keep only the method (single source of truth)

### 4. Proportionate Depth

- Match effort to cost: one config key does not need a repo-wide audit; a public API contract does
- More than ~10 targets in scope → batch with `/use-subagents` or narrow scope first with `/ask-me`

- Use /deep-validate if needed
- Use /report-review if needed
- Use /suggest-next-action if needed

## Expected Outcome

- Every target has a verdict (`correct`/`incorrect`/`unverified`) tied to a named authority
- An evidence table with `file:line` on both sides and a severity per finding
- Each finding routed to the fix owner, re-checked after fixing, and no leftover unverified item silently dropped

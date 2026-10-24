---
name: review-data
description: Review schema, migrations and data integrity, then fix confirmed findings
argument-hint: "[scope] [--diff] [then-fix] [fix all|follow-your-suggestion]"
related:
  - deep-review
  - deep-review-codebase-everything
  - deep-thinking
  - improve
  - follow-lib-drizzle
  - follow-tool-drizzle-kit
  - follow-tool-data-validation
  - deep-test
  - report-review
  - use-subagents
  - suggest-next-action
  - ask-me
  - review-ops
---

## Goal

Review a scope over the data and database rows of the dimension matrix, prove each integrity risk against the schema or a real query, then drive the fixes through the owning skills without losing data

## Scope

Use before a migration ships, after a data incident, or when a schema and its code disagree — a data layer, workspace, migration set, or whole application

- Entered through `/deep-review` with the `data` signal or called by name; scope and flags are passed through as given
- This preset seeds exactly its labels from `deep-review-codebase-everything/references/presets.md` (`## Preset Map`): data, database, migration, data-schema-evolution, schema-drift, backfill-migration, transactions-isolation, soft-delete-integrity, backup-restore, dual-write-consistency, state-machine-integrity, client-state-migration, client-state-consistency, analytics-integrity. The matrix row `Check` stays the proof — this skill never restates a check
- Siblings: a schema problem that shows up as latency → `review-performance`; a leak of personal data → `review-security`; backup and infra ownership → `review-ops`
- Proof tools: the schema and migration files themselves, `/follow-tool-drizzle-kit` for generation and diffing, `/follow-lib-drizzle` for query shape, `/follow-tool-data-validation` for write-boundary constraints, and `/deep-test database` for behavior
- Without `then-fix` the run is report-only: confirmed risks with evidence, blast radius, and a fix sequence

## Execute

### 1. Think

> Goal: know where truth lives and what a mistake would destroy

1. Run `/deep-thinking` on the scope — identify the schema of record, every writer and reader, the migration path, and what data loss or corruption would mean for users
2. Read `references/presets.md` (`## Preset Map`) for this door's labels, then let the engine's `/deep-thinking` decide which rows apply; a row with no store in scope is skipped only under its `N/A condition`
3. Compare declared schema, generated migrations, and actual queries — a column or constraint that exists in only one of the three is a finding

### 2. Scan

> Goal: one evidence pass against the real schema and query plans

1. Run `/deep-review-codebase-everything` on the scope with the labels above, passing `--diff` when diff-scoped — read its report, do not rerun the analyzer
2. Run the row tools that need capture — a schema diff via `/follow-tool-drizzle-kit`, `EXPLAIN ANALYZE` for hot queries, and `/deep-test database` for constraint behavior
3. Record the migration order and whether a rollback exists; a destructive step with no backup path is itself a finding

### 3. Confirm

> Goal: only risks that the schema or a query proves

1. Every finding cites the table, column, migration, or query plan and the path that reaches it
2. Assign severity from the matrix `Default severity` and its upgrade/downgrade trigger only; a constraint missing on a table nobody writes is downgraded with the reason
3. Separate a real integrity break from a style preference — naming or typing opinions are not findings

### 4. Order The Fix

> Goal: protect data first, then restore consistency

1. Order: backup and rollback path → corruption or data-loss risk → constraint and transaction gaps → schema drift → query and index health → client and analytics consistency
2. Cross-reference: one missing constraint often explains several orphan, duplicate, or soft-delete findings — fix it once and re-run every query it covers
3. Large or cross-workspace set → `/create-plan-in-dot-agents`; without `then-fix` stop here with the ordered table

### 5. Fix Through The Owners

> Goal: each fix is reversible and verified before the next

1. Confirm the fix list with `/ask-me` — per finding, `/follow-your-suggestion`, or `fix all`; `dont-ask-me`/`/ship` follows the report as-is
2. Dispatch through `/improve data`, `/improve database`, `/improve migration`, `/improve consistency`, and `/improve retention` — one migration or batch at a time, with a rollback written before it runs
3. Never run a destructive migration without an explicit confirmation and a backup; never rewrite history that another environment already applied
4. Independent modules → parallel workers via `/use-subagents`; an error mid-migration → `/resolve-errors` immediately, never a partially applied schema
5. Persist what should not recur: a schema or migration convention → `/update-dot-agents-project rules`; a mechanically detectable pattern (destructive DDL, missing FK index) → `/update-astgrep-rules`

### 6. Verify

> Goal: integrity holds on the real store

1. Re-run the constraint test, schema diff, or query plan that produced each finding
2. Run `/deep-test database` on the touched paths and re-review with `--diff` through the engine
3. Run `/deep-validate` on touched files and the project's `/run-check`

### 7. Report

> Goal: data risk is visible before and after

1. Run `/report-review`: findings per matrix row with severity, blast radius, fix status, and verification result
   - Use `templates/findings.md` as the output skeleton
2. State the rollback path used for each migration and anything accepted or blocked
3. Close with `/suggest-next-action`

## Rules

- Evidence first — every finding cites the schema, migration, query plan, or `file:line`
- Severity comes from the row, never from intuition; moving off the default needs the cited trigger
- Data safety outranks speed — backup and rollback before any destructive step, and destructive steps need explicit confirmation
- Migrations stay forward-only once applied; a correction ships as the next migration, never an edit to the past
- Use `/use-subagents` if needed — independent modules inspected in parallel with disjoint file sets
- Report-only unless `then-fix`; only the confirmed set is changed, one batch verified before the next
- Never commit or push unless asked

## Expected Outcome

- Every in-scope row is `done`/`covered-capture`/`covered-manual`/skipped-by-`N/A condition` in the engine ledger, proven by its coverage matrix
- Each confirmed finding has evidence, blast radius, a reversible fix, and a verification result
- Schema, migrations, and queries agree after the fix, and no data was lost to reach it
- Without `then-fix`: a prioritized fix sequence and no edits

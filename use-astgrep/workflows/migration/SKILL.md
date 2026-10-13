---
name: use-astgrep-migration
description: Whole-codebase migration with ast-grep rule files — staged batches, per-batch validation, revertible
argument-hint: "[migration-target]"
related:
  - use-astgrep
  - migration-with-astgrep
  - scan-codebase
  - update-astgrep-rules
  - run-check
  - report
---

## Goal

Run a codebase migration (API rename, framework upgrade, deprecation cleanup, import migration) with ast-grep rules in a staged way — batch by batch, validating every batch, revertible throughout

## Scope

- Orchestration layer for migrations with many rules/many batches — the mechanics of rule writing + apply live in `/migration-with-astgrep` (canonical), deep transform syntax → `/use-astgrep transform`, a single standalone batch rewrite → `/use-astgrep rewrite`

## Execute

### 1. Scope Migration

> Goal: know what to migrate, how many patterns, how many files

1. Run `/scan-codebase` to find old patterns + check `package.json` versions/breaking changes
2. Break the migration into a list of patterns — each pattern = 1 rule file
3. Estimate size: matches/files per pattern with `ast-grep run -p '<pattern>'` (search only)

### 2. Write Migration Rules

> Goal: have a rule per pattern, ready to apply

1. Write rules per `/migration-with-astgrep` (`id`, `language`, `rule`, `fix`) — complex transforms → `/use-astgrep transform`
2. Store them in `sg-rules/` or temp — promote only the rules that belong permanently into `rules/` via `/update-astgrep-rules`
3. Dry-run each rule: `sg scan --rule <file>` — count matches, check for false positives

### 3. Stage Batches

> Goal: apply in small revertible batches

1. Commit/stash before starting — never begin a migration on a dirty tree without warning
2. Order the batches: safest / least-impact patterns first → complex / risky ones last
3. Per batch: `sg scan --rule <file> --fix-all` after confirming → validate immediately before the next batch
4. A single batch may be split by directory if there are many matches (`sg scan --rule <file> <subdir>`)

### 4. Validate Per Batch

> Goal: every batch passes before moving on

1. `git diff --stat` + review the batch's diff
2. Run `/run-check` — typecheck + lint must pass; run the relevant tests
3. On failure → `git restore` only the broken files → adjust the rule → dry-run again (max 3 rounds per batch, then stop + report)

### 5. Report

> Goal: an audit trail of the whole migration

1. Build a `/report` table: `No.`, `Rule`, `Batch`, `Files`, `Changes`, `Status`
2. Note intentional leftovers + rules that should be promoted/deleted

## Rules

- The canonical mechanics live in `/migration-with-astgrep` — this workflow only adds staging/orchestration, no duplication
- Dry-run + commit before every batch — never bulk-apply the whole codebase in one shot
- Never apply to generated files or third-party code
- Use `/update-astgrep-rules` if needed

## Expected Outcome

- The migration applies every pattern in reviewable/revertible batches
- Typecheck/lint/tests pass after every batch
- Clear report: rules, files, changes, leftovers

---
name: follow-tool-drizzle-kit-migrate-schema
description: Run the drizzle-kit migration workflow — generate, push, migrate, review SQL, rollback
argument-hint: "[scope]"
related:
  - run-drizzle-studio
  - run-verify
  - run-test
---

## Goal

Manage schema migrations safely with drizzle-kit — `generate` → review SQL → `migrate`/`push` — with rollback notes

## Scope

Use when the schema changed and migrations must be created/applied — config setup lives in `workflows/config-drizzle-kit/SKILL.md`

## Execute

### 1. Prepare

> Goal: check state before generating

1. Verify `drizzle.config.ts` is correct (`dialect`, `schema`, `out`) — if missing, run `workflows/config-drizzle-kit/SKILL.md` first
2. Review the intended schema diff — read the changed schema files
3. Back up the DB if the migration affects data on a shared/production DB
4. Check the `out` dir — existing migrations must be intact, sequence continuous

### 2. Generate Migration

> Goal: create a SQL migration from the schema diff

1. Run `bunx drizzle-kit generate` — add `--name <name>` for a meaningful name
2. `--custom` for an empty migration you write SQL into; `--breakpoints` when you need statement splitting control
3. Always review generated SQL — rename detection is incomplete: drizzle-kit may treat a rename as drop+create = data loss
4. Edit the generated file's SQL when rename/edge cases are wrong — fix before commit/apply

### 3. Apply

> Goal: apply the migration per environment

1. Dev/prototyping: `bunx drizzle-kit push` — pushes the schema directly to the DB (`--force` skips warnings, `--strict` checks first)
2. Production/staging: `bunx drizzle-kit migrate` — applies migrations from the `out` dir only; never `push`
3. `bunx drizzle-kit check` to detect migration collisions before applying
4. `bunx drizzle-kit up` to upgrade snapshots when the drizzle-kit version changes

### 4. Rollback Notes

> Goal: prepare the rollback path before every apply

1. drizzle-kit has no built-in down migrations — write rollback SQL yourself or rely on a DB backup
2. For destructive changes (drop column/table, rename) — write the inverse SQL into the migration plan before applying
3. Never edit a migration that is already applied — always create a new migration
4. If an apply breaks → restore the backup or apply the inverse migration

### 5. Verify

> Goal: confirm schema matches and the app works

1. Check the DB schema after migrate — via `/run-drizzle-studio` or introspection (`drizzle-kit pull` can compare)
2. Run lint/typecheck/tests — run `/run-verify` and `/run-test` if affected tests exist
3. Commit migrations to version control together with schema changes — separate the commit from feature work when possible
4. Run `/report-before-after` summarizing the schema changes

## Rules

### 1. Environment Discipline

- production always uses `migrate` — `push` is dev/prototyping only
- review generated SQL before commit — rename detection is incomplete

### 2. Migration Integrity

- always keep migrations in version control — the sequence must never break
- never edit an applied migration — create a new one
- data migration → always back up first

### 3. Safety

- destructive changes need a rollback SQL/backup plan before applying
- unsure about flags → check `drizzle-kit <cmd> --help` or the official docs

- Use /run-drizzle-studio if needed

## Expected Outcome

- Migrations generated, reviewed, and applied correctly
- DB schema matches the drizzle schema
- Rollback path ready for destructive changes
- Lint/typecheck/tests pass

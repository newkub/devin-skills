---
name: report-database-schema
description: Create a database schema report — tables, columns, indexes, relations, and ER diagram
argument-hint: "[path]"
related:
  - create-mermaid-diagram
  - deep-review
  - report
  - run-drizzle-studio
  - suggest-next-action
---

## Goal

Create a database schema report for the project from schema definitions or migration files — showing tables, columns, indexes, relations, and a readable ER diagram

## Scope

- Use when a DB schema overview is needed for docs, review, or onboarding
- Supports Drizzle schema (`schema.ts`), SQL migrations, Prisma schema, and general SQL files
- Read-only: reports from files only — never connects to a live database

## Execute

### 1. Locate Schema Sources

> Goal: find the schema sources

1. Use `/search-files-patterns` to find `schema.ts`, `schema.prisma`, `migrations/`, `drizzle/`, `*.sql`
2. Check `drizzle.config.ts`, `DATABASE_URL` references, and the ORM used
3. Multiple sources → merge all and note precedence

### 2. Parse Schema

> Goal: extract all tables and columns

1. Drizzle/Prisma → parse model/table definitions: name, columns, types, constraints
2. SQL migrations → parse `CREATE TABLE`, `ALTER TABLE`, `CREATE INDEX` statements
3. Merge into a canonical model: table, column, type, nullable, default, PK/FK, index
4. Identify relations from foreign keys and ORM `references()`

### 3. Build ER Diagram

> Goal: draw readable relations

1. Use `/create-mermaid-diagram` to generate an `erDiagram` in mermaid
2. Node = table, edge = foreign-key relation with cardinality
3. Group tables by domain when there are dozens

### 4. Compile Report

> Goal: produce a docs-ready report

1. Use `/report table` to summarize tables: `No.`, `Table`, `Columns`, `Indexes`, `Relations`, `Note`
2. Show table detail per group: columns with type, nullability, constraints
3. Include the ER diagram in one section
4. Identify findings: missing indexes on FK, tables without PK, inconsistent naming
5. Permanent report → save to `docs/` or `.devin/temp/report/<workspace>/` per context
6. Use `/suggest-next-action`

## Rules

### 1. Source-Of-Truth

- Reference only committed schema files — never introspect a live DB
- Schema files vs migrations disagree → flag as drift

### 2. Read-Only

- Never modify schema or migrations
- Never run migrations or connect to a database

### 3. Coverage

- Include every table and relation without omission
- Large schema → split report by domain with an index

- Use /deep-review if needed
- Use /create-mermaid-diagram if needed
- Use /run-drizzle-studio if needed
- alias stub: `/report-schema` — forwards to this skill

- Final report via `/report-review` — one chat table (No./Action/Evidence/Severity/Risk/Priority/Owner skill/Status), no report files; the schema/ER output remains this skill's artifact

## Expected Outcome

- A report showing tables, columns, indexes, and relations in full
- An ER diagram in mermaid, ready for docs
- Schema findings identified (missing indexes, no PK, naming drift)

# Refactor — Data Access Scope

Detail for `/refactor` `### 8. Data Access Refactor` — restructure data access onto a type-safe ORM (raw SQL, scattered queries, N+1 → models, relations, queries, migrations) while preserving behavior; one ORM per project (TS/Rust/Python/Go)

> Pre-Run: read `/deep-review` (domain `review-database`) findings first; a project that already has an ORM keeps it — never add a second

## ORM Workflow

> Goal: models → queries → migrations → tests, behavior unchanged

1. Select ORM: TypeScript: drizzle (type-safe SQL-like), prisma (schema-first), kysely (query builder), typeorm, mikro-orm · Rust: sea-orm, diesel, sqlx · Python: sqlalchemy, django-orm, tortoise-orm · Go: gorm, ent, sqlc — greenfield choice → `/follow-my-techstack`; drizzle depth → `/follow-lib-drizzle`, migrations CLI → `/follow-tool-drizzle-kit`
2. Models/relations: one model per domain — table/field names per the ORM convention; relations complete (hasOne/hasMany/belongsTo/many-to-many with a join table); use the ORM's type inference (`$inferSelect`/`$inferInsert`, generated types); indexes on FKs and frequently queried columns; timestamps/soft-delete per domain
3. Queries: query builder only — never self-interpolated SQL strings; eager-load (`with`/`include`/`preload`) to prevent N+1; cursor pagination for large datasets, offset only for small ones; transactions for multi-write atomicity; raw SQL only where the ORM cannot express it — always parameterized
4. Migrations: generate from model changes — always review generated SQL before apply; `/deep-review` pending vs applied before deploy; destructive (drop column/table) → dry-run + user confirm; seeds separate from migrations; fail → `/resolve-errors`; migrations are the source of truth — no manual DB edits, no editing applied migrations, every migration rollback-able
5. Tests: `/update-tests` — repository/query functions against a real test DB (never mock the ORM internals); cover relations (eager load, cascade delete) and migration up/down on a clean DB → verify with `/deep-test database`
6. Boundary validation with `/follow-tool-data-validation`; schema design/drift review → `/deep-review`

## Repository Pattern

> Goal: database logic separated from business logic (interfaces, adapters, mappers, QuerySpec, UnitOfWork)

1. Interfaces use business model types + error types (`RepositoryError`/`NotFoundError`/`ConflictError`) — never import the ORM
2. Adapters implement one interface per module — translate ORM row ↔ business model at the boundary; connection/transaction/error mapping lives only in the repository
3. Mappers are pure functions producing business types — `$inferSelect` is never a business type, no `any`
4. `QuerySpec<T>` = plain object `filter`/`sort`/`pagination`/`select` — the repository converts it into query-builder calls; the builder never leaks out
5. `UnitOfWork` for multi-step writes through the ORM's transaction API — business logic passes a callback, rollback stays in the repository; a schema change then touches only the mapper
6. Tests: integration against a real test DB, unit tests for mappers, mocks only for the repository interface; cover rollback and error cases
7. Anti-patterns: ORM in business logic, row types as business types, leaked query builder, transactions in business logic

## Rules

### 1. Types

- Use the ORM's inferred types — never redeclare row types that can drift; no `any` — validate at the boundary

### 2. One ORM

- One project one ORM — never bypass it with an unnecessary raw connection

## Expected Outcome

- All data access goes through the ORM and the repository interfaces; no scattered raw SQL
- Migrations reviewed, rollback-able, applied on the test DB; relations and N+1 verified by tests
- `/run-verify` green; business logic free of ORM/framework imports

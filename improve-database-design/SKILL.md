---
name: improve-database-design
description: Review, evaluate, and improve database schema, indexing, queries, and integrity for relational and NoSQL systems
---

## Goal

Review and improve an existing or proposed database design to achieve better performance, integrity, maintainability, and scalability

## Scope

Use with relational or NoSQL databases when schema, queries, indexing, normalization, constraints, or data integrity need improvement. Covers review, diagnosis, recommendation, migration planning, and validation

## Execute

### 1. Assess Current Design

Understand the database and its context

> Goal: identify database type, schema, workload, and pain points

1. identify database engine (PostgreSQL, MySQL, MongoDB, Redis, etc.)
2. gather schema, ER diagrams, migration files, and ORM models
3. collect workload profile: read/write ratio, query patterns, peak load
4. identify reported issues: slow queries, data anomalies, lock contention, storage growth
5. document assumptions, constraints, and non-functional requirements
6. if schema is missing or outdated → stop and ask for source files

### 2. Diagnose Schema Issues

Find structural problems

> Goal: list schema-level issues with severity

1. review normalization (1NF–3NF) and denormalization needs
2. check for missing, redundant, or misnamed tables/columns
3. verify primary keys, foreign keys, and unique constraints
4. identify implicit relationships or orphan risks
5. check data types for precision, storage, and compatibility
6. flag duplicate data, multivalued columns, and EAV misuse

### 3. Diagnose Query And Index Performance

Find runtime inefficiencies

> Goal: list query and index issues with evidence

1. collect slow query logs, `EXPLAIN ANALYZE`, and query frequency
2. identify missing indexes, unused indexes, and composite index opportunities
3. check for full table scans, nested loop inefficiency, and sorting costs
4. review N+1 queries, heavy joins, and aggregation patterns
5. assess transaction boundaries and lock contention
6. measure hot spots and partition/sharding candidates

### 4. Diagnose Integrity And Security

Ensure data correctness and safety

> Goal: list integrity and security gaps

1. verify constraints, triggers, and check rules
2. review soft delete, audit trail, and change data capture
3. check for SQL injection risks and access control
4. identify sensitive data exposure and encryption needs
5. assess backup, restore, and disaster recovery strategy
6. review compliance requirements (GDPR, HIPAA, etc.) if applicable

### 5. Prioritize Improvements

Rank issues by impact and effort

> Goal: produce an actionable improvement plan

1. classify issues by severity: critical, high, medium, low
2. estimate effort and risk for each improvement
3. prioritize by impact on performance, integrity, and maintainability
4. group quick wins and foundational changes
5. define success metrics: query time, storage, error rate, test coverage

### 6. Plan Migration

Design safe schema or query changes

> Goal: have a reversible, tested migration plan

1. choose migration strategy: online, batched, blue/green, feature flag
2. write DDL/DML scripts with rollback steps
3. plan data backfill, validation, and consistency checks
4. schedule maintenance windows if downtime is required
5. prepare monitoring and alerting for the migration

### 7. Apply And Validate

Implement improvements and verify

> Goal: database design improved without regression

1. apply schema changes in a non-production environment first
2. rebuild or create indexes, update statistics
3. rewrite queries, views, or ORM mappings
4. run load tests, unit tests, and integration tests
5. verify query plans and performance metrics
6. compare before/after results and report

## Rules

### 1. Start With Evidence

- do not redesign without measured symptoms
- use query plans and metrics instead of assumptions
- preserve existing behavior unless explicitly approved

### 2. Prefer Minimal Changes

- one logical change per migration
- avoid big-bang rewrites; prefer iterative improvements
- keep backward compatibility when possible

### 3. Maintain Integrity

- never disable foreign keys or constraints without a documented reason
- validate data after migrations with reproducible checks
- use transactions for schema and data changes

### 4. Document Decisions

- record why normalization/denormalization was chosen
- document indexes with justification
- keep migration scripts under version control

### 5. Test Performance

- benchmark before and after on realistic data volume
- test concurrency, not just single-query speed
- monitor for regressions after deployment

## Expected Outcome

- documented review of current database design
- prioritized list of improvements with severity and effort
- migration plan with rollback and validation steps
- improved query performance, schema integrity, or security
- no data loss or broken references
- evidence-backed before/after metrics

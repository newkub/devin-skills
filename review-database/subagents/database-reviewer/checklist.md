# review-database — Full Dimension Checklist

## 1. Schema Design

- [ ] normalization เหมาะสม, no god-tables
- [ ] keys: PK strategy, FK constraints, ON DELETE behavior
- [ ] types เหมาะ: no TEXT-for-everything, correct numeric precision
- [ ] NOT NULL/default constraints, CHECK constraints
- [ ] naming conventions consistent

## 2. Indexes And Queries

- [ ] index coverage ตาม query patterns, no missing hot-path index
- [ ] unused/duplicate indexes, index bloat
- [ ] N+1 queries, slow query log review
- [ ] pagination: keyset vs offset, COUNT() costs
- [ ] query plans (EXPLAIN) บน critical queries

## 3. Migrations And Integrity

- [ ] migrations: versioned, reversible, tested up+down
- [ ] schema drift vs ORM models
- [ ] data integrity: orphan rows, constraint violations
- [ ] zero-downtime migration patterns (expand/contract)

## 4. Performance And Scale

- [ ] connection pooling, statement timeouts
- [ ] partitioning/archival strategy สำหรับตารางโต
- [ ] replication/read replicas usage
- [ ] lock contention, long transactions

## 5. Security And Ops

- [ ] least-privilege DB users, no app-superuser
- [ ] PII encryption/column-level protection
- [ ] backup/restore tested, PITR configured
- [ ] audit logging สำหรับ sensitive tables

## Scoring

- pass = 1, warning = 0.5, fail = 0; grade A (90+), B (80+), C (70+), D (60+), F (<60)

# Database Schema And Query Checks

## Scope

database review สำหรับ relational หรือ NoSQL database ใน project: schema design, query patterns, index coverage, data integrity, connection management, migration safety

## Checklist

### Schema

- ตรวจสอบ table structure, data types, column naming, normalization level
- ตรวจสอบ primary keys, foreign keys, unique constraints, check constraints
- ตรวจสอบ relation integrity, relation cardinality, implicit relationships, orphan risks
- ตรวจสอบ multivalued columns, EAV misuse, duplicate data, misnamed tables/columns
- ตรวจสอบ data types สำหรับ precision, storage, compatibility

### Query And Index

- ตรวจสอบ slow queries, full table scans, missing indexes, unused indexes ด้วย EXPLAIN ANALYZE หรือ query plans
- ตรวจสอบ N+1 queries, heavy joins, aggregation patterns, batch operations
- ตรวจสอบ index coverage: hot queries, composite indexes, partial indexes, unique indexes, index bloat
- ตรวจสอบ transaction boundaries, lock contention, hot spots

### Integrity

- ตรวจสอบ primary key constraints, foreign key constraints, cascade rules
- ตรวจสอบ unique constraints, composite unique, partial unique indexes, check constraints
- ตรวจสอบ orphaned record risk, transaction integrity, atomic operations, isolation level
- ตรวจสอบ soft delete, audit trail, change data capture
- ตรวจสอบ sensitive data exposure และ encryption needs

### Connection

- ตรวจสอบ connection pool size, timeout, retry strategy
- ตรวจสอบ connection leaks, long-running transactions, connection exhaustion
- ตรวจสอบ read/write split, load balancing, failover configuration
- ตรวจสอบ concurrency handling, peak load, lock contention

### Migration

- ตรวจสอบ destructive operations, locking, data loss risk, rollback capability
- ตรวจสอบ down scripts completeness, reversibility, data preservation
- ตรวจสอบ default values, nullable columns, data backfill, migration ordering, dependency chain
- ตรวจสอบ migration conflicts, strategy: online, batched, blue/green, feature flag

## Skip Conditions

- ถ้า project ไม่มี database → ข้ามทั้งหมด
- ถ้า project ไม่มี migrations → ข้ามส่วน migration
- ถ้า project ไม่มี connection pool → ข้าม connection pool items

## Severity

- Critical: data loss risk, missing migration rollback, destructive operation without safeguard, missing foreign key constraint, orphaned record risk, no transaction integrity, unbounded query ที่ crash, missing connection pool
- High: missing index on hot query, N+1 query ใน hot path, missing unique constraint, missing check constraint, unsafe cascade delete, missing down script, poor connection config
- Medium: suboptimal schema, minor schema drift, missing batch operations, missing composite index opportunity
- Low: cosmetic, naming convention, documentation gap

## No Deletions

- ห้ามรวม instruction ที่สั่งให้ลบ table, index, column, data, หรือ migration ใน review
- ห้ามใช้ `DROP`, `DELETE`, `TRUNCATE` เป็นคำสั่งใน review phase
- ทุก finding บันทึกเป็น evidence สำหรับ improvement ต่อไป

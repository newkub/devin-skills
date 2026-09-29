---
name: io-and-database
description: I/O and database performance review checklist
---

# I/O And Database Performance

## Goal

I/O operations มีประสิทธิภาพ

## Checks

1. ตรวจสอบ file I/O, database I/O, network I/O, serialization
2. ตรวจสอบ batching, async I/O, connection pooling
3. ตรวจสอบ N+1 queries, missing indexes, slow queries
4. ตรวจสอบ ORM queries, query builders, raw SQL บน hot paths
5. ถ้าไม่มี database → ข้าม step นี้

## Severity

- Critical: N+1 query on hot path, missing index causing full scan, connection pool exhausted
- High: slow query on critical path, missing batching
- Medium: suboptimal ORM query, missing pagination
- Low: minor I/O tuning

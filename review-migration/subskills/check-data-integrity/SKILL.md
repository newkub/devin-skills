---
name: review-migration-check-data-integrity
description: Check data integrity — completeness, consistency, validation queries, drift detection
argument-hint: "[migration-or-scope]"
related:
  - review-migration
  - run-drizzle-studio
  - report
---

## Goal

Run the data-integrity dimension of `/review-migration` แบบ focused — data หลัง migrate ครบและตรงต้นฉบับ

## Scope

- ใช้เมื่อ `/review-migration` dispatch มาที่ `integrity`/`data` หรือเรียก standalone
- ครอบคลุม: row counts, checksums/aggregates, referential integrity, encoding/collation, orphan records

## Execute

### 1. Integrity Checks

> Goal: data correctness prove ได้ด้วย numbers — parent Execute §3

ทำตาม `../../references/data-integrity.md`

1. completeness — row counts per table เทียบ source vs target
2. consistency — aggregates/checksums (sums, counts, min/max) ตรงกัน
3. referential — orphan rows, FK violations หลัง migrate
4. encoding — charset/collation differences, truncation จาก type narrowing
5. drift detection — ongoing writes ระหว่าง migration ถูก capture (CDC/dual-write)

### 2. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Table/Check`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น — fix ใน parent `## Fix`; post-migration verify → `## Verify` ของ parent
- ทุก finding มี numbers จริง — count/checksum ทั้งสองฝั่ง
- ห้ามรัน heavy queries บน production — dev/staging/read replica เท่านั้น

## Expected Outcome

- Integrity findings พร้อม quantitative evidence
- Drift/orphan risks พร้อม affected tables

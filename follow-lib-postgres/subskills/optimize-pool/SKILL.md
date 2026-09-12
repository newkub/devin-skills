---
name: follow-lib-postgres-optimize-pool
description: tune postgres.js pool — max connections, prepared statements, timeouts
argument-hint: "[pool-or-query]"
related:
  - follow-lib-postgres
  - check-bottlenecks
  - run-bench
  - report-before-after
---

## Goal

tune postgres.js connection pool และ query options — `max`, `prepare`, timeouts — โดยวัดผลก่อนและหลัง ไม่เปลี่ยน output

## Scope

- ใช้เมื่อมี connection exhaustion, queries ช้าจาก pool sizing, หรือต้อง tune สำหรับ production
- ครอบคลุม: `max`, `prepare`, `idle_timeout`, `connect_timeout`, `max_lifetime`, `ssl`
- ถ้ายังไม่มี client → ทำ `subskills/setup-postgres/SKILL.md` ก่อน

## Execute

### 1. Baseline

> Goal: เก็บตัวเลขเดิมก่อน tune

1. ทำ `/run-bench` หรือจับเวลา endpoints/queries ที่ช้า — latency, throughput, error rate
2. นับ connections ฝั่ง DB: `SELECT count(*) FROM pg_stat_activity` — เทียบกับ `max_connections` ของ server
3. ทำ `/check-bottlenecks` — แยกว่าช้าจาก pool (queue waiting) หรือ query เอง (seq scan, lock)
4. ระบุ topology: instances × `max` ต่อ instance ต้องไม่เกิน `max_connections` ของ Postgres

### 2. Tune Pool Size

> Goal: `max` สอดคล้องกับ capacity จริง

1. ตั้ง `max` ใน `postgres(url, { max })` — default 10; คำนวณจาก `max_connections` หารจำนวน app instances เผื่อ headroom
2. Pool ใหญ่เกิน = thrashing ฝั่ง DB; เล็กเกิน = queries คิว — เริ่มจากค่าที่คำนวณแล้ววัดซ้ำ
3. บน serverless หลาย instances → ใช้ PgBouncer/Hyperdrive transaction pooling แทนการเพิ่ม `max`
4. ตั้ง `idle_timeout` และ `max_lifetime` ให้ connections recycle — กัน stale connections หลัง restart/failover

### 3. Tune Prepared Statements And Options

> Goal: ใช้ prepare ให้ได้ประโยชน์ ไม่ชนข้อจำกัด

1. `prepare: true` (default) cache query plans — เหมาะกับ repeated queries
2. ข้อควรระวัง: ผ่าน PgBouncer transaction mode → prepared statements อาจพัง ให้ `prepare: false` (ดู official docs)
3. Dynamic queries จำนวนมากที่ shape ไม่ซ้ำ → พิจารณา `prepare: false` ลด plan cache churn
4. ตั้ง `connect_timeout` เพื่อ fail fast แทน hang — และ `ssl` เมื่อ connect ผ่าน network สาธารณะ

### 4. Measure Again

> Goal: compare กับ baseline และตัดสินใจ

1. วัดซ้ำ workload เดิม — latency, throughput, `pg_stat_activity` count
2. ถ้าไม่ดีขึ้นหรือ regression → revert option นั้นแล้ว report
3. ผ่าน → `/report-before-after` พร้อมตัวเลข แล้ว `/suggest-next-action`

## Rules

- Baseline ก่อนเสมอ — ห้าม tune โดยไม่มีตัวเลขเปรียบเทียบ
- แก้ทีละ option แล้ววัด — ห้ามเปลี่ยนหลายตัวพร้อมกันถ้าแยกผลไม่ได้
- instances × `max` ≤ `max_connections` เสมอ — เผื่อ admin/migration connections
- `prepare: false` เมื่ออยู่หลัง transaction-mode pooler — ถ้าไม่แน่ใจ → ดู official docs
- Preserve behavior — pool tuning ห้ามเปลี่ยน query semantics

## Expected Outcome

- Pool sizing สอดคล้อง `max_connections` และ topology จริง
- Prepared statements ถูกตั้งตาม pooler mode
- ตัวเลขหลัง tune ดีกว่า baseline — report พร้อม evidence

# Concurrency And Pooling Checklist — review-database

## Connection Pooling

- [ ] pool size ต่อ instance — total connections (pool × instances) < `max_connections` headroom
- [ ] pool vs workers mismatch — web workers/job workers sharing pool appropriately
- [ ] connection leak detection — acquire timeout, checkout tracing, `idle_in_transaction` monitoring
- [ ] idle reaping — stale connections closed, keepalive config
- [ ] pool saturation behavior — queue + timeout ไม่ใช่ unbounded wait
- [ ] transaction pooling pitfalls — session state (`SET`, prepared statements, temp tables) leak ข้าม checkouts

## Locks

- [ ] `SELECT ... FOR UPDATE` scope — เฉพาะ rows ที่ต้อง lock, timeout set
- [ ] lock ordering consistent — ทุก code path lock resources ลำดับเดียวกัน → deadlocks น้อย
- [ ] lock timeout — `lock_timeout`/`NOWAIT`/`SKIP LOCKED` ตาม use case
- [ ] advisory locks — app-level coordination, scoped + released
- [ ] table-level locks — DDL/`ALTER TABLE` ใน transactions ที่ไม่ค้าง
- [ ] deadlock handling — detect + retry policy, not blind retry storm

## Isolation Levels

- [ ] default isolation understood — READ COMMITTED anomalies (non-repeatable reads) ยอมรับได้หรือไม่
- [ ] serializable where needed — financial/inventory counters, มี retry-on-serialization-failure
- [ ] read-your-writes — replication lag ไม่ทำ user เห็น stale data หลัง write (read-after-write routing)
- [ ] snapshot isolation gaps — long transactions ไม่ pin old snapshots (vacuum blocked, bloat)

## Long Transactions

- [ ] transaction scope สั้น — no network calls, no heavy compute ภายใน tx
- [ ] idle-in-transaction — connections holding tx open ระหว่าง waits, timeout set
- [ ] transaction timeout — `statement_timeout`/`idle_in_transaction_session_timeout`
- [ ] batch writes — chunk ใหญ่แตกเป็น smaller txs, ไม่ lock นาน

## Multi-Instance Safety

- [ ] single-writer assumptions — code assume single process แต่ deploy หลาย replicas
- [ ] distributed coordination — advisory locks/lease สำหรับ singleton tasks (leader election)
- [ ] sequence/ID gaps — `SERIAL`/`AUTO_INCREMENT` ไม่ assume contiguous IDs
- [ ] read replica consistency — writes→reads race ระบุ, `causal` routing ถ้าจำเป็น

## Optimistic Concurrency

- [ ] `version`/`updated_at` compare-and-swap — UPDATE ... WHERE version = N
- [ ] conflict resolution — 409/retry path เมื่อ optimistic check fails
- [ ] no lost updates — read-modify-write ที่ไม่มี version check = lost update

## Detection

- grep `FOR UPDATE`, `SKIP LOCKED`, `SERIALIZABLE`, pool config (`poolSize`, `max`)
- check `pg_stat_activity`-style monitoring — idle tx, blocked queries
- grep transaction wrappers — scope ครอบอะไรบ้าง

Severity: connection leaks / pool exhaustion = High, deadlock-prone ordering = High, lost updates = High, idle-in-tx = Medium

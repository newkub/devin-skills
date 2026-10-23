---
name: follow-lib-postgres-optimize-pool
description: tune postgres.js pool — max connections, prepared statements, timeouts
argument-hint: "[pool-or-query]"
related:
  - follow-lib-postgres
  - run-bench
  - report-before-after
---

## Goal

Tune the postgres.js connection pool and query options — `max`, `prepare`, timeouts — measuring before and after, with no output change

## Scope

- use when there is connection exhaustion, queries slowed by pool sizing, or production tuning is needed
- covers: `max`, `prepare`, `idle_timeout`, `connect_timeout`, `max_lifetime`, `ssl`
- if there is no client yet → run `workflows/setup-postgres/SKILL.md` first

## Execute

### 1. Baseline

> Goal: capture the original numbers before tuning

1. run `/run-bench` or time the slow endpoints/queries — latency, throughput, error rate
2. count connections on the DB side: `SELECT count(*) FROM pg_stat_activity` — compare against the server's `max_connections`
3. run `/deep-optimize` — separate slowness from the pool (queue waiting) vs the query itself (seq scan, lock)
4. identify the topology: instances × `max` per instance must not exceed Postgres's `max_connections`

### 2. Tune Pool Size

> Goal: `max` aligned with real capacity

1. set `max` in `postgres(url, { max })` — default 10; compute from `max_connections` divided by the number of app instances, leaving headroom
2. Too large a pool = thrashing on the DB side; too small = queued queries — start from the computed value and re-measure
3. on serverless with many instances → use PgBouncer/Hyperdrive transaction pooling instead of raising `max`
4. set `idle_timeout` and `max_lifetime` so connections recycle — prevents stale connections after restart/failover

### 3. Tune Prepared Statements And Options

> Goal: use prepare for its benefits without hitting limitations

1. `prepare: true` (default) caches query plans — suits repeated queries
2. Caveat: behind PgBouncer transaction mode → prepared statements may break; set `prepare: false` (see the official docs)
3. many dynamic queries with non-repeating shapes → consider `prepare: false` to reduce plan cache churn
4. set `connect_timeout` to fail fast instead of hanging — and `ssl` when connecting over a public network

### 4. Measure Again

> Goal: compare with the baseline and decide

1. re-measure the same workload — latency, throughput, `pg_stat_activity` count
2. if there is no improvement or a regression → revert that option and report
3. passing → `/report-before-after` with the numbers, then `/suggest-next-action`

## Rules

- Baseline always first — never tune without comparison numbers
- Change one option at a time then measure — never change several at once unless their effects can be separated
- instances × `max` ≤ `max_connections` always — leave room for admin/migration connections
- `prepare: false` behind a transaction-mode pooler — if unsure → check the official docs
- Preserve behavior — pool tuning must never change query semantics

## Expected Outcome

- Pool sizing aligned with `max_connections` and the real topology
- Prepared statements set per pooler mode
- Post-tune numbers beat the baseline — report with evidence

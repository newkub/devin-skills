# Reliability Patterns Checklist — review-events

## Outbox Pattern

- [ ] transactional outbox — event written to outbox table in same DB transaction as entity
- [ ] no dual-write — never `db.save()` then `broker.publish()` separately (one can fail)
- [ ] relay/poller — CDC or polling publishes outbox rows to broker
- [ ] at-least-once — outbox guarantees delivery, consumers must dedupe
- [ ] cleanup — published outbox rows archived/deleted, not growing forever

## Inbox Pattern

- [ ] consumer inbox — received event IDs persisted before processing
- [ ] dedupe check — `if exists(event_id): skip` against durable store
- [ ] atomic — inbox insert + processing in transaction where possible
- [ ] no in-memory dedupe — set/map in process memory loses on restart
- [ ] TTL — inbox entries expire after dedupe window

## Backpressure

- [ ] bounded buffers — internal queues bounded, not unbounded growth
- [ ] batching — consumer processes in batches sized to throughput
- [ ] pause/resume — consumer pauses when downstream slow
- [ ] flow control — `prefetch`/`max_in_flight` tuned, not unlimited
- [ ] rejection policy — what happens when buffer full (drop, block, spill to disk)
- [ ] slow consumer handling — lag alerts, autoscale, or shed load

## Schema Evolution

- [ ] backward compat — new consumer reads old events
- [ ] forward compat — old consumer ignores new fields
- [ ] version field — `event_version`/`schema_version` in envelope
- [ ] migration — upcasters/transforms for old events on read
- [ ] registry — schema registry enforced, not convention-only
- [ ] breaking changes — new event type/topic, not in-place breakage

## Ordering And Partitioning

- [ ] partition key — entity ID as key (all events for order-123 in order)
- [ ] ordering scope — only guaranteed within partition, documented
- [ ] no global ordering assumption — cross-partition order not assumed
- [ ] rebalancing — consumer group rebalance handled (revocation, offset commit)

## Retry And DLQ

- [ ] retry policy — max attempts, backoff, jitter per error type
- [ ] transient vs permanent — retry transient, DLQ permanent immediately
- [ ] DLQ contents — original event + error + attempt count + timestamp
- [ ] DLQ replay — reprocess path tested, order preserved where needed
- [ ] poison message — single bad event doesn't block partition forever

## Sagas And Compensation

- [ ] saga orchestration — multi-step flows have coordinator or choreography
- [ ] compensation — rollback events/actions defined per step
- [ ] timeout — saga steps have deadlines, not infinite wait
- [ ] idempotent compensation — compensate can run twice safely

## Event Sourcing (if applicable)

- [ ] aggregate rebuild — state from events replayable, snapshot for perf
- [ ] event immutability — events never updated, corrections via new events
- [ ] projections — read models rebuilt from event stream
- [ ] upcasting — old event formats upgraded at read time

## Detection

- grep `publish`/`emit` after DB ops without outbox
- grep consumer handlers — `onMessage`/`subscribe` without dedupe check
- grep `dlq`/`dead-letter`/`retry` config
- grep `version`/`schema_version` in event payloads

Severity: dual-write without outbox = Critical, in-memory dedupe = High, unbounded buffers = High, no schema version = Medium

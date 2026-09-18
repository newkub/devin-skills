# Jobs And Consumers Checklist — review-backend

## Queue Health

- [ ] dead letter queue — failed jobs land somewhere inspectable, ไม่หายเงียบ
- [ ] retry policy — max attempts, exponential backoff, jitter — ไม่ retry ไม่จบ
- [ ] backlog monitoring — queue depth alerts, processing rate vs arrival rate
- [ ] job timeouts — stuck jobs killed/requeued, ไม่ block workers ตลอดไป
- [ ] priority lanes — critical jobs ไม่รอหลัง batch ใหญ่

## Consumer Correctness

- [ ] idempotent handlers — redelivery ไม่ double-apply (dedup key, upsert, outbox)
- [ ] at-least-once assumption — ไม่ assume exactly-once delivery
- [ ] poison message handling — malformed payload ไม่ crash loop
- [ ] graceful shutdown — in-flight jobs จบก่อน exit หรือ requeue ถูก
- [ ] concurrency limits — worker pool bounded, ไม่ล้น DB connections

## Scheduling

- [ ] cron/scheduler — timezone explicit, overlap protection (previous run ยังไม่จบ)
- [ ] missed-run policy — catch-up vs skip ระบุชัด
- [ ] job versioning — payload schema changes มี migration/compat path

## Observability

- [ ] per-job-type metrics — success/fail/latency/retry counts
- [ ] job tracing — correlation id ตามข้าม producer→consumer
- [ ] failure alerting — error rate หรือ DLQ growth → notify

## Detection

- grep queue libs — `bullmq`, `sidekiq`, `celery`, `sqs`, `kafka`, `amqp`, cron schedulers
- ตรวจ retry/dedup/timeout config รอบ enqueue + handler

Severity: no DLQ + silent loss = High, non-idempotent consumer = High, no retry bound = Medium

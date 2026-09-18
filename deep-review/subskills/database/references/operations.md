# Operations And Pii Checklist — review-database

## Replication And Availability

- [ ] replication lag monitored — read replicas freshness threshold, alert on lag
- [ ] failover procedure documented — promotion steps, DNS/endpoint switch, split-brain prevention
- [ ] backup cadence + restore testing — backups exist AND restore tested periodically (untested backup = no backup)
- [ ] point-in-time recovery — WAL/binlog retention covers RPO requirement
- [ ] maintenance windows — vacuum/analyze/reindex schedule, lock-free where possible

## Capacity And Growth

- [ ] table growth rates tracked — largest tables, projection vs disk headroom
- [ ] index bloat — dead tuples, unused index size, rebuild schedule
- [ ] partition strategy for large tables — time-range partitions, archive path
- [ ] connection limit headroom — max_connections vs pool sizes × instances
- [ ] disk IOPS/throughput headroom — query load vs provisioned capacity

## Data Lifecycle

- [ ] retention policy per table — what ages out, archival vs hard delete
- [ ] soft-delete hygiene — deleted rows excluded by default queries, periodic purge
- [ ] orphaned data — child rows without parents (FK missing), cleanup jobs
- [ ] audit/history tables — growth bounded, partitioning, retention

## Pii Inventory

- [ ] PII columns identified — names, emails, phones, addresses, IDs, payment fragments
- [ ] retention per table — PII kept only as long as needed, deletion path on request
- [ ] encryption at rest — TDE/column-level for sensitive fields (SSN, payment)
- [ ] masking in non-prod — prod PII ไม่ leak เข้า dev/staging dumps
- [ ] access logging — who queries PII tables, audit trail
- [ ] anonymization/pseudonymization — analytics/reporting ใช้ pseudonymized views

## Compliance

- [ ] GDPR/right-to-erasure path — user delete → PII removed/anonymized ทุก copy (incl. caches, logs, backups policy)
- [ ] data residency — region requirements met, cross-border flows documented
- [ ] schema-level docs — table/column comments สำหรับ sensitive data classification

## Detection

- scan schema for PII-sounding columns — `email`, `phone`, `ssn`, `address`, `dob`, `password`, `token`
- check migration history for `encrypt`/`mask`/retention tables
- inspect monitoring config — slow queries, replication lag, disk usage alerts

Severity: untested backups / no PII inventory = Critical–High, no masking in non-prod = High, missing retention = Medium

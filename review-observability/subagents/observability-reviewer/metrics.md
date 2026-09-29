# Metrics Validation Rules

## Metric Types

- Counter: ใช้สำหรับ cumulative value (request count, error count) — เพิ่มได้อย่างเดียว
- Gauge: ใช้สำหรับ current value (memory, active connection) — ขึ้นลงได้
- Histogram: ใช้สำหรับ distribution (latency, response size) — มี bucket
- Summary: ใช้สำหรับ quantile (p50, p95, p99) — คำนวณ client-side
- ตรวจ type correctness: ห้ามใช้ counter สำหรับ value ที่ลดได้

## Metric Naming

- Namespace: `app_`, `service_`, `module_` prefix
- Subsystem: logical grouping (`http_`, `db_`, `queue_`)
- Name: descriptive, snake_case, unit suffix (`_seconds`, `_bytes`, `_total`)
- ตรวจ consistency: naming convention เดียวกันทั้ง codebase
- Detection: `grep` หา `Counter`, `Gauge`, `Histogram`, `Summary`

## Labels

- Cardinality: หลีกเลี่ยง high-cardinality label (user_id, request_id)
- Label naming: snake_case, descriptive
- Default labels: service name, version, environment
- ตรวจ label explosion: label ที่มีค่าเป็น unique ทุก request → memory explosion
- Detection: `grep` หา `.label(`, `.labels(`

## RED Metrics

- Rate: request per second สำหรับทุก service
- Errors: error count, error rate สำหรับทุก service
- Duration: latency histogram (p50, p95, p99) สำหรับทุก service
- ตรวจ coverage: ทุก service มี RED metrics ครบ

## USE Metrics

- Utilization: CPU, memory, disk, network utilization
- Saturation: queue length, connection pool, thread pool
- Errors: hardware error, OS error, resource error
- ตรวจ coverage: ทุก resource มี USE metrics ครบ

## Business Metrics

- Conversion: signup, purchase, upgrade conversion rate
- Active users: DAU, MAU, concurrent users
- Revenue: MRR, ARR, revenue per user
- Custom KPIs: ตาม business domain

## Metric Exposure

- `/metrics` endpoint: Prometheus format, scrape config
- Push vs pull: push gateway สำหรับ short-lived job
- ตรวจ exposure: ทุก service expose metrics endpoint
- Detection: `grep` หา `/metrics`, `prometheus`, `registerMetric`

## Severity Criteria

- Critical: missing critical metrics, high-cardinality label causing memory explosion, metric name collision, no metrics endpoint
- High: missing RED/USE metrics, inconsistent naming, missing business metrics, missing labels
- Medium: suboptimal naming, missing unit suffix, suboptimal bucket
- Low: documentation gap, minor naming

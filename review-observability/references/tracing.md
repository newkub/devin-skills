# Distributed Tracing Validation Rules

## Trace Context Propagation

- W3C TraceContext: `traceparent`, `tracestate` header — มาตรฐานปัจจุบัน
- B3 propagation: `X-B3-TraceId`, `X-B3-SpanId` — ใช้กับ Zipkin
- Baggage: `baggage` header สำหรับ cross-service context
- ตรวจ propagation: ทุก HTTP call ส่ง trace context ต่อ
- Detection: `grep` หา `traceparent`, `X-B3`, `propagate`, `inject`, `extract`

## Span Creation

- Span naming: descriptive, lowercase, verb-noun (`http.get`, `db.query`)
- Span attributes: key-value, semantic convention (OTel)
- Span events: error event, annotation event
- Span links: link ไปยัง related span
- ตรวจ span quality: มี attribute ครบ, มี event สำหรับ error

## Span Propagation Across Boundaries

- HTTP headers: ส่ง trace context ผ่าน HTTP header
- Message queue metadata: ส่ง trace context ผ่าน message metadata
- Database context: ไม่ทำลาย trace context ตอน query
- ตรวจ broken chain: service ที่ไม่ propagate context → broken trace

## Sampling Strategy

- Head-based: decide ที่ client, ใช้ probability sampler
- Tail-based: decide ที่ collector, ใช้ policy (error, latency)
- Rate-based: fixed rate, adaptive rate
- ตรวจ sampling: ไม่ sample หนักเกินไปจนหาย error, ไม่ sample เบาเกินไปจน overhead สูง

## Instrumentation

- Auto-instrumentation: HTTP, database, cache, message queue — ใช้ library
- Manual instrumentation: business logic, custom span
- Library instrumentation: ใช้ instrumented library version
- ตรวจ coverage: critical path มี instrumentation ครบ

## Trace Correlation

- Trace ID in logs: ทุก log entry มี trace ID
- Trace ID in metrics: metric label มี trace ID (ถ้าจำเป็น)
- Trace ID in error reports: error report มี trace ID สำหรับ debugging
- ตรวจ correlation: log, metric, error สามารถ correlate ผ่าน trace ID
- Detection: `grep` หา `traceId`, `trace_id`, `spanId` ใน log config

## Trace Backend

- Jaeger: open source, UI สำหรับ trace exploration
- Zipkin: open source, lightweight
- Datadog: commercial, integrated APM
- Tempo: Grafana ecosystem, object storage
- Honeycomb: commercial, high-cardinality
- ตรวจ integration: export config, export endpoint, export frequency

## Severity Criteria

- Critical: missing trace context propagation, broken span chain, no trace correlation with logs, no trace backend
- High: missing instrumentation on critical path, inconsistent span naming, missing sampling strategy, missing trace backend
- Medium: suboptimal sampling, missing span attribute, inconsistent naming
- Low: documentation gap, minor naming

# Structured Logging Validation Rules

## Log Levels

- debug: detailed diagnostic, production off
- info: general operation, production on
- warn: unexpected but handled, production on
- error: error condition, production on
- fatal: unrecoverable, process exit, production on
- ตรวจ level usage: ใช้ level ที่เหมาะสม, ไม่ใช้ info สำหรับ error
- ตรวจ level filtering: production filter out debug

## Log Format

- JSON structured logging: ทุก log entry เป็น JSON
- Timestamp format: ISO 8601, UTC, millisecond precision
- Field naming: snake_case หรือ camelCase consistent
- ตรวจ consistency: format เดียวกันทั้ง codebase
- Detection: `grep` หา `pino`, `winston`, `JSON.stringify` ใน logger

## Log Context

- Request ID: ทุก log entry ใน request scope มี request ID
- User ID: ทุก log entry ใน user scope มี user ID
- Tenant ID: ทุก log entry ใน tenant scope มี tenant ID
- Trace ID: ทุก log entry มี trace ID สำหรับ correlation
- Span ID: ทุก log entry มี span ID สำหรับ correlation
- ตรวจ context propagation: context ส่งต่อผ่าน async boundary

## Log Content

- No sensitive data: ไม่ log password, token, secret, API key
- PII scrubbing: ไม่ log PII โดยตรง, mask หรือ hash
- Field redaction: redact sensitive field ก่อน log
- ตรวจ leak: `grep` หา `password`, `token`, `secret` ใน log statement
- Detection: `grep` หา `logger.info`, `console.log` ที่มี sensitive field

## Log Retention

- Retention policy: ระบุ retention period ตาม compliance
- Log rotation: rotate log file, compress old log
- Archive strategy: archive ไปยัง cold storage
- Hot/cold storage: hot สำหรับ recent, cold สำหรับ historical

## Log Aggregation

- Centralized logging: ส่ง log ไปยัง central system (ELK, Loki, Datadog)
- Log shipping: agent (Filebeat, Fluentd, Vector) ส่ง log
- Index strategy: index field ที่ search บ่อย
- ตรวจ aggregation: ทุก service ส่ง log ไปยัง central system

## Log Search

- Searchable fields: request ID, user ID, trace ID, timestamp
- Query capability: full-text search, field search, range search
- Log exploration tooling: Kibana, Grafana Loki, Datadog
- ตรวจ search: สามารถ search และ filter log ได้

## Severity Criteria

- Critical: secrets in logs, PII exposure, no structured logging, no log correlation, silent failure (no log on error)
- High: missing request ID, inconsistent format, missing log level, no centralized logging, missing context
- Medium: suboptimal format, missing retention policy, missing log search, inconsistent field naming
- Low: documentation gap, minor naming

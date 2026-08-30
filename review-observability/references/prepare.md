# Prepare And Scan

เตรียม context ก่อนเริ่ม review

> Goal: เข้าใจ observability setup ใน codebase

1. ทำ `/scan-codebase` เพื่อเข้าใจ observability setup, logging, monitoring, tracing
2. ระบุ metrics library (Prometheus, StatsD, OpenTelemetry Metrics), tracing library (OpenTelemetry, Jaeger, Zipkin, Datadog), logging library (pino, winston, structlog)
3. ระบุ APM tool (Datadog, New Relic, Sentry, AppSignal, Honeycomb), alerting platform (PagerDuty, Opsgenie, Slack)
4. ระบุ dashboard tool (Grafana, Datadog dashboards, Kibana), SLO/SLI definitions
5. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
6. ทำ `/review-codebase-everything` เพื่อให้ analyzers ครอบคลุม categories ล่าสุด
7. รัน `bun --filter tools-review-codebase review-codebase:json` เพื่อดึง review report พร้อม metrics
8. ทำ `/run-review` เพื่อรัน review CLI และดึง metrics ล่าสุด

# review-observability — Full Dimension Checklist

## 1. Metrics

- [ ] RED/USE coverage: rate, errors, duration / utilization, saturation
- [ ] business metrics, custom metrics, cardinality control
- [ ] metric naming/labels consistent

## 2. Tracing

- [ ] distributed tracing coverage, context propagation
- [ ] span quality: names, attributes, error recording
- [ ] sampling strategy

## 3. Logging

- [ ] structured logs, consistent levels, correlation IDs
- [ ] no secrets/PII in logs, PII redaction
- [ ] log volume/retention cost-aware

## 4. Alerting

- [ ] alerts actionable, symptom-based not cause-based
- [ ] alert fatigue: thresholds, dedup, routing
- [ ] on-call escalation paths, runbooks linked

## 5. Dashboards

- [ ] overview + drill-down dashboards, fresh data
- [ ] per-service + system-level views

## 6. SLO/SLI

- [ ] SLOs defined + measured, error budgets
- [ ] SLI collection reliable

## 7. APM And Incidents

- [ ] APM coverage, profiling, dependency maps
- [ ] incident response: detection → triage → postmortem loop
- [ ] status page/comms ถ้า public-facing

## Scoring

- pass = 1, warning = 0.5, fail = 0; grade A (90+), B (80+), C (70+), D (60+), F (<60)

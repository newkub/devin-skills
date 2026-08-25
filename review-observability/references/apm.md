# APM Integration Validation Rules

## APM Agent Setup

- Agent version: ใช้ version ล่าสุด, ไม่ใช้ EOL version
- Agent config: config ถูกต้อง, environment-specific
- Agent startup: agent start พร้อม app, ไม่ crash app
- Agent health: health check endpoint, agent status monitoring
- ตรวจ setup: agent ทำงาน, config ถูกต้อง

## Auto-Instrumentation

- HTTP: request, response, status code, latency
- Database: query, duration, error
- Cache: get, set, hit/miss, duration
- Message queue: publish, consume, latency
- Framework: Express, Fastify, Elysia, Next.js, Nuxt
- ตรวจ coverage: critical dependency มี auto-instrumentation

## Custom Instrumentation

- Business transaction: custom transaction สำหรับ business flow
- Custom span: span สำหรับ custom logic
- Custom metric: metric สำหรับ business KPI
- ตรวจ custom: business-critical flow มี custom instrumentation

## Performance Overhead

- Agent overhead: CPU, memory, latency overhead
- Sampling rate: ไม่ sample หนักเกินไป
- Memory usage: agent memory footprint
- CPU usage: agent CPU usage
- ตรวจ overhead: agent ไม่กระทบ production performance

## APM Data Retention

- Retention period: ตาม compliance, ตาม cost
- Data sampling: sample old data, keep summary
- Data storage cost: monitor cost, optimize
- ตรวจ retention: มี policy, มี cost monitoring

## APM Alerting

- Error rate alert: error rate spike
- Latency alert: latency regression
- Throughput alert: throughput drop
- Anomaly alert: anomaly detection
- ตรวจ alerting: APM มี alert ครบ

## Severity Criteria

- Critical: APM agent not running, missing auto-instrumentation on critical path, APM overhead causing production issue, no APM alerting
- High: missing custom instrumentation, high overhead, missing APM alerting, no data retention policy
- Medium: suboptimal sampling, missing framework coverage, suboptimal config
- Low: documentation gap, minor naming

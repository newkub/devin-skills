# Service Signoz API & Dependencies

SigNoz ingests OpenTelemetry (OTLP) data — instrument Node/Bun/TypeScript apps with the official OpenTelemetry JS packages, then point the exporter at SigNoz Cloud or a self-hosted collector.

## Install

Zero-code auto-instrumentation (recommended start):

```sh
bun add @opentelemetry/api @opentelemetry/auto-instrumentations-node
# or
npm install @opentelemetry/api @opentelemetry/auto-instrumentations-node
```

Manual/programmatic instrumentation:

```sh
bun add @opentelemetry/sdk-node \
        @opentelemetry/exporter-trace-otlp-http \
        @opentelemetry/exporter-metrics-otlp-http \
        @opentelemetry/exporter-logs-otlp-http \
        @opentelemetry/resources @opentelemetry/semantic-conventions
```

## Version

- `@opentelemetry/api`: 1.9.1
- `@opentelemetry/auto-instrumentations-node`: 0.80.0
- `@opentelemetry/sdk-node`: 0.222.0
- Node.js requirement: `>= 20.6.0` for auto-instrumentation register (18.19+ works but is EOL)
- [Package Registry](https://www.npmjs.com/package/@opentelemetry/auto-instrumentations-node)
- [Repository (JS SDK)](https://github.com/open-telemetry/opentelemetry-js)
- [Repository (contrib instrumentations)](https://github.com/open-telemetry/opentelemetry-js-contrib)
- [SigNoz Repository](https://github.com/SigNoz/signoz)

## Dependencies

- `@opentelemetry/auto-instrumentations-node` pulls in all contrib instrumentations (http, express, fastify, pg, redis, grpc, etc.) automatically.
- Endpoints: self-hosted `http://localhost:4318` (HTTP) / `4317` (gRPC); SigNoz Cloud `https://ingest.<region>.signoz.cloud:443` with `signoz-ingestion-key` header.
- Bun: set `OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf` (gRPC not supported by Bun runtime).

## Common API / Commands

Runtime wiring (environment-driven, no code changes):

| commands | description | default | options |
|---|---|---|---|
| `NODE_OPTIONS="--require @opentelemetry/auto-instrumentations-node/register"` | Load all auto-instrumentations at boot | — | — |
| `OTEL_TRACES_EXPORTER=otlp` | Trace exporter | `otlp` | `console`, `none` |
| `OTEL_EXPORTER_OTLP_ENDPOINT=<url>` | Collector/ingest base URL | — | append `/v1/traces` handled automatically |
| `OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf` | Wire protocol | `http/protobuf` | `grpc`, `http/json` |
| `OTEL_EXPORTER_OTLP_HEADERS="signoz-ingestion-key=<key>"` | Auth header for SigNoz Cloud | — | comma-separated `k=v` pairs |
| `OTEL_SERVICE_NAME=<name>` | `service.name` resource attr | `unknown_service` | — |
| `OTEL_RESOURCE_ATTRIBUTES="service.version=x"` | Extra resource attrs | — | `deployment.environment`, etc. |
| `OTEL_NODE_RESOURCE_DETECTORS="env,host,os"` | Resource detectors | all | `env`, `host`, `os`, `process`, `container` |
| `OTEL_LOGS_EXPORTER=otlp` / `OTEL_METRICS_EXPORTER=otlp` | Enable logs / metrics pipelines | SDK-dependent | `console`, `none` |
| `OTEL_NODE_ENABLED_INSTRUMENTATIONS` / `OTEL_NODE_DISABLED_INSTRUMENTATIONS` | Allow/deny specific instrumentations | all enabled | e.g. `http,express` |

Programmatic API (`@opentelemetry/api` + `@opentelemetry/sdk-node`):

| commands | description | default | options |
|---|---|---|---|
| `new NodeSDK({...})` | Boot the OTel SDK in code (`@opentelemetry/sdk-node`) | — | `traceExporter`, `metricReader`, `instrumentations`, `resource`, `serviceName` |
| `sdk.start()` | Start SDK before app code runs | — | call first in entrypoint |
| `process.on('SIGTERM', () => sdk.shutdown())` | Graceful flush on exit | — | — |
| `trace.getTracer(name, version)` | Get a tracer for manual spans | — | instrumentation scope |
| `tracer.startActiveSpan(name, fn)` | Create + activate a span | — | `attributes`, `kind`, `links` |
| `tracer.startSpan(name)` | Create span without activating | — | `context` parent |
| `span.setAttribute(k, v)` / `span.recordException(err)` / `span.setStatus()` / `span.end()` | Enrich + finish a span | — | `SpanStatusCode.ERROR` |
| `metrics.getMeter(name)` | Get a meter for custom metrics | — | — |
| `meter.createCounter / createHistogram / createObservableGauge` | Metric instruments | — | `unit`, `description`, `valueType` |
| `context.with(trace.setSpan(...), fn)` | Attach span to context | — | propagation helpers in `propagation` API |
| `OTLPTraceExporter({ url, headers })` | HTTP OTLP exporter (`@opentelemetry/exporter-trace-otlp-http`) | — | `url: <endpoint>/v1/traces`, `headers: { 'signoz-ingestion-key': key }` |
| `getNodeAutoInstrumentations()` | Explicit instrumentation set | all on | per-instrumentation config, e.g. `'@opentelemetry/instrumentation-fs': { enabled: false }` |

## Source

- SigNoz Node.js instrumentation: https://signoz.io/docs/instrumentation/opentelemetry-nodejs/
- SigNoz Bun: https://signoz.io/docs/instrumentation/opentelemetry-bun/
- Self-hosted install: https://signoz.io/docs/install/docker/
- OpenTelemetry JS docs: https://opentelemetry.io/docs/languages/js/
- OTel env var spec: https://opentelemetry.io/docs/specs/otel/configuration/sdk-environment-variables/

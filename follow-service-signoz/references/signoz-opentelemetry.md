# SigNoz + OpenTelemetry Reference

## Version Info

- Package: `@opentelemetry/auto-instrumentations-node` v0.79.0
- API Package: `@opentelemetry/api` v1.9.0+
- License: Apache-2.0
- Node.js: >=20.6.0 (Node 18.19.0+ supported but EOL)
- SigNoz Cloud Endpoint: `https://ingest.<region>.signoz.cloud:443`
- Self-Hosted Endpoint: `http://localhost:4318`
- Source: https://signoz.io/docs/instrumentation/opentelemetry-nodejs/

## Install

```bash
# npm
bun add @opentelemetry/api @opentelemetry/auto-instrumentations-node

# Bun
bun add @opentelemetry/api @opentelemetry/auto-instrumentations-node
```

## Environment Variables

### SigNoz Cloud

```bash
export OTEL_TRACES_EXPORTER="otlp"
export OTEL_EXPORTER_OTLP_ENDPOINT="https://ingest.<region>.signoz.cloud:443"
export OTEL_NODE_RESOURCE_DETECTORS="env,host,os"
export OTEL_SERVICE_NAME="<service-name>"
export OTEL_RESOURCE_ATTRIBUTES="service.version=<service-version>"
export OTEL_EXPORTER_OTLP_HEADERS="signoz-ingestion-key=<your-ingestion-key>"
export NODE_OPTIONS="--require @opentelemetry/auto-instrumentations-node/register"
```

### Self-Hosted (Docker)

```bash
export OTEL_TRACES_EXPORTER="otlp"
export OTEL_EXPORTER_OTLP_ENDPOINT="http://localhost:4318"
export OTEL_NODE_RESOURCE_DETECTORS="env,host,os"
export OTEL_SERVICE_NAME="<service-name>"
export OTEL_RESOURCE_ATTRIBUTES="service.version=<service-version>"
export NODE_OPTIONS="--require @opentelemetry/auto-instrumentations-node/register"
```

### Windows (PowerShell)

```powershell
$env:OTEL_TRACES_EXPORTER = "otlp"
$env:OTEL_EXPORTER_OTLP_ENDPOINT = "https://ingest.<region>.signoz.cloud:443"
$env:OTEL_NODE_RESOURCE_DETECTORS = "env,host,os"
$env:OTEL_SERVICE_NAME = "<service-name>"
$env:OTEL_RESOURCE_ATTRIBUTES = "service.version=<service-version>"
$env:OTEL_EXPORTER_OTLP_HEADERS = "signoz-ingestion-key=<your-ingestion-key>"
$env:NODE_OPTIONS = "--require @opentelemetry/auto-instrumentations-node/register"
```

### Environment variable reference

| Variable | Description |
|----------|-------------|
| `OTEL_TRACES_EXPORTER` | Exporter protocol (use `otlp`) |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | SigNoz ingest endpoint |
| `OTEL_NODE_RESOURCE_DETECTORS` | Resource detectors (`env,host,os`) |
| `OTEL_SERVICE_NAME` | Name of your service (e.g. `payment-service`) |
| `OTEL_RESOURCE_ATTRIBUTES` | Additional attributes (e.g. `service.version=1.4.2`) |
| `OTEL_EXPORTER_OTLP_HEADERS` | Auth header for SigNoz Cloud |
| `NODE_OPTIONS` | Auto-registration via `--require` flag |
| `OTEL_METRICS_EXPORTER` | Set to `otlp` to send metrics |
| `OTEL_LOG_LEVEL` | Set to `debug` for troubleshooting |

## Run the Application

```bash
# Node.js
node app.js

# Bun
bun run src/index.ts
```

## Docker Setup

```dockerfile
# Install OpenTelemetry packages
RUN bun add @opentelemetry/api@^1.9.0 @opentelemetry/auto-instrumentations-node

# Set environment variables
ENV OTEL_TRACES_EXPORTER="otlp"
ENV OTEL_EXPORTER_OTLP_ENDPOINT="https://ingest.<region>.signoz.cloud:443"
ENV OTEL_NODE_RESOURCE_DETECTORS="env,host,os"
ENV OTEL_SERVICE_NAME="<service-name>"
ENV OTEL_RESOURCE_ATTRIBUTES="service.version=<service-version>"
ENV OTEL_EXPORTER_OTLP_HEADERS="signoz-ingestion-key=<your-ingestion-key>"
ENV NODE_OPTIONS="--require @opentelemetry/auto-instrumentations-node/register"
```

## Kubernetes Deployment

```yaml
env:
  - name: OTEL_TRACES_EXPORTER
    value: 'otlp'
  - name: OTEL_EXPORTER_OTLP_ENDPOINT
    value: 'https://ingest.<region>.signoz.cloud:443'
  - name: OTEL_NODE_RESOURCE_DETECTORS
    value: 'env,host,os'
  - name: OTEL_SERVICE_NAME
    value: '<service-name>'
  - name: OTEL_RESOURCE_ATTRIBUTES
    value: 'service.version=<service-version>'
  - name: OTEL_EXPORTER_OTLP_HEADERS
    value: 'signoz-ingestion-key=<your-ingestion-key>'
  - name: NODE_OPTIONS
    value: '--require @opentelemetry/auto-instrumentations-node/register'
```

## SigNoz Self-Hosted Installation (Docker)

```bash
# Install via Foundry
curl -fsSL https://signoz.io/foundry.sh | bash

# Create casting.yaml
# flavor: compose
# mode: docker

# Deploy
foundryctl cast -f casting.yaml
```

## TypeScript Entry Point

If the TypeScript entry does not work with auto-instrumentation, add an explicit import:

```ts
import '@opentelemetry/auto-instrumentations-node/register'
```

## Bun-Specific Notes

- Test with `OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf` and adjust based on results
- Bun may require explicit import instead of `NODE_OPTIONS`

## Verification

1. Open SigNoz UI at `http://localhost:8080` (self-hosted) or SigNoz Cloud URL
2. Check service name in Services page
3. View traces in Traces page
4. View logs in Logs Explorer
5. View metrics in Metrics Explorer or Dashboards
6. If no data appears within 5 minutes, check ingestion key, endpoint, and firewall
7. Enable `OTEL_LOG_LEVEL=debug` for troubleshooting

## Metrics and Logs

```bash
# Enable metrics export
export OTEL_METRICS_EXPORTER="otlp"

# Logs are sent via OTLP logs exporter or OpenTelemetry Collector
```

## Sources

- Node.js Instrumentation: https://signoz.io/docs/instrumentation/opentelemetry-nodejs/
- Docker Install: https://signoz.io/docs/install/docker/
- Cloud vs Self-Hosted: https://signoz.io/docs/ingestion/cloud-vs-self-hosted/
- Alerts Management: https://signoz.io/docs/userguide/alerts-management/

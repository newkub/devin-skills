---
name: follow-service-signoz
description: Connect SigNoz observability for Node/Bun/TypeScript via OpenTelemetry
argument-hint: "[scope]"
related:
  - follow-service-aws-sdk
  - follow-service-cloudflare
  - follow-secret-manager
  - follow-best-practice
  - learn
  - setup-cicd

---

## Goal

Add observability to Bun/Node/TypeScript apps with SigNoz via OpenTelemetry — covering traces, metrics, and logs

## Scope

- Set up SigNoz Cloud or self-hosted via Docker
- Use OpenTelemetry auto-instrumentation for Node.js and Bun
- Send traces, logs, and metrics with alerts and dashboards configured
- Does not cover infrastructure monitoring outside this scope such as Kubernetes operators

## Execute

### Workflows

> Goal: dispatch to the workflow matching the topic

- Setup: SigNoz endpoint, OTel SDK install, instrumentation → `## Merged Details → setup-signoz`
- Config: `OTEL_*` env vars, service name, traces/metrics/logs exporters → `## Merged Details → config-signoz`
- Verify: endpoint reachable, telemetry flowing, service visible → `## Merged Details → verify-connection`

### 1. Assess Project And Prepare SigNoz

> Goal: Check runtime, endpoint, and ingestion key before installing

Determine what kind of backend the project is and which runtime it uses.

1. Read `package.json` to identify the runtime such as `bun`, `node`, or TypeScript
2. Decide whether to use `SigNoz Cloud` or `self-hosted`
3. For `self-hosted`, use `webfetch` to read `https://signoz.io/docs/install/docker/`
4. Install SigNoz self-hosted via Foundry:
   - Run `curl -fsSL https://signoz.io/foundry.sh | bash`
   - Create `casting.yaml` with `flavor: compose` and `mode: docker`
   - Run `foundryctl cast -f casting.yaml`
5. Identify the correct endpoint, e.g. `http://localhost:4318` for self-hosted or `https://ingest.<region>.signoz.cloud:443` for cloud
6. For SigNoz Cloud, prepare the ingestion key for use

### 2. Instrument The Application

> Goal: Install telemetry so SigNoz can receive data

Install the required OpenTelemetry instrumentation.

Latest: `@opentelemetry/auto-instrumentations-node@0.80.0` (verified 2026-09-12)

1. Install the required packages:
   - `bun add @opentelemetry/api @opentelemetry/auto-instrumentations-node`
   - For Bun use `bun add @opentelemetry/api @opentelemetry/auto-instrumentations-node`
2. Set environment variables in `.env` or the shell:
   - `OTEL_TRACES_EXPORTER=otlp`
   - `OTEL_EXPORTER_OTLP_ENDPOINT=<your-endpoint>`
   - `OTEL_SERVICE_NAME=<service-name>`
   - `OTEL_RESOURCE_ATTRIBUTES=service.version=<version>`
   - `OTEL_EXPORTER_OTLP_HEADERS=signoz-ingestion-key=<key>` for cloud
   - `NODE_OPTIONS=--require @opentelemetry/auto-instrumentations-node/register`
3. For Bun, always set `OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf`
4. Run `bun run src/index.ts` or `node app.js` with instrumentation
5. If the TypeScript entry has problems, switch to `import '@opentelemetry/auto-instrumentations-node/register'` instead of `require(...)` because the require hook may not work

### 3. Send Logs, Metrics, And Traces

> Goal: Send traces, logs, and metrics to the SigNoz UI

Configure all three telemetry signals.

1. Use `webfetch` to read `https://signoz.io/docs/instrumentation/opentelemetry-nodejs/` for additional environment variables
2. Set `OTEL_METRICS_EXPORTER=otlp` to send metrics
3. Send logs via the OTLP logs exporter or an OpenTelemetry Collector per the architecture
4. Check the console for errors and confirm exporters work correctly
5. If telemetry does not appear, set `OTEL_LOG_LEVEL=debug` to debug

### 4. Verify Data In SigNoz

> Goal: Confirm data really enters the system

Inspect telemetry through the SigNoz UI.

1. Open the UI at `http://localhost:8080` or the SigNoz Cloud URL
2. Check the service name under Services and Traces
3. View logs under Logs Explorer
4. View metrics under Metrics Explorer or Dashboards
5. If no data arrives within 5 minutes, check the ingestion key, endpoint, and firewall

### 5. Configure Dashboards And Alerts

> Goal: Set up monitors for real use

Create the needed dashboards and alerts.

1. Use `webfetch` to read `https://signoz.io/docs/userguide/alerts-management/`
2. Create a dashboard with panels such as request rate, latency, error rate
3. Set alert rules with suitable thresholds such as `p95 latency > 500ms` or `error rate > 5%`
4. Configure the desired notification channel through SigNoz
5. Save the configuration into references if needed

## Rules

### 1. General Safety

- Keep the ingestion key and secrets away from code
- Put the endpoint and key in `.env` or a secret manager
- Test observability before deploying to production

### 2. Documentation And Verification

- Use `webfetch` or `learn` (web) to check the latest SigNoz docs
- Always verify that traces and logs really appear in the UI
- Use backticks for `commands`, `paths`, `skills`, and `environment variables`

### 3. Scope And Exit

- Limit the scope to Bun/Node/TypeScript only
- If telemetry cannot be confirmed within 3 rounds, stop and report

- Use /follow-service-aws-sdk if needed
- Use /follow-service-cloudflare if needed
- Use /follow-secret-manager if needed
- Use /follow-best-practice if needed
- Use /setup-cicd if needed

## Merged Details

### config-signoz

##### Goal

Set/edit OpenTelemetry configuration for SigNoz — service name, resource attributes, traces/metrics/logs exporters, and headers — without clobbering the existing env

##### Scope

- Edit `OTEL_*` env vars for Bun/Node/TypeScript
- Separate config per environment (dev/staging/prod)
- Set headers (`signoz-ingestion-key`), protocol, and resource attributes
- Does not cover first-time install → use `## Merged Details → setup-signoz`

##### Execute

###### 1. Read Current Config

> Goal: Know the current env vars before editing

1. Read `.env*`, start scripts, and existing instrumentation entries
2. Do `/check-secrets env-vars` to identify missing or duplicated `OTEL_*` vars
3. Do `/deep-review` domain `review-config` across environments if needed
4. If there are no OTel packages yet → do `## Merged Details → setup-signoz` instead

###### 2. Configure Service Identity

> Goal: Set service name and resource attributes so it is searchable in the UI

1. Set `OTEL_SERVICE_NAME=<service-name>` matching the real service name
2. Set `OTEL_RESOURCE_ATTRIBUTES=service.version=<version>` and additional attributes such as `deployment.environment=<env>`
3. Use the same name across all instances of one service — merge only the necessary keys

###### 3. Configure Exporters

> Goal: Send all three signals — traces, metrics, logs

1. Set `OTEL_TRACES_EXPORTER=otlp`, `OTEL_METRICS_EXPORTER=otlp`, `OTEL_LOGS_EXPORTER=otlp` per the wanted signals
2. Set `OTEL_EXPORTER_OTLP_ENDPOINT=<endpoint>` — separate per-signal endpoints if needed
3. Cloud: set `OTEL_EXPORTER_OTLP_HEADERS=signoz-ingestion-key=<key>` — key from `/follow-secret-manager`
4. For Bun, always set `OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf`
5. Logs: use the OTLP logs exporter or route through an OpenTelemetry Collector per the architecture — see official docs

###### 4. Verify

> Goal: Confirm all three telemetry signals really reach the UI

1. Restart the app with the new env and send test traffic
2. Check Traces, Logs Explorer, and Metrics Explorer in the SigNoz UI
3. If nothing appears → set `OTEL_LOG_LEVEL=debug` to see exporter errors, check headers/endpoint/protocol
4. Do `/run-verify` — if it fails → revert the keys just changed, do `resolve-errors`, then report the diff

##### Rules

- Merge only the necessary `OTEL_*` keys — never overwrite the whole `.env`
- Store the ingestion key in `/follow-secret-manager` — never in a committed config file
- `service.name` must stay consistent across environments (separate with `deployment.environment`)
- Use official docs as the primary source — do `learn` (web) if unsure
- If telemetry cannot be confirmed within 3 rounds → stop and report

##### Expected Outcome

- `OTEL_*` config complete and clearly separated per environment
- Traces, metrics, and logs appear in the SigNoz UI under the correct service name
- No secrets leaking into config files

### setup-signoz

##### Goal

Prepare the SigNoz backend (cloud or self-hosted), install the OpenTelemetry SDK, and instrument the Bun/Node/TypeScript app so it can send telemetry — first-time setup only

##### Scope

- Choose and prepare SigNoz Cloud or self-hosted via Docker/Foundry
- Install `@opentelemetry/api` and `@opentelemetry/auto-instrumentations-node`
- Set the minimum endpoint and ingestion key so telemetry can send
- Does not cover detailed service name, exporters, dashboards → use `## Merged Details → config-signoz`

##### Execute

###### 1. Check Prerequisites

> Goal: Identify the runtime and pick the deployment mode (idempotent)

1. Read `package.json` to identify the runtime (`bun`, `node`, TypeScript)
2. Check whether OTel packages or instrumentation already exist → if so, skip to verify
3. Decide `SigNoz Cloud` or `self-hosted` — self-hosted requires Docker
4. If there is no SigNoz account/endpoint → stop and tell the user

###### 2. Prepare SigNoz Endpoint

> Goal: Get the correct endpoint and ingestion key

1. Cloud: prepare `https://ingest.<region>.signoz.cloud:443` and the ingestion key from the dashboard
2. Self-hosted: install via Foundry or Docker per `https://signoz.io/docs/install/docker/` — a local endpoint such as `http://localhost:4318`
3. Store the ingestion key in `/follow-secret-manager`, then inject it into env
4. Confirm the endpoint is reachable before instrumenting

###### 3. Install OTel SDK

> Goal: Install auto-instrumentation

1. Install with `bun add @opentelemetry/api @opentelemetry/auto-instrumentations-node`
2. Set `NODE_OPTIONS=--require @opentelemetry/auto-instrumentations-node/register` for Node
3. For Bun/TS entries where the require hook does not work → use `import '@opentelemetry/auto-instrumentations-node/register'` as the first line of the entry instead
4. Set the minimum env: `OTEL_TRACES_EXPORTER=otlp`, `OTEL_EXPORTER_OTLP_ENDPOINT=<endpoint>`, `OTEL_SERVICE_NAME=<name>`

###### 4. Verify Telemetry

> Goal: Confirm traces really reach the SigNoz UI

1. Run the app with instrumentation and send test requests
2. Open the SigNoz UI and check Services/Traces for the service name
3. If it does not appear within 5 minutes → check endpoint, ingestion key, protocol, then set `OTEL_LOG_LEVEL=debug`
4. If it still fails → do `resolve-errors` max 3 rounds, then stop and report

##### Rules

- Limit the scope to Bun/Node/TypeScript only — for other runtimes check official docs
- Store the ingestion key in `/follow-secret-manager` — never hardcode or commit
- Use official docs (`learn` (web)/`webfetch`) as the primary source when unsure about an env var
- If telemetry cannot be confirmed within 3 rounds → stop and report

##### Expected Outcome

- OTel SDK installed and the app runs with instrumentation
- Endpoint/ingestion key correct and secure
- Traces really appear in the SigNoz UI

### verify-connection

##### Goal

Confirm after setup/config that OTel telemetry really flows into SigNoz — endpoint reachable, ingestion key valid, service visible in SigNoz

##### Scope

- Used when `/follow-service-signoz` dispatches to `verify`/`verify-connection`
- Read-only: check only — do not change instrumentation

##### Execute

###### 1. Check Endpoint Config

> Goal: OTel env vars complete and endpoint correct

1. Check `OTEL_EXPORTER_OTLP_ENDPOINT`, `OTEL_SERVICE_NAME`, and the ingestion key/`SIGNOZ_INGESTION_KEY` exist
2. `curl -sI <endpoint>` or the health endpoint — endpoint reachable

###### 2. Check Telemetry Flow

> Goal: data really enters SigNoz

1. Run the app briefly or send a test span — confirm the SDK throws no connection errors
2. Check in the SigNoz UI/API that `OTEL_SERVICE_NAME` appears in the services list
3. Flag: endpoint reachable but no data → wrong ingestion key or misconfigured exporter

###### 3. Report

> Goal: Summarize connection status

1. Use `/report` columns: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `endpoint-down` / `auth-failed` / `no-data-flowing`

##### Rules

- Do not print the ingestion key
- `no-data-flowing` = endpoint OK but no telemetry — flag separately from endpoint-down
- Record the service name seen in SigNoz as evidence

##### Expected Outcome

- Verdict with endpoint/service evidence

### references/apis

#### Service Signoz API & Dependencies

SigNoz ingests OpenTelemetry (OTLP) data — instrument Node/Bun/TypeScript apps with the official OpenTelemetry JS packages, then point the exporter at SigNoz Cloud or a self-hosted collector.

##### Install

Zero-code auto-instrumentation (recommended start):

```sh
bun add @opentelemetry/api @opentelemetry/auto-instrumentations-node
#### or
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

##### Version

- `@opentelemetry/api`: 1.9.1
- `@opentelemetry/auto-instrumentations-node`: 0.80.0
- `@opentelemetry/sdk-node`: 0.222.0
- Node.js requirement: `>= 20.6.0` for auto-instrumentation register (18.19+ works but is EOL)
- [Package Registry](https://www.npmjs.com/package/@opentelemetry/auto-instrumentations-node)
- [Repository (JS SDK)](https://github.com/open-telemetry/opentelemetry-js)
- [Repository (contrib instrumentations)](https://github.com/open-telemetry/opentelemetry-js-contrib)
- [SigNoz Repository](https://github.com/SigNoz/signoz)

##### Dependencies

- `@opentelemetry/auto-instrumentations-node` pulls in all contrib instrumentations (http, express, fastify, pg, redis, grpc, etc.) automatically.
- Endpoints: self-hosted `http://localhost:4318` (HTTP) / `4317` (gRPC); SigNoz Cloud `https://ingest.<region>.signoz.cloud:443` with `signoz-ingestion-key` header.
- Bun: set `OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf` (gRPC not supported by Bun runtime).

##### Common API / Commands

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

##### Source

- SigNoz Node.js instrumentation: https://signoz.io/docs/instrumentation/opentelemetry-nodejs/
- SigNoz Bun: https://signoz.io/docs/instrumentation/opentelemetry-nodejs/
- Self-hosted install: https://signoz.io/docs/install/docker/
- OpenTelemetry JS docs: https://opentelemetry.io/docs/languages/js/
- OTel env var spec: https://opentelemetry.io/docs/specs/otel/configuration/sdk-environment-variables/

### references/package-manifest

#### Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/deep-review` runs.

##### Primary Package

| Field | Value |
|-------|-------|
| Package | `@opentelemetry/auto-instrumentations-node` |
| Registry | `npm` |
| Latest Version | `0.80.0` |
| Release Date | `2026-08-31` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | OpenTelemetry Authors (CNCF) |
| License | `Apache-2.0` |
| Repository | `https://github.com/open-telemetry/opentelemetry-js-contrib` |
| Website | `https://opentelemetry.io/` |
| Documentation | `https://signoz.io/docs/instrumentation/opentelemetry-nodejs/` |
| Releases / Changelog | `https://github.com/open-telemetry/opentelemetry-js-contrib/releases` |

##### Install

```bash
bun add @opentelemetry/api @opentelemetry/auto-instrumentations-node
```

##### Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@opentelemetry/api` | `npm` | `1.9.1` | Stable API surface used alongside auto-instrumentation |
| SigNoz (self-hosted) | `system` | `unknown` | Deployed via Docker/Foundry (`foundryctl cast`), not a package — see `https://signoz.io/docs/install/docker/` |

##### Notes

- Breaking changes in latest major: `0.x` — instrumentation config may shift between minors; Bun requires `OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf`
- Version pinned in SKILL.md: `0.80.0`

### references/routes

#### Follow Service Signoz Route Map

- Website: <https://github.com/open-telemetry/opentelemetry-js/tree/main/api>
- Routes discovered (homepage): 30

##### Routes

- /collections
- /customer-stories
- /enterprise
- /enterprise/premium-support
- /enterprise/startups
- /features
- /features/actions
- /features/ai/github-app
- /features/code-quality
- /features/code-review
- /features/codespaces
- /features/copilot
- /features/copilot/copilot-business
- /features/issues
- /login
- /marketplace
- /mcp
- /open-source/sponsors
- /open-telemetry
- /open-telemetry/opentelemetry-js
- /open-telemetry/opentelemetry-js-api/issues/46
- /open-telemetry/opentelemetry-js-api/issues/78
- /open-telemetry/opentelemetry-js-api/pull/45
- /open-telemetry/opentelemetry-js-api/pull/47
- /open-telemetry/opentelemetry-js-api/pull/55
- /open-telemetry/opentelemetry-js/actions
- /open-telemetry/opentelemetry-js/blob/main/api/CHANGELOG.md
- /open-telemetry/opentelemetry-js/blob/main/api/LICENSE
- /open-telemetry/opentelemetry-js/blob/main/api/README.md
- /open-telemetry/opentelemetry-js/blob/main/api/karma.conf.js

### references/signoz-opentelemetry

#### SigNoz + OpenTelemetry Reference

##### Version Info

- Package: `@opentelemetry/auto-instrumentations-node` v0.80.0
- API Package: `@opentelemetry/api` v1.9.1+
- License: Apache-2.0
- Node.js: >=20.6.0 (Node 18.19.0+ supported but EOL)
- SigNoz Cloud Endpoint: `https://ingest.<region>.signoz.cloud:443`
- Self-Hosted Endpoint: `http://localhost:4318`
- Source: https://signoz.io/docs/instrumentation/opentelemetry-nodejs/

##### Install

```bash
#### npm
bun add @opentelemetry/api @opentelemetry/auto-instrumentations-node

#### Bun
bun add @opentelemetry/api @opentelemetry/auto-instrumentations-node
```

##### Environment Variables

###### SigNoz Cloud

```bash
export OTEL_TRACES_EXPORTER="otlp"
export OTEL_EXPORTER_OTLP_ENDPOINT="https://ingest.<region>.signoz.cloud:443"
export OTEL_NODE_RESOURCE_DETECTORS="env,host,os"
export OTEL_SERVICE_NAME="<service-name>"
export OTEL_RESOURCE_ATTRIBUTES="service.version=<service-version>"
export OTEL_EXPORTER_OTLP_HEADERS="signoz-ingestion-key=<your-ingestion-key>"
export NODE_OPTIONS="--require @opentelemetry/auto-instrumentations-node/register"
```

###### Self-Hosted (Docker)

```bash
export OTEL_TRACES_EXPORTER="otlp"
export OTEL_EXPORTER_OTLP_ENDPOINT="http://localhost:4318"
export OTEL_NODE_RESOURCE_DETECTORS="env,host,os"
export OTEL_SERVICE_NAME="<service-name>"
export OTEL_RESOURCE_ATTRIBUTES="service.version=<service-version>"
export NODE_OPTIONS="--require @opentelemetry/auto-instrumentations-node/register"
```

###### Windows (PowerShell)

```powershell
$env:OTEL_TRACES_EXPORTER = "otlp"
$env:OTEL_EXPORTER_OTLP_ENDPOINT = "https://ingest.<region>.signoz.cloud:443"
$env:OTEL_NODE_RESOURCE_DETECTORS = "env,host,os"
$env:OTEL_SERVICE_NAME = "<service-name>"
$env:OTEL_RESOURCE_ATTRIBUTES = "service.version=<service-version>"
$env:OTEL_EXPORTER_OTLP_HEADERS = "signoz-ingestion-key=<your-ingestion-key>"
$env:NODE_OPTIONS = "--require @opentelemetry/auto-instrumentations-node/register"
```

###### Environment variable reference

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

##### Run the Application

```bash
#### Node.js
node app.js

#### Bun
bun run src/index.ts
```

##### Docker Setup

```dockerfile
#### Install OpenTelemetry packages
RUN bun add @opentelemetry/api@^1.9.1 @opentelemetry/auto-instrumentations-node

#### Set environment variables
ENV OTEL_TRACES_EXPORTER="otlp"
ENV OTEL_EXPORTER_OTLP_ENDPOINT="https://ingest.<region>.signoz.cloud:443"
ENV OTEL_NODE_RESOURCE_DETECTORS="env,host,os"
ENV OTEL_SERVICE_NAME="<service-name>"
ENV OTEL_RESOURCE_ATTRIBUTES="service.version=<service-version>"
ENV OTEL_EXPORTER_OTLP_HEADERS="signoz-ingestion-key=<your-ingestion-key>"
ENV NODE_OPTIONS="--require @opentelemetry/auto-instrumentations-node/register"
```

##### Kubernetes Deployment

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

##### SigNoz Self-Hosted Installation (Docker)

```bash
#### Install via Foundry
curl -fsSL https://signoz.io/foundry.sh | bash

#### Create casting.yaml
#### flavor: compose
#### mode: docker

#### Deploy
foundryctl cast -f casting.yaml
```

##### TypeScript Entry Point

If the TypeScript entry does not work with auto-instrumentation, add an explicit import:

```ts
import '@opentelemetry/auto-instrumentations-node/register'
```

##### Bun-Specific Notes

- Test with `OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf` and adjust based on results
- Bun may require explicit import instead of `NODE_OPTIONS`

##### Verification

1. Open SigNoz UI at `http://localhost:8080` (self-hosted) or SigNoz Cloud URL
2. Check service name in Services page
3. View traces in Traces page
4. View logs in Logs Explorer
5. View metrics in Metrics Explorer or Dashboards
6. If no data appears within 5 minutes, check ingestion key, endpoint, and firewall
7. Enable `OTEL_LOG_LEVEL=debug` for troubleshooting

##### Metrics and Logs

```bash
#### Enable metrics export
export OTEL_METRICS_EXPORTER="otlp"

#### Logs are sent via OTLP logs exporter or OpenTelemetry Collector
```

##### Sources

- Node.js Instrumentation: https://signoz.io/docs/instrumentation/opentelemetry-nodejs/
- Docker Install: https://signoz.io/docs/install/docker/
- Cloud vs Self-Hosted: https://signoz.io/docs/ingestion/cloud-vs-self-hosted/
- Alerts Management: https://signoz.io/docs/userguide/alerts-management/

### references/website

#### Service Signoz Official Resources

- [Website](https://github.com/open-telemetry/opentelemetry-js/tree/main/api)
- [Documentation](https://github.com/open-telemetry/opentelemetry-js/blob/main/doc/tracing.md)
- [Repository](https://github.com/open-telemetry/opentelemetry-js)
- [Package Registry](https://www.npmjs.com/package/@opentelemetry/api)
- About: OpenTelemetry JavaScript Client.

## Expected Outcome

- The Bun/Node/TypeScript app successfully sends traces, metrics, and logs to SigNoz
- Data is verifiable through the SigNoz UI
- Dashboards and alerts are configured
- No configuration or secrets leaking into code

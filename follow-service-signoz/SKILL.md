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

- Setup: SigNoz endpoint, OTel SDK install, instrumentation → `workflows/setup-signoz/SKILL.md`
- Config: `OTEL_*` env vars, service name, traces/metrics/logs exporters → `workflows/config-signoz/SKILL.md`
- Verify: endpoint reachable, telemetry flowing, service visible → `workflows/verify-connection/SKILL.md`

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


## Expected Outcome

- The Bun/Node/TypeScript app successfully sends traces, metrics, and logs to SigNoz
- Data is verifiable through the SigNoz UI
- Dashboards and alerts are configured
- No configuration or secrets leaking into code

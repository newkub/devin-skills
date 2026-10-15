---
name: follow-service-signoz-verify-connection
description: Confirm after setup/config that OTel telemetry really flows into SigNoz — endpoint reachable, ingestion key valid, service visible in SigNoz
related:
  - follow-service-signoz
---

## Goal

Confirm after setup/config that OTel telemetry really flows into SigNoz — endpoint reachable, ingestion key valid, service visible in SigNoz

## Scope

- Used when `/follow-service-signoz` dispatches to `verify`/`verify-connection`
- Read-only: check only — do not change instrumentation

## Execute

### 1. Check Endpoint Config

> Goal: OTel env vars complete and endpoint correct

1. Check `OTEL_EXPORTER_OTLP_ENDPOINT`, `OTEL_SERVICE_NAME`, and the ingestion key/`SIGNOZ_INGESTION_KEY` exist
2. `curl -sI <endpoint>` or the health endpoint — endpoint reachable

### 2. Check Telemetry Flow

> Goal: data really enters SigNoz

1. Run the app briefly or send a test span — confirm the SDK throws no connection errors
2. Check in the SigNoz UI/API that `OTEL_SERVICE_NAME` appears in the services list
3. Flag: endpoint reachable but no data → wrong ingestion key or misconfigured exporter

### 3. Report

> Goal: Summarize connection status

1. Use `/report` columns: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `endpoint-down` / `auth-failed` / `no-data-flowing`

## Rules

- Do not print the ingestion key
- `no-data-flowing` = endpoint OK but no telemetry — flag separately from endpoint-down
- Record the service name seen in SigNoz as evidence

## Expected Outcome

- Verdict with endpoint/service evidence

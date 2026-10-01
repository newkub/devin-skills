---
name: follow-service-signoz
description: เชื่อมต่อ SigNoz observability สำหรับ Node/Bun/TypeScript ผ่าน OpenTelemetry
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

เพิ่ม observability ให้แอป Bun/Node/TypeScript ด้วย SigNoz ผ่าน OpenTelemetry — ครอบคลุม traces, metrics และ logs

## Scope

- ตั้งค่า SigNoz Cloud หรือ self-hosted ผ่าน Docker
- ใช้ OpenTelemetry auto-instrumentation สำหรับ Node.js และ Bun
- ส่ง traces, logs, metrics พร้อมตั้งค่า alerts และ dashboards
- ไม่ครอบคลุม infrastructure monitoring นอก scope นี้ เช่น Kubernetes operator

## Execute

### Workflows

> Goal: dispatch ไปยัง workflow ที่ตรงกับ topic

- Setup: SigNoz endpoint, OTel SDK install, instrumentation → `workflows/setup-signoz/SKILL.md`
- Config: `OTEL_*` env vars, service name, traces/metrics/logs exporters → `workflows/config-signoz/SKILL.md`
- Verify: endpoint reachable, telemetry ไหลเข้า, service ปรากฏ → `workflows/verify-connection/SKILL.md`

### 1. Assess Project And Prepare SigNoz

> Goal: ตรวจ runtime, endpoint และ ingestion key ก่อนติดตั้ง

ตรวจสอบว่าโปรเจกต์เป็น backend แบบใดและ runtime อะไร

1. อ่าน `package.json` เพื่อระบุ runtime เช่น `bun`, `node` หรือ TypeScript
2. ตัดสินใจว่าจะใช้ `SigNoz Cloud` หรือ `self-hosted`
3. ถ้าใช้ `self-hosted` ให้ `webfetch` อ่าน `https://signoz.io/docs/install/docker/`
4. ติดตั้ง SigNoz self-hosted ผ่าน Foundry:
   - รัน `curl -fsSL https://signoz.io/foundry.sh | bash`
   - สร้าง `casting.yaml` โดยระบุ `flavor: compose` และ `mode: docker`
   - รัน `foundryctl cast -f casting.yaml`
5. ระบุ endpoint ที่ถูกต้อง เช่น `http://localhost:4318` สำหรับ self-hosted หรือ `https://ingest.<region>.signoz.cloud:443` สำหรับ cloud
6. ถ้าใช้ SigNoz Cloud ให้เตรียม ingestion key ไว้ใช้งาน

### 2. Instrument The Application

> Goal: ติดตั้ง telemetry ให้ SigNoz รับข้อมูลได้

ติดตั้ง OpenTelemetry instrumentation ที่จำเป็น

Latest: `@opentelemetry/auto-instrumentations-node@0.80.0` (verified 2026-09-12)

1. ติดตั้ง package ที่จำเป็น:
   - `bun add @opentelemetry/api @opentelemetry/auto-instrumentations-node`
   - สำหรับ Bun ใช้ `bun add @opentelemetry/api @opentelemetry/auto-instrumentations-node`
2. ตั้งค่า environment variables ใน `.env` หรือ shell:
   - `OTEL_TRACES_EXPORTER=otlp`
   - `OTEL_EXPORTER_OTLP_ENDPOINT=<your-endpoint>`
   - `OTEL_SERVICE_NAME=<service-name>`
   - `OTEL_RESOURCE_ATTRIBUTES=service.version=<version>`
   - `OTEL_EXPORTER_OTLP_HEADERS=signoz-ingestion-key=<key>` สำหรับ cloud
   - `NODE_OPTIONS=--require @opentelemetry/auto-instrumentations-node/register`
3. สำหรับ Bun ให้ตั้ง `OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf` เสมอ
4. รัน `bun run src/index.ts` หรือ `node app.js` พร้อม instrumentation
5. ถ้า TypeScript entry มีปัญหาให้เปลี่ยนเป็น `import '@opentelemetry/auto-instrumentations-node/register'` แทน `require(...)` เพราะ require hook อาจไม่ทำงาน

### 3. Send Logs, Metrics, And Traces

> Goal: ส่ง traces, logs, metrics ไป SigNoz UI

ตั้งค่า telemetry ให้ครบทั้งสามอย่าง

1. ใช้ `webfetch` อ่าน `https://signoz.io/docs/instrumentation/opentelemetry-nodejs/` เพื่อดู environment variables เพิ่มเติม
2. ตั้งค่า `OTEL_METRICS_EXPORTER=otlp` เพื่อส่ง metrics
3. ส่ง logs ผ่าน OTLP logs exporter หรือ OpenTelemetry Collector ตาม architecture
4. ตรวจสอบ console ว่ามี error หรือ exporter ทำงานถูกต้องหรือไม่
5. ถ้า telemetry ไม่ขึ้น ให้ตั้ง `OTEL_LOG_LEVEL=debug` เพื่อ debug

### 4. Verify Data In SigNoz

> Goal: ยืนยันว่าข้อมูลเข้าระบบจริง

ตรวจสอบ telemetry ผ่าน SigNoz UI

1. เปิด UI ที่ `http://localhost:8080` หรือ URL ของ SigNoz Cloud
2. ตรวจสอบ service name ภายใต้ Services และ Traces
3. ดู logs ภายใต้ Logs Explorer
4. ดู metrics ภายใต้ Metrics Explorer หรือ Dashboards
5. ถ้าข้อมูลไม่เข้าใน 5 นาที ให้ตรวจ ingestion key, endpoint, และ firewall

### 5. Configure Dashboards And Alerts

> Goal: ตั้งค่า monitor ให้ใช้งานจริง

สร้าง dashboard และ alert ที่จำเป็น

1. ใช้ `webfetch` อ่าน `https://signoz.io/docs/userguide/alerts-management/`
2. สร้าง dashboard พร้อม panels เช่น request rate, latency, error rate
3. ตั้ง alert rule ตามเกณฑ์ที่เหมาะสม เช่น `p95 latency > 500ms` หรือ `error rate > 5%`
4. ตั้งค่า notification channel ผ่าน SigNoz ที่ต้องการ
5. บันทึก configuration ลง reference ถ้าจำเป็น

## Rules

### 1. General Safety

- เก็บ ingestion key และ secrets ห่างจาก code
- ตั้งค่า endpoint และ key ใน `.env` หรือ secret manager
- ทดสอบ observability ก่อน deploy ไป production

### 2. Documentation And Verification

- ใช้ `webfetch` หรือ `learn` (web) เพื่อดูเอกสารล่าสุดของ SigNoz
- ตรวจสอบเสมอว่า traces และ logs ขึ้นใน UI จริง
- ใช้ backticks สำหรับ `commands`, `paths`, `skills`, และ `environment variables`

### 3. Scope And Exit

- จำกัด scope ที่ Bun/Node/TypeScript เท่านั้น
- ถ้าไม่สามารถยืนยัน telemetry ได้ใน 3 รอบ ให้หยุดและรายงาน

- ใช้ /follow-service-aws-sdk ถ้าจำเป็น
- ใช้ /follow-service-cloudflare ถ้าจำเป็น
- ใช้ /follow-secret-manager ถ้าจำเป็น
- ใช้ /follow-best-practice ถ้าจำเป็น
- ใช้ /setup-cicd ถ้าจำเป็น

## Merged Details

### config-signoz

##### Goal

ตั้งค่า/แก้ไข OpenTelemetry configuration สำหรับ SigNoz — service name, resource attributes, traces/metrics/logs exporters และ headers — โดยไม่ clobber env เดิม

##### Scope

- แก้ `OTEL_*` env vars สำหรับ Bun/Node/TypeScript
- แยก config ตาม environment (dev/staging/prod)
- ตั้ง headers (`signoz-ingestion-key`), protocol และ resource attributes
- ไม่ครอบคลุม first-time install → ใช้ `workflows/setup-signoz/SKILL.md`

##### Execute

###### 1. Read Current Config

> Goal: รู้ env vars ปัจจุบันก่อนแก้

1. อ่าน `.env*`, start scripts และ instrumentation entry ที่มีอยู่
2. ทำ `/check-secrets env-vars` เพื่อระบุ `OTEL_*` vars ที่ขาดหรือซ้ำ
3. ทำ `/deep-review` domain `review-config` ระหว่าง environments ถ้าจำเป็น
4. ถ้ายังไม่มี OTel packages → ทำ `workflows/setup-signoz/SKILL.md` แทน

###### 2. Configure Service Identity

> Goal: ตั้ง service name และ resource attributes ให้ค้นใน UI ได้

1. ตั้ง `OTEL_SERVICE_NAME=<service-name>` ให้ตรงกับชื่อ service จริง
2. ตั้ง `OTEL_RESOURCE_ATTRIBUTES=service.version=<version>` และ attributes เพิ่มเติม เช่น `deployment.environment=<env>`
3. ใช้ชื่อเดียวกันข้ามทุก instance ของ service เดียวกัน — merge เฉพาะ keys ที่จำเป็น

###### 3. Configure Exporters

> Goal: ส่ง traces, metrics, logs ครบสาม signal

1. ตั้ง `OTEL_TRACES_EXPORTER=otlp`, `OTEL_METRICS_EXPORTER=otlp`, `OTEL_LOGS_EXPORTER=otlp` ตาม signals ที่ต้องการ
2. ตั้ง `OTEL_EXPORTER_OTLP_ENDPOINT=<endpoint>` — แยก per-signal endpoint ถ้าจำเป็น
3. Cloud: ตั้ง `OTEL_EXPORTER_OTLP_HEADERS=signoz-ingestion-key=<key>` — key จาก `/follow-secret-manager`
4. สำหรับ Bun ตั้ง `OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf` เสมอ
5. Logs: ใช้ OTLP logs exporter หรือ route ผ่าน OpenTelemetry Collector ตาม architecture — ดู official docs

###### 4. Verify

> Goal: ยืนยัน telemetry ทั้งสาม signal ขึ้น UI จริง

1. Restart app ด้วย env ใหม่แล้วยิง traffic ทดสอบ
2. ตรวจ Traces, Logs Explorer, Metrics Explorer ใน SigNoz UI
3. ถ้าไม่ขึ้น → ตั้ง `OTEL_LOG_LEVEL=debug` ดู exporter errors, ตรวจ headers/endpoint/protocol
4. ทำ `/run-verify` — ถ้า fail → revert keys ที่แก้ ทำ `resolve-errors` แล้ว report diff

##### Rules

- Merge เฉพาะ `OTEL_*` keys ที่จำเป็น — ห้าม overwrite `.env` ทั้งไฟล์
- เก็บ ingestion key ใน `/follow-secret-manager` ห้ามใส่ config file ที่ commit
- `service.name` ต้องสม่ำเสมอข้าม environments (แยกด้วย `deployment.environment`)
- ใช้ official docs เป็นแหล่งหลัก — ทำ `learn` (web) ถ้าไม่แน่ใจ
- ถ้ายืนยัน telemetry ไม่ได้ใน 3 รอบ → stop และ report

##### Expected Outcome

- `OTEL_*` config ครบและแยกตาม environment ชัดเจน
- Traces, metrics, logs ขึ้น SigNoz UI ภายใต้ service name ที่ถูกต้อง
- ไม่มี secrets รั่วใน config files

### setup-signoz

##### Goal

เตรียม SigNoz backend (cloud หรือ self-hosted), ติดตั้ง OpenTelemetry SDK และ instrument app Bun/Node/TypeScript ให้ส่ง telemetry ได้ — first-time setup เท่านั้น

##### Scope

- เลือกและเตรียม SigNoz Cloud หรือ self-hosted ผ่าน Docker/Foundry
- ติดตั้ง `@opentelemetry/api`, `@opentelemetry/auto-instrumentations-node`
- ตั้ง endpoint และ ingestion key ขั้นต่ำให้ telemetry ส่งได้
- ไม่ครอบคลุม service name, exporters, dashboards ละเอียด → ใช้ `workflows/config-signoz/SKILL.md`

##### Execute

###### 1. Check Prerequisites

> Goal: ระบุ runtime และเลือก deployment mode (idempotent)

1. อ่าน `package.json` เพื่อระบุ runtime (`bun`, `node`, TypeScript)
2. ตรวจว่ามี OTel packages หรือ instrumentation อยู่แล้ว → ถ้ามี skip ไป verify
3. ตัดสินใจ `SigNoz Cloud` หรือ `self-hosted` — ถ้า self-hosted ต้องมี Docker
4. ถ้าไม่มี SigNoz account/endpoint → stop และแจ้ง user

###### 2. Prepare SigNoz Endpoint

> Goal: ได้ endpoint และ ingestion key ที่ถูกต้อง

1. Cloud: เตรียม `https://ingest.<region>.signoz.cloud:443` และ ingestion key จาก dashboard
2. Self-hosted: ติดตั้งผ่าน Foundry หรือ Docker ตาม `https://signoz.io/docs/install/docker/` — endpoint local เช่น `http://localhost:4318`
3. เก็บ ingestion key ใน `/follow-secret-manager` แล้ว inject เข้า env
4. ยืนยัน endpoint reachable ก่อน instrument

###### 3. Install OTel SDK

> Goal: ติดตั้ง auto-instrumentation

1. ติดตั้งด้วย `bun add @opentelemetry/api @opentelemetry/auto-instrumentations-node`
2. ตั้ง `NODE_OPTIONS=--require @opentelemetry/auto-instrumentations-node/register` สำหรับ Node
3. สำหรับ Bun/TS entry ที่ require hook ไม่ทำงาน → ใช้ `import '@opentelemetry/auto-instrumentations-node/register'` บรรทัดแรกของ entry แทน
4. ตั้ง env ขั้นต่ำ: `OTEL_TRACES_EXPORTER=otlp`, `OTEL_EXPORTER_OTLP_ENDPOINT=<endpoint>`, `OTEL_SERVICE_NAME=<name>`

###### 4. Verify Telemetry

> Goal: ยืนยัน traces เข้า SigNoz UI จริง

1. รัน app พร้อม instrumentation แล้วยิง request ทดสอบ
2. เปิด SigNoz UI ตรวจ Services/Traces ว่ามี service name ขึ้น
3. ถ้าไม่ขึ้นใน 5 นาที → ตรวจ endpoint, ingestion key, protocol แล้วตั้ง `OTEL_LOG_LEVEL=debug`
4. ถ้ายัง fail → ทำ `resolve-errors` max 3 รอบ แล้ว stop report

##### Rules

- จำกัด scope ที่ Bun/Node/TypeScript เท่านั้น — runtime อื่นดู official docs
- เก็บ ingestion key ใน `/follow-secret-manager` ห้าม hardcode หรือ commit
- ใช้ official docs (`learn` (web)/`webfetch`) เป็นแหล่งหลักถ้า env var ไม่แน่ใจ
- ถ้ายืนยัน telemetry ไม่ได้ใน 3 รอบ → stop และ report

##### Expected Outcome

- OTel SDK ติดตั้งและ app รันพร้อม instrumentation
- Endpoint/ingestion key ถูกต้องและปลอดภัย
- Traces ขึ้นใน SigNoz UI จริง

### verify-connection

##### Goal

ยืนยันหลัง setup/config ว่า OTel telemetry ไหลเข้า SigNoz จริง — endpoint reachable, ingestion key valid, service ปรากฏใน SigNoz

##### Scope

- ใช้เมื่อ `/follow-service-signoz` dispatch มาที่ `verify`/`verify-connection`
- Read-only: ตรวจสอบ — ไม่แก้ instrumentation

##### Execute

###### 1. Check Endpoint Config

> Goal: OTel env vars ครบและ endpoint ถูก

1. ตรวจ `OTEL_EXPORTER_OTLP_ENDPOINT`, `OTEL_SERVICE_NAME`, ingestion key/`SIGNOZ_INGESTION_KEY` มี
2. `curl -sI <endpoint>` หรือ health endpoint — endpoint reachable

###### 2. Check Telemetry Flow

> Goal: data เข้า SigNoz จริง

1. รัน app ชั่วคราวหรือส่ง test span — ตรวจ SDK ไม่ throw connection errors
2. เช็คใน SigNoz UI/API ว่า `OTEL_SERVICE_NAME` ปรากฏใน services list
3. flag: endpoint reachable แต่ไม่มี data → ingestion key ผิดหรือ exporter misconfig

###### 3. Report

> Goal: สรุป connection status

1. ใช้ `/report` คอลัมน์: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `endpoint-down` / `auth-failed` / `no-data-flowing`

##### Rules

- ไม่ print ingestion key
- `no-data-flowing` = endpoint OK แต่ไม่มี telemetry — flag แยกจาก endpoint-down
- ระบุ service name ที่เห็นใน SigNoz เป็น evidence

##### Expected Outcome

- Verdict พร้อม endpoint/service evidence

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

- แอป Bun/Node/TypeScript ส่ง traces, metrics, logs ไป SigNoz สำเร็จ
- ตรวจสอบข้อมูลผ่าน SigNoz UI ได้
- มี dashboard และ alert ที่ตั้งค่าเรียบร้อย
- ไม่มี configuration หรือ secrets รั่วไหลใน code

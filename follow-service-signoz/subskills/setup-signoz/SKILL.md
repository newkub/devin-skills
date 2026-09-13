---
name: follow-service-signoz-setup-signoz
description: ติดตั้ง OpenTelemetry SDK และตั้งค่า SigNoz endpoint ให้ส่ง telemetry ได้
argument-hint: "[project-path]"
related:
  - follow-service-signoz
  - follow-secret-manager
  - check-secrets
  - resolve-errors
  - run-verify
  - learn
---

## Goal

เตรียม SigNoz backend (cloud หรือ self-hosted), ติดตั้ง OpenTelemetry SDK และ instrument app Bun/Node/TypeScript ให้ส่ง telemetry ได้ — first-time setup เท่านั้น

## Scope

- เลือกและเตรียม SigNoz Cloud หรือ self-hosted ผ่าน Docker/Foundry
- ติดตั้ง `@opentelemetry/api`, `@opentelemetry/auto-instrumentations-node`
- ตั้ง endpoint และ ingestion key ขั้นต่ำให้ telemetry ส่งได้
- ไม่ครอบคลุม service name, exporters, dashboards ละเอียด → ใช้ `subskills/config-signoz/SKILL.md`

## Execute

### 1. Check Prerequisites

> Goal: ระบุ runtime และเลือก deployment mode (idempotent)

1. อ่าน `package.json` เพื่อระบุ runtime (`bun`, `node`, TypeScript)
2. ตรวจว่ามี OTel packages หรือ instrumentation อยู่แล้ว → ถ้ามี skip ไป verify
3. ตัดสินใจ `SigNoz Cloud` หรือ `self-hosted` — ถ้า self-hosted ต้องมี Docker
4. ถ้าไม่มี SigNoz account/endpoint → stop และแจ้ง user

### 2. Prepare SigNoz Endpoint

> Goal: ได้ endpoint และ ingestion key ที่ถูกต้อง

1. Cloud: เตรียม `https://ingest.<region>.signoz.cloud:443` และ ingestion key จาก dashboard
2. Self-hosted: ติดตั้งผ่าน Foundry หรือ Docker ตาม `https://signoz.io/docs/install/docker/` — endpoint local เช่น `http://localhost:4318`
3. เก็บ ingestion key ใน `/follow-secret-manager` แล้ว inject เข้า env
4. ยืนยัน endpoint reachable ก่อน instrument

### 3. Install OTel SDK

> Goal: ติดตั้ง auto-instrumentation

1. ติดตั้งด้วย `bun add @opentelemetry/api @opentelemetry/auto-instrumentations-node`
2. ตั้ง `NODE_OPTIONS=--require @opentelemetry/auto-instrumentations-node/register` สำหรับ Node
3. สำหรับ Bun/TS entry ที่ require hook ไม่ทำงาน → ใช้ `import '@opentelemetry/auto-instrumentations-node/register'` บรรทัดแรกของ entry แทน
4. ตั้ง env ขั้นต่ำ: `OTEL_TRACES_EXPORTER=otlp`, `OTEL_EXPORTER_OTLP_ENDPOINT=<endpoint>`, `OTEL_SERVICE_NAME=<name>`

### 4. Verify Telemetry

> Goal: ยืนยัน traces เข้า SigNoz UI จริง

1. รัน app พร้อม instrumentation แล้วยิง request ทดสอบ
2. เปิด SigNoz UI ตรวจ Services/Traces ว่ามี service name ขึ้น
3. ถ้าไม่ขึ้นใน 5 นาที → ตรวจ endpoint, ingestion key, protocol แล้วตั้ง `OTEL_LOG_LEVEL=debug`
4. ถ้ายัง fail → ทำ `resolve-errors` max 3 รอบ แล้ว stop report

## Rules

- จำกัด scope ที่ Bun/Node/TypeScript เท่านั้น — runtime อื่นดู official docs
- เก็บ ingestion key ใน `/follow-secret-manager` ห้าม hardcode หรือ commit
- ใช้ official docs (`learn` (web)/`webfetch`) เป็นแหล่งหลักถ้า env var ไม่แน่ใจ
- ถ้ายืนยัน telemetry ไม่ได้ใน 3 รอบ → stop และ report

## Expected Outcome

- OTel SDK ติดตั้งและ app รันพร้อม instrumentation
- Endpoint/ingestion key ถูกต้องและปลอดภัย
- Traces ขึ้นใน SigNoz UI จริง

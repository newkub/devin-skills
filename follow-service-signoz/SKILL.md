---
name: follow-service-signoz
description: เชื่อมต่อ SigNoz observability สำหรับ Node/Bun/TypeScript ผ่าน OpenTelemetry
argument-hint: "[scope]"
related:
  - follow-service-aws-sdk
  - follow-service-cloudflare
  - follow-secret-manager
  - follow-best-practice
  - learn-web
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

- ใช้ `webfetch` หรือ `learn-web` เพื่อดูเอกสารล่าสุดของ SigNoz
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

## Expected Outcome

- แอป Bun/Node/TypeScript ส่ง traces, metrics, logs ไป SigNoz สำเร็จ
- ตรวจสอบข้อมูลผ่าน SigNoz UI ได้
- มี dashboard และ alert ที่ตั้งค่าเรียบร้อย
- ไม่มี configuration หรือ secrets รั่วไหลใน code

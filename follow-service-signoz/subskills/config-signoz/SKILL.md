---
name: follow-service-signoz-config-signoz
description: ตั้งค่า OTEL env vars, service name, exporters สำหรับ traces/metrics/logs
argument-hint: "[project-path]"
related:
  - follow-service-signoz
  - follow-secret-manager
  - check-secrets
  - check-config-drift
  - run-verify
  - learn
---

## Goal

ตั้งค่า/แก้ไข OpenTelemetry configuration สำหรับ SigNoz — service name, resource attributes, traces/metrics/logs exporters และ headers — โดยไม่ clobber env เดิม

## Scope

- แก้ `OTEL_*` env vars สำหรับ Bun/Node/TypeScript
- แยก config ตาม environment (dev/staging/prod)
- ตั้ง headers (`signoz-ingestion-key`), protocol และ resource attributes
- ไม่ครอบคลุม first-time install → ใช้ `subskills/setup-signoz/SKILL.md`

## Execute

### 1. Read Current Config

> Goal: รู้ env vars ปัจจุบันก่อนแก้

1. อ่าน `.env*`, start scripts และ instrumentation entry ที่มีอยู่
2. ทำ `/check-secrets env-vars` เพื่อระบุ `OTEL_*` vars ที่ขาดหรือซ้ำ
3. ทำ `/check-config-drift` ระหว่าง environments ถ้าจำเป็น
4. ถ้ายังไม่มี OTel packages → ทำ `subskills/setup-signoz/SKILL.md` แทน

### 2. Configure Service Identity

> Goal: ตั้ง service name และ resource attributes ให้ค้นใน UI ได้

1. ตั้ง `OTEL_SERVICE_NAME=<service-name>` ให้ตรงกับชื่อ service จริง
2. ตั้ง `OTEL_RESOURCE_ATTRIBUTES=service.version=<version>` และ attributes เพิ่มเติม เช่น `deployment.environment=<env>`
3. ใช้ชื่อเดียวกันข้ามทุก instance ของ service เดียวกัน — merge เฉพาะ keys ที่จำเป็น

### 3. Configure Exporters

> Goal: ส่ง traces, metrics, logs ครบสาม signal

1. ตั้ง `OTEL_TRACES_EXPORTER=otlp`, `OTEL_METRICS_EXPORTER=otlp`, `OTEL_LOGS_EXPORTER=otlp` ตาม signals ที่ต้องการ
2. ตั้ง `OTEL_EXPORTER_OTLP_ENDPOINT=<endpoint>` — แยก per-signal endpoint ถ้าจำเป็น
3. Cloud: ตั้ง `OTEL_EXPORTER_OTLP_HEADERS=signoz-ingestion-key=<key>` — key จาก `/follow-secret-manager`
4. สำหรับ Bun ตั้ง `OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf` เสมอ
5. Logs: ใช้ OTLP logs exporter หรือ route ผ่าน OpenTelemetry Collector ตาม architecture — ดู official docs

### 4. Verify

> Goal: ยืนยัน telemetry ทั้งสาม signal ขึ้น UI จริง

1. Restart app ด้วย env ใหม่แล้วยิง traffic ทดสอบ
2. ตรวจ Traces, Logs Explorer, Metrics Explorer ใน SigNoz UI
3. ถ้าไม่ขึ้น → ตั้ง `OTEL_LOG_LEVEL=debug` ดู exporter errors, ตรวจ headers/endpoint/protocol
4. ทำ `/run-verify` — ถ้า fail → revert keys ที่แก้ ทำ `resolve-errors` แล้ว report diff

## Rules

- Merge เฉพาะ `OTEL_*` keys ที่จำเป็น — ห้าม overwrite `.env` ทั้งไฟล์
- เก็บ ingestion key ใน `/follow-secret-manager` ห้ามใส่ config file ที่ commit
- `service.name` ต้องสม่ำเสมอข้าม environments (แยกด้วย `deployment.environment`)
- ใช้ official docs เป็นแหล่งหลัก — ทำ `learn` (web) ถ้าไม่แน่ใจ
- ถ้ายืนยัน telemetry ไม่ได้ใน 3 รอบ → stop และ report

## Expected Outcome

- `OTEL_*` config ครบและแยกตาม environment ชัดเจน
- Traces, metrics, logs ขึ้น SigNoz UI ภายใต้ service name ที่ถูกต้อง
- ไม่มี secrets รั่วใน config files

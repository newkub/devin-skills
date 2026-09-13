---
name: follow-service-signoz-verify-connection
description: ยืนยัน SigNoz/OTel pipeline — endpoint reachable, telemetry ไหลเข้า, service ปรากฏ
argument-hint: "[endpoint]"
related:
  - report
---

## Goal

ยืนยันหลัง setup/config ว่า OTel telemetry ไหลเข้า SigNoz จริง — endpoint reachable, ingestion key valid, service ปรากฏใน SigNoz

## Scope

- ใช้เมื่อ `/follow-service-signoz` dispatch มาที่ `verify`/`verify-connection`
- Read-only: ตรวจสอบ — ไม่แก้ instrumentation

## Execute

### 1. Check Endpoint Config

> Goal: OTel env vars ครบและ endpoint ถูก

1. ตรวจ `OTEL_EXPORTER_OTLP_ENDPOINT`, `OTEL_SERVICE_NAME`, ingestion key/`SIGNOZ_INGESTION_KEY` มี
2. `curl -sI <endpoint>` หรือ health endpoint — endpoint reachable

### 2. Check Telemetry Flow

> Goal: data เข้า SigNoz จริง

1. รัน app ชั่วคราวหรือส่ง test span — ตรวจ SDK ไม่ throw connection errors
2. เช็คใน SigNoz UI/API ว่า `OTEL_SERVICE_NAME` ปรากฏใน services list
3. flag: endpoint reachable แต่ไม่มี data → ingestion key ผิดหรือ exporter misconfig

### 3. Report

> Goal: สรุป connection status

1. ใช้ `/report` คอลัมน์: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `endpoint-down` / `auth-failed` / `no-data-flowing`

## Rules

- ไม่ print ingestion key
- `no-data-flowing` = endpoint OK แต่ไม่มี telemetry — flag แยกจาก endpoint-down
- ระบุ service name ที่เห็นใน SigNoz เป็น evidence

## Expected Outcome

- Verdict พร้อม endpoint/service evidence

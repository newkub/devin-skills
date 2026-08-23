---
name: improve-observability
description: ปรับปรุง observability, telemetry, และ auditability ของ project
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
triggers:
  - user
  - model
related:
  - improve-codebase
---

## Goal

ปรับปรุงการมองเห็นระบบด้วย logging, metrics, tracing, telemetry และ auditability

## Scope

ใช้กับ project หรือ workspace ที่ต้องการปรับปรุง observability, telemetry หรือ auditability

## Execute

### 1. Analyze
> Goal: วิเคราะห์สถานะปัจจุบัน
1. ทำ /scan-codebase เพื่อหา issues ที่เกี่ยวข้อง
2. ทำ /review-codebase เพื่อรายละเอียดเพิ่ม
3. ระบุ observability stack: logs, metrics, traces, alerts, dashboards
4. ถ้าไม่พบ issues -> stop และ report

### 2. Improve Logging
> Goal: บันทึกเหตุการณ์ทีมี context ครบ
1. ตรวจสอบ log levels, structured logging, correlation IDs
2. ลด noise logs ที่ไม่จำเป็น เพิ่ม error logs ทีบอก context
3. ใช้ /follow-best-practice สำหรับ logging standards

### 3. Improve Metrics And Telemetry
> Goal: รู้สถานะระบบแบบ real-time
1. ระบุ metrics สำคัญ: latency, throughput, errors, resource usage
2. ตรวจสอบ telemetry collection: OpenTelemetry, Prometheus, Datadog
3. เพิ่ม dashboards, alerts, SLOs ถ้าขาด
4. ใช้ /learn-from-web เพื่อหา best practices ของ stack ทีใช้

### 4. Improve Tracing
> Goal: ติดตาม request ข้าม service
1. ตรวจสอบ distributed tracing: trace IDs, spans, baggage
2. เพิ่ม instrumentation สำหรับ critical paths
3. ใช้ /improve-reliability ถ้าพบ failure propagation

### 5. Improve Auditability
> Goal: ตรวจสอบย้อนหลังได้
1. ระบุ events ทีต้อง audit: user actions, data changes, security events
2. ตรวจสอบ audit logs มี timestamp, actor, action, result
3. ใช้ /improve-security ถ้าพบ sensitive data logging

### 6. Validate
> Goal: ยืนยันว่าปรับปรุงแล้วดีขึ้น
1. ทำ /validate หรือ /run-check
2. ถ้าไม่ผ่าน -> ทำ /resolve-errors แล้ว retry (max 3)
3. ทำ /suggest-next-action

## Rules
### 1. Minimal Changes
- ใช้ minimal changes
- ไม่แก้นอก scope
- ถ้าไม่แน่ใจ -> stop และ /ask-me

## Expected Outcome
- observability, telemetry, auditability ดีขึ้นตาม criteria
- ไม่มี regression
- รายงานสรุปผล

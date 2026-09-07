# Fix Guide

(merged from: improve-logging)

## Goal

ปรับ logging ทั้งระบบให้มีประโยชน์ตอน debug — levels ถูกต้อง, structured format, context ครบ (request id, user, trace) และไม่ leak sensitive data

## Scope

- ตรวจ log statements ทั้ง codebase: `console.*`, `logger.*`, `log.*`, `tracing`, `slog` ตาม ecosystem
- ครอบคลุม: log levels, structured logging, context/correlation ids, sensitive data redaction, log volume, error logging completeness
- Action-oriented: แก้ logging จริง — สัมพันธ์กับ `/review-observability` (metrics/tracing)

## Execute

### 1. Inventory Logging

> Goal: map logging surface ปัจจุบัน

1. หา logger setup และ log call sites ทั้งหมด — ทำ `/check-console-logs` เพื่อหา raw `console.*` ที่ควรเปลี่ยนเป็น logger
2. ระบุ logging library ที่ใช้ (pino, winston, slog, tracing, log4j)
3. ดู log output จริงจาก dev run — format, levels, context ที่มี

### 2. Evaluate Quality

> Goal: flag logging issues

1. Levels: `info` ที่ควรเป็น `debug`, errors ที่ log เป็น `warn`, fatal ที่ไม่มี
2. Structure: string interpolation แทน structured fields (`logger.info('user ' + id)` → `logger.info({ userId: id })`)
3. Context: logs ที่ไม่มี request id/trace id/user context — trace ยาก
4. Leaks: passwords, tokens, PII, full request bodies ใน logs
5. Noise: logs ใน hot loops, duplicate logs, success spam
6. Errors: catch ที่ไม่ log error object หรือ log แค่ message ไม่มี stack

### 3. Apply Improvements

> Goal: แก้ตาม priority

1. Standardize: ผ่าน logger เดียว — แทน `console.*` ด้วย logger calls
2. Levels: ปรับให้ถูก — `error` เมื่อ operation fail, `warn` สำหรับ recoverable, `info` สำหรับ lifecycle, `debug` สำหรับ diagnostics
3. Structure: เปลี่ยนเป็น structured fields — ทุก log มี searchable keys
4. Context: เพิ่ม correlation — request id middleware, child loggers ต่อ request/module
5. Redact: mask sensitive fields (passwords, tokens, email/PII ตาม policy) — ใช้ redact paths ของ logger
6. Errors: log error objects ครบ (`logger.error({ err }, 'msg')` ไม่ใช่ `err.message` อย่างเดียว)

### 4. Verify And Report

> Goal: ยืนยัน log quality ดีขึ้น

1. รัน app และ trigger flows — ดู log output จริง
2. ตรวจว่า trace ได้จาก log เดียวถึง log เดียว (correlation works)
3. ใช้ `/report-table` สรุป changes: `No.`, `Area`, `Change`, `Reason`

## Rules

### 1. No Sensitive Leaks

- ห้าม log passwords, tokens, API keys, PII — redact หรือ omit เสมอ
- ตรวจ error objects ที่อาจ carry sensitive context

### 2. Purposeful

- ทุก log ต้องตอบ: ใครอ่าน เพื่ออะไร — ไม่ใส่ log เพื่อสวย
- ลด noise — logs เยอะเกินทำ signal จม

### 3. Ecosystem Idiomatic

- ใช้ logger และ patterns ที่ project มีอยู่ — ไม่เปลี่ยน logging library ถ้าไม่จำเป็น
- structured logging ตาม library ที่ใช้ (pino fields, slog attrs, tracing spans)

## Expected Outcome

- Logging ผ่าน logger เดียว พร้อม levels ที่ถูกต้อง
- Structured logs พร้อม correlation context
- ไม่มี sensitive data ใน logs
- Error logs มีข้อมูลครบพอ debug

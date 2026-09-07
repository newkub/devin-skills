---
name: test-all-api-routes
description: ทดสอบ API routes ทั้งหมดของ domain จาก routes file, OpenAPI spec หรือ source code
argument-hint: "<domain> [-RoutesFile <file>] [-SpecUrl <url>]"
related:
  - run-test-api
  - check-routes-status
  - check-api-contract
  - gen-openapi
  - report-uxui-all-routes
  - report
  - resolve-errors
  - use-scripts
---

## Goal

ทดสอบ HTTP response ของ API routes ทั้งหมดบน domain — discover routes จาก OpenAPI spec, routes file หรือ source code แล้วยิง request ทีละ endpoint เพื่อรายงาน status, response time และ coverage

## Scope

- ใช้ /check-routes-status ถ้าจำเป็น
- ใช้ /report-uxui-all-routes ถ้าจำเป็น
- Safe by default: ยิงเฉพาะ `GET`/`HEAD`/`OPTIONS` — mutation methods ต้องใช้ `-AllowWrite` พร้อม user confirmation
- ไม่รันกับ production ยกเว้น user ยืนยัน

## Execute

### 1. Resolve Target And Route Source

> Goal: รู้ว่าจะเช็ค domain ไหนและเอา route list จากไหน

1. รับ `domain` จาก argument — normalize เป็น base URL
2. เลือก route source ตามลำดับ:
- ถ้ามี routes file → ใช้ `-RoutesFile <file>`
- ถ้ามี OpenAPI spec URL → ใช้ `-SpecUrl <url>`
- ถ้ามี source code → ทำ `/report-uxui-all-routes` แล้วนำ paths มา test
3. ถ้าหา routes ไม่ได้เลย → stop และ report ว่าต้องการ source ใด

### 2. Run Route Checks

> Goal: ได้ status จริงทุก API route

1. รัน `scripts/test-all-api-routes.ps1 -Domain <domain>` พร้อม options ที่เลือก
2. script ยิง request ทีละ route ผ่าน `curl.exe` — dynamic segments `{id}` ถูกแทนด้วย `1`
3. เก็บต่อ route: `method`, `path`, `status`, `expected status` (ถ้ามี), `response time (ms)`
4. ถ้าต้อง auth → ส่ง `-Token <bearer>` หรือ `-Header` ใน script (ระบุใน report ว่าเป็น authenticated check)

### 3. Classify Findings

> Goal: จัด severity ให้ทุก route

1. `ok` — status 2xx หรือตรง expected status
2. `redirect` — 3xx (API ไม่ควร redirect — flag เป็น warning)
3. `protected` — 401/403 (endpoint มี auth ตาม spec)
4. `slow` — response time > 3000ms
5. `critical` — 4xx/5xx ที่ไม่ตรง expected, timeout, DNS/TLS failure
6. `skipped` — non-safe method ที่ไม่ได้เปิด `-AllowWrite`
7. `missing` — route อยู่ใน spec/source แต่ได้ 404 จาก server

### 4. Report Coverage And Findings

> Goal: รายงานครบพร้อม action

1. ทำ `/report` คอลัมน์: `No.`, `Method`, `Route`, `Status`, `Expected`, `Time (ms)`, `Severity`, `Recommendation`
2. สรุป: total routes, tested, skipped, ok, protected, critical, missing
3. ถ้า spec กับ implementation ไม่ตรง → ส่งต่อ `/check-api-contract`
4. ถ้ามี critical → แนะนำ `/resolve-errors` พร้อมระบุ route ที่พัง
5. ถ้า routes ใน source ไม่ครบ → แนะนำ `/gen-openapi` เพื่อสร้าง spec

## Rules

### 1. Safety

- default ยิงเฉพาะ `GET`/`HEAD`/`OPTIONS` — `POST`/`PUT`/`PATCH`/`DELETE` mark `skipped` เว้นแต่ `-AllowWrite` + user confirm
- ไม่รันกับ production domain โดยไม่ได้รับ confirmation
- ไม่ส่ง credentials จริงใน report — mask token ทุกครั้ง

### 2. Coverage

- ทุก route ที่ discover ได้ต้องมีผล: tested หรือ skipped พร้อมเหตุผล
- ระบุ route source ที่ใช้ (file, spec URL, source scan) ใน report
- ถ้า discover ได้ไม่ครบ → ระบุว่า coverage อาจไม่ complete

### 3. Evidence-Based

- ทุก finding มี actual status และ response time จริง ห้ามเดา
- ถ้า route ทั้งหมด fail pattern เดียวกัน (เช่น ทุก endpoint 404) → เช็ค base path / deploy ก่อน route-level

- ใช้ /run-test-api ถ้าจำเป็น
- ใช้ /check-api-contract ถ้าจำเป็น
- ใช้ /report-uxui-all-routes ถ้าจำเป็น
- ใช้ /gen-openapi ถ้าจำเป็น

- ใช้ /use-scripts ถ้าจำเป็น
## Expected Outcome

- ตารางทุก API routes พร้อม method, status, expected, response time และ severity
- coverage summary: tested/skipped/missing
- critical routes มี recommendation ชัดเจน

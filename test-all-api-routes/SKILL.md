---
name: test-all-api-routes
description: ทดสอบ API routes ทั้งหมดของ domain จาก routes file, OpenAPI spec หรือ source code
argument-hint: "<domain> [-RoutesFile <file>] [-SpecUrl <url>]"
related:
  - run-test
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
- `crw_map` (MCP) — map site → เก็บ URL list ลง routes file (แนะนำ, ครอบคลุมสุด)
- ถ้ามี routes file → ใช้ `--routes-file <file>` (รองรับ URL เต็ม จะ normalize เป็น path ให้)
- ถ้ามี OpenAPI spec → ดึง paths จาก spec ลง routes file
- ถ้า SPA → `--discover` (fetch base HTML, ดึง same-origin links)
- ถ้ามี source code → ทำ `/report-uxui-all-routes` แล้วนำ paths มา test
3. ถ้าหา routes ไม่ได้เลย → stop และ report ว่าต้องการ source ใด

### 2. Run Route Checks

> Goal: ได้ status จริงทุก API route

1. รัน CLI (Bun, generic, print table):

```bash
bun <skill-dir>/scripts/check-routes.ts --base <domain> --routes-file routes.txt
```

2. options: `--method GET` (default), `--timeout`, `--slow`, `--header "Authorization: Bearer <token>"`, `--allow-write` (mutation methods — ต้อง user confirm), `--out <file>`
3. script ยิง request ทีละ route — dynamic segments `{id}` ถูกแทนด้วย `1`
4. เก็บต่อ route: `method`, `path`, `status`, `response time (ms)`, `severity` → table + manifest JSON
5. fallback: `scripts/test-all-api-routes.ps1` (PowerShell + curl.exe) ถ้า Bun ไม่มี
6. ถ้าต้อง auth → ส่ง `--header` ใน CLI (ระบุใน report ว่าเป็น authenticated check)

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
2. persist raw results → `.devin/reports/<workspace>/api-routes-<time>.md` ตาม format `/create-report-in-dot-devin` — ตารางเดียวกัน + สรุป เพื่อให้ `/update-docs` reuse
3. สรุป: total routes, tested, skipped, ok, protected, critical, missing
4. ถ้า spec กับ implementation ไม่ตรง → ส่งต่อ `/check-api-contract`
5. ถ้ามี critical → แนะนำ `/resolve-errors` พร้อมระบุ route ที่พัง
6. ถ้า routes ใน source ไม่ครบ → แนะนำ `/gen-openapi` เพื่อสร้าง spec

### Subagents

> Goal: parallelize route checks เมื่อ route list ยาว

- ใช้ `subagents/route-checker.md` เมื่อ routes เยอะและแบ่งเป็น groups ที่ independent กันได้ (เช่น ตาม path prefix) — spawn ทีละ group ผ่าน `/use-subagents` แล้ว merge ตารางผลทุก group ก่อน report

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

- ใช้ /deep-test-api ถ้าจำเป็น
- ใช้ /check-api-contract ถ้าจำเป็น
- ใช้ /report-uxui-all-routes ถ้าจำเป็น
- ใช้ /gen-openapi ถ้าจำเป็น

- ใช้ /use-scripts ถ้าจำเป็น
## Expected Outcome

- ตารางทุก API routes พร้อม method, status, expected, response time และ severity
- coverage summary: tested/skipped/missing
- critical routes มี recommendation ชัดเจน

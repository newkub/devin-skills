---
name: check-routes-status
description: เช็ค HTTP status ทุก page routes ของ domain ด้วย crw map discovery และ per-route requests
argument-hint: "<domain> [depth]"
related:
  - follow-tool-crw
  - report-uxui-all-routes
  - test-all-api-routes
  - check-security-headers
  - report
  - resolve-errors
  - use-scripts
---

## Goal

เช็ค HTTP response status ของทุก page routes บน domain ที่ระบุ — discover routes ด้วย `crw map` (sitemap + crawl fallback) แล้วยิง request ทีละ route เพื่อรายงาน status, response time และ severity

## Scope

- ใช้กับ deployed domain (`https://example.com`) หรือ local dev server (`localhost:3000`)
- เช็คเฉพาะ same-origin page routes ที่ discover ได้จาก sitemap หรือ crawl — ไม่ตาม external links
- ใช้ /api ถ้าจำเป็น
- ใช้ /resolve-errors ถ้าจำเป็น
- Route ที่ต้อง auth ให้จัด 401/403 เป็น `protected` ไม่ใช่ critical

## Execute

### 1. Resolve Domain And Prerequisites

> Goal: พร้อมก่อนเช็ค

1. รับ `domain` จาก argument — normalize เป็น base URL (`example.com` → `https://example.com`, `localhost:3000` → `http://localhost:3000`)
2. ตรวจว่า `crw` พร้อมใช้ด้วย `crw --version` — ถ้าไม่มี → ทำ `/download-program`
3. ถ้าเป็น local dev URL → ตรวจว่า server รันอยู่ (ทำ `/check-open-ports` ถ้าไม่ตอบ)
4. ถ้า domain ไม่ตอบเลย → stop และ report

### 2. Discover Routes

> Goal: ได้ URL list ของทุก page routes

1. รัน `crw map <base-url> --format json` — discover จาก sitemap ก่อน ถ้าไม่มี sitemap จะ crawl ตาม link อัตโนมัติ
2. ถ้าได้ 0 routes → retry `crw map <base-url> --no-sitemap --format json` บังคับ crawl
3. ถ้า target เป็น SPA ที่ render ด้วย JS → เพิ่ม `--js`
4. ถ้า discover จากเว็บไม่ได้แต่มี source code → ทำ `/report-uxui-all-routes` แล้วเอา paths มาต่อท้าย base URL
5. กรองเฉพาะ same-origin URLs และ dedupe

### 3. Check Response Per Route

> Goal: ได้ status และ response time ทุก route

1. รัน `scripts/check-routes-status.ps1 -Domain <domain>` — script ทำ step 1-3 อัตโนมัติ
2. script ยิง `HEAD` ทีละ route ผ่าน `curl.exe` — ถ้าได้ 405/501 → fallback `GET`
3. เก็บต่อ route: `status code`, `response time (ms)`, `effective URL` หลัง redirect
4. timeout default 15 วินาทีต่อ route — ปรับด้วย `-TimeoutSec` จำกัดจำนวน routes ด้วย `-Limit` และ depth ด้วย `-Depth`

### 4. Classify Findings

> Goal: จัด severity ให้ทุก route

1. `ok` — status 2xx
2. `redirect` — status 3xx (flag ถ้า redirect chain ยาวกว่า 1 hop)
3. `protected` — 401/403 (expected สำหรับ auth routes)
4. `slow` — 2xx แต่ response time > 3000ms
5. `critical` — 4xx อื่น, 5xx, timeout, DNS/TLS failure
6. กรอง false positives: route ที่ตั้งใจให้ 404/410 เช่น catch-all หรือ gone pages

### 5. Report

> Goal: รายงานผลพร้อม action

1. ทำ `/report` คอลัมน์: `No.`, `Route`, `Status`, `Time (ms)`, `Severity`, `Recommendation`
2. สรุปท้ายตาราง: total, ok, redirect, slow, protected, critical
3. ถ้ามี critical → แนะนำ `/resolve-errors` หรือ `/deep-debug` พร้อมระบุ route ที่พัง
4. ถ้าทุก route ok → report "all routes healthy"

## Rules

### 1. Read-Only And Safe

- ไม่ flood target — ใช้ sequential requests และ respect crawl-delay ของ `robots.txt` ถ้ามี
- ไม่ตาม external links หรือ subdomains ที่ไม่ได้ระบุ

### 2. Evidence-Based

- ทุก finding ต้องมี actual status code และ response time จริง ห้ามเดา
- ระบุ error type เมื่อ request ล้ม: DNS, TLS, timeout, connection refused
- ถ้า discover ได้ไม่ครบ → ระบุใน report ว่า route list อาจไม่ complete

### 3. Actionable

- ใช้ /resolve-errors ถ้าจำเป็น

- ใช้ /follow-tool-crw ถ้าจำเป็น
- ใช้ /report-uxui-all-routes ถ้าจำเป็น
- ใช้ /test-all-api-routes ถ้าจำเป็น
- ใช้ /resolve-errors ถ้าจำเป็น

- ใช้ /check-security-headers ถ้าจำเป็น
- ใช้ /use-scripts ถ้าจำเป็น
## Expected Outcome

- ตารางทุก page routes พร้อม status code, response time และ severity
- summary แยกตาม severity พร้อมจำนวน
- critical routes มี recommendation ชัดเจน

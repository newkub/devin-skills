---
name: run-api-docs
description: Start Scalar API docs server จาก OpenAPI spec พร้อม preview ใน browser
argument-hint: "[scope]"
related:
  - follow-tool-scalar
  - gen-openapi
  - review-api
  - run-dev
  - open
  - resolve-errors
---

## Goal

Start Scalar API Reference server จาก OpenAPI spec (`scalar document serve`) พร้อม verify spec และเปิด browser preview

## Scope

ใช้สำหรับ project ที่มี OpenAPI spec หรือต้องการ preview API docs แบบ local — เน้นการ execute รัน docs server ไม่ใช่ guide ทั่วไป (guide → `/follow-tool-scalar`)

## Execute

> Pre-Run: ทำ `/review-api` ก่อนเสมอ — `run-*` ต้อง review/ประเมินก่อนลงมือหลัก ห้ามข้าม; ถ้า findings เป็น blocker ให้แก้หรือ report ก่อนรัน (api docs)

### 1. Locate OpenAPI Spec

> Goal: หา spec file หรือ URL ที่จะ serve

1. หา spec ใน repo: `openapi.json`, `openapi.yaml`, `docs/openapi.*`, `api/spec.*`
2. ถ้า framework generate ได้ → หา route เช่น `/openapi.json`, `/docs/json` (Elysia/Hono/Fastify/oRPC `OpenAPIGenerator`)
3. ถ้ายังไม่มี spec → ทำ `/gen-openapi` สร้างจาก code ก่อน แล้วใช้ไฟล์ที่ได้
4. Validate ก่อน serve: `bunx @scalar/cli document validate <spec>`

### 2. Install Scalar CLI

> Goal: มี `scalar` binary พร้อมใช้

1. ถ้า project มี `@scalar/cli` ใน devDependencies → ใช้ `bunx scalar`
2. ถ้าไม่มี → `bun add -D @scalar/cli` หรือใช้ `bunx @scalar/cli` โดยตรง (requires Node >=24)
3. Latest: `@scalar/cli@2.1.0` (verified 2026-09-13)
4. Verify ด้วย `scalar --version`

### 3. Start Docs Server

> Goal: serve API reference บน local port

1. รัน `bunx scalar document serve <spec> --watch --port 7970`
2. ใช้ `--port` อื่นถ้า 7970 ถูกใช้; `-w/--watch` reload เมื่อ spec เปลี่ยน
3. ใช้ `document serve <url>` ได้ถ้า spec อยู่บน remote/dev server ที่รันอยู่
4. บันทึก URL ที่ server แจ้ง (default `http://localhost:7970`)

### 4. Preview In Browser

> Goal: เปิด docs ให้ user ดูได้

1. เปิด browser preview หรือ `/open web` ไปยัง `http://localhost:<port>`
2. ยืนยันว่า API reference render ครบ — endpoints, schemas, examples
3. ถ้าหน้าว่าง → ตรวจ spec validity ด้วย `document lint` (spectral rules)

### 5. Alternatives And Errors

> Goal: ครอบคลุมกรณี serve ไม่ได้

1. ไม่มี live backend แต่ต้องการลอง requests → `bunx scalar document mock <spec> --watch --port <port>` (validate request ตาม contract)
2. ต้องการ docs แบบ embed ใน app → `@scalar/api-reference` standalone script tag (ดู `/follow-tool-scalar`)
3. ถ้า `scalar: command not found` → `bun add -D @scalar/cli`
4. ถ้า Node <24 → upgrade Node หรือใช้ Docker/CI ที่มี Node 24
5. ถ้าไม่ผ่าน → ทำ `/resolve-errors`

## Rules

### 1. Spec Source

- prefer spec file ที่ generate จาก code (single source of truth) มากกว่าไฟล์ที่เขียนเองค้างเก่า
- validate spec ก่อน serve เสมอ — serve spec ที่ invalid ทำให้หน้า render พังเงียบๆ

### 2. Port And Process

- default port `7970` — ถ้าชนให้เลือก port อื่นและบอก user
- รันเป็น background process; หยุดด้วย Ctrl+C / taskkill เมื่อเสร็จ ไม่ทิ้ง process ค้าง

### 3. Non-Redundancy

- ไม่ซ้ำกับ `/follow-tool-scalar` ที่เน้น toolchain เต็มรูปแบบ — skill นี้ execute serve เท่านั้น
- ถ้าต้องการ static docs แทน server → `scalar document markdown <spec>` หรือ `/update-docs`

## Expected Outcome

- Scalar API Reference รันบน `http://localhost:<port>` พร้อม `--watch`
- Spec validate ผ่านก่อน serve
- User เปิด docs ใน browser ได้
- ไม่มี process ค้างหลังใช้งานเสร็จ

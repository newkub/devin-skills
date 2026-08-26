---
name: realize-implementation
description: แปลงทุกอย่างเป็น production code จริง ครบทุกมิติ
related:
  - implement-mock
  - implement-features-to-mvp
  - update-review-codebase-cli-and-run
  - deep-analyze-by-use-scripts
  - use-lib-effective
  - resolve-errors
  - refactor
  - update-references
  - run-verify
---

## Goal

แปลงทุกอย่างเป็น production code จริงที่ใช้งานได้จริง ครบทุกมิติ

## Scope

แปลง TODO, MOCK, FAKE, STUB, placeholder เป็น production code ครบทุกมิติ: database, API, UX/UI, schema, types, external services พร้อมเชื่อมต่อ infrastructure จริง end-to-end

## Execute

### 1. Review Codebase Everything

> Goal: Deep Review codebase ครบทุกมิติก่อนเริ่ม implement

1. ทำ `/update-review-codebase-cli-and-run` เพื่อ deep review ครบทุกมิติอย่างลึกซึ้ง พร้อม validate issues

### 2. Analyze And Verify Infrastructure

> Goal: วิเคราะห์สิ่งที่ขาดหายไปและตรวจสอบ infrastructure ก่อนเริ่ม implement

1. ถ้ามี `.devin/plan/<title-date>.md` → ทำ `/implement-plan` ให้ครบก่อน
2. ทำ `/deep-analyze-by-use-scripts`, `/deep-review`, `/update-review-codebase-cli-and-run` — วิเคราะห์โปรเจกต์ครบทุกมิติ ระบุ TODO/MOCK/FAKE/STUB/placeholder/unfinished features
3. จัดลำดับตาม critical path: schema → data → API → UX/UI
4. ตรวจสอบ Database (connection pool, indexes, migrations, backup), API Server (endpoints, rate limiting, CORS, auth), Environment Variables (required, secrets, values)
5. ถ้ามี External Services → ตรวจสอบ credentials, API keys, rate limits — ถ้ามี Monitoring → ตรวจสอบ metrics collection, alerting rules
6. ถ้า infrastructure ไม่พร้อม → stop และ report

### 3. Implement Schema And Data Layer

> Goal: Implement schema, validation schemas, types และ data layer ให้สมบูรณ์

1. เพิ่ม schema สำหรับ data models ที่ขาด, สร้าง validation schemas สำหรับ API input/output, สร้าง types จาก schema
2. ตรวจสอบ type flow: schema → validation schema → API types → UI types
3. สร้างและรัน migrations สำหรับ schema changes
4. แทนที่ mock data ด้วย real data queries — implement repository/queries layer สำหรับทุก data models
5. เพิ่ม error handling สำหรับ data operations — สร้างและรัน seed script สำหรับ testing
6. ตรวจสอบ data integrity หลัง seed — ถ้า migrations หรือ seed fail ให้ทำ `/resolve-errors` ก่อนดำเนินต่อ

### 4. Implement API And UX/UI Layer

> Goal: Implement API handlers และเชื่อม UX/UI components กับ real API

1. Implement API handlers ที่ query data source จริง — เพิ่ม validation สำหรับ input/output ทุก endpoint
2. Implement auth middleware สำหรับ protected endpoints, rate limiting สำหรับ public endpoints, structured error responses
3. ตรวจสอบว่า API types ตรงกับ schema และ validation schemas
4. แทนที่ mock data ใน components ด้วย real API calls — implement loading, error, empty states สำหรับทุก data-driven components
5. Implement form validation ด้วย validation schemas ที่ตรงกับ API, เชื่อม auth UI กับ auth service จริง
6. ถ้าเหมาะสม → implement optimistic updates สำหรับ mutations — ถ้า API validation fail ให้ทำ `/resolve-errors`

> Reminder: workflow goal คือแปลงทุกอย่างเป็น production code จริง — schema และ data layer เป็น foundation ก่อน API และ UX/UI

### 5. Convert TODOs, Markdown TODOs, And Use Libraries

> Goal: แปลง TODO/FIXME/HACK, TODO.md, และ missing features เป็น production code

1. ค้นหา `TODO`, `FIXME`, `XXX`, `HACK` comments, placeholder functions, mock data, hard-coded values ด้วย `grep`
2. ค้นหา TODO.md, ROADMAP.md, และ queue files ใน project
3. ใช้ `edit` หรือ `write` แทนที่ placeholder ด้วย real implementation — ถ้าต้อง edit-only ให้ทำตาม `/edit-only`
4. Implement TODO items จาก Markdown/queue ตาม priority และ dependencies
5. ทำ `/implement-features-to-mvp` เพื่อ implement features ที่ขาด
6. ทำ `/implement-mock` เพื่อแทนที่ MOCK, FAKE, STUB ด้วย real implementations
7. ทำ `/use-lib-effective` — ถ้ามี library ที่ดีกว่า → ทำ `/use-lib-better` — ถ้า fail ให้ทำ `/resolve-errors`

### 6. Refactor And Verify

> Goal: ปรับปรุงคุณภาพโค้ด ตรวจสอบ references และ cleanup

1. ทำ `/refactor`, `/update-references`, `/update-review-codebase-cli-and-run`, `/review-quality`, `/update-review-codebase-cli-and-run` — refactor ครบวงจร, อัปเดท references, เพิ่ม type safety, config optimization
2. ทำ `/check-unused-deps`, `/check-unused-files` — ตรวจจับ unused dependencies และไฟล์ พิจารณาว่าควรลบหรือ implement ให้ครบ
3. ทำ `/run-lint` เพื่อรัน lint และแก้ code ให้ผ่าน — ถ้า lint ไม่ผ่านหลังแก้ 3 ครั้ง → stop และ report
4. ทำ `/run-verify` เพื่อตรวจสอบ scan, typecheck, test, build ครบถ้วน — ถ้าไม่ผ่าน ให้ทำ `/resolve-errors` แล้ว retry (max 3)

## Rules

### 1. No Mock Implementations

- ไม่มี mock implementations ใน production code — แทนที่ทุก mock data ด้วย real data queries
- แทนที่ทุก simulated delay ด้วย actual API calls — แทนที่ทุก in-memory stores ด้วย real databases หรือ caches
- UX/UI components ต้องใช้ real API calls ไม่ใช่ hardcoded data — ไม่ silently fall back ไปใช้ mock data

### 2. Type Flow And Validation

- Types ต้อง flow ตลอดทั้ง chain: schema → validation schema → API types → UI types
- ใช้ type inference จาก schema ไม่ประกาศ type ซ้ำ — หลีกเลี่ยง `any` ใช้ `unknown` แทน
- ใช้ validation schemas สำหรับ runtime validation ที่ทุก boundary — ถ้า schema เปลี่ยน types ทุก layer ต้องอัปเดท

### 3. Security And Resilience

- Validate และ sanitize ทุก user inputs — ใช้ parameterized queries ป้องกัน SQL injection
- ไม่ expose secrets หรือ API keys ใน client-side code — API keys ต้อง encrypted หรือใช้ secrets manager
- Throw error ถ้า required environment variables ไม่มี — Validate config ที่ startup time
- ไม่ crash ทั้ง application เมื่อ service ล่ม — return cached data ถ้าเป็นไปได้ — implement retry logic ด้วย exponential backoff

### 4. UX/UI And Observability

- ทุก data-driven component ต้องมี loading, error, empty states
- Form validation ด้วย validation schemas ที่ตรงกับ API validation — แสดง user-friendly error messages
- Structured logging สำหรับทุก external call — metrics สำหรับ response times, error rates — log correlation IDs สำหรับ distributed tracing

## Expected Outcome

- ทุกอย่างเป็น production code จริง ใช้งานได้จริง — ไม่มี TODO/MOCK/placeholder เหลือ
- TODO comments, TODO.md items, queue items ถูก implement ครบ
- Schema, validation schemas, TypeScript types สมบูรณ์และเชื่อมต่อกัน
- API handlers เชื่อม data source จริง — UX/UI components เชื่อม API จริง
- Type flow ครบ: schema → validation → API → UI
- Infrastructure พร้อมสำหรับ production — security, error handling, observability ครบถ้วน
- Unused dependencies และ files ได้รับการพิจารณา — code ผ่าน lint โดยไม่มี errors/warnings
- `/run-verify` ผ่าน: scan, typecheck, test, build ไม่มี errors

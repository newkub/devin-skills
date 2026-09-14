---
name: follow-tool-hurl
description: ใช้ Hurl CLI สำหรับรันและทดสอบ HTTP requests จาก plain-text files พร้อม assertions
argument-hint: "[scope]"
related:
  - deep-test
  - run-test
  - follow-test
  - follow-tool-bruno
  - gen-openapi
  - follow-tool-github-actions
---

## Goal

ใช้ Hurl สำหรับเขียนและรัน API tests จาก `.hurl` plain-text files — assertions built-in, request chaining, CI-friendly

## Scope

ใช้สำหรับ projects ที่ต้องการ API test files ที่ diff ได้ใน Git, รันบน CLI ล้วน ไม่ต้องมี GUI หรือ runtime เพิ่ม

- Latest: `hurl@8.0.1` (verified 2026-09-13) — Rust single binary, powered by libcurl
- ถ้าต้องการ GUI/collections → `/follow-tool-bruno`; ถ้าต้องการ docs/mock server จาก spec → `/follow-tool-scalar`

## Execute

### 1. Installation

> Goal: ติดตั้ง Hurl binary

1. Windows: `scoop install hurl` หรือ `winget install hurl` (ต้องมี Visual C++ Redistributable)
2. Global ผ่าน mise: `mise use -g hurl` ถ้ารองรับ registry นั้น
3. Rust: `cargo install --locked hurl`; npm dev-dep: `bun add -D @orangeopensource/hurl`
4. Docker: `docker pull ghcr.io/orange-opensource/hurl:latest`
5. Verify ด้วย `hurl --version`

### 2. Write Hurl Files

> Goal: สร้าง `.hurl` files ที่ assert response ถูกต้อง

1. เก็บ tests ใน directory เช่น `tests/api/` หรือ `.hurl` files ข้าง feature
2. Format: request block ตามด้วย expected response — อย่างน้อย status code
3. เพิ่ม `[Asserts]` ด้วย queries: `jsonpath`, `xpath`, `header`, `status`, `duration`, `body`, `regex`, `sha256`
4. ใช้ predicates: `==`, `!=`, `contains`, `startsWith`, `matches`, `exists`, `>`, `<`
5. ดู syntax เต็มใน [references/hurl-file.md](references/hurl-file.md)

### 3. Chain Requests

> Goal: reuse ค่าจาก response ก่อนหน้าใน requests ถัดไป

1. เพิ่ม `[Captures]` section เพื่อเก็บค่า เช่น `csrf_token: xpath "..."`, `id: jsonpath "$.id"`
2. interpolate ด้วย `{{name}}` ใน request ถัดไป (URL, headers, body)
3. ใช้ chain สำหรับ login → create → verify → cleanup flows

### 4. Run Tests

> Goal: รัน tests พร้อม reporting สำหรับ local และ CI

1. รันด้วย `hurl --test tests/api/` (directory = รัน `*.hurl` ทั้งหมด recursive)
2. Variables: `--variable key=value` หรือ `--variables-file vars.env` (ไม่ commit secrets — ใช้ env vars `HURL_*`)
3. Reports: `--report-junit out.xml`, `--report-html out/`, `--report-json out.json`, `--test` exit code non-zero เมื่อ fail
4. Debug: `--very-verbose`, `--error-format long`, `--retry`, `--max-time`
5. ดู options เต็มใน [references/cli.md](references/cli.md)

### 5. Integrate CI

> Goal: gate pipeline ด้วย hurl exit code

1. ใช้ `hurl --test` + `--report-junit` ใน CI step
2. ไม่มี official GitHub Action — install ด้วย package manager หรือ npm binary ใน workflow
3. เก็บ reports เป็น artifacts; pair กับ JUnit reporters (dorny/test-reporter ฯลฯ)
4. ดูตัวอย่างใน [references/ci.md](references/ci.md)

## Rules

### 1. File Format

- หนึ่ง entry = request + expected response; response block เป็น asserts
- ใช้ `HTTP 200` shorthand หรือ `HTTP *` + `[Asserts]` เมื่อต้องการละเอียด
- ใส่ secrets ใน `--variables-file` หรือ env vars เท่านั้น ห้าม hard-code ใน `.hurl`

### 2. Testing Discipline

- ทุก assert ต้อง deterministic — ใช้ `jsonpath`/`xpath` queries ไม่ใช่ compare ทั้ง body เมื่อมี dynamic fields
- Chain ด้วย captures เมื่อ flow ต้องการ sequential requests
- ใช้ `--test` เสมอใน CI เพื่อให้ได้ exit code ถูกต้อง

### 3. Limitations

- HTTP/HTTPS เท่านั้น — ไม่รองรับ gRPC/WebSocket/MQTT (พิจารณา `/follow-tool-bruno` หรือ tool เฉพาะ)
- ไม่มี scripting language เต็มรูปแบบ — logic ซับซ้อนให้แยกไฟล์หรือใช้ `/deep-test api` script approach

- ใช้ /deep-test api ถ้าจำเป็น
- ใช้ /follow-tool-github-actions ถ้าจำเป็น (tool hurl)

## References

- [CLI options](references/cli.md)
- [Hurl file format](references/hurl-file.md)
- [CI integration](references/ci.md)
- [Package manifest](references/package-manifest.md)
- [Official resources](references/website.md)
- ใช้ /run-test ถ้าจำเป็น
- ใช้ /follow-test ถ้าจำเป็น
- ใช้ /gen-openapi ถ้าจำเป็น


## Expected Outcome

- `.hurl` test files อยู่ใน version control และรันผ่าน `hurl --test`
- Assertions ครอบคลุม status, headers, body fields สำคัญ
- Chaining ทำงานถูกต้องสำหรับ multi-step flows
- CI gate ด้วย exit code + JUnit report

---
name: follow-tool-scalar
description: ใช้ Scalar สำหรับออกแบบ ทดสอบ และจัดทำเอกสาร API แบบครบวงจร
argument-hint: "[scope]"
related:
  - run-api-docs
  - follow-tool-bruno
  - follow-tool-hurl
  - follow-test
  - follow-release
  - follow-deploy
  - follow-tool-github-actions
---

## Goal

ใช้ Scalar สำหรับออกแบบ API, ทดสอบ endpoints, สร้าง documentation และ mock server แบบครบวงจร

## Scope

ใช้สำหรับ projects ที่ต้องการ API documentation, API playground, mock server และ schema validation โดยใช้ Scalar toolchain

- Latest: `@scalar/api-reference@1.68.0` / `@scalar/cli@2.1.0` (verified 2026-09-13)

## Execute

### 1. Installation

> Goal: ติดตั้ง Scalar CLI หรือ package ที่เหมาะสม

1. ตรวจสอบ project stack ว่าใช้ OpenAPI, AsyncAPI หรือ GraphQL
2. ติดตั้ง `@scalar/cli` ด้วย `bun add -D @scalar/cli` (binary ชื่อ `scalar`, ต้องใช้ Node `>=24`)
3. ตรวจสอบ version ด้วย `bunx @scalar/cli --version` และรัน `bunx @scalar/cli init` เพื่อสร้าง config เริ่มต้น
4. ใช้ `@scalar/api-reference` เมื่อต้องการ embed API reference ใน app (React/Vue/standalone)
5. ดูคำสั่ง CLI ใน [references/scalar-cli.md](references/scalar-cli.md)

### 2. Configuration

> Goal: สร้าง Scalar config สำหรับ project

1. สร้าง `scalar.config.json`, `scalar.config.yaml` หรือ `scalar.config.ts`
2. กำหนด `title`, `description`, `proxyUrl`, `theme`, `layout`
3. ตั้งค่า environment variables เช่น `SCALAR_PORT`, `SCALAR_API_URL`
4. ดูตัวเลือก config ใน [references/scalar-config.md](references/scalar-config.md)

### 3. Schema Design

> Goal: ออกแบบ API schema ที่ถูกต้องและเอกสารครบถ้วน

1. ใช้ type system ทีเหมาะสม (OpenAPI/AsyncAPI/GraphQL)
2. ตั้งชื่อ types, fields, operations ทีชัดเจน
3. เพิ่ม descriptions, examples, deprecation notes
4. ใช้ enums สำหรับ fixed values และ input types สำหรับ mutations
5. ดู API patterns ใน [references/scalar-api.md](references/scalar-api.md)

### 4. Mock and Test

> Goal: ทดสอบ APIs ด้วย mock server และ validation

1. รัน mock server ด้วย `bunx @scalar/cli document mock openapi.yaml --watch --port 8080`
2. ทดสอบ queries, mutations, และ error scenarios (mock server validate request ตาม OpenAPI contract โดย default)
3. ใช้ `bunx @scalar/cli document validate openapi.yaml` เพื่อตรวจสอบ schema validity และ `document lint` สำหรับ spectral rules
4. ใช้ `bunx @scalar/cli document serve openapi.yaml` เพื่อ preview API reference แบบ local — หรือทำ `/run-api-docs` ให้ start docs server + browser preview ครบ
5. ถ้าต้องการ test API จริงจาก spec → export/import เข้า Bruno (`bru import openapi`) หรือเขียน `.hurl` files — ดู `/deep-test-api`
6. ทำ `/follow-test` เพื่อขยาย test coverage

### 5. Documentation and Deploy

> Goal: publish documentation และ integrate กับ CI

1. สร้าง Markdown docs ด้วย `bunx @scalar/cli document markdown openapi.yaml` หรือ bundle refs ด้วย `document bundle`
2. ใช้ `@scalar/api-reference` (standalone script tag หรือ framework integration) สำหรับ HTML docs หรือ publish ผ่าน `scalar registry`/`scalar project`
3. ตั้งค่า GitHub Actions หรือ CI/CD pipeline สำหรับ `document validate` และ deploy docs
4. deploy ไปยัง static host เช่น GitHub Pages, Cloudflare Pages
5. ดู official resources ใน [references/official-resources.md](references/official-resources.md)

## Rules

### 1. Schema Design

- ใช้ descriptive names สำหรับ types และ fields
- เพิ่ม descriptions สำหรับทุก public types และ fields
- ใช้ examples สำหรับ complex queries และ mutations
- mark deprecated fields อย่างชัดเจน

### 2. Mock and Test

- ใช้ mock server สำหรับ development และ manual testing
- ทดสอบ error scenarios และ performance
- ใช้ version control สำหรับ schema changes

### 3. Documentation

- สร้าง docs อัตโนมัติจาก schema
- deploy docs บน static host
- อัปเดต docs เมื่อ schema เปลี่ยน

### 4. Integration

- ใช้ CI/CD สำหรับ validate และ build docs
- ไม่ hard-code secrets หรือ API keys
- ใช้ environment variables สำหรับ config ที environment-specific

- ใช้ /follow-release ถ้าจำเป็น
- ใช้ /follow-deploy ถ้าจำเป็น
- ใช้ /follow-tool-github-actions ถ้าจำเป็น (tool scalar)

## References

- [CLI reference](references/cli.md)


## Expected Outcome

- Scalar ติดตั้งและตั้งค่าเสร็จ
- API schema ถูกต้องและมีเอกสารครบถ้วน
- Mock server ทำงานได้
- Documentation publish ได้
- Tests และ validation ผ่าน


---
name: follow-tool-scalar
description: ใช้ Scalar สำหรับออกแบบ ทดสอบ และจัดทำเอกสาร API แบบครบวงจร
argument-hint: "[scope]"
related:
  - follow-test
  - follow-release
  - follow-deploy
  - follow-tool-github-actions
---

## Goal

ใช้ Scalar สำหรับออกแบบ API, ทดสอบ endpoints, สร้าง documentation และ mock server แบบครบวงจร

## Scope

ใช้สำหรับ projects ที่ต้องการ API documentation, API playground, mock server และ schema validation โดยใช้ Scalar toolchain

## Execute

### 1. Installation

> Goal: ติดตั้ง Scalar CLI หรือ package ที่เหมาะสม

1. ตรวจสอบ project stack ว่าใช้ OpenAPI, AsyncAPI หรือ GraphQL
2. ติดตั้ง `@scalar/api-designer` หรือ `@scalar/cli` ด้วย `bun add -D <package>`
3. ตรวจสอบ version ด้วย `bunx @scalar/api-designer --version`
4. ดูคำสั่ง CLI ใน [references/scalar-cli.md](references/scalar-cli.md)

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

1. รัน mock server ด้วย `bunx @scalar/api-designer --mock`
2. ทดสอบ queries, mutations, และ error scenarios
3. ใช้ `scalar validate` เพื่อตรวจสอบ schema validity
4. ทำ `/follow-test` เพื่อขยาย test coverage

### 5. Documentation and Deploy

> Goal: publish documentation และ integrate กับ CI

1. สร้าง static docs ด้วย `bunx @scalar/api-designer --build`
2. ตั้งค่า GitHub Actions หรือ CI/CD pipeline สำหรับ build และ deploy docs
3. deploy ไปยัง static host เช่น GitHub Pages, Cloudflare Pages
4. ดู official resources ใน [references/official-resources.md](references/official-resources.md)

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
- ใช้ /follow-tool-github-actions ถ้าจำเป็น

## References

- [CLI reference](references/cli.md)
- [References index](references/index.md)

## Expected Outcome

- Scalar ติดตั้งและตั้งค่าเสร็จ
- API schema ถูกต้องและมีเอกสารครบถ้วน
- Mock server ทำงานได้
- Documentation publish ได้
- Tests และ validation ผ่าน

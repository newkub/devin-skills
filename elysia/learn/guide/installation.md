# Installation

## Purpose

แนะนำการติดตั้ง Elysia framework และ dependencies ที่จำเป็น

## Scope

- Bun Runtime
- Elysia Package
- Project Scaffolding
- TypeScript Configuration

## Prerequisites

| Requirement | Version | คำอธิบาย |
|-------------|---------|----------|
| **Bun** | >= 1.0 | Runtime หลักของ Elysia |
| **TypeScript** | >= 5.0 | แนะนำสำหรับ type safety |

### Install Bun

```bash
# macOS / Linux
curl -fsSL https://bun.sh/install | bash

# Windows
powershell -c "irm bun.sh/install.ps1 | iex"

# Verify
bun --version
```

## Install Elysia

### Create New Project

```bash
bun create elysia my-app
cd my-app
bun install
bun dev
```

### Add to Existing Project

```bash
bun add elysia
```

### Optional Packages

| Package | คำอธิบาย | Command |
|---------|----------|---------|
| **@elysia/cors** | CORS support | `bun add @elysia/cors` |
| **@elysia/bearer** | Bearer auth | `bun add @elysia/bearer` |
| **@elysia/jwt** | JWT support | `bun add @elysia/jwt` |
| **@elysia/cookie** | Cookie management | `bun add @elysia/cookie` |
| **@elysia/swagger** | Swagger docs | `bun add @elysia/swagger` |
| **@elysia/openapi** | OpenAPI docs | `bun add @elysia/openapi` |
| **@elysia/eden** | Type-safe client | `bun add @elysia/eden` |
| **@elysia/static** | Static files | `bun add @elysia/static` |

## TypeScript Configuration

เพิ่ม compiler options ใน `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["bun-types"]
  }
}
```

| Option | คำอธิบาย | จำเป็น |
|--------|----------|--------|
| `strict` | เปิด strict mode สำหรับ type safety | แนะนำ |
| `target` | ใช้ `ESNext` สำหรับ Bun | แนะนำ |
| `moduleResolution` | ใช้ `bundler` | แนะนำ |
| `types` | เพิ่ม `bun-types` สำหรับ Bun APIs | แนะนำ |

## Project Structure

```text
my-app/
├── src/
│   └── index.ts          # Main entry point
├── tsconfig.json         # TypeScript config
├── package.json          # Dependencies
└── .env                  # Environment variables
```

## Verify Installation

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
  .get('/', () => 'Hello Elysia!')
  .listen(3000)

console.log(`Listening on ${app.server?.url}`)
```

```bash
bun run src/index.ts
# Listening on http://localhost:3000
```

## Summary

| ขั้นตอน | Command |
|---------|---------|
| **Install Bun** | `curl -fsSL https://bun.sh/install \| bash` |
| **Create Project** | `bun create elysia my-app` |
| **Add Elysia** | `bun add elysia` |
| **Config TS** | เพิ่ม `strict: true` ใน tsconfig.json |
| **Run** | `bun run src/index.ts` |

---
name: solid-nitro-tanstack
description: "ตั้งค่า TanStack Start (SolidJS) กับ Nitro สำหรับ SSR และ deployment"
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

ตั้งค่าและใช้งาน TanStack Start (SolidJS) ร่วมกับ Nitro สำหรับ server-side rendering และ universal deployment


## Scope

ใช้สำหรับ projects ที่ต้องการ:
- Full-stack framework ด้วย SolidJS
- Server-side rendering (SSR) และ streaming
- Deployment ผ่าน Nitro ไปยังหลาย platforms (Node.js, Bun, Cloudflare Workers, etc.)
- Type-safe routing ด้วย TanStack Router
- Server functions และ API routes


## Execute

### 1. Setup Project

สร้าง project ใหม่ด้วย TanStack Start CLI:

```bash
bun create @tanstack/start@latest
```

เลือก SolidJS เป็น framework

### 2. Install Dependencies

ติดตั้ง TanStack Start, Router, และ SolidJS:

```bash
bun i @tanstack/solid-start @tanstack/solid-router solid-js
bun i -D vite vite-plugin-solid typescript @types/node
```

สำหรับ Rsbuild:

```bash
bun i -D @rsbuild/core @rsbuild/plugin-solid
```

### 3. Configure Nitro

ตั้งค่า Nitro plugin ใน `vite.config.ts`:

```ts
import { tanstackStart } from '@tanstack/solid-start/plugin/vite'
import { defineConfig } from 'vite'
import { nitro } from 'nitro/vite'
import viteSolid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [
    tanstackStart(),
    nitro(), // หรือ nitro({ preset: 'bun' }) สำหรับ Bun
    viteSolid({ ssr: true })
  ]
})
```

สำหรับ Rsbuild:

```ts
import { defineConfig } from '@rsbuild/core'
import { pluginSolid } from '@rsbuild/plugin-solid'
import { tanstackStart } from '@tanstack/solid-start/plugin/rsbuild'

export default defineConfig({
  plugins: [
    pluginSolid(),
    tanstackStart()
  ]
})
```

### 4. Configure TypeScript

ตั้งค่า `tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "solid-js",
    "moduleResolution": "Bundler",
    "module": "ESNext",
    "target": "ES2022",
    "skipLibCheck": true,
    "strictNullChecks": true
  }
}
```

### 5. Build And Deploy

รัน build และ deploy ตาม target ที่เลือก:

```bash
bun run build
bun run start
```


## Rules

### 1. Nitro Configuration

- ใช้ `nitro/vite` plugin สำหรับ integration กับ Vite Environments API
- Plugin อยู่ใน active development และได้รับ updates อย่างสม่ำเสมอ
- ตั้งค่า `preset` ตาม deployment target (เช่น `bun` สำหรับ Bun deployment)
- ทำตาม `follow-nitro` สำหรับ Nitro configuration ที่ครบถ้วน

### 2. SolidJS Requirements

- ต้องใช้ SolidJS 1.x สำหรับ Bun deployment
- ตั้งค่า `vite-plugin-solid` ด้วย `ssr: true`
- ใช้ `HydrationScript` สำหรับ client-side hydration
- ทำตาม `follow-solidjs` สำหรับ SolidJS best practices

### 3. TypeScript Configuration

- ตั้งค่า `jsx: "preserve"` และ `jsxImportSource: "solid-js"`
- ใช้ `moduleResolution: "Bundler"` และ `target: "ES2022"`
- หลีกเลี่ยง `verbatimModuleSyntax` เพื่อป้องกัน server bundles รั่วไปยัง client bundles
- ทำตาม `follow-ts` สำหรับ TypeScript configuration

### 4. Build Tool Configuration

- Vite: ใช้ `@tanstack/solid-start/plugin/vite` และ `vite-plugin-solid`
- Rsbuild: ใช้ `@tanstack/solid-start/plugin/rsbuild` และ `@rsbuild/plugin-solid`
- ทำตาม `follow-vite` สำหรับ Vite configuration

### 5. TanStack Start Features

- TanStack Start อยู่ใน Release Candidate stage
- ใช้ TanStack Router สำหรับ type-safe routing
- รองรับ full-document SSR, streaming, server functions
- รองรับ SolidJS Server Components (experimental)
- ทำตาม `follow-tanstack-router` สำหรับ routing

### 6. Performance Optimization

- สำหรับ Node.js deployment: ใช้ `srvx` FastResponse สำหรับ ~5% throughput improvement
- ติดตั้ง `srvx` และเพิ่มใน server entry point
- ใช้ `globalThis.Response = FastResponse` ใน `src/server.ts`

### 7. Deployment Guidelines

ทำตาม deployment guidelines ของแต่ละ platform:
- Node.js: ใช้ `node` command เพื่อ start application
- Bun: ตั้งค่า preset เป็น `bun` และใช้ SolidJS 1.x
- Cloudflare Workers: ใช้ `cloudflare-workers` preset
- Vercel/Netlify/Railway: ใช้ preset ที่เกี่ยวข้อง
- ทำตาม `follow-deploy-to-cloudflare` สำหรับ Cloudflare deployment


## Expected Outcome

- TanStack Start (SolidJS) project ที่ตั้งค่าด้วย Nitro
- SSR และ streaming ที่ทำงานได้อย่างถูกต้อง
- Deployment ไปยัง target platform ที่เลือก
- Type-safe routing ด้วย TanStack Router
- Server functions และ API routes ที่ทำงานได้

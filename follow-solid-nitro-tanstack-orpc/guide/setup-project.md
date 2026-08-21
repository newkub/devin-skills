---
description: สร้าง TanStack Start (SolidJS) project ใหม่ด้วย Nitro
---

## Setup TanStack Start with Nitro

### 1. Create Project

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

ติดตั้ง Nitro:

```bash
bun install nitro
```

### 3. Configure TypeScript

สร้าง `tsconfig.json`:

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

### 4. Configure Vite

แก้ไข `vite.config.ts`:

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

### 5. Update Package Scripts

```json
{
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "start": "node .output/server/index.mjs"
  }
}
```

### 6. Verify Setup

```bash
bun run dev
```

เปิด browser ที่ `http://localhost:3000`

---
description: Configuration options สำหรับ Nitro กับ TanStack Start
---

## Nitro Configuration

### Basic Config

```ts
import { tanstackStart } from '@tanstack/solid-start/plugin/vite'
import { defineConfig } from 'vite'
import { nitro } from 'nitro/vite'
import viteSolid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [
    tanstackStart(),
    nitro(),
    viteSolid({ ssr: true })
  ]
})
```

### Preset Options

#### Node.js

```ts
nitro({ preset: 'node-server' })
```

#### Bun

```ts
nitro({ preset: 'bun' })
```

#### Cloudflare Workers

```ts
nitro({ preset: 'cloudflare-workers' })
```

#### Vercel

```ts
nitro({ preset: 'vercel' })
```

#### Netlify

```ts
nitro({ preset: 'netlify' })
```

#### Railway

```ts
nitro({ preset: 'railway' })
```

#### Appwrite Sites

```ts
nitro({ preset: 'appwrite-sites' })
```

### Advanced Options

```ts
nitro({
  preset: 'node-server',
  routeRules: {
    '/api/**': { cors: true }
  }
})
```

### Performance Optimization

สำหรับ Node.js deployment ใช้ `srvx` FastResponse:

```ts
import { FastResponse } from 'srvx'
globalThis.Response = FastResponse
```

ติดตั้ง `srvx`:

```bash
bun install srvx
```

เพิ่มใน server entry point (`src/server.ts`) สำหรับ ~5% throughput improvement

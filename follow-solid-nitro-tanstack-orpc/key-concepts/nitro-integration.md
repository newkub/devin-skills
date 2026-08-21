---
description: Nitro integration กับ TanStack Start (SolidJS)
---

## Nitro Integration

### Nitro Plugin

`nitro/vite` plugin ทำให้ TanStack Start ทำงานกับ Nitro:

- Integration กับ Vite Environments API
- Plugin อยู่ใน active development และได้รับ updates อย่างสม่ำเสมอ
- Support หลาย deployment presets
- Automatic server entry generation

### Presets

Nitro presets สำหรับ deployment ต่างๆ:

- `node-server` - Node.js deployment
- `bun` - Bun runtime
- `cloudflare-workers` - Cloudflare Workers
- `vercel` - Vercel platform
- `netlify` - Netlify platform
- `railway` - Railway platform
- `appwrite-sites` - Appwrite Sites

### Server Entry

Nitro สร้าง server entry อัตโนมัติ:

```ts
import { createStartHandler, defaultStreamHandler } from '@tanstack/solid-start/server'

const fetch = createStartHandler(defaultStreamHandler)
export const serverEntry = { fetch }
```

### Build Tool Support

Nitro รองรับทั้ง Vite และ Rsbuild:

- Vite: ใช้ `nitro/vite` plugin
- Rsbuild: ใช้ `nitro/vite` plugin ผ่าน Vite Environments API

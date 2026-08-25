# Cloudflare Vite Plugin

`@cloudflare/vite-plugin` เป็น official Cloudflare plugin สำหรับ Vite ที่ integrate Vite เข้ากับ Workers runtime ผ่าน Vite Environment API

## When To Install

- Project deploy ไป Cloudflare Workers หรือ Pages
- Project ใช้ Vite เป็น build tool (มี `vite.config.ts` หรือ `vite` ใน `devDependencies`)
- รองรับ TanStack Start, React Router v8, SPA, standalone Workers, multi-Worker

## Install

```bash
bun add -D @cloudflare/vite-plugin wrangler
```

## Configure Vite

เพิ่ม `cloudflare()` plugin ใน `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [cloudflare()],
});
```

ถ้าใช้ framework plugin อื่น (เช่น React) ให้วาง `cloudflare()` หลัง framework plugin:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [react(), cloudflare()],
});
```

### TanStack Start (Solid หรือ React)

สำหรับ TanStack Start ต้องวาง `cloudflare()` **ก่อน** `tanstackStart()` และตั้งค่า `viteEnvironment`:

```ts
import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/solid-start/plugin/vite";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart(),
    solidPlugin({ ssr: true }),
  ],
});
```

`wrangler.jsonc` สำหรับ TanStack Start ใช้ server-entry export เป็น `main`:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "my-app",
  "compatibility_date": "2025-08-13",
  "compatibility_flags": ["nodejs_compat"],
  "main": "@tanstack/solid-start/server-entry",
  "observability": { "enabled": true }
}
```

สำหรับ TanStack Start + React ใช้ `@tanstack/react-start/server-entry` แทน

## Wrangler Config

Plugin อ่าน `wrangler.jsonc`, `wrangler.json` หรือ `wrangler.toml` ใน root อัตโนมัติ ไม่ต้องกำหนดค่าเพิ่มเว้นแต่ต้องการ override

ตัวอย่าง `wrangler.jsonc` สำหรับ SPA:

```jsonc
{
  "name": "my-app",
  "main": "./worker/index.ts",
  "compatibility_date": "2026-08-26",
  "assets": {
    "directory": "./dist/client",
    "not_found_handling": "single-page-application"
  }
}
```

## Build And Deploy

หลังติดตั้ง plugin แล้ว build และ deploy ด้วย Vite + Wrangler:

```bash
# Build ด้วย Vite (plugin สร้าง output สำหรับ Workers)
vite build

# Deploy ด้วย wrangler
wrangler deploy
```

รองรับ `vite preview` เพื่อ preview build output ใน Workers runtime ก่อน deploy จริง

## Verify Install

1. ตรวจสอบ `vite.config.ts` มี `cloudflare()` ใน `plugins` array
2. รัน `vite build` สำเร็จโดยไม่มี error
3. ตรวจสอบว่ามี `wrangler.jsonc` หรือ `wrangler.toml` ใน root
4. รัน `wrangler whoami` เพื่อยืนยัน authentication

## CI Deploy Tips

### GitHub Actions

ใช้ `cloudflare/wrangler-action@v3` สำหรับ auth ใน CI เพราะ `bunx wrangler deploy` โดยตรงมักไม่ detect `CLOUDFLARE_API_TOKEN` env var ใน non-interactive environment:

```yaml
- uses: actions/checkout@v4
- uses: oven-sh/setup-bun@v2
- name: Install dependencies
  run: bun install --frozen-lockfile
- name: Build
  run: bun run build
- name: Deploy to Cloudflare Workers
  uses: cloudflare/wrangler-action@v3
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    command: deploy
    packageManager: bun
```

### Common Pitfalls

- **Frozen lockfile**: CI ใช้ `bun install --frozen-lockfile` ถ้า `bun.lock` ไม่ sync กับ `package.json` จะ fail ต้องรัน `bun install` ในเครื่องแล้ว commit lockfile ใหม่
- **Missing secret**: ต้องตั้ง `CLOUDFLARE_API_TOKEN` เป็น GitHub secret (`gh secret set CLOUDFLARE_API_TOKEN`)
- **`.wrangler` directory**: เพิ่ม `.wrangler` ใน `.gitignore` และ linter ignores
- **Stale wrangler.toml**: ถ้า migrate จาก Nitro/SolidStart เก่าที่ใช้ `.output/server/index.mjs` ต้องแปลงเป็น `wrangler.jsonc` และใช้ `main` ตาม framework ปัจจุบัน
- **Biome schema version**: ถ้า Biome อัปเดต ให้รัน `bunx biome migrate --write` และอัปเดต `$schema` URL ใน `biome.jsonc`

## Source

- [Vite plugin docs](https://developers.cloudflare.com/workers/vite-plugin/)
- [Get started](https://developers.cloudflare.com/workers/vite-plugin/get-started/)
- [API reference](https://developers.cloudflare.com/workers/vite-plugin/reference/api/)
- [@cloudflare/vite-plugin on npm](https://www.npmjs.com/package/@cloudflare/vite-plugin)
- [Bun package registry](https://bun.sh/docs/install)

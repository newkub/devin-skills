---
name: follow-solid-framework
description: SolidJS app dispatcher — SPA (TanStack Router) / full-stack TanStack Start (server fns + Drizzle/D1) — deploy targets CF Workers, Nitro bun, Nitro CF — merged จาก follow-create-solid-* เดิม
argument-hint: "[spa|start|nitro-bun|nitro-cf]"
related:
  - follow-lib-solidjs
  - follow-lib-tanstack-ecosystem
  - follow-lib-unocss
  - follow-lib-nitro
  - follow-lib-drizzle
  - follow-lib-orpc
  - follow-lib-effect-ts
  - follow-service-cloudflare
  - follow-tool-vite
  - follow-lang-typescript
  - follow-single-responsibility
  - run-dev
---

## Goal

สร้าง SolidJS application — เลือก variant ตาม deploy target แล้ว execute ตาม section ของ variant นั้น

## Scope

ครอบทุก Solid app archetype:

| Variant | Stack | Deploy | เมื่อไหร่ |
|---|---|---|---|
| `spa` | Solid + TanStack Router + UnoCSS | static bundle | client-only (dashboard, Tauri/Capacitor embed) |
| `start` | TanStack Start (SSR + server fns/routes) + Drizzle/D1 | Cloudflare Workers | full-stack บน CF (canonical) |
| `nitro-bun` | TanStack Start + Nitro preset `bun` | `.output/server/index.mjs` self-host/Docker | own server, local `bun:sqlite` |
| `nitro-cf` | TanStack Start + Nitro preset `cloudflare-module` | wrangler deploy จาก `.output/` | nitro-native CF path (แทน `@cloudflare/vite-plugin`) |

Frameworks อื่น → `/follow-create-web`; lib only → `/follow-lib-solidjs`

## Execute

### 0. Choose Variant

เลือกจากตาราง Scope — ถ้าไม่ชัด default = `start` (full-stack) หรือถาม user

### 1. Setup Project (ทุก variant)

1. ทำ `/deep-research` + `/follow-best-practice` ยืนยันเวอร์ชันล่าสุด ตาม `/update-devin-global-skills` แล้ว `/deep-review` สรุป stack
2. Scaffold: `bun create vite@latest my-app -- --template solid` (spa) หรือ `npx @tanstack/cli@latest create --framework solid` / gitpick `TanStack/router` example `solid/start-basic` (start variants)
3. Modules: `src/modules/<feature>/` (components + hooks + schemas + types + `index.ts` barrel), shared UI `src/components/`, infra `src/lib/` — file structure canonical ใน `templates/`

### 2. Dependencies

```bash
# spa (pure Router) — หรือใช้ @tanstack/solid-start ด้วย spa.enabled mode (ดู §3)
bun i @tanstack/solid-router solid-js
bun i -D vite vite-plugin-solid typescript @tanstack/router-plugin unocss @iconify-json/mdi

# start variants (+ server)
bun i @tanstack/solid-start @tanstack/solid-router solid-js drizzle-orm
bun i -D vite vite-plugin-solid typescript nitro unocss @iconify-json/mdi drizzle-kit wrangler
bun i -D vite-tsconfig-paths         # ~/ alias จาก tsconfig paths
# CF deploy ผ่าน vite-plugin path → bun i -D @cloudflare/vite-plugin
```

Optional: `zod` (validator), `effect` (`/follow-lib-effect-ts`), `@orpc/*` (`/follow-lib-orpc`)

### 3. Vite Config — Per Variant

**spa — มี 2 patterns** (เลือกอย่างใดอย่างหนึ่ง):

```ts
// (a) pure Router — SPA ล้วน ไม่เกี่ยว Start
plugins: [
  tsConfigPaths(),
  tanstackRouter({ target: 'solid', autoCodeSplitting: true }),
  UnoCSS(),
  viteSolid(),
]

// (b) Start spa mode — codebase เดียวกับ fullstack / prerender shell (Capacitor)
plugins: [
  tsConfigPaths(),
  tanstackStart({ spa: { enabled: true, prerender: { outputPath: '/index' } } }),
  UnoCSS(),
  viteSolid({ ssr: true }),   // จำเป็น — prerender ยังสร้าง ssr bundle
]
```

**start — Cloudflare canonical (dept-saw path)** ใช้ `@cloudflare/vite-plugin` ไม่ใช่ nitro:
```ts
plugins: [
  tsConfigPaths(),
  cloudflare({ viteEnvironment: { name: 'ssr' } }),   // D1 binding ผ่าน env
  tanstackStart(),
  UnoCSS(),
  viteSolid({ ssr: true }),
]
```

**nitro variants** — `viteSolid({ ssr: true })` หลัง `tanstackStart()` เสมอ:
```ts
import { nitro } from 'nitro/vite'

// preset ผ่าน option หรือ env — env ปลอดภัยกว่า (nitro บาง version type ไม่รับ option)
process.env.NITRO_PRESET ??= '<preset>'   // 'bun' | 'cloudflare-module'

plugins: [tsConfigPaths(), tanstackStart(), nitro(), UnoCSS(), viteSolid({ ssr: true })]
```

| Variant | engine | preset | config หลัก |
|---|---|---|---|
| start | `@cloudflare/vite-plugin` | — | `vite.config.ts` |
| nitro-bun | `nitro()` | `bun` | `vite.config.bun.ts` |
| nitro-cf | `nitro()` | `cloudflare-module` | `vite.config.ts` |

หลาย target ใน repo เดียว → แยก `vite.config.*.ts` (pattern ใน dept-saw: `build` CF + `build:bun` nitro + `build:spa` capacitor)

### 4. TypeScript

`jsx: "preserve"` + `jsxImportSource: "solid-js"`, `moduleResolution: "Bundler"`, `target: "ES2022"`, `skipLibCheck: true`; `paths: {"~/*": ["./src/*"]}` + `vite-tsconfig-paths` สำหรับ `~/` alias; full-stack หลีกเลี่ยง `verbatimModuleSyntax` (server รั่ว client); CF → `wrangler types` → `worker-configuration.d.ts`

### 4.5 Quality Scripts

ตั้ง `check`/`verify`/`ci` + `scan` (ast-grep rules) ตาม `/follow-tasks` Minimal — lint/format ผ่าน biome (`biome.json` config overrides เท่านั้น ตาม `/follow-default-config`), test ผ่าน `bun test` (bun-native) หรือ `vitest`

### 5. Router (ทุก variant)

1. `createFileRoute`/`createRootRoute` file-based — `routeTree.gen.ts` generated ห้ามแก้
2. `defaultPreload: 'intent'` + `scrollRestoration: true` + `validateSearch`
3. `import 'virtual:uno.css'` ใน `__root.tsx`/entry — **ห้าม `@import` ใน css** (postcss resolve เป็นไฟล์ → ENOENT)

### 6. Full-Stack Only (start/nitro-*)

1. **Server fns**: `createServerFn({ method })` + `.validator()` + `.handler()` — internal RPC; client เรียกเหมือน local แล้ว `router.invalidate()`
2. **Server routes**: `src/routes/api/*.ts` `server.handlers` — เฉพาะ webhooks/external; wildcard `api.$.ts`
3. **Server-only**: `.server.ts` / `serverOnly()` guard — ห้าม import DB/secrets เข้า client bundle
4. **Drizzle**: `src/lib/schema.ts` = source of truth; `drizzle.config.ts` + `migrations/` ตาม `/follow-lib-drizzle`
5. **DB adapter** per target:
   - CF → `drizzle(env.DB)` ด้วย `drizzle-orm/d1`; binding ใน `wrangler.jsonc` → `d1_databases`
   - nitro-bun → `bun:sqlite` ผ่าน `sqlite-proxy`; auto-migrate/seed ตอน start ถ้า DB ว่าง
   - runtime-detect adapter → ดู `dept-saw/src/lib/db.server.ts`

### 7. Build And Deploy — Per Variant

**spa**: `bun run build` → static `dist/` (embed ใน Tauri/Capacitor ได้ — `vite.config.spa.ts` + `spa.prerender` ตาม dept-saw)

**start (CF canonical)**: `bun run build` → `wrangler deploy`; bindings ใน `wrangler.jsonc` เท่านั้น; secrets `wrangler secret put`; rollback `wrangler rollback`

**nitro-bun**: `bun run build` → `.output/`; run `bun .output/server/index.mjs` (port จาก `PORT`/`NITRO_PORT`); Docker `FROM oven/bun` + `COPY .output`; sqlite file = runtime artifact อย่า commit

**nitro-cf**: `bun run build` → `wrangler.jsonc` ชี้ `"main": ".output/server/index.mjs"` + `"assets": {"directory": ".output/public"}` + `compatibility_flags: ["nodejs_compat"]` → `wrangler deploy` — ref https://nitro.build/deploy/providers/cloudflare

## Rules

- **spa**: client-only เท่านั้น — ห้าม `createServerFn`/`.server.ts`/server imports
- **start variants**: `.validator()` ทุก server fn ที่รับ input; server routes เฉพาะ external HTTP; ห้าม inline server code ใน components
- Nitro preset ผ่าน `NITRO_PRESET` env หรือ `nitro({ preset })` — env ปลอดภัยกว่า (nitro บาง version type ไม่รับ option); presets ทั้งหมดดู `/follow-lib-nitro`
- CF bindings declare ใน `wrangler.jsonc` เท่านั้น — code อ่านผ่าน typed `env.*`
- ห้ามใช้ `@cloudflare/vite-plugin` ร่วม nitro-cf path ใน config เดียว — เลือกทางเดียว (`start` = vite-plugin, `nitro-cf` = nitro)
- `routeTree.gen.ts` ห้าม edit; `virtual:uno.css` import ผ่าน JS entry เท่านั้น
- shared leaves (`utils/`/`types/`) ต้อง isomorphic-safe บน start — ห้าม `node:*`/`bun:*` (ย้าย `server/utils/`)
- Performance: `defaultPreload: 'intent'`, lazy routes + `Suspense`, `manualChunks` vendor split

## Expected Outcome

- Variant ที่เลือกรัน `bun run dev` + build ผ่าน target ของตัวเอง
- Type-safe routes + (full-stack) server fns/routes + Drizzle ทำงานครบ
- Deploy สำเร็จตาม target — static / Worker / portable bun server

## Templates

- `templates/file-structure-web-solid-spa.md` — SPA flat-layered structure
- `templates/file-structure-web-solid-start.md` — Start full-stack structure (isomorphic, `server/fns`, `infra/` server-only)

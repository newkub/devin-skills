---
name: follow-solid-tanstack
description: พัฒนา @tanstack/solid-start app ด้วย oRPC, Query, Store, Form และ Vite
allowed-tools:
- read
- edit
- grep
- glob
- exec
triggers:
- user
- model
---

## Goal

พัฒนา application ด้วย `@tanstack/solid-start` meta-framework พร้อม file-based routing, SSR/CSR, oRPC API layer, TanStack Query/Store/Form และ Vite (Rolldown)

## Scope

ใช้สำหรับ projects ที่ใช้ `@tanstack/solid-start` (ไม่ใช่ `@solidjs/start`)

## Execute

### 1. Setup Project

1. ติดตั้ง dependencies: `bun add @tanstack/solid-start @tanstack/solid-router @tanstack/solid-query @tanstack/solid-store solid-js`
2. ถ้า project มี forms ติดตั้ง `@tanstack/solid-form`
3. ติดตั้ง dev dependencies: `bun add -d vite vite-plugin-solid @tanstack/router-plugin typescript`
4. ถ้าใช้ Vite (Rolldown) ตั้งค่า `"vite": "npm:rolldown-vite@latest"` ใน `package.json`
5. ตั้งค่า `package.json` scripts: `dev` → `vite`, `build` → `vite build`, `typecheck` → `tsc --noEmit`, `test` → `vitest`

### 2. Configure Vite And TypeScript

1. สร้าง `vite.config.ts` พร้อม `tanstackStart()` จาก `@tanstack/solid-start/plugin/vite`, `viteSolid({ ssr: true })`, `UnoCSS()` - `viteSolid` ต้องอยู่หลัง `tanstackStart()` เสมอ
2. ตั้งค่า `router.routeFileIgnorePattern` สำหรับไฟล์ที่ไม่ใช่ route
3. ตั้งค่า `resolve.tsconfigPaths: true` สำหรับ path aliases (Vite 8+ built-in, Vite 7 ใช้ `vite-tsconfig-paths`)
4. ตั้งค่า `manualChunks` สำหรับ vendor splitting: `solid-vendor`, `tanstack-router`, `tanstack-query`, แยก major dependencies
5. ตั้งค่า `server.warmup.clientFiles` สำหรับ pre-transform ไฟล์ที่ใช้บ่อย (ทำ `/follow-vite`)
6. เปิดใช้ `experimental.rolldown: true` สำหรับ Rolldown bundler ถ้าใช้ Vite 7+
7. ตั้งค่า `tsconfig.json` ตาม `/follow-typescript`: `jsx: "preserve"`, `jsxImportSource: "solid-js"`, `moduleResolution: "Bundler"`, `module: "ESNext"`, `target: "ES2022"`, `paths: { "~/*": ["./src/*"] }`, `strict: true`, `skipLibCheck: true`
8. ห้ามเปิด `verbatimModuleSyntax` เพราะทำให้ server bundles รั่วเข้า client bundles

### 3. Setup Entry Points And Router

1. สร้าง `src/client.tsx`: import `uno.css`/`theme.css`, ใช้ `hydrateStart()` จาก `@tanstack/solid-start/client`, `StartClient` พร้อม router, `SolidQueryDevtools`, `hydrate()` จาก `solid-js/web`
2. สร้าง `src/server.ts`: ใช้ `createServerEntry` จาก `@tanstack/solid-start/server-entry`, รองรับ universal fetch handler format (Cloudflare Workers, WinterCG)
3. สร้าง `src/router.tsx` พร้อม `getRouter()`: ใช้ `createRouter` จาก `@tanstack/solid-router`, ส่ง `routeTree` จาก `./routeTree.gen.ts`, ตั้งค่า `defaultPreload: "intent"`, `scrollRestoration: true`
4. อย่าแก้ไข `routeTree.gen.ts` (auto-generated โดย `@tanstack/router-plugin`) แต่ commit ไฟล์นี้ใน git และ ignore ใน Biome
5. ถ้าต้องการ custom server handler ใช้ `createStartHandler` พร้อม `defineHandlerCallback` และ `defaultStreamHandler`
6. ใช้ request context ผ่าน TypeScript module augmentation สำหรับส่ง typed data (auth, DB) เข้า server handlers

### 4. Implement Routing

1. ทำ `/follow-tanstack` สำหรับ file-based routing patterns
2. ใช้ `createFileRoute("/path")` สำหรับทุก route
3. ใช้ `beforeLoad` สำหรับ auth guards และ `throw redirect()` สำหรับ redirects
4. ใช้ `head` ในแต่ละ route สำหรับ per-route SEO meta tags
5. ใช้ `$id/` สำหรับ dynamic segments, `_layout.tsx` สำหรับ layouts, `[...rest].tsx` สำหรับ catch-all
6. เปิดใช้ `autoCodeSplitting` ใน router plugin

### 5. Setup Server Functions And API Layer

1. ใช้ `createServerFn` จาก `@tanstack/solid-start` สำหรับ server-side logic พร้อม `method` และ `validator`/`inputValidator`
2. ใช้ `createCsrfMiddleware()` สำหรับ protect server functions จาก cross-site requests (auto-installed ถ้าไม่มี `src/start.ts`)
3. ถ้า deploy ที่ origin ต่างกัน ตั้งค่า `createCsrfMiddleware({ origin: 'https://app.example.com' })`
4. ใช้ `@orpc/server` และ `@orpc/tanstack-query` สำหรับ type-safe API layer
5. สร้าง `src/routes/api/rpc/[...rest].tsx` สำหรับ oRPC catch-all
6. ใช้ `authOS` (ไม่ใช่ `os` ตรง) สำหรับ procedures ที่ต้องการ auth
7. ใช้ `createTanstackQueryUtils` สำหรับ type-safe `.queryOptions()`/`.mutationOptions()`
8. ใช้ `isDefinedError` จาก `@orpc/client` สำหรับ type-safe error handling
9. ใช้ `createIsomorphicFn` สำหรับ environment-specific RPCLink config

### 6. Setup Data And State

1. ทำ `/follow-tanstack` สำหรับ Query v5 setup และ patterns
2. สร้าง `src/lib/query-client.ts` พร้อม `QueryClient` (`staleTime`, `gcTime`, `retry`)
3. ใช้ `useQuery(() => orpc.<path>.queryOptions({ input: { ... } }))` ด้วย function arguments สำหรับ reactive tracking
4. ห้าม destructure query return value - access ใน JSX reactive context ผ่าน `<Switch>`/`<Match>`
5. ทำ `/follow-tanstack` สำหรับ Store patterns
6. สร้าง stores ใน `src/modules/<feature>/stores/`, re-export จาก `src/stores/index.ts`
7. ถ้า project มี forms ทำ `/follow-tanstack` สำหรับ Form v1 patterns

### 7. Configure Testing And Deployment

1. ทำ `/follow-vitest` สำหรับ testing setup
2. ใช้ `@solidjs/testing-library` สำหรับ component testing
3. ใช้ `vi.mock` สำหรับ mock oRPC client ใน tests
4. เพิ่ม `routeTree.gen.ts` ใน Biome `ignore` patterns
5. ใช้ Nitro presets สำหรับ deployment targets (Vercel, Cloudflare, Netlify, Node.js)
6. ถ้า deploy บน Cloudflare Workers ขยาย `src/server.ts` สำหรับรองรับ queues, scheduled events, Durable Objects

## Rules

### 1. Framework Selection

- ใช้ `@tanstack/solid-start` ไม่ใช่ `@solidjs/start`
- ใช้ `tanstackStart()` plugin, `createFileRoute`, `hydrateStart`, `StartClient`, `createServerEntry`
- อย่าแก้ไข `routeTree.gen.ts` (auto-generated โดย `@tanstack/router-plugin`)

### 2. SolidJS Reactivity Constraints

- ใช้ function arguments ใน `useQuery(() => ({ ... }))` สำหรับ reactive tracking
- ห้าม destructure query return value - access ใน JSX reactive context
- ใช้ `createSignal`, `createMemo`, `createResource` สำหรับ reactivity
- ไม่ใช้ React patterns - SolidJS มี reactivity model ที่ต่างกัน

### 3. API Layer Constraints

- ใช้ `createServerFn` สำหรับ server-side logic พร้อม `method` และ `validator`
- ใช้ `createCsrfMiddleware()` สำหรับ protect server functions
- ใช้ `@orpc/server/fetch` สำหรับ `RPCHandler`, `@orpc/client/fetch` สำหรับ `RPCLink`
- ใช้ `@orpc/tanstack-query` สำหรับ `createTanstackQueryUtils`
- ใช้ `authOS` สำหรับ procedures ที่ต้องการ auth
- ใช้ Zod สำหรับ input validation เสมอ (ทำ `/follow-zod`)
- ใช้ `isDefinedError` สำหรับ type-safe error handling

### 4. State Management Constraints

- ไม่ใช้ Redux, Zustand, หรือ state libraries อื่น
- ใช้ `@tanstack/solid-store` สำหรับ global state
- ใช้ `@tanstack/solid-query` สำหรับ server state
- ใช้ `orpc.<path>.queryOptions()` สำหรับ type-safe oRPC queries

### 5. Performance And Import Protection

- ใช้ `lazy()` พร้อม `<Suspense>` สำหรับ heavy components
- ใช้ `manualChunks` ใน Vite config สำหรับ vendor splitting
- ใช้ `defaultPreload: "intent"` และ `scrollRestoration: true`
- ใช้ `.server.ts`/`.client.ts` naming convention สำหรับ environment-specific files
- หลีกเลี่ยง barrel files - import จากไฟล์ตรงๆ ตาม `/follow-vite`

### 6. TypeScript Constraints

- ใช้ `jsx: "preserve"` ไม่ใช่ `"react-jsx"` สำหรับ Solid.js
- ห้ามเปิด `verbatimModuleSyntax` เพราะทำให้ server bundles รั่วเข้า client
- ใช้ `moduleResolution: "Bundler"` และ `module: "ESNext"`

## Expected Outcome

- `@tanstack/solid-start` project ตั้งค่าครบถ้วน
- File-based routing ทำงานด้วย `createFileRoute` และ `autoCodeSplitting`
- SSR และ CSR modes ทำงานได้
- Server functions พร้อม CSRF protection และ type-safe RPC
- oRPC API layer type-safe ครบถ้วน
- TanStack Query/Store/Form ทำงานได้ด้วย reactive patterns
- Auth guards ทำงานทั้ง client และ server side
- Deployment presets รองรับ multiple platforms
- Biome ตั้งค่าครบ พร้อม `routeTree.gen.ts` ignore
- Vitest ทำงานด้วย `@solidjs/testing-library`

# Website Framework Routing Conventions

## Next.js

- App Router: `app/` directory, files `page.tsx`, `route.ts`, `layout.tsx`, `loading.tsx`
- Pages Router: `pages/`, `pages/api/`
- Dynamic: `[id]`, `[...slug]`, `[[...optional]]`
- Route groups: `(group)` ไม่มีผลต่อ URL
- Catch-all: `[...slug]`

## Nuxt

- Pages: `pages/`
- Dynamic: `[id]`, `[...slug]`, `[[optional]]`
- Nested routes: สร้างโฟลเดอร์ย่อย
- API routes: `server/api/`

## SvelteKit

- Routes: `src/routes/`
- Files: `+page.svelte`, `+page.ts`, `+page.server.ts`, `+server.ts`, `+layout.svelte`
- Dynamic: `[id]`, `[...slug]`, `[[optional]]`, `(group)`
- API: `+server.ts` รองรับ GET, POST, PUT, DELETE

## SolidStart

- Routes: `src/routes/`
- Files: `index.tsx`, `[id].tsx`, `[...id].tsx`
- API: `**/[name].ts` ใน `src/routes/`

## TanStack Start

- Routes: `app/routes.ts` หรือ file-based `app/routes/`
- Dynamic: `$id`, `$`
- API: `server/`, `api/`

## Remix

- Routes: `app/routes/`
- Files: `_index.tsx`, `$id.tsx`, `$.tsx`
- API: `resource routes` ไฟล์ทีมี loader/action

## Astro

- Routes: `src/pages/`
- Files: `.astro`, `.md`, `.mdx`
- Dynamic: `[id].astro`, `[...slug].astro`
- API: `src/pages/api/` หรือ endpoints ใน `src/server/`

# Website Framework Routing Conventions

## Next.js

- App Router: `app/` directory, files `page.tsx`, `route.ts`, `layout.tsx`, `loading.tsx`
- Pages Router: `pages/`, `pages/api/`
- Dynamic: `[id]`, `[...slug]`, `[[...optional]]`
- Route groups: `(group)` have no effect on the URL
- Catch-all: `[...slug]`

## Nuxt

- Pages: `pages/`
- Dynamic: `[id]`, `[...slug]`, `[[optional]]`
- Nested routes: create subfolders
- API routes: `server/api/`

## SvelteKit

- Routes: `src/routes/`
- Files: `+page.svelte`, `+page.ts`, `+page.server.ts`, `+server.ts`, `+layout.svelte`
- Dynamic: `[id]`, `[...slug]`, `[[optional]]`, `(group)`
- API: `+server.ts` supports GET, POST, PUT, DELETE

## SolidStart

- Routes: `src/routes/`
- Files: `index.tsx`, `[id].tsx`, `[...id].tsx`
- API: `**/[name].ts` in `src/routes/`

## TanStack Start

- Routes: `app/routes.ts` or file-based `app/routes/`
- Dynamic: `$id`, `$`
- API: `server/`, `api/`

## Remix

- Routes: `app/routes/`
- Files: `_index.tsx`, `$id.tsx`, `$.tsx`
- API: `resource routes` — files with loader/action

## Astro

- Routes: `src/pages/`
- Files: `.astro`, `.md`, `.mdx`
- Dynamic: `[id].astro`, `[...slug].astro`
- API: `src/pages/api/` or endpoints in `src/server/`

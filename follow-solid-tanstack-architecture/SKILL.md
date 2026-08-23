---
name: follow-solid-tanstack-architecture
description: จัดโครงสร้าง TanStack Start + SolidJS app พร้อม modules/, monorepo และ file-based routing
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
triggers:
  - user
  - model
related: []
---
## Goal

จัดโครงสร้าง TanStack Start + SolidJS application ตาม best practices ที่รองรับ SSR, CSR, server functions, modules/ สำหรับ feature-based organization และ monorepo shared packages โดยไม่ผูกกับ styling หรือ API layer เฉพาะ

## Scope

ใช้สำหรับ projects ที่ใช้ `@tanstack/solid-start` (ไม่ใช่ `@solidjs/start`) ทั้ง standalone และ monorepo

## Execute

### 1. Setup Project Structure

> Goal: สร้างโครงสร้างโปรเจกต์พื้นฐาน
> Goal: มีโครงสร้างโฟลเดอร์หลักครบถ้วนพร้อม modules/

1. สร้าง `public/` สำหรับ static assets
2. สร้าง `src/routes/` สำหรับ file-based routing
3. สร้าง `src/modules/` สำหรับ feature-based organization
4. สร้าง `src/components/` สำหรับ shared reusable components
5. สร้าง `src/lib/` สำหรับ utilities, helpers และ non-UI logic
6. สร้าง `src/types/` สำหรับ TypeScript types
7. สร้าง `src/router.tsx` สำหรับ router configuration

### 2. Configure Entry Points

> Goal: ตั้งค่า entry points สำหรับ TanStack Start
> Goal: มี router configuration และ root route พร้อม SSR setup

1. ทำ `/follow-tanstack-ecosystem` เพื่อตั้งค่า TanStack Start entry points
2. ทำ `/follow-vite` เพื่อตั้งค่า `vite.config.ts` ด้วย `tanstackStart` plugin
3. ตั้งค่า `src/router.tsx` ด้วย `createRouter` และ `routeTree`
4. ตั้งค่า `src/routes/__root.tsx` สำหรับ HTML document shell
5. ใช้ `HeadContent`, `Scripts`, `Outlet` จาก `@tanstack/solid-router`
6. ใช้ `HydrationScript` จาก `solid-js/web` ใน `<head>`

### 3. Implement File-Based Routing

> Goal: ใช้ TanStack Router file-based routing conventions
> Goal: ใช้ routing conventions ครบถ้วน พร้อม code splitting อัตโนมัติ

1. ทำ `/follow-tanstack-ecosystem` เพื่อใช้ file-based routing conventions
2. สร้าง routes ใน `src/routes/` ด้วย `createFileRoute`
3. ใช้ `index.tsx` สำหรับ index routes
4. ใช้ `$param.tsx` สำหรับ dynamic segments
5. ใช้ `route.tsx` ใน directory สำหรับ layout routes
6. ใช้ `_group/` prefix สำหรับ pathless layout routes
7. ใช้ `$.tsx` สำหรับ catch-all/splat routes
8. อย่าแก้ไข `routeTree.gen.ts` — auto-generated

### 4. Organize Modules

> Goal: จัดระเบียบ feature-based modules ใน `src/modules/`
> Goal: แต่ละ module มี single responsibility, boundaries ชัดเจน

1. ทำ `/follow-solidjs` เพื่อใช้ component patterns และ reactivity
2. ทำ `/follow-tanstack-ecosystem` สำหรับ data fetching patterns ใน modules
3. ทำ `/follow-tanstack-ecosystem` สำหรับ state management ใน modules
4. สร้าง `src/modules/<feature>/` สำหรับแต่ละ domain feature
5. แต่ละ module ประกอบด้วย: `components/`, `hooks/`, `schemas/`, `utils/`, `types/`
6. สร้าง `src/modules/<feature>/index.ts` เป็น barrel export สำหรับ public API
7. ใช้ `/follow-import-export` สำหรับ barrel export strategy
8. เก็บ internal code ใน private directories ไม่ export ออก
9. ถ้า module ใหญ่เกินไป → ทำ `/refactor-packages`

### 5. Implement Server Functions

> Goal: ใช้ server functions สำหรับ client-server communication
> Goal: server functions type-safe พร้อม validation และ error handling

1. ใช้ `createServerFn` จาก `@tanstack/solid-start`
2. ใช้ `.validator()` สำหรับ input validation (Zod, Valibot, หรือ validator อื่น)
3. ใช้ `createServerOnlyFn` สำหรับ server-only utilities (database, filesystem)
4. ใช้ `createClientOnlyFn` สำหรับ browser-only utilities (DOM, localStorage)
5. ใช้ `createIsomorphicFn` สำหรับ environment-aware implementations
6. ใช้ `useHydrated` hook สำหรับ hydration-dependent behavior

### 6. Configure Rendering Modes

> Goal: ตั้งค่า rendering modes ตามความต้องการ
> Goal: rendering modes ตั้งค่าตาม use case และมี performance ที่เหมาะสม

1. ตั้งค่า SSR mode (default) ใน `vite.config.ts`
2. ใช้ `ssr: false` สำหรับ SPA mode
3. ใช้ prerender options สำหรับ SSG
4. ใช้ `createClientOnlyFn` สำหรับ client-only components
5. ใช้ streaming SSR สำหรับ progressive loading

### 7. Setup Monorepo Structure

> Goal: ตั้งค่า monorepo สำหรับ shared packages และ multiple apps
> Goal: shared packages ใช้ได้หลาย apps โดย route tree แยก per app

1. สร้าง `packages/shared/` สำหรับ shared code (components, utils, types, schemas)
2. สร้าง `packages/shared/src/modules/` สำหรับ shared feature modules
3. แต่ละ app มี `src/routes/` และ `routeTree.gen.ts` ของตัวเอง
4. อย่า share route tree ข้าม package boundary — share components และ logic แทน
5. ใช้ `~/*` alias ภายในแต่ละ app และ `@<scope>/shared` สำหรับ shared package
6. ทำ `/follow-monorepo` สำหรับ monorepo structure validation

## File Structure

### Standalone Project

```
public/
src/
├── routes/
│   ├── __root.tsx          # Root route — HTML document shell
│   ├── index.tsx           # Index route (/)
│   ├── posts/
│   │   ├── route.tsx       # Layout route for /posts/*
│   │   ├── index.tsx       # /posts
│   │   └── $postId.tsx     # /posts/:postId
│   ├── _account/           # Pathless layout group
│   │   ├── route.tsx
│   │   └── profile.tsx
│   └── $.tsx               # Splat catch-all (404)
├── modules/
│   └── <feature>/          # components/ hooks/ schemas/ utils/ types/ index.ts
├── components/             # ui/ shared/
├── lib/                    # server/ client/ shared/
├── types/
├── router.tsx
└── routeTree.gen.ts        # Auto-generated (do not edit)
vite.config.ts
```

### Monorepo Project

```
packages/
├── shared/                 # @<scope>/shared
│   └── src/                 # modules/ components/ lib/ types/ schemas/ index.ts
├── <platform>/             # shared platform (optional)
│   └── src/                 # components/ layouts/ stores/ types/ utils/
apps/
├── <app>/
│   └── src/                 # routes/ modules/ components/ lib/ router.tsx routeTree.gen.ts
└── ...
```

## File Patterns

| Location | Pattern | Purpose |
|----------|---------|---------|
| `src/routes` | `__root.tsx`, `index.tsx`, `$param.tsx`, `route.tsx`, `$.tsx` | Routing |
| `src/modules/<feature>` | `index.ts` (barrel), `components/*.tsx`, `hooks/use*.ts`, `schemas/*.schema.ts` | Feature module |
| `src/components/ui` | `PascalCase.tsx` | Base UI |
| `src/lib` | `camelCase.ts` | Utilities |

## Rules

### 1. Routing Conventions

- ใช้ `createFileRoute` สำหรับทุก route ใน `src/routes/`
- อย่าแก้ไข `routeTree.gen.ts` — auto-generated
- ใช้ `route.tsx` ใน directory สำหรับ layout wrapper
- ใช้ `_group/` prefix สำหรับ pathless layout routes
- ใช้ `$param.tsx` สำหรับ dynamic segments (ไม่ใช่ `[param].tsx`)

### 2. Module Boundaries

- แต่ละ module ใน `src/modules/` มี `index.ts` เป็น public API
- เก็บ internal code private ไม่ export ออก
- ใช้ `~/*` alias สำหรับ import ภายใน app
- ใช้ `@<scope>/shared` สำหรับ import จาก shared package ใน monorepo
- ไม่มี circular dependencies ระหว่าง modules

### 3. Server Functions

- ใช้ `createServerFn` จาก `@tanstack/solid-start` (ไม่ใช่ `"use server"` directive)
- ใช้ `.validator()` สำหรับ input validation
- ใช้ `createServerOnlyFn` สำหรับ server-only code (database, secrets)
- ใช้ `createClientOnlyFn` สำหรับ browser-only code (DOM, localStorage)
- ใช้ `createIsomorphicFn` สำหรับ environment-aware logic

### 4. Monorepo Rules

- อย่า share route tree ข้าม package boundary
- Share components, hooks, schemas, utils ผ่าน `packages/shared/`
- แต่ละ app มี `routes/` และ `routeTree.gen.ts` ของตัวเอง
- ใช้ `@<scope>/shared` alias สำหรับ shared package imports
- ทำ `/follow-monorepo` เพื่อ validate monorepo structure

### 5. SolidJS Patterns

- ใช้ `createSignal` สำหรับ primitive state
- ใช้ `createStore` สำหรับ nested reactive state
- ใช้ `createEffect` / `onMount` แทน `useEffect`
- ใช้ `<Show>`, `<For>`, `<Switch>` แทน conditional rendering
- ใช้ `class` attribute (ไม่ใช่ `className`)

### 6. Configuration

- ใช้ `vite.config.ts` ด้วย `tanstackStart` plugin
- ใช้ `@tanstack/router-plugin/vite` สำหรับ auto code splitting
- ตั้งค่า `srcDirectory: 'src'` และ `generatedRouteTree: 'src/routeTree.gen.ts'`
- ใช้ `vite-plugin-solid` สำหรับ SolidJS JSX transformation
- ถ้าใช้ UnoCSS → เพิ่ม `@unocss/vite` plugin
- ทำ `/follow-vitest` สำหรับ testing strategy

## Expected Outcome

- TanStack Start + SolidJS structure ที่ถูกต้องพร้อม `modules/` และ monorepo support
- File-based routing ใช้ TanStack Router conventions ครบถ้วน
- Server functions type-safe พร้อม validation และ environment control
- Module boundaries ชัดเจน ไม่มี circular dependencies
- Monorepo shared packages ใช้ได้หลาย apps โดย route tree แยก per app
- SolidJS patterns ถูกต้อง (signals, stores, fine-grained reactivity)

---
name: follow-nextjs-architecture
description: จัดโครงสร้างโปรเจกต์ Next.js ตาม best practices
---

## Goal

จัดโครงสร้างโปรเจกต์ Next.js ตาม best practices พร้อม App Router patterns, modules/ และ monorepo support

## Scope

ใช้สำหรับ Next.js projects ที่ใช้ App Router และ Server/Client Components ทั้ง standalone และ monorepo

## Execute

### 1. Setup Project Structure

สร้างโครงสร้างโปรเจกต์พื้นฐาน

> Goal: มีโครงสร้างโฟลเดอร์หลักครบถ้วน

1. สร้าง `app/` สำหรับ App Router (pages, layouts, templates)
2. สร้าง `modules/` สำหรับ feature-based organization
3. สร้าง `components/` สำหรับ reusable components
4. สร้าง `lib/` สำหรับ utility functions
5. สร้าง `hooks/` สำหรับ custom React hooks
6. สร้าง `types/` สำหรับ TypeScript types
7. สร้าง `public/` สำหรับ static assets

### 2. Configure Next.js

ตั้งค่า Next.js และ build tools

> Goal: มี Next.js config และ TypeScript config พร้อมใช้งาน

1. ทำ `/follow-nextjs` เพื่อติดตั้ง dependencies และตั้งค่า Next.js
2. ทำ `/follow-vite` เพื่อตั้งค่า build tooling
3. ตั้งค่า `next.config.js` หรือ `next.config.mjs`
4. ตั้งค่า `tsconfig.json` พร้อม path aliases
5. ตั้งค่า environment variables ใน `.env.local`

### 3. Implement App Router Patterns

ใช้ App Router patterns ของ Next.js

> Goal: ใช้ App Router conventions ครบถ้วน

1. ใช้ `app/` directory สำหรับ routing
2. ใช้ `layout.tsx` สำหรับ shared layouts
3. ใช้ `page.tsx` สำหรับ route pages
4. ใช้ `loading.tsx` สำหรับ loading states
5. ใช้ `error.tsx` สำหรับ error boundaries
6. ใช้ `not-found.tsx` สำหรับ 404 pages
7. ใช้ `template.tsx` สำหรับ re-render layouts

### 4. Data Fetching

จัดการ data fetching อย่างมีประสิทธิภาพ

> Goal: data fetching มีประสิทธิภาพและใช้ caching อย่างเหมาะสม

1. ใช้ `async/await` ใน Server Components
2. ใช้ `fetch` พร้อม `cache` options
3. ใช้ `revalidate` สำหรับ ISR
4. ใช้ `dynamic` สำหรับ dynamic rendering
5. ใช้ `generateStaticParams` สำหรับ SSG
6. ใช้ Route Handlers สำหรับ API routes

### 5. State Management

จัดการ state อย่างมีประสิทธิภาพ

> Goal: state management แยก Server/Client Components ชัดเจน

1. ใช้ Server Components สำหรับ data fetching
2. ใช้ Client Components สำหรับ interactivity
3. ใช้ React Context สำหรับ global state
4. ใช้ Server Actions สำหรับ mutations
5. ใช้ `use` hook สำหรับ async resources
6. ใช้ state management libraries ถ้าจำเป็น
7. ทำ `/follow-vitest` สำหรับ testing strategy

## File Structure

### Standalone Project

```
app/
├── (auth)/             # Auth routes group
├── (dashboard)/        # Dashboard routes group
├── api/                # API routes
├── layout.tsx          # Root layout
├── page.tsx            # Home page
├── loading.tsx         # Global loading
├── error.tsx           # Global error
└── not-found.tsx       # Global 404
modules/
└── <feature>/          # components/ hooks/ schemas/ utils/ types/ index.ts
components/             # ui/ shared/
lib/                   # server/ client/ shared/
hooks/
types/
public/
```

### Monorepo Project

```
packages/
├── shared/             # @<scope>/shared
│   └── src/             # modules/ components/ lib/ types/ schemas/ index.ts
apps/
├── <app>/
│   ├── app/             # App Router routes
│   ├── modules/         # App-specific modules
│   ├── components/      # App-specific components
│   └── lib/             # App-specific utilities
└── ...
```

## File Patterns

| Folder | File | Purpose | Pattern |
|--------|------|---------|---------|
| `app` | `layout.tsx` | Shared layouts | `layout.tsx` |
| `app` | `page.tsx` | Route pages | `page.tsx` |
| `app` | `loading.tsx` | Loading states | `loading.tsx` |
| `app` | `error.tsx` | Error boundaries | `error.tsx` |
| `app` | `not-found.tsx` | 404 pages | `not-found.tsx` |
| `app/api` | `route.ts` | API routes | `route.ts` |
| `components/ui` | `*.tsx` | Base UI components | `PascalCase.tsx` |
| `components/features` | `*.tsx` | Feature components | `PascalCase.tsx` |
| `lib` | `*.ts` | Utility functions | `camelCase.ts` |
| `hooks` | `*.ts` | Custom hooks | `useCamelCase.ts` |
| `types` | `*.ts` | TypeScript types | `PascalCase.ts` |

## Rules

### 1. Routing Conventions

- ใช้ `app/` directory สำหรับ routing
- ใช้ `layout.tsx` สำหรับ shared layouts, `page.tsx` สำหรับ route pages
- ใช้ `loading.tsx`, `error.tsx`, `not-found.tsx` สำหรับ special routes
- ใช้ `(group)` สำหรับ route groups, `[slug]` สำหรับ dynamic routes
- ใช้ `route.ts` สำหรับ API endpoints

### 2. Module Boundaries

- แต่ละ module ใน `modules/` มี `index.ts` เป็น public API
- เก็บ internal code private ไม่ export ออก
- ใช้ path aliases ใน `tsconfig.json`
- ไม่มี circular dependencies ระหว่าง modules
- ทำ `/follow-import-export` สำหรับ barrel export strategy
- ถ้า module ใหญ่เกินไป → ทำ `/use-or-refactor-to-modules`

### 3. Server/Client Components

- ใช้ Server Components เป็น default
- ใช้ Client Components เฉพาะเมื่อจำเป็น (interactivity, hooks)
- ใช้ `'use client'` directive สำหรับ Client Components
- แยก data fetching ไป Server Components, interactivity ไป Client Components
- ใช้ Server Actions สำหรับ mutations

### 4. Monorepo Rules

- อย่า share route tree ข้าม package boundary
- Share components, hooks, schemas, utils ผ่าน `packages/shared/`
- แต่ละ app มี `app/` directory ของตัวเอง
- ใช้ `@<scope>/shared` alias สำหรับ shared package imports
- ทำ `/follow-monorepo` เพื่อ validate monorepo structure

### 5. Optimization

- ใช้ `Image` component สำหรับ images, `Link` สำหรับ navigation
- ใช้ `font` optimization สำหรับ fonts
- ใช้ caching strategies และ ISR สำหรับ static content
- ใช้ `dynamic` imports สำหรับ code splitting

## Expected Outcome

- Next.js structure ที่ถูกต้องพร้อม `modules/` และ monorepo support
- App Router patterns ครบถ้วน
- Server/Client Component separation ชัดเจน
- Module boundaries ไม่มี circular dependencies
- TypeScript support ครบถ้วน

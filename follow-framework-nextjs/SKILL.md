---
name: follow-framework-nextjs
description: แนวทางการจัดโครงสร้างและพัฒนา Next.js 16 applications
---

## Goal

กำหนดแนวทางการพัฒนา Next.js 16 applications ให้มีประสิทธิภาพสูงสุด

## Scope

จัดโครงสร้างและพัฒนา Next.js 16 applications ด้วย App Router, React 19.2, Cache Components และ TypeScript

## Execute

### 1. Project Structure

> Goal: สร้างโครงสร้าง App Router ด้วย `app/` directory

1. ใช้ App Router ด้วย `app/` directory
2. สร้าง `app/layout.tsx` สำหรับ root layout
3. สร้าง `app/page.tsx` สำหรับ home page
4. สร้าง `app/globals.css` สำหรับ global styles
5. สร้าง `app/error.tsx`, `loading.tsx`, `not-found.tsx` สำหรับ error handling
6. ใช้ `app/api/` สำหรับ API routes
7. ใช้ route groups `(group)` สำหรับ organize routes โดยไม่กระทบ URL
8. ดูรายละเอียดใน [references/nextjs.md](references/nextjs.md)

### 2. Directory Organization

> Goal: จัดระเบียบ supporting directories นอก `app/`

1. ใช้ `components/` สำหรับ React components (ui, features)
2. ใช้ `hooks/` สำหรับ custom React hooks
3. ใช้ `lib/` สำหรับ utilities และ helpers
4. ใช้ `types/` สำหรับ TypeScript types
5. ใช้ `public/` สำหรับ static assets

### 3. Configuration

> Goal: ตั้งค่า Next.js 16 config และ scripts

1. ตั้งค่า `next.config.ts` สำหรับ Next.js config
2. ตั้งค่า `tsconfig.json` ด้วย strict mode (TypeScript 5.1+)
3. ตั้งค่า `package.json` scripts (dev, build, start, lint, typecheck)
4. สร้าง `proxy.ts` สำหรับ auth checks เท่านั้น (ไม่ใช่ database calls) — แทน `middleware.ts`
5. ใช้ Turbopack สำหรับ dev และ build (stable default ใน Next.js 16)
6. ดูรายละเอียดใน [references/nextjs.md](references/nextjs.md)

### 4. Server And Client Components

> Goal: แยก Server และ Client Components อย่างถูกต้อง

1. Server Components เป็น default (ไม่ใช้ `useState`, `useEffect`)
2. Client Components เฉพาะเมื่อต้องการ interactivity (`'use client'`)
3. Push `'use client'` ให้ลึกที่สุดใน tree
4. ส่ง Server Components เป็น `children` ของ Client Components
5. หลีกเลี่ยง non-serializable props จาก Server → Client (functions, dates)

### 5. Data Fetching And Cache Components

> Goal: ใช้ Server Components สำหรับ data fetching และ Cache Components สำหรับ explicit caching

1. ใช้ Server Components สำหรับ data fetching (ไม่ใช้ `useEffect`)
2. ใช้ `Promise.all` สำหรับ parallel data fetching (หลีกเลี่ยง waterfalls)
3. `params` และ `searchParams` เป็น `Promise` ใน Next.js 15+ ต้อง `await`
4. ใช้ `'use cache'` directive สำหรับ Cache Components (Next.js 16 — explicit opt-in caching)
5. ใช้ `generateMetadata` สำหรับ SEO ในทุก page
6. ใช้ `generateStaticParams` สำหรับ static generation
7. ดูรายละเอียดใน [references/nextjs.md](references/nextjs.md)

### 6. Server Actions

> Goal: ใช้ Server Actions สำหรับ form handling และ mutations

1. ใช้ Server Actions สำหรับ form handling และ mutations
2. Validate inputs ด้วย Zod schemas
3. Return typed error objects
4. ใช้ `'use server'` directive สำหรับ Server Actions
5. ทดสอบ forms โดยไม่ใช้ client-side JavaScript

### 7. Performance

> Goal: ปรับแต่ง performance ด้วย Turbopack, React Compiler และ PPR

1. ใช้ `next/image` สำหรับ image optimization
2. ใช้ `next/link` สำหรับ navigation
3. ใช้ dynamic imports สำหรับ code splitting
4. ใช้ Suspense boundaries สำหรับ streaming (แทน `loading.tsx` เมื่อต้องการ granular control)
5. ใช้ Partial Prerendering (PPR) สำหรับ static shell + dynamic islands
6. ใช้ React Compiler แทน manual `memo`/`useMemo`/`useCallback` (stable ใน Next.js 16)
7. ใช้ React 19.2 features: View Transitions, `useEffectEvent()`

### 8. Caching Strategy

> Goal: ใช้ explicit caching APIs ของ Next.js 16

1. `fetch()` ไม่ cached by default ใน Next.js 15+
2. ใช้ `'use cache'` directive สำหรับ Cache Components (Next.js 16)
3. ใช้ `next: { revalidate: seconds }` สำหรับ time-based revalidation
4. ใช้ `next: { tags: ['tag'] }` สำหรับ tag-based revalidation
5. ใช้ `updateTag()` และ `revalidateTag()` สำหรับ cache invalidation
6. ใช้ `cache: 'force-cache'` สำหรับ static data
7. ใช้ `cache: 'no-store'` สำหรับ always-fresh data

## Rules

### 1. Directory Structure

- ใช้ `app/` directory สำหรับ App Router
- ใช้ route groups `(group)` สำหรับ organize routes
- ใช้ `components/` สำหรับ shared components (ui, features)
- ใช้ `hooks/` สำหรับ custom hooks
- ใช้ `lib/` สำหรับ utilities
- ใช้ `types/` สำหรับ TypeScript types

### 2. Server And Client Components

- Server Components เป็น default
- `'use client'` เฉพาะเมื่อต้องการ interactivity, state, หรือ browser APIs
- Push `'use client'` ให้ลึกที่สุดใน tree
- ส่ง Server Components เป็น `children` ของ Client Components
- หลีกเลี่ยง `useEffect` สำหรับ data fetching ใช้ Server Components แทน

### 3. Data Fetching And Caching

- ใช้ Server Components สำหรับ data fetching
- ใช้ `Promise.all` สำหรับ parallel fetches
- `params` และ `searchParams` เป็น `Promise` ต้อง `await`
- ใช้ `'use cache'` directive สำหรับ explicit caching (Next.js 16)
- ใช้ explicit `revalidate` หรือ `cache` ในทุก `fetch()`
- ใช้ `generateMetadata` ในทุก page

### 4. Server Actions

- Validate inputs ด้วย Zod
- Return typed error objects
- ทดสอบ forms โดยไม่ใช้ client-side JavaScript
- ใช้ `'use server'` directive

### 5. Performance

- ใช้ `next/image` สำหรับ images
- ใช้ `next/link` สำหรับ navigation
- ใช้ Suspense boundaries สำหรับ streaming
- ใช้ PPR สำหรับ static + dynamic hybrid
- ใช้ React Compiler แทน manual memoization
- ใช้ dynamic imports สำหรับ heavy components

### 6. Proxy (formerly Middleware)

- ใช้ `proxy.ts` แทน `middleware.ts` (Next.js 16)
- ใช้สำหรับ auth checks เท่านั้น
- ห้ามทำ database calls ใน proxy
- รันบน Edge Runtime

## Expected Outcome

- Next.js 16 project ที่มีโครงสร้างถูกต้อง
- Server Components เป็น default, Client Components เฉพาะเมื่อจำเป็น
- App Router พร้อม streaming, PPR และ Cache Components
- TypeScript strict mode
- Performance ที่ดีขึ้นด้วย Turbopack, React Compiler และ Suspense
- Server Actions สำหรับ mutations

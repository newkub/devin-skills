---
name: follow-nextjs
description: แนวทางการจัดโครงสร้างและพัฒนา Next.js 15 applications
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
related:
---

## Goal

กำหนดแนวทางการพัฒนา Next.js 15 applications ให้มีประสิทธิภาพสูงสุด

## Scope

จัดโครงสร้างและพัฒนา Next.js 15 applications ด้วย App Router, React 19, และ TypeScript

## Execute

### 1. Project Structure
> Goal: Project Structure

1. ใช้ App Router ด้วย `app/` directory
2. สร้าง `app/layout.tsx` สำหรับ root layout
3. สร้าง `app/page.tsx` สำหรับ home page
4. สร้าง `app/globals.css` สำหรับ global styles
5. สร้าง `app/error.tsx`, `loading.tsx`, `not-found.tsx` สำหรับ error handling
6. ใช้ `app/api/` สำหรับ API routes
7. ใช้ route groups `(group)` สำหรับ organize routes โดยไม่กระทบ URL

### 2. Directory Organization
> Goal: Directory Organization

1. ใช้ `components/` สำหรับ React components (ui, features)
2. ใช้ `hooks/` สำหรับ custom React hooks
3. ใช้ `lib/` สำหรับ utilities และ helpers
4. ใช้ `types/` สำหรับ TypeScript types
5. ใช้ `public/` สำหรับ static assets

### 3. Configuration
> Goal: Configuration

1. ตั้งค่า `next.config.ts` สำหรับ Next.js config
2. ตั้งค่า `tsconfig.json` ด้วย strict mode
3. ตั้งค่า `package.json` scripts (dev, build, start, lint, typecheck)
4. สร้าง `middleware.ts` สำหรับ auth checks เท่านั้น (ไม่ใช่ database calls)
5. ใช้ Turbopack สำหรับ dev และ build (stable ใน Next.js 15)

### 4. Server And Client Components
> Goal: Server And Client Components

1. Server Components เป็น default (ไม่ใช้ `useState`, `useEffect`)
2. Client Components เฉพาะเมื่อต้องการ interactivity (`'use client'`)
3. Push `'use client'` ให้ลึกที่สุดใน tree
4. ส่ง Server Components เป็น `children` ของ Client Components
5. หลีกเลี่ยง non-serializable props จาก Server → Client (functions, dates)

### 5. Data Fetching
> Goal: Data Fetching

1. ใช้ Server Components สำหรับ data fetching (ไม่ใช้ `useEffect`)
2. ใช้ `Promise.all` สำหรับ parallel data fetching (หลีกเลี่ยง waterfalls)
3. `params` และ `searchParams` เป็น `Promise` ใน Next.js 15+ ต้อง `await`
4. ใช้ `fetch()` พร้อม explicit `revalidate` หรือ `cache` option
5. ใช้ `generateMetadata` สำหรับ SEO ในทุก page
6. ใช้ `generateStaticParams` สำหรับ static generation

### 6. Server Actions
> Goal: Server Actions

1. ใช้ Server Actions สำหรับ form handling และ mutations
2. Validate inputs ด้วย Zod schemas
3. Return typed error objects
4. ใช้ `'use server'` directive สำหรับ Server Actions
5. ทดสอบ forms โดยไม่ใช้ client-side JavaScript

### 7. Performance
> Goal: Performance

1. ใช้ `next/image` สำหรับ image optimization
2. ใช้ `next/link` สำหรับ navigation
3. ใช้ dynamic imports สำหรับ code splitting
4. ใช้ Suspense boundaries สำหรับ streaming (แทน `loading.tsx` เมื่อต้องการ granular control)
5. ใช้ Partial Prerendering (PPR) สำหรับ static shell + dynamic islands
6. ใช้ React Compiler แทน manual `memo`/`useMemo`/`useCallback`

### 8. Caching Strategy
> Goal: Caching Strategy

1. `fetch()` ไม่ cached by default ใน Next.js 15+
2. ใช้ `next: { revalidate: seconds }` สำหรับ time-based revalidation
3. ใช้ `next: { tags: ['tag'] }` สำหรับ tag-based revalidation
4. ใช้ `cache: 'force-cache'` สำหรับ static data
5. ใช้ `cache: 'no-store'` สำหรับ always-fresh data

## Rules

### 1. Directory Structure

โครงสร้างที่ถูกต้อง:

- ใช้ `app/` directory สำหรับ App Router
- ใช้ route groups `(group)` สำหรับ organize routes
- ใช้ `components/` สำหรับ shared components (ui, features)
- ใช้ `hooks/` สำหรับ custom hooks
- ใช้ `lib/` สำหรับ utilities
- ใช้ `types/` สำหรับ TypeScript types

### 2. Server And Client Components

ใช้ components อย่างถูกต้อง:

- Server Components เป็น default
- `'use client'` เฉพาะเมื่อต้องการ interactivity, state, หรือ browser APIs
- Push `'use client'` ให้ลึกที่สุดใน tree
- ส่ง Server Components เป็น `children` ของ Client Components
- หลีกเลี่ยง `useEffect` สำหรับ data fetching ใช้ Server Components แทน

### 3. Data Fetching

ใช้ data fetching อย่างถูกต้อง:

- ใช้ Server Components สำหรับ data fetching
- ใช้ `Promise.all` สำหรับ parallel fetches
- `params` และ `searchParams` เป็น `Promise` ต้อง `await`
- ใช้ explicit `revalidate` หรือ `cache` ในทุก `fetch()`
- ใช้ `generateMetadata` ในทุก page

### 4. Server Actions

ใช้ Server Actions อย่างถูกต้อง:

- Validate inputs ด้วย Zod
- Return typed error objects
- ทดสอบ forms โดยไม่ใช้ client-side JavaScript
- ใช้ `'use server'` directive

### 5. Performance

ตั้งค่า performance:

- ใช้ `next/image` สำหรับ images
- ใช้ `next/link` สำหรับ navigation
- ใช้ Suspense boundaries สำหรับ streaming
- ใช้ PPR สำหรับ static + dynamic hybrid
- ใช้ React Compiler แทน manual memoization
- ใช้ dynamic imports สำหรับ heavy components

### 6. Middleware

ใช้ middleware อย่างถูกต้อง:

- ใช้สำหรับ auth checks เท่านั้น
- ห้ามทำ database calls ใน middleware
- รันบน Edge Runtime

## Expected Outcome

- Next.js 15 project ที่มีโครงสร้างถูกต้อง
- Server Components เป็น default, Client Components เฉพาะเมื่อจำเป็น
- App Router พร้อม streaming และ PPR
- TypeScript strict mode
- Performance ที่ดีขึ้นด้วย React Compiler และ Suspense
- Server Actions สำหรับ mutations

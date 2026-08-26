---
name: follow-lib-react
description: พัฒนา React 19 applications ตาม best practices 2026
---

## Goal

พัฒนา React applications ตาม best practices ด้วย React 19, Server Components, และ modern patterns

## Scope

ใช้สำหรับพัฒนา React 19 applications ด้วย Vite หรือ Next.js, TypeScript, และ folder structure มาตรฐาน

## Execute

### 1. Setup Project Structure

> Goal: สร้างโครงสร้างโปรเจกต์ตามมาตรฐาน React 19

สร้างโครงสร้างโปรเจกต์ตามมาตรฐาน

1. สร้าง `src/components/ui`, `src/components/features`, `src/hooks`, `src/lib`, `src/types`
2. ตั้งค่า `package.json` ด้วย scripts มาตรฐาน
3. ตั้งค่า `vite.config.ts` และ `tsconfig.json`
4. ติดตั้ง dependencies ที่จำเป็น
5. ใช้ React 19+ เป็น minimum version

### 2. Configure Core Principles

> Goal: ตั้งค่าหลักการพื้นฐานของ React 19 อย่างถูกต้อง

ตั้งค่าหลักการพื้นฐานของ React 19

1. ใช้ `React.StrictMode` ห่อ `App` component
2. ใช้ Error Boundaries สำหรับส่วนเสี่ยง
3. ตั้งค่า UnoCSS ตาม `/follow-lib-unocss`
4. ใช้ React Server Components เป็น default ใช้ Client Components เฉพาะเมื่อจำเป็น
5. ใช้ React Compiler ก่อนเพิ่ม manual memoization
6. ใช้ Server Actions สำหรับ form handling และ mutations

### 3. React 19 Hooks And APIs

> Goal: ใช้ hooks ใหม่ของ React 19 อย่างถูกต้องตาม use case

ใช้ hooks ใหม่ของ React 19

1. ใช้ `useActionState` สำหรับ form actions พร้อม pending state
2. ใช้ `useFormStatus` สำหรับ form submission status
3. ใช้ `useOptimistic` สำหรับ optimistic updates
4. ใช้ `use()` API สำหรับ unwrapping promises และ context
5. ใช้ `useTransition` สำหรับ non-blocking UI updates
6. ใช้ `useDeferredValue` สำหรับ deferring expensive renders

### 4. Implement Folder Rules

> Goal: ใช้ rules สำหรับแต่ละ folder อย่างชัดเจน

ใช้ rules สำหรับแต่ละ folder

1. `components/ui`: Dumb components, props in, events out
2. `components/features`: Feature-specific components
3. `hooks`: Orchestration and facade patterns
4. `lib`: Pure utilities, clients, adapters

### 5. Setup Import Rules

> Goal: ตั้งค่า import dependencies ตามลำดับชั้นที่ถูกต้อง

ตั้งค่า import dependencies ตามลำดับ

1. pages → components/features, hooks
2. components/features → components/ui, hooks
3. components/ui → no internal dependencies
4. hooks → lib, types
5. lib → types
6. types → no internal dependencies

### 6. Server Components Patterns

> Goal: ใช้ Server Components เป็น default และ Client Components เฉพาะจำเป็น

ใช้ Server Components อย่างถูกต้อง

1. Server Components เป็น default (ไม่ใช้ `useState`, `useEffect`)
2. Client Components เฉพาะเมื่อต้องการ interactivity
3. ใช้ `'use client'` directive เฉพาะจุดที่จำเป็น
4. ใช้ `'use server'` directive สำหรับ Server Actions
5. ส่ง data จาก Server → Client ผ่าน props ไม่ใช่ fetch ใน Client
6. ใช้ `loading.tsx` และ `error.tsx` สำหรับ streaming และ error boundaries

### 7. Optimize Performance

> Goal: ตั้งค่า performance optimization โดยใช้ React Compiler

ตั้งค่า performance optimization

1. ใช้ React Compiler ก่อนเพิ่ม `React.memo`, `useMemo`, `useCallback`
2. ใช้ code splitting ด้วย `React.lazy`
3. ใช้ `useTransition` สำหรับ priority updates
4. ใช้ `useDeferredValue` สำหรับ expensive renders
5. หลีกเลี่ยง over-memoization ถ้าใช้ React Compiler

## Rules

### 1. Component Structure

จัดโครงสร้าง components ตาม responsibilities

- `components/ui`: Small, focused, single responsibility
- `components/features`: Feature-specific, no global state binding
- `hooks`: Orchestration, facade patterns, no UI markup
- `lib`: Pure utilities, clients, adapters, no React imports

### 2. React 19 Best Practices

ใช้ React 19 features อย่างเหมาะสม

- ใช้ React Compiler ก่อน manual memoization
- Server Components เป็น default, Client Components เฉพาะเมื่อจำเป็น
- ใช้ Server Actions สำหรับ form handling และ mutations
- ใช้ `useActionState` แทน manual form state management
- ใช้ `useOptimistic` สำหรับ optimistic UI updates
- หลีกเลี่ยง `useEffect` สำหรับ data fetching ใช้ Server Components แทน

### 3. Performance Best Practices

ใช้ performance optimization อย่างเหมาะสม

- ใช้ React Compiler แทน manual `memo`/`useMemo`/`useCallback`
- หลีกเลี่ยง over-memoization
- ใช้ code splitting ตาม route หรือ component
- ใช้ `useTransition` สำหรับ non-critical updates
- ใช้ `useDeferredValue` สำหรับ expensive renders

### 4. Code Quality

รักษาคุณภาพโค้ด

- ใช้ TypeScript สำหรับ type safety
- ใช้ Biome สำหรับ linting
- ใช้ strict mode สำหรับ development
- ใช้ Error Boundaries สำหรับ error handling

### 5. Configuration Standards

ตั้งค่า configuration ตามมาตรฐาน

- `package.json`: dev, build, preview, typecheck, lint scripts
- `vite.config.ts`: Vite configuration
- `tsconfig.json`: TypeScript configuration
- UnoCSS configuration ตาม `/follow-lib-unocss`

## Expected Outcome

- React 19 application ด้วย structure ที่ถูกต้อง
- Server Components เป็น default, Client Components เฉพาะเมื่อจำเป็น
- React Compiler ลดความจำเป็นของ manual memoization
- Performance optimization ที่เหมาะสม
- Type safety ด้วย TypeScript
- Code quality ด้วย linting
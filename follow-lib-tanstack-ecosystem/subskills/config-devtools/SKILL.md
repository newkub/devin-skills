---
name: follow-lib-tanstack-ecosystem-config-devtools
description: ตั้งค่า TanStack Devtools — Query, Router devtools integration
argument-hint: "[framework]"
related:
  - follow-lib-tanstack-ecosystem
  - run-install
  - check-config-drift
  - resolve-errors
---

## Goal

ตั้งค่า TanStack Devtools สำหรับ inspect Query cache, Router state และ libraries อื่นใน dev mode

## Scope

ใช้เมื่อต้อง config devtools ของ TanStack libraries — Query devtools, Router devtools หรือ unified `@tanstack/devtools` panel — dev-only, ไม่กระทบ production bundle

## Execute

### 1. Read Current Config

> Goal: ตรวจสอบ TanStack libraries และ devtools ที่มีอยู่

1. ตรวจ `package.json` ว่ามี `@tanstack/*-query`, `@tanstack/*-router` หรือ library อื่นติดตั้งอยู่
2. ตรวจ entry point ว่ามี devtools component อยู่แล้วหรือไม่ — ถ้ามี → merge config ห้าม overwrite
3. ถ้าไม่พบ TanStack library เลย → stop และทำ `/follow-lib-tanstack-ecosystem` setup ก่อน

### 2. Install Devtools

> Goal: ติดตั้ง devtools เป็น dev dependency

1. Query: `bun add -D @tanstack/react-query-devtools` (หรือ `solid-query-devtools`, `vue-query-devtools` ตาม framework)
2. Router: `bun add -D @tanstack/react-router-devtools` (หรือ `@tanstack/solid-router-devtools`)
3. Unified panel: `@tanstack/devtools` + plugin per library — ดู official docs ที่ `https://tanstack.com/devtools` สำหรับ package names ล่าสุด
4. ติดตั้งเป็น `devDependencies` เสมอ — devtools ไม่ใช่ runtime dependency

### 3. Integrate Devtools Component

> Goal: render devtools ใน dev mode เท่านั้น

1. Query: render `<ReactQueryDevtools initialIsOpen={false} />` ภายใน `QueryClientProvider`
2. Router: render `<TanStackRouterDevtools />` ข้าง `RouterProvider`
3. Guard ด้วย dev check เช่น `import.meta.env.DEV` หรือ `process.env.NODE_ENV !== 'production'` ถ้า bundler ไม่ tree-shake devtools อัตโนมัติ
4. ใช้ lazy/dynamic import สำหรับ devtools เพื่อไม่ให้เข้า production bundle:

   ```ts
   const Devtools = import.meta.env.DEV
     ? lazy(() => import('@tanstack/react-query-devtools').then(m => ({ default: m.ReactQueryDevtools })))
     : () => null
   ```

### 4. Verify

> Goal: ตรวจสอบ devtools ทำงานและไม่รั่วไป production

1. รัน dev server — devtools panel ต้องเปิดได้และแสดง cache/route state
2. รัน production build แล้วเช็ค bundle — devtools code ต้องไม่อยู่ใน output (ทำ `/check-size` ถ้าต้องยืนยัน)
3. ถ้าพัง → revert จุดที่เพิ่งแก้ แล้วทำ `/resolve-errors`

## Rules

- ติดตั้ง devtools เป็น `devDependencies` เสมอ
- ห้าม render devtools ใน production — guard ด้วย env check หรือ lazy import
- ห้ามแก้ config เดิมที่ไม่เกี่ยว — merge เท่านั้น
- ตำแหน่ง devtools ต้องอยู่ภายใน provider ที่มัน inspect (QueryClientProvider/RouterProvider)
- ใช้ `/follow-lib-tanstack-ecosystem` สำหรับ overview

## Expected Outcome

- Devtools panel แสดง Query cache และ Router state ใน dev mode
- Production bundle ไม่มี devtools code
- Config เดิมไม่ถูก clobber

---
name: follow-lib-tanstack-ecosystem
description: เลือกและใช้งาน TanStack libraries ใน project ตาม use case และ maturity
argument-hint: "[scope]"
related:
  - analyze-project
  - ask-me
  - run-install
  - run-test
  - run-typecheck
---

## Goal

เลือกและ integrate TanStack libraries ได้ถูกต้องตาม use case และ maturity ของแต่ละ library

## Scope

ใช้สำหรับ projects ที่ต้องการใช้ TanStack ecosystem ปัจจุบัน (ดูรายการล่าสุดที่ `https://tanstack.com/libraries`):

- Framework: `Start` (full-stack SSR/streaming บน Router + Vite, v1 stable), `Router` (type-safe routing สำหรับ React/Solid, v1)
- Data & State: `Query` (server state, v5), `DB` (reactive client store, 0.x), `Store` (client state, 0.x), `AI` (framework-agnostic AI SDK, RC)
- UI & UX: `Table` (headless datagrid, v9), `Form` (form state, v1; v2 alpha), `Charts`, `Hotkeys`, `Markdown`, `Highlight`
- Performance: `Virtual` (virtualized lists, v3), `Pacer` (debounce/throttle/batch, 0.x)
- Tooling: `Devtools` (unified devtools panel), `Config`, `CLI`, `Intent`

## Execute

### 1. Identify Needs

> Goal: ระบุว่าต้องการ library ตัวไหนของ TanStack

1. ทำ `/analyze-project` เพื่อเข้าใจ state, data flow, routing, form needs
2. ดูว่า project ต้องการ:
   - async server state / data fetching → `Query`
   - client state → `Store`
   - type-safe routing → `Router`
   - full-stack framework (SSR, server functions) → `Start`
   - form state + validation → `Form`
   - headless data tables → `Table`
   - virtualized long lists → `Virtual`
   - local-first reactive data / sync → `DB`
   - AI providers, chat, MCP integration → `AI`
   - debounce/throttle/rate-limit → `Pacer`
3. ตรวจ maturity ก่อนใช้: ตัวที่เป็น `0.x` หรือ alpha/RC (เช่น `DB`, `AI`, `Pacer`, `Store`) API อาจเปลี่ยน — ใช้เฉพาะเมื่อยอมรับความเสี่ยงได้
4. ถ้าไม่ชัด → stop และ `/ask-me`

### 2. Install And Configure

> Goal: ติดตั้ง library ที่เลือก

1. ใช้ package manager ที่ project ใช้ (`npm`, `pnpm`, `bun`, `yarn`) ผ่าน `/run-install`
2. ติดตั้ง package ตาม naming convention `@tanstack/{framework}-{lib}` เช่น `@tanstack/react-query`, `@tanstack/vue-query`, `@tanstack/solid-router`, `@tanstack/svelte-query` (Angular บางตัวยังใช้ชื่อ `*-experimental` เช่น `@tanstack/angular-query-experimental`)
3. ตั้งค่า provider/client ใน entry point เช่น `QueryClientProvider` สำหรับ Query
4. ติดตั้ง `Devtools` เป็น dev dependency เพื่อ inspect state ระหว่าง develop
5. ตรวจสอบ version compatibility กับ framework version ใน `package.json`

### 3. Implement Feature

> Goal: ใช้งาน library ในฟีเจอร์จริง

1. `Query`: สร้าง query keys, query functions, ตั้ง `staleTime`/`gcTime`, ใช้ `select`, mutations + invalidation
2. `Form`: สร้าง schema (รองรับ Standard Schema เช่น Zod/Valibot/ArkType), fields, validation, submission
3. `Router`: สร้าง route tree (file-based หรือ code-based), loaders, search param validation, navigation
4. `Start`: สร้าง server functions, SSR routes, middleware
5. `Store`: สร้าง store สำหรับ client state ที่ไม่ใช่ server state
6. `Table`: ตั้งค่า columns, sorting, filtering, pagination (headless — render UI เอง)
7. `Virtual`: ตั้งค่า virtualizer กับ list/table ที่ยาว
8. `DB`/`AI`: ตั้งค่า collections/sync engine หรือ AI provider adapters ตาม docs ล่าสุด

### 4. Test And Optimize

> Goal: ตรวจสอบว่า integration ทำงานได้ดี

1. รัน `/run-test` และ `/run-typecheck`
2. ตรวจสอบ caching behavior ของ `Query`/`DB` ผ่าน Devtools
3. วัด re-render ของ components
4. ตรวจสอบ error boundaries, pending และ loading states

## Rules

### 1. Library Selection

- เลือก library ตาม use case จริง ไม่ติดตั้งทุกตัว
- `Query` กับ `Store` ไม่ทดแทนกัน — ใช้ `Query` สำหรับ server state, `Store` สำหรับ client state
- `Router`/`Start` รองรับเฉพาะ React และ Solid — ถ้าใช้ Vue/Svelte ให้ใช้ router ของ framework นั้น
- อ้างอิง official docs `https://tanstack.com` เป็นแหล่งหลักเสมอ
- ดูรายละเอียดเพิ่มเติมที่ `references/index.md` (versions, API, CLI, config) และ `workflows/` (Query, Table)

### 2. Type Safety

- ใช้ TypeScript types ที่ library provide
- กำหนด query keys, route params และ form schemas ให้ type-safe
- หลีกเลี่ยง `any` ใน callbacks

### 3. Performance

- ใช้ `select` และ `staleTime` ใน `Query` เพื่อลด refetch
- ใช้ `Virtual` เฉพาะ list ที่ใหญ่
- ใช้ `Pacer` สำหรับ debounce/throttle แทนเขียนเอง
- แยก reactivity scope ใน `Store`/`DB` ให้เหมาะสม

## Expected Outcome

- TanStack library ที่เลือกถูกต้องตาม use case และ maturity
- Integration ทำงานได้และผ่าน typecheck/test
- Performance ที่เหมาะสม ไม่ over-fetching หรือ over-rendering
- Code อ่านง่ายและ maintain ได้

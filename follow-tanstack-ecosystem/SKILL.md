---
name: follow-tanstack-ecosystem
description: เลือกและใช้งาน TanStack libraries ใน project ตาม use case
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
  - ask_user_question
triggers:
  - user
  - model
related:
---

## Goal

เลือกและ integrate TanStack libraries ได้ถูกต้องตาม use case

## Scope

ใช้สำหรับ projects ทีต้องการใช้ TanStack ecosystem: Query, Form, Router, Start, Store, Table, Virtual, DB, AI

## Execute

### 1. Identify Needs

> Goal: ระบุว่าต้องการ library ตัวไหนของ TanStack
> Goal: เลือก library ทีตรงกับปัญหา

1. ทำ `analyze-project` เพื่อเข้าใจ state, data flow, routing, form needs
2. ดูว่า project ต้องการ:
   - async data fetching → Query
   - form validation → Form
   - routing → Router
   - fullstack framework → Start
   - state management → Store
   - data tables → Table
   - virtual lists → Virtual
   - local first DB → DB
   - AI integration → AI
3. ถ้าไม่ชัด → stop และ `ask-me`

### 2. Install And Configure

> Goal: ติดตั้ง library ทีเลือก
> Goal: library พร้อมใช้งานใน project

1. ใช้ package manager ที project ใช้ (`npm`, `pnpm`, `bun`, `yarn`)
2. ติดตั้ง core package และ adapters ตาม framework (React, Vue, Solid, Svelte)
3. ตั้งค่า provider/client ใน entry point
4. ตรวจสอบ version compatibility กับ framework

### 3. Implement Feature

> Goal: ใช้งาน library ในฟีเจอร์จริง
> Goal: ฟีเจอร์ทำงานได้ถูกต้อง

1. Query: สร้าง query keys, fetchers, caching, invalidation
2. Form: สร้าง schema, fields, validation, submission
3. Router: สร้าง routes, loaders, navigation
4. Start: สร้าง server/client routes, actions
5. Store: สร้าง atoms/signals สำหรับ state
6. Table: ตั้งค่า columns, sorting, filtering
7. Virtual: ตั้งค่า virtualizer กับ list/table
8. DB/AI: ตั้งค่า sync layer หรือ AI hooks

### 4. Test And Optimize

> Goal: ตรวจสอบว่า integration ทำงานได้ดี
> Goal: ไม่มี regression และ performance ทีเหมาะสม

1. รัน `run-test` และ `run-typecheck`
2. ตรวจสอบ caching behavior ของ Query/Store
3. วัด re-render ของ components
4. ตรวจสอบ error boundaries และ loading states

## Rules

### 1. Library Selection

- เลือก library ตาม use case จริง ไม่ติดตั้งทุกตัว
- Query กับ Store ไม่ทดแทนกัน — ใช้ Query สำหรับ server state, Store สำหรับ client state
- Router ควรใช้ version ที match framework version

### 2. Type Safety

- ใช้ TypeScript types ที library provide
- กำหนด query keys และ form schemas ให้ type-safe
- หลีกเลี่ยง `any` ใน callbacks

### 3. Performance

- ใช้ `select` และ `staleTime` ใน Query เพื่อลด refetch
- ใช้ virtualization เฉพาะ list ทีใหญ่
- แยก reactivity scope ใน Store ให้เหมาะสม

## Expected Outcome

- TanStack library ทีเลือกถูกต้องตาม use case
- Integration ทำงานได้และผ่าน typecheck/test
- Performance ทีเหมาะสม ไม่ over-fetching หรือ over-rendering
- Code อ่านง่ายและ maintain ได้

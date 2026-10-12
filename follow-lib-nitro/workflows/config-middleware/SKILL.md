---
name: follow-lib-nitro-config-middleware
description: ตั้งค่า Nitro middleware/plugins/hooks — request pipeline, auth guards, event hooks
argument-hint: "[middleware|plugin|hook]"
related:
  - follow-lib-nitro
  - run-test
  - resolve-errors
---

## Goal

ตั้งค่า Nitro request pipeline — middleware, plugins, nitroApp hooks สำหรับ auth/logging/CORS/request lifecycle

## Scope

cross-cutting concerns ฝั่ง server — middleware (`middleware/`), plugins (`plugins/`), runtime hooks (`nitroApp.hooks()`)

## Execute

### 1. Middleware

> Goal: run ก่อนทุก request — auth, logging, headers

```ts
// middleware/auth.ts — global middleware (auto-registered)
import { defineEventHandler, createError, getRequestHeader } from 'nitro/h3'

export default defineEventHandler((event) => {
  const token = getRequestHeader(event, 'authorization')
  if (!token && event.path.startsWith('/api/private')) {
    throw createError({ statusCode: 401 })
  }
  event.context.user = decodeToken(token)   // attach context ให้ handlers
})
```

- Order = filename/`middleware/` registration — เช็ค execution order เมื่อมีหลายตัว
- Scoped middleware: `middleware/` ใน subdirs หรือ check `event.path` ใน handler

### 2. Plugins

> Goal: startup logic + app-level 

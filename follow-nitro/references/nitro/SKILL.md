---
name: follow-nitro/references/nitro
description: Universal server framework ที่ deploy ได้ทุก platform ด้วย Vite integration
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

## Goal

ใช้ Nitro สร้าง server applications ที่ deploy ได้ทุก runtime และ platform ด้วย zero config และ Vite integration


## Scope

ใช้สำหรับสร้าง server applications, APIs, backend services และ full-stack applications ด้วย Nitro v3 framework


## Execute

- ติดตั้ง Nitro ด้วย `bun add nitro`
- อ่าน `guide/` สำหรับ architecture, best practices, และ configuration
- อ่าน `key-concepts/` สำหรับแนวคิดหลัก (caching, database, deployment presets, route rules)
- อ่าน `principles/` สำหรับ best practices (platform-agnostic, serverless-first)
- อ่าน `references/` สำหรับ API, CLI, และ configuration
- ใช้ `workflows/` สำหรับ setup และ deployment
- ใช้ `templates/` สำหรับ code templates
- ใช้ `scripts/` สำหรับ automation scripts


## Rules

- ใช้ `bun add nitro` สำหรับ installation (v3+)
- Runtime requirements: Node.js ^20.19.0 || >=22.12.0
- ใช้ backticks สำหรับ `defineHandler()`, `useStorage()`, `useDatabase()`, commands
- ใช้ code blocks สำหรับ server examples
- เขียน code ที่ platform-agnostic เสมอ
- ใช้ storage abstraction (`unstorage`) สำหรับ data persistence
- ใช้ database layer (`db0`) สำหรับ SQL operations
- หลีกเลี่ยง runtime-specific APIs (ใช้ `unenv` polyfills)
- ใช้ Vite plugin integration (`nitro/vite`) สำหรับ full-stack development
- ใช้ serverless deployment presets เมื่อเป็นไปได้
- ใช้ edge functions สำหรับ low-latency responses
- หลีกเลี่ยง long-running processes (serverless-friendly)
- ใช้ `defineCachedHandler` สำหรับ caching ด้วย SWR pattern
- ใช้ route rules สำหรับ per-path configuration


## Expected Outcome

- Server applications ที่ platform-agnostic
- Code ที่ deploy ได้ทุกที่ (Node.js, Cloudflare Workers, Deno, Bun, Vercel, Netlify)
- Performance ที่ optimized สำหรับ serverless (near-0ms boot time ด้วย compiled routing)
- Integration ที่ smooth กับ Vite และ frameworks อื่นๆ (Nuxt, SolidStart, TanStack Start)
- Built-in storage, caching, และ database layers

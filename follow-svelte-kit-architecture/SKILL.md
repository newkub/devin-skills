---
name: follow-svelte-kit-architecture
description: จัดโครงสร้างโปรเจกต์ SvelteKit ตาม best practices และ Svelte 5 Runes
---

## Goal

จัดโครงสร้างโปรเจกต์ SvelteKit ตาม best practices พร้อม Svelte 5 Runes, modules/ และ monorepo support

## Scope

ใช้สำหรับ SvelteKit projects ที่ใช้ Svelte 5 Runes และ file-based routing ทั้ง standalone และ monorepo

## Execute

### 1. Setup Project Structure

สร้างโครงสร้างโปรเจกต์พื้นฐาน

> Goal: มีโครงสร้างโฟลเดอร์หลักครบถ้วน

1. สร้างโฟลเดอร์หลัก: `src/`, `static/`, `tests/`
2. สร้าง `src/lib/` สำหรับ reusable components และ utilities
3. สร้าง `src/lib/server/` สำหรับ server-only code
4. สร้าง `src/modules/` สำหรับ feature-based organization
5. สร้าง `src/routes/` สำหรับ file-based routing
6. สร้าง `src/params/` สำหรับ param matchers
7. สร้าง `src/stores/` สำหรับ state management
8. สร้าง `src/types/` สำหรับ TypeScript types

### 2. Configure SvelteKit

ตั้งค่า SvelteKit และ build tools

> Goal: มี SvelteKit config และ TypeScript config พร้อมใช้งาน

1. ทำ `/follow-svelte` เพื่อตั้งค่า Svelte 5 patterns และ conventions
2. ทำ `/follow-vite` เพื่อตั้งค่า build tooling
3. ตั้งค่า `svelte.config.js` หรือ `svelte.config.ts`
4. ตั้งค่า TypeScript config สำหรับ SvelteKit
5. เพิ่ม SvelteKit types ใน `tsconfig.json`

### 3. Implement File-Based Routing

ใช้ file-based routing ของ SvelteKit

> Goal: ใช้ file-based routing conventions ครบถ้วน

1. สร้าง routes ใน `src/routes` ด้วย directory structure
2. ใช้ `+page.svelte` สำหรับ page components
3. ใช้ `+page.js` หรือ `+page.server.js` สำหรับ load functions
4. ใช้ `+layout.svelte` สำหรับ layouts
5. ใช้ `+error.svelte` สำหรับ error pages
6. ใช้ `+server.js` สำหรับ API endpoints
7. ใช้ `[slug]` สำหรับ dynamic routes

### 4. Implement Reactive Patterns

ใช้ reactive patterns ของ Svelte 5

> Goal: ใช้ Svelte 5 Runes อย่างถูกต้องแทน legacy reactivity

1. ใช้ `$state` สำหรับ local reactive state
2. ใช้ `$derived` สำหรับ derived state
3. ใช้ `$effect` สำหรับ side effects
4. ใช้ `$props` สำหรับ component props
5. ใช้ `$bindable` สำหรับ two-way bindings
6. ใช้ Svelte stores สำหรับ global state

### 5. Component Organization

จัดระเบียบ components อย่างเหมาะสม

> Goal: components มีขนาดเล็ก reusable และมี type-safe props

1. แยก components เป็น small, reusable units
2. ใช้ `$props` สำหรับ component API
3. ใช้ `{@render}` และ snippets สำหรับ composition
4. ใช้ context API สำหรับ prop drilling
5. ใช้ dynamic components สำหรับ conditional rendering

### 6. State Management

จัดการ state อย่างมีประสิทธิภาพ

> Goal: state management ปลอดภัยบน server และใช้ stores บน client

1. หลีกเลี่ยง shared state บน server
2. ใช้ load functions สำหรับ data loading
3. ใช้ `page.data` สำหรับ passing data ไปยัง components
4. ใช้ Svelte stores สำหรับ client-side state
5. ใช้ `writable` stores สำหรับ mutable state
6. ใช้ `readable` stores สำหรับ read-only state
7. ใช้ `derived` stores สำหรับ computed values
8. ทำ `/follow-vitest` สำหรับ testing strategy

## File Structure

### Standalone Project

```
src/
├── lib/                # Reusable components and utilities
│   ├── components/     # UI components
│   ├── server/         # Server-only code
│   └── utils/          # Utility functions
├── modules/            # Feature-based modules
│   └── <feature>/      # components/ hooks/ schemas/ utils/ types/ index.ts
├── routes/             # File-based routing
├── params/             # Param matchers
├── stores/             # State management
├── types/              # TypeScript types
├── app.html            # Root layout
├── error.html          # Error page
├── hooks.client.js     # Client hooks
├── hooks.server.js     # Server hooks
└── service-worker.js  # Service worker
static/                 # Static assets
tests/                  # Test files
```

### Monorepo Project

```
packages/
├── shared/             # @<scope>/shared
│   └── src/             # modules/ components/ lib/ types/ schemas/ index.ts
apps/
├── <app>/
│   └── src/             # lib/ modules/ routes/ stores/ types/
└── ...
```

## File Patterns

| Folder | File | Purpose | Pattern |
|--------|------|---------|---------|
| `src/lib/components` | `*.svelte` | Reusable components | `PascalCase.svelte` |
| `src/lib/server` | `*.ts` | Server-only code | `camelCase.ts` |
| `src/lib/utils` | `*.ts` | Utility functions | `camelCase.ts` |
| `src/routes` | `+page.svelte` | Page components | `+page.svelte` |
| `src/routes` | `+page.js` | Universal load functions | `+page.js` |
| `src/routes` | `+page.server.js` | Server load functions | `+page.server.js` |
| `src/routes` | `+layout.svelte` | Layout components | `+layout.svelte` |
| `src/routes` | `+error.svelte` | Error pages | `+error.svelte` |
| `src/routes` | `+server.js` | API endpoints | `+server.js` |
| `src/stores` | `*.ts` | State management | `camelCase.ts` |
| `src/types` | `*.ts` | TypeScript types | `PascalCase.ts` |

## Rules

### 1. Routing Conventions

- ใช้ `+page.svelte` สำหรับ page components
- ใช้ `+page.js` สำหรับ universal load functions, `+page.server.js` สำหรับ server load
- ใช้ `+layout.svelte` สำหรับ layouts, `+error.svelte` สำหรับ error pages
- ใช้ `+server.js` สำหรับ API endpoints, `[slug]` สำหรับ dynamic routes

### 2. Module Boundaries

- แต่ละ module ใน `modules/` มี `index.ts` เป็น public API
- เก็บ internal code private ไม่ export ออก
- ทำ `/follow-import-export` สำหรับ barrel export strategy
- ไม่มี circular dependencies ระหว่าง modules
- ถ้า module ใหญ่เกินไป → ทำ `/refactor-packages`

### 3. Svelte 5 Runes

- ใช้ `$state` สำหรับ local reactive state
- ใช้ `$derived` สำหรับ derived state, `$effect` สำหรับ side effects
- ใช้ `$props` สำหรับ component props, `$bindable` สำหรับ two-way bindings
- หลีกเลี่ยง legacy reactivity (`let`, `$:`)

### 4. State Management

- หลีกเลี่ยง shared state บน server
- ใช้ load functions สำหรับ data loading, `page.data` สำหรับ passing data
- ใช้ Svelte stores สำหรับ client-side state

### 5. Monorepo Rules

- Share components, hooks, schemas, utils ผ่าน `packages/shared/`
- แต่ละ app มี `routes/` และ `modules/` ของตัวเอง
- ใช้ `@<scope>/shared` alias สำหรับ shared package imports
- ทำ `/follow-monorepo` เพื่อ validate monorepo structure

### 6. Component Development

- ใช้ `.svelte` พร้อม `lang="ts"` สำหรับทุก components
- กำหนด types สำหรับ props ด้วย `$props`
- ใช้ snippets แทน slots, context API สำหรับ deep prop passing

## Expected Outcome

- SvelteKit structure ที่ถูกต้องพร้อม `modules/` และ monorepo support
- File-based routing ใช้ SvelteKit conventions ครบถ้วน
- Svelte 5 Runes ใช้งานถูกต้อง
- Module boundaries ไม่มี circular dependencies
- TypeScript support ครบถ้วน

---
name: follow-nuxt-architecture
description: จัดโครงสร้างโปรเจกต์ Nuxt 3/4 มาตรฐานพร้อม Layers และ Modules
---

## Goal

จัดโครงสร้างโปรเจกต์ Nuxt 3/4 ตามมาตรฐานพร้อม Layers, modules/ และ monorepo support

## Scope

ใช้สำหรับ project ที่พัฒนาด้วย Nuxt 3/4 ทั้ง standalone และ monorepo

## Execute

### 1. Project Structure Setup

สร้างโครงสร้างโปรเจกต์มาตรฐาน

> Goal: มีโครงสร้างโฟลเดอร์หลักครบถ้วนตามมาตรฐาน Nuxt 4 พร้อม modules/

1. ใช้ `app/` directory ตามมาตรฐาน Nuxt 4
2. สร้าง `app/modules/` สำหรับ feature-based organization
3. สร้าง `layers/` สำหรับ feature-based architecture
4. สร้าง `server/` สำหรับ Nitro API routes และ business logic
5. สร้าง `shared/` สำหรับ types และ utilities ที่ใช้ร่วมกัน
6. ใช้ `public/` สำหรับ static assets และ `content/` สำหรับ Nuxt Content

### 2. App Directory Structure

สร้างโครงสร้างมาตรฐานสำหรับ app/ directory

> Goal: มี app/ directory ครบถ้วนตาม Nuxt 4 conventions

1. สร้าง `app.vue` (root), `app.config.ts`, `error.vue`
2. ทำ `/follow-nuxtjs` เพื่อตั้งค่า Nuxt conventions
3. ทำ `/follow-vite` เพื่อตั้งค่า build tooling
4. สร้าง `assets/`, `components/`, `layouts/`, `middleware/`, `pages/`, `plugins/`, `stores/`, `utils/`
5. สร้าง `modules/` สำหรับ feature-based organization ภายใน app

### 3. Components And Composables

จัดโครงสร้าง components และ composables ตาม feature domain

> Goal: components แยกตาม feature domain, composables ใช้ `use` prefix

1. `ui/` สำหรับ base components, `layout/` สำหรับ layout components
2. `[feature]/` สำหรับ feature-specific components, `global/` สำหรับใช้ทุกหน้า
3. ทำ `/follow-vue` สำหรับ component patterns และ composable patterns
4. ตั้งชื่อไฟล์ด้วย PascalCase, composables ใช้ `use` prefix
5. ใช้ `computed` สำหรับ derived state, `try/catch` สำหรับ error handling

### 4. Layers Setup

สร้าง Layers สำหรับ feature-based architecture

> Goal: แต่ละ Layer มี app/, server/, shared/ ของตัวเอง

1. แต่ละ Layer มี `app/`, `server/`, `shared/`, `nuxt.config.ts` (optional)
2. ใช้ `extends` ใน `nuxt.config.ts` เพื่อรวม Layers
3. หลีกเลี่ยง circular dependencies ระหว่าง layers
4. ตั้งชื่อ Layer ตาม feature/domain ชัดเจน
5. กำหนด Route Rules: `isr`, `ssr`, `prerender`, `cors`, `cache`, `headers`, `redirect`, `proxy`
6. กำหนด Runtime Config: API keys (private), feature flags (public)
7. ทำ `/follow-nitro` สำหรับ server configuration

### 5. Server Structure

สร้างโครงสร้าง server/ directory (Nitro)

> Goal: server/ มี api/, db/, services/, repositories/, middleware/

1. `api/` สำหรับ REST API endpoints แยกตาม feature
2. `db/` สำหรับ database schema, migrations และ connection
3. `services/` สำหรับ business logic และ `repositories/` สำหรับ data access
4. `middleware/` สำหรับ auth, logging, CORS บน server
5. ทำ `/follow-pinia` สำหรับ state management patterns

### 6. Shared And Barrel Exports

สร้างโครงสร้าง shared/ directory พร้อม barrel exports

> Goal: shared/ มี types/, utils/, constants/ พร้อม barrel exports

1. `types/` สำหรับ TypeScript interfaces, types, enums
2. `utils/` สำหรับ pure functions ที่ใช้ทั้ง client และ server
3. ใช้ barrel exports (`index.ts`) สำหรับทุก subfolder — ทำ `/follow-import-export`
4. ไม่ใช้ relative path import ใน cross-layer imports
5. ตรวจสอบไม่มี circular dependencies ใน barrel exports
6. ทำ `/follow-vitest` สำหรับ testing strategy

### 7. Data Flow

กำหนด flow การทำงานของข้อมูล

> Goal: data flow ชัดเจนจาก Pages ถึง DB

`Pages → Components → Composables → Stores → API → Services → Repositories → DB`

1. Pages: รับ parameters และจัดการ routing
2. Components: แสดง UI และรับ user interactions
3. Composables: จัดการ business logic และ local state
4. Stores: จัดการ global state (Pinia)
5. API → Services → Repositories → DB: Server-side data flow

## File Structure

### Standalone Project

```
app/
├── app.vue              # Root component
├── app.config.ts        # App configuration
├── error.vue            # Error page
├── assets/              # Styles, fonts, images
├── components/          # Vue components (auto-import)
│   ├── ui/              # Base UI components
│   ├── layout/          # Layout components
│   ├── [feature]/       # Feature-specific components
│   └── global/          # Globally available components
├── composables/         # Composables (auto-import)
├── modules/             # Feature-based modules
│   └── <feature>/       # components/ composables/ schemas/ utils/ types/ index.ts
├── layouts/             # Layout components
├── middleware/          # Route middleware
├── pages/               # File-based routing
├── plugins/             # Nuxt plugins
├── stores/              # Pinia stores
└── utils/               # Client utilities
layers/
└── [feature]/           # app/ server/ shared/ nuxt.config.ts
server/
├── api/                 # API routes
├── db/                  # Database
├── services/            # Business logic
└── repositories/        # Data access
shared/
├── types/               # TypeScript definitions
└── utils/               # Shared utilities
public/                  # Static assets
content/                 # Nuxt Content
```

### Monorepo Project

```
packages/
├── shared/             # @<scope>/shared
│   └── src/             # modules/ components/ lib/ types/ schemas/ index.ts
apps/
├── <app>/              # Nuxt app with layers/ and modules/
└── ...
```

## File Patterns

| Folder | File | Purpose | Pattern |
|--------|------|---------|---------|
| `app/components` | `*.vue` | Vue components | `PascalCase.vue` |
| `app/composables` | `*.ts` | Composables | `useCamelCase.ts` |
| `app/pages` | `*.vue` | Route pages | `camelCase.vue` |
| `app/layouts` | `*.vue` | Layout components | `default.vue` |
| `app/middleware` | `*.ts` | Route middleware | `camelCase.ts` |
| `app/stores` | `*.ts` | Pinia stores | `camelCase.ts` |
| `server/api` | `*.ts` | API routes | `camelCase.ts` |
| `server/services` | `*.ts` | Business logic | `camelCase.ts` |
| `shared/types` | `*.ts` | TypeScript types | `PascalCase.ts` |
| `shared/utils` | `*.ts` | Utility functions | `camelCase.ts` |

## Rules

### 1. Layer Structure

- แต่ละ Layer ต้องมี `app/`, `server/`, `shared/` ครบถ้วน
- ใช้ `extends` ใน `nuxt.config.ts` เพื่อรวม Layers
- หลีกเลี่ยง circular dependencies ระหว่าง layers

### 2. Module Boundaries

- แต่ละ module ใน `modules/` มี `index.ts` เป็น public API
- เก็บ internal code private ไม่ export ออก
- ถ้า module ใหญ่เกินไป → ทำ `/use-or-refactor-to-modules`

### 3. Naming Conventions

- ใช้ PascalCase สำหรับ component files (e.g., `BookingCard.vue`)
- ใช้ `use` prefix สำหรับ composables (e.g., `useBooking.ts`)
- ใช้ camelCase สำหรับ utilities และ store files

### 4. Barrel Exports

- ทุก feature folder ต้องมี `index.ts`
- ไม่ใช้ relative path import ใน cross-layer imports
- ตรวจสอบไม่มี circular dependencies

### 5. Monorepo Rules

- Share components, composables, types ผ่าน `packages/shared/`
- แต่ละ app มี `layers/` และ `modules/` ของตัวเอง
- ใช้ `@<scope>/shared` alias สำหรับ shared package imports
- ทำ `/follow-monorepo` เพื่อ validate monorepo structure

## Expected Outcome

- Nuxt structure ตามมาตรฐาน Nuxt 4 พร้อม `modules/` และ monorepo support
- Layers สำหรับ feature-based architecture
- Components แยกตาม feature, composables ใช้ `use` prefix
- Barrel exports ในทุก feature folder
- Data flow ชัดเจนจาก Pages ถึง DB

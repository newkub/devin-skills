---
name: follow-nuxt
description: สร้างหรือปรับปรุง Nuxt 3/4 project ด้วย Universal Rendering และ Nitro
allowed-tools:
  - read
  - write
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
---

## Goal

กำหนดแนวทางการพัฒนา Nuxt 3/4 applications ให้มีประสิทธิภาพสูงสุด

## Scope

ครอบคลุมการ setup, directory structure, configuration, code standards, performance, plugins, assets, error handling, และ verification สำหรับ Nuxt 3/4 projects

## Execute

### 1. Setup

> Goal: วางแผน project architecture
> Goal: ระบุ version, rendering mode, และ stack ทีเหมาะสม

1. ระบุ project location ใน monorepo เช่น `apps/web/`
2. เลือก Nuxt Version ระหว่าง 3.x หรือ 4.x (default: 4.x)
3. กำหนด Rendering Mode: SSR, SSG, CSR, หรือ Hybrid
4. ตัดสินใจใช้ Database หรือไม่ (เช่น Drizzle ORM)
5. เลือก UI Framework: UnoCSS, Tailwind, หรืออื่นๆ
6. กำหนด Architecture: ใช้ Layers และ Modules หรือไม่

### 2. Directory Structure

> Goal: สร้างโครงสร้างโฟลเดอร์
> Goal: มา project structure ที scale ได้

1. ใช้ `app/` directory สำหรับ Nuxt 4
2. สร้าง `layers/` สำหรับ feature-based architecture
3. จัดกลุ่ม components, composables ตาม feature ในแต่ละ layer
4. ใช้ auto-imports สำหรับ components และ composables
5. แยก business logic เป็น services และ repositories ใน `server/`

### 3. Configuration

> Goal: ตั้งค่า config และ scripts
> Goal: config รองรับ dev, build, typecheck, lint, test

1. ตั้งค่า `nuxt.config.ts` (extends, modules, nitro, typescript)
2. ตั้งค่า `package.json` scripts (build, dev, generate, lint, format, test)
3. ตั้งค่า `tsconfig.json` ด้วย strict mode
4. สร้าง barrel exports สำหรับทุก folder
5. กำหนด data flow: Pages → Components → Composables → Stores → API → Services → Repositories → DB

### 4. Code Standards

> Goal: กำหนด coding standards
> Goal: code มี type safety และ consistency

1. Vue components: ใช้ `script setup lang="ts"`, script อยู่บน template
2. Composables: ชื่อขึ้นต้นด้วย `use`, อยู่ใน `composables/` หรือ `layers/[feature]/composables/`
3. Server API: ใช้ `defineEventHandler` หรือ `defineNitroPlugin`
4. Types: ไม่ใช้ `any`, กำหนด types ชัดเจนใน `shared/types/`
5. Import: auto-import สำหรับ Nuxt built-ins, barrel export สำหรับ shared
6. Icons: ใช้ `@nuxt/icon` ด้วย preset `mdi` เท่านั้น ไม่ใช้ SVG โดยตรง
7. Components: import จาก `components/ui/` เท่านั้น สำหรับ shared UI components
8. Barrel Exports: ทุก `index.ts` แค่ re-export เท่านั้น ไม่มี logic
9. Deprecated: ลบ `@deprecated` ทั้งหมด ไม่ให้เหลือใน codebase
10. SEO: ใช้ `useHead` ในทุก page component สำหรับ meta tags

### 5. Development

> Goal: พัฒนา base project
> Goal: project พร้อมพัฒนา features

1. สร้าง directory structure ตามที่วางแปลง
2. ติดตั้ง dependencies ด้วย `bun add`
3. สร้าง base components, layouts, composables
4. สร้าง server layer (API routes, services, repositories)
5. สร้าง layers สำหรับแต่ละ feature (ถ้าใช้)

### 6. Performance

> Goal: ปรับแต่ง performance
> Goal: ลด TTI และ bundle size

1. Lazy Loading Components — ใช้ `Lazy` prefix สำหรับ components ที่ไม่จำเป็นต้องโหลดทันที
   ```vue
   <!-- Bad: โหลดทันที -->
   <Modal v-if="showModal" />

   <!-- Good: โหลดเมื่อจำเป็น -->
   <LazyModal v-if="showModal" />
   ```
2. Lazy Hydration — ใช้ `hydrate-on-visible` สำหรับ components ที่ไม่ต้อง interactive ทันที
   ```vue
   <LazyMyComponent hydrate-on-visible />
   ```
3. Hybrid Rendering — ใช้ route rules สำหรับ rendering แบบผสม
   ```typescript
   export default defineNuxtConfig({
     routeRules: {
       '/': { prerender: true },
       '/products/**': { swr: 3600 },
       '/blog': { isr: 3600 },
       '/admin/**': { ssr: false },
     },
   })
   ```
4. NuxtLink Smart Prefetching — ใช้ `<NuxtLink>` แทน `<a>` tag ทั้งหมด
   ```vue
   <NuxtLink to="/about">About page</NuxtLink>
   ```
5. Data Fetching Optimization — ใช้ `useFetch` และ `useAsyncData` พร้อม key parameter
   ```typescript
   const { data } = useAsyncData('tracks', () => fetch(`/tracks/${id}`))
   ```
6. Built-in Storage — ใช้ `useStorage` สำหรับ key-value storage
   ```typescript
   const storage = useStorage()
   await storage.setItem('session:token', sessionToken)
   ```

### 7. Plugins Best Practices

> Goal: ตั้งค่า Nuxt plugins
> Goal: plugins initialize เร็วและไม่กระทบ performance

1. Avoid costly plugin setup - หลีกเลี่ยง plugins ที่มีการคำนวณหนักหรือใช้เวลา initialize นาน
2. Use Composition whenever possible - ใช้ composables แทน plugins เมื่อเป็นไปได้
3. Enable parallel for async plugins - ใช้ `true` สำหรับ async plugins
   ```typescript
   export default defineNuxtPlugin({
     parallel: true,
     async setup() {
       // async initialization
     }
   })
   ```

### 8. Assets Management

> Goal: จัดการ assets
> Goal: assets ถูกประมวลผลหรือ static ได้ถูกต้อง

1. ใช้ `~/assets` สำหรับไฟล์ที่ต้อง processing
   ```typescript
   import image from '~/assets/image.png'
   ```
2. ใช้ `~/public` สำหรับไฟล์ที่ไม่ต้อง processing
   ```vue
   <img src="/image.png" />
   ```
3. `/assets` จะตรวจสอบ missing files ใน build time

### 9. Error Handling

> Goal: ตั้งค่า error boundaries
> Goal: errors ถูก handle อย่างถูกต้อง

1. ใช้ `NuxtErrorBoundary` สำหรับ handle errors ในส่วนต่างๆ ของ app
   ```vue
   <NuxtErrorBoundary>
     <NuxtPage />
     <template #error="{ error }">
       <p>Oh no, something broke!</p>
       <button @click="clearError(error)">Retry</button>
     </template>
   </NuxtErrorBoundary>
   ```

### 10. Verification

> Goal: ตรวจสอบ quality
> Goal: project build และ test ผ่าน

1. รัน `nuxt typecheck` ตรวจสอบ TypeScript errors
2. รัน Biome และ oxlint ตรวจสอบ code quality
3. รัน `nuxt build` และ `nuxt generate` ยืนยัน build ผ่าน
4. ทดสอบ dev server รันได้โดยไม่มี errors
5. ตรวจสอบ HMR และ auto-imports ทำงานถูกต้อง

## Rules

### 1. Directory Conventions

- ใช้ `app/` directory สำหรับ Nuxt 4
- สร้าง `layers/` สำหรับ feature-based architecture

### 2. Vue Components

- Vue components ใช้ `script setup lang="ts"` เท่านั้น
- Composables ต้องมี prefix `use`
- ใช้ `<NuxtLink>` แทน `<a>` tag ทั้งหมด

### 3. Types And Imports

- ไม่ใช้ `any` โดยเด็ดขาด
- ใช้ barrel exports สำหรับทุก folder
- ใช้ auto-imports สำหรับ Nuxt built-ins
- ไม่ใช้ relative path ใน cross-layer imports ใช้ default import alias (`~/`, `#server`, `#shared`)
- ทุก `index.ts` แค่ re-export ไม่มี logic

### 4. UI And Assets

- ใช้ `@nuxt/icon` ด้วย preset `mdi` สำหรับ icons ทั้งหมด
- Components ที่ใช้ซ้ำต้อง import จาก `components/ui/`
- ใช้ `~/assets` สำหรับ processed files
- ใช้ `~/public` สำหรับ static files

### 5. Code Quality

- ลบ `@deprecated` ทั้งหมดจาก codebase
- ใช้ `useHead` ในทุก page component สำหรับ SEO meta tags
- ใช้ `Lazy` prefix สำหรับ lazy loading
- หลีกเลี่ยง costly plugins

## Expected Outcome

- Nuxt 3/4 project ที่มีโครงสร้างถูกต้อง
- Layers และ Modules ที่จัดระเบียบดี
- Code ที่มี type safety ด้วย TypeScript
- Performance ที่ดีขึ้น
- Build และ test ที่ผ่านทั้งหมด
- Error handling ที่ดี
- Assets management ที่ถูกต้อง

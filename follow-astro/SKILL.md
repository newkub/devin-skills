---
name: follow-astro
description: พัฒนา Astro 5 applications ด้วย Server Islands, Content Layer และ Actions
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
  - follow-unocss
---

## Goal

พัฒนา Astro 5 applications ด้วย Server Islands, Content Layer API, Actions และ islands architecture

## Scope

ใช้สำหรับ Astro 5 projects ที่ใช้ Vite 6+ เป็น build tool (content-heavy sites, marketing, docs)

## Execute

### 1. Setup Project
> Goal: Setup Project

1. สร้าง Astro 5 project ด้วย `bunx create-astro@latest`
2. ใช้ `astro.config.mjs` สำหรับ configuration
3. ตั้งค่า `tsconfig.json` ด้วย `strict: true` และ `moduleResolution: bundler`
4. เพิ่ม scripts ใน `package.json` (dev, build, preview, check)
5. ติดตั้ง adapter สำหรับ server-side features (Node, Vercel, Netlify, Cloudflare)
6. ใช้ Vite 6+ เป็น build tool

### 2. Rendering Modes
> Goal: Rendering Modes

1. Astro เป็น static by default
2. ใช้ `prerender = false` ในหน้าที่ต้องการ SSR
3. ไม่ต้องตั้งค่า `output: 'hybrid'` อีก (merged เข้า `static` ใน Astro 5)
4. ติดตั้ง adapter เท่านั้นก็เพียงพอสำหรับ dynamic routes
5. ใช้ Server Islands สำหรับ dynamic content บน static pages

### 3. Server Islands
> Goal: Server Islands

1. ใช้ `server:defer` directive สำหรับ components ที่ต้อง render บน server per-request
2. ใช้ `slot="fallback"` สำหรับ loading content ระหว่างรอ
3. Props ต้อง serializable (ไม่ใช่ functions, dates, class instances)
4. ใช้ `Cache-Control` headers สำหรับ cache individual islands
5. Props ถูก encrypted อัตโนมัติ (safe สำหรับ permission-bearing data)
6. ใช้ server islands สำหรับ personalized content (cart, user info, live data)

### 4. Content Layer API
> Goal: Content Layer API

1. ใช้ Content Layer แทน Content Collections แบบเดิม
2. กำหนด schema ด้วย Zod ใน `src/content.config.ts`
3. ใช้ built-in loaders: `glob()` สำหรับ local files
4. เขียน custom loaders สำหรับ remote APIs, CMS, databases
5. ใช้ `getCollection()` สำหรับ access content (type-safe)
6. ใช้ `render()` สำหรับ render content to HTML
7. Live Content Loaders (experimental) สำหรับ request-time data

### 5. Astro Actions
> Goal: Astro Actions

1. ใช้ Astro Actions สำหรับ type-safe server functions
2. กำหนด actions ใน `src/actions/`
3. ใช้ `defineAction()` พร้อม Zod input validation
4. เรียก actions จาก client ด้วย auto-generated type-safe API
5. ใช้ actions แทน manual API routes สำหรับ forms และ mutations

### 6. Islands Architecture
> Goal: Islands Architecture

1. ใช้ `client:load` สำหรับ hydrate ทันที
2. ใช้ `client:idle` สำหรับ hydrate เมื่อ browser idle
3. ใช้ `client:visible` สำหรับ hydrate เมื่อ visible ใน viewport
4. ใช้ `client:media` สำหรับ hydrate เมื่อ match media query
5. ใช้ `client:only` สำหรับ render เฉพาะ client (ไม่มี SSR)
6. ใช้ framework components (React, Vue, Svelte, Solid) เป็น islands

### 7. View Transitions
> Goal: View Transitions

1. ใช้ `<ViewTransitions />` ใน layout สำหรับ native View Transitions API
2. ใช้ `transition:animate` สำหรับ animations
3. ใช้ `transition:persist` สำหรับ persist state ระหว่าง navigations

### 8. Type-Safe Environment Variables
> Goal: Type-Safe Environment Variables

1. กำหนด schema ใน `astro.config.mjs` ด้วย `env.schema`
2. ใช้ `import.meta.env` สำหรับ access variables (type-safe)
3. ใช้ `getSecret()` สำหรับ server-only secrets

### 9. i18n
> Goal: i18n

1. ใช้ built-in i18n routing (stable ใน Astro 5)
2. กำหนด locales ใน `astro.config.mjs`
3. ใช้ fallback routing และ domain routing

### 10. Styling
> Goal: Styling

1. ทำ `/follow-unocss` สำหรับ styling
2. ใช้ UnoCSS หรือ Tailwind CSS
3. ใช้ scoped styles ใน `.astro` components
4. หลีกเลี่ยง global styles ถ้าไม่จำเป็น

## Rules

### 1. Configuration

ตั้งค่า project ตามมาตรฐาน Astro 5:

- ใช้ `astro.config.mjs` สำหรับ configuration
- ติดตั้ง adapter สำหรับ server-side features
- ใช้ Vite 6+ เป็น build tool
- ตั้งค่า `strict: true` ใน TypeScript
- กำหนด env schema สำหรับ type-safe variables

### 2. Server Islands

ใช้ Server Islands อย่างถูกต้อง:

- ใช้ `server:defer` สำหรับ dynamic content บน static pages
- Props ต้อง serializable เท่านั้น
- ใช้ `slot="fallback"` สำหรับ loading state
- ใช้ `Cache-Control` headers สำหรับ per-island caching
- หลีกเลี่ยงการส่ง entire data objects เป็น props

### 3. Content Layer

ใช้ Content Layer API:

- กำหนด schema ด้วย Zod
- ใช้ `getCollection()` สำหรับ type-safe access
- เขียน custom loaders สำหรับ external data sources
- ไม่ใช้ `getStaticPaths` แบบเดิม (ใช้ Content Layer แทน)

### 4. Actions

ใช้ Astro Actions:

- Validate inputs ด้วย Zod
- ใช้ `defineAction()` สำหรับ type-safe server functions
- ใช้ actions แทน manual API routes สำหรับ forms

### 5. Islands Architecture

ใช้ islands อย่างมีประสิทธิภาพ:

- ใช้ `client:visible` เป็น default สำหรับ below-the-fold
- ใช้ `client:load` เฉพาะ interactive elements ที่จำเป็น
- ใช้ `client:idle` สำหรับ non-critical interactivity
- หลีกเลี่ยง `client:only` ถ้าไม่จำเป็น (สูญเสีย SSR)

### 6. Code Quality

รักษาคุณภาพโค้ด:

- ใช้ TypeScript strict mode
- รัน `astro check` สำหรับ type checking
- ใช้ Biome สำหรับ linting และ formatting
- ใช้ `import.meta.env` สำหรับ type-safe env access

## Expected Outcome

- Astro 5 project ที่มีโครงสร้างถูกต้อง
- Server Islands สำหรับ dynamic content บน static pages
- Content Layer API สำหรับ type-safe content management
- Astro Actions สำหรับ type-safe server functions
- Islands architecture ที่ส่ง JavaScript น้อยที่สุด
- Type safety ด้วย TypeScript และ Zod
- Performance ที่ดีด้วย static-first approach

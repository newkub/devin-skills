---
name: follow-my-tech-stack
description: สรุป tech stack ที่ใช้ในการพัฒนา จัดกลุ่มตาม ecosystem
triggers:
  - user
  - model
allowed-tools:
  - read
  - skill
related:
  - deep-analyze-by-use-scripts
  - follow-monorepo
  - follow-uxui-animation
  - follow-tanstack-ai
  - follow-hk
  - follow-pitchfork
  - follow-usage
---

## Goal

สรุป tech stack ที่ใช้ในการพัฒนา จัดกลุ่มตาม ecosystem เพื่อให้เห็นภาพรวมและง่ายต่อการอ้างอิง

## Scope

ครอบคลุม runtime, frameworks, libraries, tools และ utilities ที่ใช้ในการพัฒนา ทั้ง TypeScript/JavaScript และ Rust ecosystems

## Execute

### 1. Identify Tech Stack

ระบุ tools และ frameworks ที่ใช้

> Goal: รู้ภาพรวม tech stack ของ project

1. ทำ `/deep-analyze-by-use-scripts` เพื่อวิเคราะห์ dependencies และ tools ที่ใช้
2. ระบุ ecosystem: TypeScript/JavaScript หรือ Rust หรือทั้งสองอย่าง
3. ระบุ runtime, build tools, frameworks, ORM, และ ecosystem libraries
4. ถ้าเป็น monorepo: ทำ `/follow-monorepo` เพื่อตรวจสอบ workspace dependencies
5. ถ้ามี desktop app: ระบุ `Tauri` และ Rust backend
6. ถ้ามี mobile app: ระบุ `Capacitor` และ native plugins
7. ถ้ามี AI features: ระบุ `TanStack AI` และ AI providers
8. ถ้ามี animation/interactive visuals: ระบุ `/follow-uxui-animation`

### 2. Document Tech Stack

สร้างรายการสรุปเป็นตารางเดียวโดยใช้ ecosystem เป็น columns

> Goal: สรุป tech stack ครบถ้วนและอัปเดต

1. ใช้ตาราง `Category | TypeScript | Rust` ใน Rules
2. จัดกลุ่มตาม domain: Runtime, Framework, Data, Frontend, Dev Tools, Infrastructure, Services
3. ระบุ default must-have libraries สำหรับโปรเจกต์ใหม่
4. อัปเดตเมื่อมีการเปลี่ยนแปลง

## Rules

### 1. Tech Stack

| Category | TypeScript | Rust |
|---|---|---|
| Runtime | `Bun` | `Rust` |
| Package Manager | `Bun` | `Cargo` |
| Build Tool | `tsdown`, `Rolldown` | `Cargo` |
| Bundler | `Vite` (with Rolldown) | - |
| Type Checker | `tsc` | `rustc` |
| Web Framework | `ElysiaJS`, `Hono`, `Nitro` | `Axum`, `Actix Web` |
| Full-stack Framework | `TanStack Start`, `Nuxt 3` | - |
| Frontend Framework | `Vue 3` | - |
| Desktop App | `Tauri` | `Tauri` (Rust backend) |
| Mobile App | `Capacitor` | - |
| ORM | `Drizzle` | `SQLx`, `SeaORM` |
| Database | `TanStack DB`, `Cloudflare D1` | - |
| Database Migration | `drizzle-kit` | `SQLx` migrations |
| Data Schema | `Drizzle Schema` | `SQLx` migrations |
| API Schema | `oRPC`, `Zod` | `Serde` + `Axum` extractors |
| Validator | `Zod` | `Garage`, `Serde` |
| Serialization | - | `Serde` |
| Router | `TanStack Router`, `Vue Router` | `Axum` router |
| State Management | `TanStack Store`, `Pinia` | - |
| Data Fetching | `TanStack Query` | `reqwest` |
| Caching | `TanStack Query` cache | `moka` |
| Table | `TanStack Table` | - |
| Charts | `TanStack Charts` | - |
| Form | `TanStack Form` | - |
| Hotkeys | `TanStack Hotkeys` | - |
| Markdown | `TanStack Markdown`, `marked`, `shiki` | `pulldown-cmark` |
| Highlight | `TanStack Highlight` | - |
| Virtual | `TanStack Virtual` | - |
| Pacer | `TanStack Pacer` | - |
| Animation / Interactive | `animejs`, `GSAP`, `Framer Motion`, `Motion One`, `Lottie`, `Rive` | - |
| UI Library | `Nuxt UI`, `shadcn-vue` | - |
| Styling | `UnoCSS`, `TailwindCSS` | - |
| Icons | `@iconify-json/*` | - |
| Utilities | `VueUse` | - |
| i18n | `@intlify/vuex-i18n`, `vue-i18n` | `fluent` |
| Devtools | `TanStack Devtools` | - |
| Config | `TanStack Config` | - |
| CLI | `TanStack CLI`, `Wrangler`, `Clap` | `Clap` |
| Intent | `TanStack Intent` | - |
| TUI | - | `Ratatui` |
| Async Runtime | - | `Tokio` |
| HTTP Client | - | `reqwest` |
| Logging | `pino` | `tracing` |
| AI | `TanStack AI` (ดู `/follow-tanstack-ai`), `Workers AI` | - |
| MCP Server | `@modelcontextprotocol/sdk` | `rmcp` |
| Web Scraping | `fastCRW` | `scraper` |
| Linter | `Biome` | `Clippy` |
| Formatter | `Biome` | `rustfmt` |
| Code Search | `ast-grep` | `ast-grep` |
| Unused Code Detection | `Knip` | - |
| Circular Dependency | `madge` | - |
| Testing | `Vitest`, `Playwright` | `cargo-nextest` |
| Mutation Testing | - | `cargo-mutants` |
| Code Coverage | `v8` (via Vitest) | `tarpaulin` |
| Build System | `Turborepo`, `Moonrepo` | `Cargo` workspaces |
| Git Hooks | `hk` | `hk` |
| Process Manager | `pitchfork` | `pitchfork` |
| CLI Spec | `usage` | `usage` |
| CI/CD | `GitHub Actions` | `GitHub Actions` |
| Documentation | `Docus`, `VitePress` | - |
| Release | `Auto` | - |
| Deployment | `NuxtHub`, `Cloudflare Workers` | - |
| Storage | `Cloudflare KV`, `Cloudflare R2` | - |
| Secrets Management | `Infisical`, `Phase.dev` | - |
| Auth | `Supabase`, `Better Auth`, `WorkOS`, `Auth.js` | `jsonwebtoken` |
| Payment | `Stripe` | `stripe-rust` |
| Email | `Resend`, `Nodemailer` | `lettre` |
| Feature Flags | `PostHog`, `Vercel Flags` | - |
| Error Monitoring | `Sentry` | `Sentry` |
| Image Optimization | `Cloudflare Images` | - |

### 2. Default Must-Have Libraries

ระบุ default libraries ที่จำเป็นต้องมีสำหรับทุกโปรเจกต์

- ทุกโปรเจกต์ต้องมี: Database ORM, Validator, Linter, Testing, Package Manager, Git Hooks
- ถ้าเป็น web app: เพิ่ม Router, State Management, Styling, UI Library, Data Fetching
- ถ้าเป็น API: เพิ่ม API Schema, HTTP Client, Auth
- ถ้าเป็น monorepo: เพิ่ม Build System, Documentation
- ถ้ามี AI: เพิ่ม `TanStack AI` (ดู `/follow-tanstack-ai`)
- ถ้ามี desktop: เพิ่ม `Tauri`
- ถ้ามี mobile: เพิ่ม `Capacitor`
- ถ้ามี background daemons/processes: เพิ่ม `pitchfork` (ดู `/follow-pitchfork`)
- ถ้าสร้าง CLI หรือต้องการ completions/docs/manpages: เพิ่ม `usage` (ดู `/follow-usage`)
- ถ้ามี animation/interactive visuals: เพิ่ม `/follow-uxui-animation`

## Expected Outcome

- รายการสรุป tech stack ที่ครบถ้วนครอบคลุมทั้ง TypeScript และ Rust
- จัดกลุ่มตาม ecosystem อย่างชัดเจนในตารางเดียว
- ง่ายต่อการอ้างอิงและอัปเดต
- เห็นภาพรวมของ tools ที่ใช้ทุก domain
- Default must-have libraries ชัดเจนสำหรับทุกโปรเจกต์
- รองรับหลาย project types: web, API, desktop, mobile, AI, monorepo, interactive UI

## Common Mistakes

- ไม่อัปเดตรายการเมื่อเปลี่ยน tech stack
- จัดกลุ่ม tools ไม่ถูกต้องตาม domain
- ทิ้ง tools ที่ obsolete ไว้ในรายการ
- ไม่ระบุ Rust equivalents เมื่อใช้หลาย ecosystems
- ลืม conditional libraries สำหรับ project types เฉพาะ (desktop, mobile, AI, animation)

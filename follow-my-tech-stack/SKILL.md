---
name: follow-my-tech-stack
description: สรุป tech stack ที่ใช้ในการพัฒนา จัดกลุ่มตาม ecosystem
argument-hint: "[scope]"
related:
  - use-scripts
  - follow-lang-bun
  - follow-tool-rolldown
  - follow-tool-oxlint
  - follow-lib-esm-sh
  - use-lib-effective
  - deep-analyze-by-use-scripts
  - follow-service-cloudflare
---

## Goal

สรุป tech stack ที่ใช้ในการพัฒนา จัดกลุ่มตาม ecosystem เพื่อให้เห็นภาพรวมและง่ายต่อการอ้างอิง

## Scope

ครอบคลุม runtime, frameworks, libraries, tools และ utilities ที่ใช้ในการพัฒนา ทั้ง TypeScript/JavaScript และ Rust ecosystems

## Execute

### 1. Identify Tech Stack

> Goal: ระบุ tools และ frameworks ที่ใช้

1. ทำ `/deep-analyze-by-use-scripts` เพื่อวิเคราะห์ dependencies และ tools ที่ใช้
2. ระบุ ecosystem: TypeScript/JavaScript หรือ Rust หรือทั้งสองอย่าง
3. ระบุ runtime, build tools, frameworks, ORM, และ ecosystem libraries
4. ถ้าไม่พบ tech stack หรือ library ที่ต้องการใน table → ทำ `/deep-research` หรือ `/research-dependencies` เพื่อหาทางเลือกทีเหมาะสม
5. ถ้าเป็น monorepo: ทำ `/follow-monorepo` เพื่อตรวจสอบ workspace dependencies
6. ถ้ามี desktop app: ระบุ `Tauri` และ Rust backend
7. ถ้ามี mobile app: ระบุ `Capacitor` และ native plugins
8. ถ้ามี AI features: ระบุ `TanStack AI` และ AI providers
9. ถ้ามี animation/interactive visuals: ระบุ `/review-frontend`

### 2. Document Tech Stack

> Goal: สร้างรายการสรุปเป็นตารางเดียวโดยใช้ ecosystem เป็น columns

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
| Build Tool | `tsdown`, `Rolldown` (oxc engine) | `Cargo` |
| Bundler | `Rolldown`, `Vite` (with Rolldown engine) | - |
| JS/TS Parser | `oxc-parser` | `oxc_parser` |
| Type Checker | `tsc` | `rustc` |
| Web Framework | `ElysiaJS`, `Hono`, `Nitro` | `Axum`, `Actix Web` |
| Full-stack Framework | `TanStack Start`, `Nuxt 3` | - |
| Frontend Framework | `Vue 3` | - |
| Desktop App | `Tauri` | `Tauri` (Rust backend) |
| Mobile App | `Capacitor` | - |
| ORM | `Drizzle` | `SQLx`, `SeaORM` |
| Database | `TanStack DB`, `Cloudflare D1`, `Cloudflare Hyperdrive` (accelerate Postgres/MySQL) | - |
| Database Migration | `drizzle-kit` | `SQLx` migrations |
| Data Schema | `Drizzle Schema` | `SQLx` migrations |
| API Schema | `oRPC`, `Zod` | `Serde` + `Axum` extractors |
| Validator | `Zod` | `garde`, `Serde` |
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
| AI | `TanStack AI` (ดู `/follow-lib-tanstack-ecosystem`), `Workers AI`, `Cloudflare AI Gateway`, `Cloudflare AI Search` (RAG), `Cloudflare Vectorize`, `Cloudflare Agents`, `Cloudflare Agent Memory`, `Cloudflare Browser Run` (headless), `Cloudflare AI Crawl Control` | - |
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
| Deployment | `NuxtHub`, `Cloudflare Workers`, `Cloudflare Pages`, `Cloudflare Containers`, `Cloudflare Dynamic Workers`, `Cloudflare Sandbox SDK` | - |
| Storage | `Cloudflare KV`, `Cloudflare R2` (+`R2 Data Catalog`, `R2 SQL`), `Cloudflare Cache`, `Cloudflare Cache Reserve`, `Cloudflare Artifacts`, `Cloudflare Durable Objects` | - |
| Secrets Management | `/follow-secret-manager` (default: `/follow-secret-manager`), `Cloudflare Secrets Store` | `/open-web-for-config-secret` |
| Auth | `Supabase`, `Better Auth`, `WorkOS`, `Auth.js` | `jsonwebtoken` |
| Payment | `Stripe` | `stripe-rust` |
| Email | `Resend`, `Nodemailer`, `Cloudflare Email Service`, `Cloudflare Email Routing`, `Cloudflare DMARC Management` | `lettre` |
| Feature Flags | `PostHog`, `Vercel Flags`, `Cloudflare Flagship` | - |
| Error Monitoring | `Sentry` | `Sentry` |
| Media / Image | `Cloudflare Images`, `Cloudflare Stream`, `Cloudflare Realtime`, `Cloudflare RealtimeKit`, `Cloudflare TURN Service`, `Cloudflare MoQ` | - |
| Bookmarking | `raindrop-cli` (Raindrop.io) — ดู `/list-raindrop-io`, `/search-in-raindrop-io` | - |
| JSON Processing | `jq` | - |
| Cloudflare - Background Jobs | `Cloudflare Workflows`, `Cloudflare Queues`, `Cloudflare Cron Triggers`, `Cloudflare Pipelines` | - |
| Cloudflare - Realtime / State | `Cloudflare Durable Objects`, `Cloudflare Realtime`, `Cloudflare RealtimeKit`, `Cloudflare TURN Service`, `Cloudflare MoQ` | - |
| Cloudflare - CDN / Performance | `Cloudflare Cache`, `Cloudflare Argo Smart Routing`, `Cloudflare Smart Shield`, `Cloudflare Speed`, `Cloudflare Waiting Room`, `Cloudflare Load Balancing`, `Cloudflare Health Checks`, `Cloudflare Automatic Platform Optimization` | - |
| Cloudflare - Network | `Cloudflare Tunnel`, `Cloudflare Spectrum`, `Cloudflare Network Interconnect`, `Cloudflare Multi-Cloud Networking`, `Cloudflare BYOIP`, `Cloudflare China Network`, `Cloudflare Workers VPC`, `Cloudflare Privacy Gateway` | - |
| Cloudflare - Security | `Cloudflare WAF`, `Cloudflare DDoS Protection`, `Cloudflare Bots`, `Cloudflare Turnstile`, `Cloudflare Challenges`, `Cloudflare API Shield`, `Cloudflare SSL/TLS` (+`Keyless SSL`, `Geo Key Manager`), `Cloudflare Client-side security`, `Cloudflare Fraud Detection`, `Cloudflare Rate Limiting` (Rules), `Cloudflare Randomness Beacon`, `Cloudflare Key Transparency Auditor` | - |
| Cloudflare - Zero Trust | `Cloudflare One`, `Cloudflare Access`, `Cloudflare Gateway`, `Cloudflare WARP Client`, `Cloudflare Browser Isolation`, `Cloudflare CASB`, `Cloudflare DLP`, `Cloudflare WAN`, `Cloudflare Magic Transit`, `Cloudflare Mesh`, `Cloudflare Digital Experience Monitoring`, `Cloudflare Email security` | - |
| Cloudflare - DNS / Domains | `Cloudflare DNS` (+`Internal DNS`, `DNS Firewall`), `Cloudflare Registrar`, `1.1.1.1`, `Cloudflare Time Services` | - |
| Cloudflare - Observability | `Cloudflare Web Analytics`, `Cloudflare Analytics` (GraphQL Analytics API), `Cloudflare Logs` / `Logpush`, `Cloudflare Log Explorer`, `Cloudflare Workers Logs`, `Cloudflare Network Error Logging`, `Cloudflare Radar`, `Cloudflare Notifications`, `Cloudflare Agent Lee` | - |
| Cloudflare - Tag Management | `Cloudflare Zaraz`, `Google tag gateway` | - |
| Cloudflare - Multi-tenant | `Cloudflare for Platforms`, `Cloudflare for SaaS`, `Cloudflare Tenant` | - |
| Cloudflare - Deploy Tooling | `Wrangler`, `Cloudflare Workers Builds`, `Cloudflare Version Management`, `Cloudflare Terraform provider`, `Pulumi` | - |
| Cloudflare - Misc | `Cloudflare Wallets`, `Cloudflare Web3`, `Cloudflare Privacy Pass` / `Privacy Proxy`, `Cloudflare Ruleset Engine`, `Cloudflare Resource Tagging`, `Cloudflare Snippets` | - |

### 2. Default Must-Have Libraries

ระบุ default libraries ที่จำเป็นต้องมีสำหรับทุกโปรเจกต์

- ทุกโปรเจกต์ต้องมี: Database ORM, Validator, Linter, Testing, Package Manager, Git Hooks
- ถ้าเป็น web app: เพิ่ม Router, State Management, Styling, UI Library, Data Fetching
- ถ้าเป็น API: เพิ่ม API Schema, HTTP Client, Auth
- ถ้าเป็น monorepo: เพิ่ม Build System, Documentation
- ถ้ามี AI: เพิ่ม `TanStack AI` (ดู `/follow-lib-tanstack-ecosystem`)
- ถ้ามี desktop: เพิ่ม `Tauri`
- ถ้ามี mobile: เพิ่ม `Capacitor`
- ถ้ามี background daemons/processes: เพิ่ม `pitchfork` (ดู `/follow-tool-pitchfork`)
- ถ้าสร้าง CLI หรือต้องการ completions/docs/manpages: เพิ่ม `usage` (ดู `/follow-tool-usage`)
- ถ้ามี animation/interactive visuals: เพิ่ม `/review-frontend`

### 4. Missing Stack

- ถ้า library หรือ tool ที่ต้องการไม่อยู่ใน table → ทำ `/deep-research` หรือ `/research-dependencies` เพื่อหาทางเลือก
- บันทึกผล research ลงใน tech stack table หรือ `references/`
- ถ้าไม่แน่ใจระหว่างหลายทางเลือก → ใช้ `/ask-me`

### 3. Fast Parser And Bundler

เลือก parser และ bundler ทีเร็วทีสุดเมื่อเหมาะสม

- ใช้ `oxc-parser` แทน `acorn`, `babel`, `typescript` parser สำหรับ JS/TS AST เมื่อต้องการความเร็วสูง
- ใช้ `rolldown` แทน `Vite`/`esbuild` สำหรับ bundle ขนาดใหญ่ หรือ `Vite` ก็ยังใช้ Rolldown engine ได้
- ดู `/follow-tool-rolldown` และ `/follow-tool-oxlint` สำหรับ setup และ best practices
- ถ้าใช้ Bun scripts ให้ใช้ `Bun.Transpiler` ก่อน แล้ว fallback ไป `oxc-parser` ถ้าต้องการ AST ละเอียด

- ใช้ /follow-lang-bun ถ้าจำเป็น
- ใช้ /follow-lib-esm-sh ถ้าจำเป็น
- ใช้ /use-lib-effective ถ้าจำเป็น

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
- ลืม conditional libraries สำหรับ project types เฉพาะ (desktop, mobile, AI, animation, cloudflare) — ให้ใช้ `/follow-service-cloudflare` ด้วย

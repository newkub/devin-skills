# Tech Stack Catalog

Canonical tech stack + default picks ต่อ category จัดกลุ่มตาม ecosystem — merged from `follow-my-tech-stack`

## How To Select

- เลือกจาก column `Default` เสมอ — ยกเว้นเงื่อนไข `(→ ...)` ใน `Alternatives` ตรงกับ project
- ถ้า project มีตัวที่ไม่ใช่ default → ตรวจว่ามีเหตุผลหรือ drift — ถ้า drift flag ใน report ให้ user ตัดสินใจ
- ถ้า library ที่ต้องการไม่อยู่ใน table → ทำ `/deep-research` หรือ `/research-dependencies` แล้วอัปเดต catalog นี้

## Core — TypeScript ↔ Rust

| Category | TS Default | TS Alternatives | Rust Default | Rust Alternatives |
|---|---|---|---|---|
| Runtime | `Bun` | - | `Rust` | - |
| Package Manager | `Bun` | `aube` | `Cargo` | - |
| Build Tool | `tsdown`, `Rolldown` (oxc engine) | - | `Cargo` | - |
| JS/TS Parser | `oxc-parser` | - | `oxc_parser` | - |
| Type Checker | `tsc` | - | `rustc` | - |
| Tool Version Manager | `mise` | - | `mise` | - |
| Web Framework | `Elysia` | `Hono` (→CF Workers/multi-runtime), `Nitro` (→ใน Nuxt) | `Axum` | `Actix Web` |
| Full-stack Framework | `Nuxt 4` (Vue), `TanStack Start` (Solid) | `Astro` (→content site), `SvelteKit` (→Svelte) | `Dioxus` | - |
| Desktop App | `Tauri` | `Native SDK` (→native toolkit) | `Tauri` (Rust backend) | - |
| Mobile App | `Capacitor` | - | - | - |
| ORM | `Drizzle` | - | `SQLx` | `SeaORM` (→ต้องการ full ORM) |
| SQL / KV Driver | `postgres`, `ioredis` | - | `sqlx`, `fred` | - |
| Database Migration | `drizzle-kit` | - | `SQLx` migrations | - |
| API Schema | `oRPC` + `Zod` (ดู `/follow-lib-orpc`) | - | `Serde` + `Axum` extractors | - |
| API Docs | `Scalar` | `Redocly` (→docs-as-code) | `utoipa` | `aide` |
| SDK Generation | `Stainless` | - | - | - |
| Validator | `Zod` | `Valibot` (→bundle/edge), `ArkType` (→perf) | `garde` | `validator`, `nutype` (→domain newtypes) |
| Serialization | - | - | `Serde` | `rkyv` |
| Router | `TanStack Router` | `Vue Router` (→ใน Nuxt) | `Axum` router | - |
| Data Fetching | `TanStack Query` | `pinia-colada` (→Vue เบา) | `reqwest` | - |
| Caching | `TanStack Query` cache | - | `moka` | - |
| Markdown | `marked` + `shiki` | `markdown-it`, `comark` | `pulldown-cmark` | `comrak`, `syntect` (→highlight) |
| i18n | `vue-i18n` (`@intlify/*`) | - | `fluent` | - |
| CLI Framework | `citty` (+`usage` spec) | `cac`, `commander`, `TanStack CLI` | `Clap` | - |
| TUI | `OpenTUI` (+`tuiparts`) | - | `Ratatui` | `crossterm` |
| Async Runtime | - | - | `Tokio` | - |
| Effect System | `effect` (ดู `/follow-lib-effect-ts`) | - | idiomatic: `tokio`+`thiserror`/`anyhow`+`tracing` | `id_effect` (→Effect DX), `effect-rs` (alpha) |
| Error Handling | `neverthrow` | `effect` typed errors (→adopt Effect) | `thiserror` (lib), `anyhow` (app) | `miette` (→rich diagnostics) |
| Retry / Resilience | `effect` Schedule | - | `backon` | `again` |
| Concurrency | `Promise` pool | worker threads | `tokio` `JoinSet` | `rayon` (→CPU parallel), `dashmap`, `parking_lot`, `crossbeam` |
| Stream | `effect` Stream | `rxjs` | `futures` + `tokio-stream` | `async_stream` |
| STM | `effect` STM | - | `stm` | `async-stm` |
| HTTP Client | `ofetch` | `ky`, `fetch` (→ไม่ต้อง dep) | `reqwest` | `ureq` (→blocking/light) |
| HTTP Mocking | `msw` | `emulate` (→local API emulation) | `wiremock` | - |
| Logging | `pino` (prod) | `consola` (→dev/CLI pretty) | `tracing` | - |
| Observability | `OpenTelemetry` + `SigNoz` (ดู `/follow-service-signoz`) | `Parca` (→profiling) | `tracing-opentelemetry` | `opentelemetry` |
| MCP Server | `@modelcontextprotocol/sdk` | - | `rmcp` | - |
| Web Scraping | `fastCRW` | `Spider` (→hosted crawler) | `scraper` | - |
| Date / Time | `date-fns` | `Temporal` (→project ใหม่) | `jiff` | `time` |
| Config / Env | `c12` | `unconfig`, `dotenv` | `figment` | `config-rs`, `dotenvy` |
| Utilities | `es-toolkit`, `ts-pattern` | `pathe`, `defu`, `ufo`, `nanoid`, unjs: `jiti`, `giget`, `scule`, `mlly`, `ohash`, `nypm` | `itertools`, `derive_more`, `bon`, `camino` | `uuid`, `ulid`, `secrecy`, `zeroize` |
| Local DB / IndexedDB | `Dexie` | - | - | - |
| LLM Inference | - | - | `mistral.rs` | - |
| Agent Sandbox | `Cloudflare Sandbox SDK` | `Beam` (→hosted) | - | - |
| AI Memory | `Cloudflare Agent Memory` | `supermemory` (→hosted) | - | - |
| Linter | `Biome` | `Oxlint` (→repo ใหญ่/speed), `ESLint` (→compat) | `Clippy` | - |
| Formatter | `Biome` | `dprint` (→ภาษาอื่น), `oxfmt` (→oxc formatter, ใหม่) | `rustfmt` | `dprint` |
| Code Search | `ast-grep` | `GritQL` (→ใน Biome), `Semgrep` (→security) | `ast-grep` | - |
| Dep Hygiene | `Knip` (unused) | `madge` (circular), `publint` + `attw` (package lint) | `cargo-udeps` | `cargo-modules` |
| Testing | `Vitest` + `Playwright` | `happy-dom` (→DOM env) | `cargo-nextest` | `insta` (→snapshot), `proptest` (→property) |
| Mutation Testing | `Stryker` | - | `cargo-mutants` | - |
| Benchmark | `mitata` | Vitest bench, `hyperfine` (→CLI) | `criterion` | `divan` |
| Code Coverage | `v8` (via Vitest) | - | `cargo-llvm-cov` | `tarpaulin` |
| Build System | `Moonrepo` (→ผสม Rust+TS) | `Turborepo` (→TS ล้วน) | `Cargo` workspaces | - |
| Git Hooks | `hk` | - | `hk` | - |
| Process Manager | `pitchfork` | - | `pitchfork` | - |
| CLI Spec | `usage` | - | `usage` | - |
| CI/CD | `GitHub Actions` | `act` (→local), `RunsOn` (→self-hosted), `Harness`, `BuildBuddy` (→enterprise/Bazel) | `GitHub Actions` | - |
| Dependency Updates | `taze` | `Renovate` (→auto PRs), `pkg.pr.new` (→preview) | `cargo-outdated` | `cargo-update` |
| Release | `Changesets` (monorepo) | `semantic-release` (→full-auto), `release-it` (→single pkg), `changelogen` (→changelog only), `Auto` | `release-plz` + `cargo-dist` | - |
| Error Monitoring | `Sentry` | - | `Sentry` | - |
| Code Metrics | `loc` | - | `tokei` | `scc` |
| CLI / Shell Tools | `jq`, `gh`, `watchexec`, `just`, `nushell`, `pwsh`, `ni` | `yq`, `Bun Shell` | `jaq`, `watchexec`, `just`, `nushell` | - |

## Vite / Rolldown Ecosystem

| Category | Default | Alternatives |
|---|---|---|
| Bundler | `Rolldown` | `rolldown-vite` (→Vite 7 migration path), `Vite` (Rolldown engine ใน Vite 8) |
| Library Bundler | `tsdown` | - |
| Unified Toolchain | - | `Vite+` (→ต้องการตัวเดียวจบ, ยังใหม่) |
| Dev Server / HMR | `Vite` | - |
| Test Runner | `Vitest` | `@cloudflare/vitest-pool-workers` (→test Workers) |
| Docs | `VitePress` | `Slidev` (→slides), `Astro` (→content site) |
| Browser Extension | `WXT` | - |
| Universal Plugin API | `unplugin` | `unplugin-auto-import`, `unplugin-vue-components`, `unplugin-icons` |
| Plugin Authoring | `withFilter` (rolldown-vite filter) | native plugins (`enableNativePlugin`, experimental) |
| Common Plugins | - | `@cloudflare/vite-plugin` (→Workers in Vite), `vite-plugin-pwa`, `vite-tsconfig-paths`, `vite-plugin-devtools` |
| Native Speed | `lightningcss` (CSS) | `oxfmt` (format) |
| Bundle Analysis | `sonda` | `bundlewatch` |
| Inspect / Debug | `vite-plugin-inspect` | `node-modules-inspector` |

## Vue / Nuxt Ecosystem

| Category | Default | Alternatives |
|---|---|---|
| UI Framework | `Vue 3` | - |
| Meta Framework | `Nuxt 4` | - |
| Server Engine | `Nitro` | `h3` (→standalone server) |
| UI Library | `Nuxt UI` | `shadcn-vue` (→own code) |
| Headless Primitives | `reka-ui` | - |
| State Management | `Pinia` | - |
| Composables | `VueUse` | - |
| Form Validation | `Regle` (→Vue-native) | `TanStack Form` |
| i18n | `vue-i18n` | `@nuxtjs/i18n` (→Nuxt module) |
| Content / Docs | `Nuxt Content` | `Docus` (→docs site), `Velite` (→นอก Nuxt) |
| Deployment | `NuxtHub` | - |

## TanStack Ecosystem

| Category | Default | Alternatives |
|---|---|---|
| Full-stack | `TanStack Start` | - |
| Router | `TanStack Router` | - |
| Query | `TanStack Query` | - |
| DB | `TanStack DB` | - |
| Store | `TanStack Store` | - |
| Table | `TanStack Table` | - |
| Form | `TanStack Form` | - |
| Virtual | `TanStack Virtual` | - |
| Pacer | `TanStack Pacer` | - |
| Hotkeys | `TanStack Hotkeys` | - |
| Devtools | `TanStack Devtools` | - |
| Config | `TanStack Config` | - |
| CLI | `TanStack CLI` | - |
| Intent | `TanStack Intent` | - |
| AI | `TanStack AI` (ดู `/follow-lib-tanstack-ecosystem`) | - |
| Charts | `TanStack Charts` | - |
| Highlight | `TanStack Highlight` | - |
| Markdown | `TanStack Markdown` | - |

## TypeScript Libraries (General)

| Category | Default | Alternatives |
|---|---|---|
| Styling | `UnoCSS` | `TailwindCSS` |
| Icons | `@iconify-json/*` | - |
| Animation / Interactive | `animejs` | `Motion` (→spring UI), `GSAP` (→complex timeline), `Lottie`, `Rive` (→designer assets) |
| ESM CDN | `esm.sh` (ดู `/follow-lib-esm-sh`) | - |
| PDF | `pdfkit` (ดู `/follow-lib-pdfkit`) | - |
| QR Code | `qrcode` (ดู `/follow-lib-qrcode`) | - |
| JWT / JWK | `jose` (ดู `/follow-lib-jose`) | - |
| OTP / 2FA | `otplib` (ดู `/follow-lib-otplib`) | - |
| Passkeys / WebAuthn | `simplewebauthn` (ดู `/follow-lib-simplewebauthn`) | - |
| AI SDK | `openai` (ดู `/follow-lib-openai`), `claude-agent-sdk` (ดู `/follow-service-claude-agent-sdk`) | - |

## Rust Ecosystem

| Category | Default | Alternatives |
|---|---|---|
| CLI UX | `cliclack`, `indicatif` | `inquire`, `dialoguer`, `comfy-table`, `console` |
| Service Middleware | `tower`, `tower-http` | - |
| Actor Framework | `ractor` | `kameo` |
| DataFrame / Arrow | `polars` | `arrow` |
| Cross-platform UI | `Dioxus` (ดู `/follow-create-cross-dioxus`) | - |
| Modern Shell Utils | `eza`, `bat`, `fd`, `ripgrep` | `sd`, `delta`, `starship`, `zoxide` |
| Cargo Tooling | `cargo-dist` | `cargo-deny`, `cargo-audit`, `cargo-watch`, `cargo-edit`, `cargo-bloat` |

## Cloudflare

| Category | Offering |
|---|---|
| Compute / Deploy | `Cloudflare Workers`, `Cloudflare Pages`, `Cloudflare Containers`, `Cloudflare Dynamic Workers`, `Cloudflare Sandbox SDK` |
| AI | `Workers AI`, `Cloudflare AI Gateway`, `Cloudflare AI Search` (RAG), `Cloudflare Vectorize`, `Cloudflare Agents` (Agent class, Code Mode, Payments, MCP tools), `Cloudflare Agent Memory`, `Cloudflare Browser Run` (headless + Playwright GA), `Cloudflare AI Crawl Control`, `VibeSDK` |
| Database | `Cloudflare D1`, `Cloudflare Hyperdrive` (accelerate Postgres/MySQL), `Cloudflare Data Platform` (distributed SQL) |
| Storage | `Cloudflare KV`, `Cloudflare R2` (+`R2 Data Catalog`, `R2 SQL`, `R2 Infrequent Access`), `Cloudflare Cache`, `Cloudflare Cache Reserve`, `Cloudflare Artifacts`, `Cloudflare Durable Objects` |
| Secrets | `Cloudflare Secrets Store` |
| Email | `Cloudflare Email Service`, `Cloudflare Email Routing`, `Cloudflare DMARC Management` |
| Feature Flags | `Cloudflare Flagship` |
| Media / Image | `Cloudflare Images`, `Cloudflare Stream`, `Cloudflare Media Transformations` |
| Background Jobs | `Cloudflare Workflows`, `Cloudflare Queues`, `Cloudflare Cron Triggers`, `Cloudflare Pipelines` |
| Realtime / State | `Cloudflare Durable Objects`, `Cloudflare Realtime`, `Cloudflare RealtimeKit`, `Cloudflare TURN Service`, `Cloudflare MoQ` |
| CDN / Performance | `Cloudflare Cache`, `Cloudflare Argo Smart Routing`, `Cloudflare Smart Shield`, `Cloudflare Speed`, `Cloudflare Waiting Room`, `Cloudflare Load Balancing`, `Cloudflare Health Checks`, `Cloudflare Automatic Platform Optimization` |
| Network | `Cloudflare Tunnel`, `Cloudflare Spectrum`, `Cloudflare Network Interconnect`, `Cloudflare Multi-Cloud Networking`, `Cloudflare BYOIP`, `Cloudflare China Network`, `Cloudflare Workers VPC`, `Cloudflare Privacy Gateway` |
| Security | `Cloudflare WAF`, `Cloudflare DDoS Protection`, `Cloudflare Bots`, `Cloudflare Turnstile`, `Cloudflare Challenges`, `Cloudflare API Shield`, `Cloudflare SSL/TLS` (+`Keyless SSL`, `Geo Key Manager`), `Cloudflare Client-side security`, `Cloudflare Fraud Detection`, `Cloudflare Rate Limiting` (Rules), `Cloudflare Randomness Beacon`, `Cloudflare Key Transparency Auditor` |
| Zero Trust | `Cloudflare One`, `Cloudflare Access`, `Cloudflare Gateway`, `Cloudflare WARP Client`, `Cloudflare Browser Isolation`, `Cloudflare CASB`, `Cloudflare DLP`, `Cloudflare WAN`, `Cloudflare Magic Transit`, `Cloudflare Mesh`, `Cloudflare Digital Experience Monitoring`, `Cloudflare Email security` |
| DNS / Domains | `Cloudflare DNS` (+`Internal DNS`, `DNS Firewall`), `Cloudflare Registrar`, `1.1.1.1`, `Cloudflare Time Services` |
| Observability | `Cloudflare Web Analytics`, `Cloudflare Analytics` (GraphQL Analytics API), `Cloudflare Logs` / `Logpush`, `Cloudflare Log Explorer`, `Cloudflare Workers Logs`, `Cloudflare Network Error Logging`, `Cloudflare Radar`, `Cloudflare Notifications`, `Cloudflare Agent Lee` |
| Tag Management | `Cloudflare Zaraz`, `Google tag gateway` |
| Multi-tenant | `Cloudflare for Platforms`, `Cloudflare for SaaS`, `Cloudflare Tenant` |
| Deploy Tooling | `Wrangler`, `Cloudflare Workers Builds`, `Cloudflare Version Management`, `Remote Bindings` (local → prod), `@cloudflare/vite-plugin`, `@cloudflare/vitest-pool-workers`, `Cloudflare Terraform provider`, `Pulumi` |
| Misc | `Cloudflare Wallets`, `Cloudflare Web3`, `Cloudflare Privacy Pass` / `Privacy Proxy`, `Cloudflare Ruleset Engine`, `Cloudflare Resource Tagging`, `Cloudflare Snippets` |

## Third-Party Services

| Category | TS Default | TS Alternatives | Rust |
|---|---|---|---|
| Auth | `Better Auth` | `WorkOS` (→enterprise SSO), `Supabase` (→BaaS), `Auth.js` | `jsonwebtoken` |
| Payment | `Stripe` | - | `stripe-rust` |
| Email | `Resend` | `Nodemailer`, `Cloudflare Email Service` | `lettre` |
| Feature Flags | `PostHog` | `Cloudflare Flagship` (→edge eval), `Vercel Flags` (→ใน Vercel) | - |
| Realtime DB / BaaS | `InstantDB` | `Supabase` | - |
| AI Agent Monitoring | `Raindrop` (raindrop.ai) | - | - |
| Session Replay | `LogRocket` | - | - |
| IaC | `Pulumi` | `OpenTofu` (→HCL/Terraform-compatible) | - |
| SMS / OTP | `Twilio` (ดู `/follow-service-twilio`) | - | - |
| CI Runner | `RunsOn` (ดู `/follow-service-run-on`) | - | - |
| Deploy Platforms | `Cloudflare Workers` | `NuxtHub` (→Nuxt), `Vercel` (→Next.js), `Railway` (→prototype), `Dokploy`, `Sevalla` (→self-hosted) | - |
| Bookmarking | `raindrop-cli` (`jvm/raindrop-cli`) — ดู `/list-raindrop-favorite`, `/list-recent-bookmark-raindrop`, `/search raindrop` | - | - |
| Secrets Management | `/follow-secret-manager`, `Cloudflare Secrets Store` | - | `/open-web-for-config-secret` |

## Default Must-Have Libraries

- ทุกโปรเจกต์ต้องมี: Database ORM, Validator, Linter, Testing, Package Manager, Git Hooks
- ถ้าเป็น web app: เพิ่ม Router, State Management, Styling, UI Library, Data Fetching
- ถ้าเป็น API: เพิ่ม API Schema, HTTP Client, Auth
- ถ้าเป็น Rust app: เพิ่ม `thiserror`/`anyhow`, `tracing`, `Clap`
- ถ้าเป็น monorepo: เพิ่ม Build System, Documentation
- ถ้ามี AI: เพิ่ม `TanStack AI` (ดู `/follow-lib-tanstack-ecosystem`)
- ถ้ามี desktop: เพิ่ม `Tauri`
- ถ้ามี mobile: เพิ่ม `Capacitor`
- ถ้ามี background daemons/processes: เพิ่ม `pitchfork` (ดู `/follow-tool-pitchfork`)
- ถ้าสร้าง CLI หรือต้องการ completions/docs/manpages: เพิ่ม `usage` (ดู `/follow-tool-usage`)
- ถ้ามี animation/interactive visuals: เพิ่ม `/review-frontend`

## Fast Parser And Bundler

- ใช้ `oxc-parser` แทน `acorn`, `babel`, `typescript` parser สำหรับ JS/TS AST เมื่อต้องการความเร็วสูง
- ใช้ `rolldown`/`rolldown-vite` แทน Rollup/esbuild engine — Vite 8 ใช้ Rolldown เป็น default อยู่แล้ว
- ดู `/follow-tool-rolldown` และ `/follow-tool-eslint` สำหรับ setup และ best practices
- ถ้าใช้ Bun scripts ให้ใช้ `Bun.Transpiler` ก่อน แล้ว fallback ไป `oxc-parser` ถ้าต้องการ AST ละเอียด

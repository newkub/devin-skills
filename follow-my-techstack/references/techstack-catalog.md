# Tech Stack Catalog

Canonical tech stack + default picks per category, grouped by ecosystem —

## How To Select

- Always pick from the `Default` column — unless a `(→ ...)` condition in `Alternatives` matches the project
- If the project has a non-default pick → check whether there's a reason or it's drift — if drift, flag it in the report for the user to decide
- If the wanted library isn't in the table → run `/deep-research dependencies`, then update this catalog

## Core — TypeScript ↔ Rust

| Category | TS Default | TS Alternatives | Rust Default | Rust Alternatives |
|---|---|---|---|---|
| Runtime | `Bun` | - | `Rust` | - |
| Package Manager | `Bun` | `aube` | `Cargo` | - |
| Build Tool | `tsdown`, `Rolldown` (oxc engine) | - | `Cargo` | - |
| JS/TS Parser | `oxc-parser` | - | `oxc_parser` | - |
| Type Checker | `tsc` | - | `rustc` | - |
| Tool Version Manager | `mise` | - | `mise` | - |
| Web Framework | `Elysia` | `Hono` (→CF Workers/multi-runtime), `Nitro` (→in Nuxt) | `Axum` | `Actix Web` |
| Full-stack Framework | `Nuxt 4` (Vue), `TanStack Start` (Solid) | `Astro` (→content site), `SvelteKit` (→Svelte) | `Dioxus` | - |
| Desktop App | `Tauri` | `Native SDK` (→`/follow-lib-native-sdk` — TS+markup AOT, no runtime) | `Tauri` (Rust backend) | `gpui-kit` (→`/follow-lib-gpui-kit`) |
| Mobile App | `Capacitor` | - | - | - |
| ORM | `Drizzle` | - | `SQLx` | `SeaORM` (→need full ORM) |
| SQL / KV Driver | `postgres`, `ioredis` | - | `sqlx`, `fred` | - |
| Database Migration | `drizzle-kit` | - | `SQLx` migrations | - |
| API Schema | `oRPC` + `Zod` (see `/follow-lib-orpc`) | - | `Serde` + `Axum` extractors | - |
| API Docs | `Scalar` | `Redocly` (→docs-as-code) | `utoipa` | `aide` |
| SDK Generation | `Stainless` | - | - | - |
| Validator | `Zod` | `Valibot` (→bundle/edge), `ArkType` (→perf) | `garde` | `validator`, `nutype` (→domain newtypes) |
| Serialization | - | - | `Serde` | `rkyv` |
| Router | `TanStack Router` | `Vue Router` (→in Nuxt) | `Axum` router | - |
| Data Fetching | `TanStack Query` | `pinia-colada` (→light Vue) | `reqwest` | - |
| Caching | `TanStack Query` cache | - | `moka` | - |
| Markdown | `marked` + `shiki` | `markdown-it`, `comark` | `pulldown-cmark` | `comrak`, `syntect` (→highlight) |
| i18n | `vue-i18n` (`@intlify/*`) | - | `fluent` | - |
| CLI Framework | `citty` (+`usage` spec) | `cac`, `commander`, `TanStack CLI` | `Clap` | - |
| TUI | `OpenTUI` (+`tuiparts`) | - | `Ratatui` | `crossterm` |
| Async Runtime | - | - | `Tokio` | - |
| Effect System | `effect` (see `/follow-lib-effect-ts`) | - | idiomatic: `tokio`+`thiserror`/`anyhow`+`tracing` | `id_effect` (→Effect DX), `effect-rs` (alpha) |
| Error Handling | `neverthrow` | `effect` typed errors (→adopt Effect) | `thiserror` (lib), `anyhow` (app) | `miette` (→rich diagnostics) |
| Retry / Resilience | `effect` Schedule | - | `backon` | `again` |
| Concurrency | `Promise` pool | worker threads | `tokio` `JoinSet` | `rayon` (→CPU parallel), `dashmap`, `parking_lot`, `crossbeam` |
| Stream | `effect` Stream | `rxjs` | `futures` + `tokio-stream` | `async_stream` |
| STM | `effect` STM | - | `stm` | `async-stm` |
| HTTP Client | `ofetch` | `ky`, `fetch` (→no dep needed) | `reqwest` | `ureq` (→blocking/light) |
| HTTP Mocking | `msw` | `emulate` (→local API emulation) | `wiremock` | - |
| Logging | `pino` (prod) | `consola` (→dev/CLI pretty) | `tracing` | - |
| Observability | `OpenTelemetry` + `SigNoz` (see `/follow-service-signoz`) | `Parca` (→profiling) | `tracing-opentelemetry` | `opentelemetry` |
| MCP Server | `@modelcontextprotocol/sdk` | - | `rmcp` | - |
| Web Scraping | `fastCRW` | `Spider` (→hosted crawler) | `scraper` | - |
| Date / Time | `date-fns` | `Temporal` (→new project) | `jiff` | `time` |
| Config / Env | `c12` | `unconfig`, `dotenv` | `figment` | `config-rs`, `dotenvy` |
| Utilities | `es-toolkit`, `ts-pattern` | `pathe`, `defu`, `ufo`, `nanoid`, unjs: `jiti`, `giget`, `scule`, `mlly`, `ohash`, `nypm` | `itertools`, `derive_more`, `bon`, `camino` | `uuid`, `ulid`, `secrecy`, `zeroize` |
| Local DB / IndexedDB | `Dexie` | - | - | - |
| LLM Inference | - | - | `mistral.rs` | - |
| Agent Sandbox | `Cloudflare Sandbox SDK` | `Beam` (→hosted) | - | - |
| AI Memory | `Cloudflare Agent Memory` | `supermemory` (→hosted) | - | - |
| Linter | `Biome` | `Oxlint` (→big repo/speed), `ESLint` (→compat) | `Clippy` | - |
| Formatter | `Biome` | `dprint` (→other languages), `oxfmt` (→oxc formatter, new) | `rustfmt` | `dprint` |
| Code Search | `ast-grep` | `GritQL` (→in Biome), `Semgrep` (→security) | `ast-grep` | - |
| Dep Hygiene | `Knip` (unused) | `madge` (circular), `publint` + `attw` (package lint) | `cargo-udeps` | `cargo-modules` |
| Testing | `Vitest` + `Playwright` | `happy-dom` (→DOM env) | `cargo-nextest` | `insta` (→snapshot), `proptest` (→property) |
| E2E (Mobile/UI) | `Playwright` (→web, `/follow-tool-playwright`) | `Maestro` (→Android/iOS/web YAML flows + MCP, `/follow-tool-maestro`), `e2e` (→agentic, `/follow-tool-e2e`) | - | - |
| Visual Testing | `Argos` (see `/follow-tool-argos`) | Playwright `toHaveScreenshot` (→committed snapshots) | `insta` (→snapshot) | - |
| Security Audit (agent) | `security-audit-skill` (→Cloudflare multi-phase audit, `/follow-tool-security-audit-skill`) | `deepsec` (→CI scan pipeline, `/follow-tool-deepsec`) | - | - |
| Mutation Testing | `Stryker` | - | `cargo-mutants` | - |
| Benchmark | `mitata` | Vitest bench, `hyperfine` (→CLI) | `criterion` | `divan` |
| Code Coverage | `v8` (via Vitest) | - | `cargo-llvm-cov` | `tarpaulin` |
| Build System | `Moonrepo` (→mixing Rust+TS) | `Turborepo` (→pure TS) | `Cargo` workspaces | - |
| Git Hooks | `moon vcs.hooks` (moonrepo) / `hk` (non-moon) | - | `moon vcs.hooks` / `hk` | - |
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
| Bundler | `Rolldown` | `rolldown` (standalone bundler), `vite@^8` (Rolldown engine built in — the `rolldown-vite` preview is retired) |
| Library Bundler | `tsdown` | - |
| Unified Toolchain | - | `Vite+` (→want an all-in-one, still new) |
| Dev Server / HMR | `Vite` | - |
| Test Runner | `Vitest` | `@cloudflare/vitest-pool-workers` (→test Workers) |
| Docs | `VitePress` | `Slidev` (→slides), `Astro` (→content site) |
| Browser Extension | `WXT` | - |
| Universal Plugin API | `unplugin` | `unplugin-auto-import`, `unplugin-vue-components`, `unplugin-icons` |
| Plugin Authoring | `withFilter` (Rolldown hook filter) | native plugins (`enableNativePlugin`, experimental) |
| Common Plugins | - | `@cloudflare/vite-plugin` (→Workers in Vite), `vite-plugin-pwa`, `vite-tsconfig-paths`, `vite-plugin-devtools` |
| Native Speed | `lightningcss` (CSS) | `oxfmt` (format) |
| Bundle Analysis | `sonda` | `bundlewatch` |
| Inspect / Debug | `vite-plugin-inspect` | `node-modules-inspector` |
| DevTools Framework | `@vitejs/devtools` (→`/follow-tool-vite-devtools`) | `@vitejs/devtools-kit` (→author integrations), `devframe` (→framework-neutral, `/follow-tool-devfra`), `wrikka-vite-devtools` (→project-specific dock, `/use-wrikka-vite-devtools`) |

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
| Content / Docs | `Nuxt Content` | `Docus` (→docs site), `Velite` (→outside Nuxt) |
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
| AI | `TanStack AI` (see `/follow-lib-tanstack-ecosystem`) | - |
| Charts | `TanStack Charts` | - |
| Highlight | `TanStack Highlight` | - |
| Markdown | `TanStack Markdown` | - |

## TypeScript Libraries (General)

| Category | Default | Alternatives |
|---|---|---|
| Utilities | `remeda` (see `/follow-lib-remedajs`) | `es-toolkit`, `radash`, `lodash-es` |
| Styling | `UnoCSS` | `TailwindCSS` |
| Icons | `@iconify-json/*` | - |
| Animation / Interactive | `animejs` | `Motion` (→spring UI), `GSAP` (→complex timeline), `Lottie`, `Rive` (→designer assets) |
| ESM CDN | `esm.sh` (see `/follow-lib-esm-sh`) | - |
| PDF | `pdfkit` (see `/follow-lib-pdfkit`) | - |
| QR Code | `qrcode` (see `/follow-lib-qrcode`) | - |
| JWT / JWK | `jose` (see `/follow-lib-jose`) | - |
| OTP / 2FA | `otplib` (see `/follow-lib-otplib`) | - |
| Passkeys / WebAuthn | `simplewebauthn` (see `/follow-lib-simplewebauthn`) | - |
| AI SDK | `openai` (see `/follow-lib-openai`), `claude-agent-sdk` (see `/follow-service-claude-agent-sdk`) | - |
| Diagram (interactive) | `archify` (→agent skill, standalone HTML artifact, see `/follow-tool-archify`) | `mermaid` (→inline docs, `/create-mermaid-diagram`), `excalidraw`/`tldraw` (→whiteboard) |

## Rust Ecosystem

| Category | Default | Alternatives |
|---|---|---|
| CLI UX | `cliclack`, `indicatif` | `inquire`, `dialoguer`, `comfy-table`, `console` |
| Service Middleware | `tower`, `tower-http` | - |
| Actor Framework | `ractor` | `kameo` |
| DataFrame / Arrow | `polars` | `arrow` |
| Cross-platform UI | `Dioxus` (see `/follow-create-cross-dioxus`) | - |
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
| Deploy Tooling | `Wrangler`, `Cloudflare Workers Builds`, `Cloudflare Version Management`, `Remote Bindings` (local → prod), `@cloudflare/vite-plugin`, `@cloudflare/vitest-pool-workers`, `Cloudflare Terraform provider`, `Pulumi`, `workers-rs` (→100% Rust Workers, see `follow-service-cloudflare/references/workers-rs.md`) |
| Misc | `Cloudflare Wallets`, `Cloudflare Web3`, `Cloudflare Privacy Pass` / `Privacy Proxy`, `Cloudflare Ruleset Engine`, `Cloudflare Resource Tagging`, `Cloudflare Snippets` |

## Third-Party Services

| Category | TS Default | TS Alternatives | Rust |
|---|---|---|---|
| Auth | `Better Auth` | `WorkOS` (→enterprise SSO), `Supabase` (→BaaS), `Auth.js` | `jsonwebtoken` |
| Payment | `Stripe` | - | `stripe-rust` |
| Email | `Resend` | `Nodemailer`, `Cloudflare Email Service` | `lettre` |
| Feature Flags | `PostHog` | `Cloudflare Flagship` (→edge eval), `Vercel Flags` (→in Vercel) | - |
| Realtime DB / BaaS | `InstantDB` | `Supabase` | - |
| AI Agent Monitoring | `Raindrop` (raindrop.ai) | - | - |
| Session Replay | `LogRocket` | - | - |
| IaC | `Pulumi` | `OpenTofu` (→HCL/Terraform-compatible) | - |
| SMS / OTP | `Twilio` (see `/follow-service-twilio`) | - | - |
| CI Runner | `RunsOn` (see `/follow-service-run-on`) | - | - |
| Deploy Platforms | `Cloudflare Workers` | `NuxtHub` (→Nuxt), `Vercel` (→Next.js), `Railway` (→prototype), `Dokploy`, `Sevalla` (→self-hosted) | - |
| Bookmarking | `raindrop-cli` (`jvm/raindrop-cli`) — see `/list-raindrop-favorite`, `/list-recent-bookmark-raindrop`, `/search-raindrop` | - | - |
| Secrets Management | `/follow-secret-manager`, `Cloudflare Secrets Store` | - | `/open-web-for-config-secret` |
| SEO Platform | `OpenSEO` (→MIT self-host, BYO DataForSEO usage key — see `/follow-tool-openseo`) | Hosted `openseo.so` (→subscription, non-free) | - |

## Default Must-Have Libraries

- Every project must have: Database ORM, Validator, Linter, Testing, Package Manager, Git Hooks
- If it's a web app: add Router, State Management, Styling, UI Library, Data Fetching
- If it's an API: add API Schema, HTTP Client, Auth
- If it's a Rust app: add `thiserror`/`anyhow`, `tracing`, `Clap`
- If it's a monorepo: add Build System, Documentation
- If it has AI: add `TanStack AI` (see `/follow-lib-tanstack-ecosystem`)
- If it has desktop: add `Tauri` (webview shell) or `Native SDK` (native AOT, no runtime — see `/follow-lib-native-sdk`)
- If it has mobile: add `Capacitor`, plus `Maestro` for E2E (see `/follow-tool-maestro`)
- If it has background daemons/processes: add `pitchfork` (see `/follow-tool-pitchfork`)
- If building a CLI or needing completions/docs/manpages: add `usage` (see `/follow-tool-usage`)
- If it has animation/interactive visuals: add `/deep-review`

## Fast Parser And Bundler

- Use `oxc-parser` instead of the `acorn`, `babel`, `typescript` parsers for JS/TS AST when you need high speed
- Use `rolldown` instead of the Rollup/esbuild engine — Vite 8 already uses Rolldown as the default (upgrade `vite` directly, no need for the `rolldown-vite` preview)
- See `/follow-tool-rolldown` and `/follow-tool-eslint` for setup and best practices
- If using Bun scripts, use `Bun.Transpiler` first, then fall back to `oxc-parser` if you need a detailed AST

---
name: follow-architecture
description: Choose and apply an architecture pattern — Clean for multi-app, Layered for a single app
argument-hint: "[target-path | clean | layered]"
related:
  - refactor
  - deep-review
  - scan-codebase
  - ask-me
  - update-references
  - run-check
  - report-before-after

---

## Goal

Single entry point for architecture restructure — pick the pattern that fits the target: **Layered** (flat type-grouped — merged inline here) for a single app, **Clean** (`modules/{domain,features,ports,adapters}` — merged inline here) for multiple unified apps / `packages/*` / `crates/*`

## Scope

- Use when restructuring a codebase/package/app by an architecture pattern — dispatched from `/refactor` architecture scope and `/restructure`, plus other callers
- Full pattern detail (SSOT): `/deep-review` `## Pattern Guides` → `references/pattern-clean.md`, `references/pattern-layered.md`
- File structures (canonical): Clean → [templates/file-structure-clean.md](templates/file-structure-clean.md); Layered → [templates/file-structure-layered.md](templates/file-structure-layered.md)
- Stack-specific file structures — canonical owner per target (never copy a structure here):

  Web:

  | Target | Owner skill | Template |
  |--------|-------------|----------|
  | Web (dispatcher — picks the framework) | `/follow-create-web` | — |
  | Next.js App Router | `/follow-create-web-nextjs` | `templates/file-structure-web-nextjs.md` |
  | Nuxt | `/follow-create-web-nuxt` | `templates/file-structure-web-nuxt.md` |
  | SvelteKit | `/follow-create-web-svelte` | `templates/file-structure-web-svelte.md` |
  | SolidStart | `/follow-create-web-solidstart` | See skill (structure in SKILL.md) |
  | Solid SPA + TanStack Router | `/follow-solid-framework` | `templates/file-structure-web-solid-spa.md` |
  | TanStack Start + Nitro → CF Workers | `/follow-solid-framework` | `templates/file-structure-web-solid-start.md` |
  | Vite SPA | `/follow-tool-vite` | `templates/file-structure-web-vite-spa.md` |
  | Docs site | `/follow-create-web-docs` | See skill |
  | WebMCP (page tools) | `/follow-create-web-mcp` | See skill |
  | Rust WASM | `/follow-create-web-wasm` | See skill |

  Mobile and Desktop:

  | Target | Owner skill | Template |
  |--------|-------------|----------|
  | Mobile (dispatcher) | `/follow-create-mobile` | — |
  | Capacitor cross-platform | `/follow-create-mobile-cross-with-capacitor` | See skill |
  | iOS + Android native (KMP) | `/follow-create-ios-android-native-by-kotlin-multiplatform` | See skill |
  | Tauri desktop | `/follow-create-desktop-tauri` | See skill |
  | Dioxus cross-platform | `/follow-create-cross-dioxus` | See skill |

  CLI and TUI:

  | Target | Owner skill | Template |
  |--------|-------------|----------|
  | CLI (dispatcher) | `/follow-create-cli` | `templates/file-structure-cli.md` |
  | Bun CLI | `/follow-create-bun-cli` | See skill |
  | Rust CLI | `/follow-create-rust-cli` | See skill |
  | Rust crate (library) | `/follow-create-rust-crate` | See skill |
  | TUI (Ratatui) | `/follow-create-tui-ratatui` | See skill |
  | Nushell module | `/follow-create-nushell-plugin` | See skill |
  | PowerShell module | `/follow-create-powershell-module` | See skill |
  | Library package (TS) | `/follow-tool-tsdown` | `templates/file-structure-lib.md` |

  Plugin and Extension:

  | Target | Owner skill | Template |
  |--------|-------------|----------|
  | Plugin (dispatcher) | `/follow-create-plugins` | `templates/file-structure-plugins.md` |
  | Vite plugin | `/follow-create-vite-plugin` | See skill |
  | Rolldown plugin | `/follow-create-rolldown-plugin` | See skill |
  | Bun plugin | `/follow-create-bun-plugin` | See skill |
  | Nitro plugin | `/follow-create-nitro-plugin` | See skill |
  | Elysia plugin | `/follow-create-elysia-plugin` | See skill |
  | Biome plugin | `/follow-create-biome-plugin` | See skill |
  | ESLint plugin | `/follow-create-eslint-plugin` | See skill |
  | Oxlint plugin | `/follow-create-oxlint-plugin` | See skill |
  | Vitest plugin | `/follow-create-vitest-plugin` | See skill |
  | Storybook addon | `/follow-create-storybook-addon` | See skill |
  | Tauri plugin | `/follow-create-tauri-plugin` | See skill |
  | VS Code extension | `/follow-create-vscode-extensions` | See skill |
  | Browser extension (WXT) | `/follow-create-browser-extensions-wxt` | See skill |
  | Obsidian plugin | `/follow-create-obsidian-plugin` | See skill |
  | Neovim plugin | `/follow-create-nvim-plugin` | See skill |
  | Zed extension | `/follow-create-zed-extensions` | See skill |
  | Raycast extension | `/follow-create-raycast-extensions` | See skill |
  | Claude Code plugin | `/follow-create-claude-plugin` | See skill |
  | Codex plugin | `/follow-create-codex-plugin` | See skill |
  | Devin CLI plugin | `/follow-create-devin-plugin` | See skill |

  Bot and Service:

  | Target | Owner skill | Template |
  |--------|-------------|----------|
  | Bot (dispatcher) | `/follow-create-bot` | — |
  | Discord bot | `/follow-create-bot-discord` | See skill |
  | GitHub bot | `/follow-create-bot-github` | See skill |
  | GitHub App | `/follow-create-bot-github-app` | See skill |
  | LINE bot | `/follow-create-bot-line` | See skill |
  | Slack bot | `/follow-create-bot-slack` | See skill |
  | Telegram bot | `/follow-create-bot-telegram` | See skill |
  | SDK / client library | `/follow-create-sdk` | `templates/file-structure-sdk.md` |
  | MCP server | `/follow-create-mcp` | See skill |
  | Docker image | `/follow-create-docker` | See skill |
  | GitHub Action | `/follow-create-github-action` | See skill |
  | Product scaffold | `/follow-create-product` | See skill |
  | Slidev deck | `/follow-create-slide-slidev` | See skill |
  | Devin project skills | `/follow-create-devin-project-skills` | See skill |

- Microservices are out of scope — read `/deep-review` `### Pattern: Microservices Architecture` directly

## Execute

### 1. Detect Target

> Goal: know what the target is and how many apps it has

1. Run `/scan-codebase` at the root — identify `apps/*`, `packages/*`, `crates/*`, and the target the user specifies
2. Count app entry points and check for shared domain/modules that several apps must use together (unified support)
3. Argument `clean`/`layered` → pick that pattern directly, skipping the selection table

### 2. Select Pattern

> Goal: pick the single pattern that fits the target

| No. | Condition | Pattern | Where |
|-----|-----------|---------|-------|
| 1 | Several `apps/*` need unified support — share `modules/`/`core/`/`contracts/` across entry points | Clean | inline `### Pattern: Clean` below |
| 2 | `packages/*`, `crates/*` (shared libs, domain packages) | Clean | inline `### Pattern: Clean` below |
| 3 | A single app — one `apps/*` or a single-app project | Layered | inline `### Pattern: Layered` below |
| 4 | Other targets — high testability/domain-heavy → Clean; UI-driven/CRUD → Layered | by code character | accordingly |

- Unclear → run `/ask-me` before choosing
- Never mix patterns in one target — handle one target at a time
- Target matches a stack in the `## Scope → Stack-specific` table → use that stack's template as the canonical file structure (layered variants — same rules as the main pattern)

### Pattern: Layered (merged from `/follow-layered-arch`)

> Goal: a single app as a flat type-grouped structure — dependencies point one way down, no bypassing

**Prepare**

1. Run `/scan-codebase` on the target — identify routes/pages, business logic, data access
2. Read `/deep-review` `references/pattern-layered.md` — the canonical guide (variants, boundaries)
3. Read [templates/file-structure-layered.md](templates/file-structure-layered.md) — canonical flat structure + layer table (the Required column marks mandatory/optional folders)
4. Identify the current public API and route entry points — they must be preserved
5. Plan the folder mapping: presentation → `app/`+`components/`+`hooks/`; domain → `usecases/`+`services/`+`features/`; data → `infra/`+`lib/`; shared leaves → `types/`+`constants/`+`utils/`+`config/`

**Restructure**

1. Create flat type-grouped folders per the template — never nest by capability; prefix file names with the domain (`user-service.ts`)
2. Move UI/routes → `app/`+`components/`+`hooks/`; use cases → `usecases/`; business rules → `services/`+`features/`; persistence/external calls → `infra/`+`lib/`; pure helpers → `utils/`/`types/`/`constants/` — run `/refactor` one move at a time
3. If concerns are mixed in one file (handler + logic + query) → run `/refactor` `### /separate-of-concerns` (merged) to split concerns before assigning layers
4. Enforce dependencies: presentation → domain → data only; `app/` calls `usecases/`/`features/` only; public API through the `index` barrel
5. Align tests per layer; run `/update-references` + `/refactor` structure scope after each move batch

**Verify**

1. Check there is no layer bypass (presentation calling `infra/`/`lib/` directly) and no cross-layer deep imports — run `madge` for circular deps if present
2. Run `/run-check` and the tests; run `/report-before-after`

### Pattern: Clean (merged from `/follow-clean-arch`)

> Goal: the target becomes Clean Architecture — pure domain core, application orchestration, ports & adapters — dependency direction `core` ← `modules` ← `adapters`/`infra` ← `app`

**Prepare**

1. Run `/scan-codebase` on the target — identify domain logic, side effects, external deps
2. Read `/deep-review` `references/pattern-clean.md` — the canonical guide (structure, rules, splitting thresholds)
3. Read [templates/file-structure-clean.md](templates/file-structure-clean.md) — canonical file structure + layer table
4. Identify the current public API (barrel `index`, exported symbols) — it must be preserved
5. Find the package's consumers — keep `/update-references` in the plan

**Restructure**

1. Create the structure per [templates/file-structure-clean.md](templates/file-structure-clean.md): `modules/<name>/{domain,usecases?,features,ports,adapters}` + `index.ts`, `core/` (primitives + `ports/`), `adapters/`, `infra/`, `contracts/`, `config/`, entry/composition in `app/` — run `/refactor` one move at a time
2. Move pure logic → `modules/*/domain/` + `core/`; application use cases called by `app/` → `modules/*/usecases/`; feature orchestration → `modules/*/features/`; interfaces → `ports/`; IO/framework → `infra/` + `adapters/`
3. If concerns are mixed in one file (logic + IO + config) → run `/refactor` `### /separate-of-concerns` (merged) to split concerns before assigning layers
4. Define the ports (interfaces) that `features/` needs — adapters/infra implement them; wire everything at the `app/runtime.ts` composition root
5. Run `/update-references` + `/refactor` structure scope after each move batch

**Verify**

1. Check there are no imports from `core/`/`modules/*/domain`/`features` into `infra/`/`adapters/` — run `madge` for circular deps if present
2. Run `/run-check` (lint/typecheck) and the package tests; run `/report-before-after`

**Clean rules**

- `domain/` + `core/` must stay pure — no IO, framework imports, or side effects; no `fx/` layer — side effects live in `infra/` and are orchestrated through `features/` (+ `usecases/` when present) + ports; the `usecases → features → domain` direction must never be reversed
- Public API through `index` only — no deep imports across layer/module from outside; modules talk to each other through `contracts/` or ports

### 3. Apply And Verify

> Goal: the restructure succeeds and the boundaries are correct

1. Layered → follow `### Pattern: Layered` above; Clean → follow `### Pattern: Clean` above
2. If mixed concerns are found during the moves (logic + IO + config in one file) → run `/refactor` `### /separate-of-concerns` (merged) to split concerns before assigning layers
3. After each target → run `/update-references` + `/run-check` before the next target
4. Run `/report-before-after` once every target is done

## Rules

- Single entry point — every architecture restructure picks its pattern through this skill
- Never duplicate pattern detail — canonical: Layered = `### Pattern: Layered` + `templates/file-structure-layered.md`; Clean = `### Pattern: Clean` + `templates/file-structure-clean.md` here; pattern guides = `/deep-review` `references/pattern-*.md`
- Always preserve the original behavior and public API — tests must pass as before the restructure

## Expected Outcome

- The target is restructured with the fitting pattern — multi-app unified/`packages/`/`crates/` = Clean, single app = Layered (flat type-grouped)
- No circular dependencies; the original public API still works
- Passes `/run-check` and the tests

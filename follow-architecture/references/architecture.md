# Follow Architecture — Pattern Selection & Restructure

Detail reference for `/follow-architecture` — single source for architecture restructure: pick the pattern that fits the target, then apply it. Layered (flat type-grouped) for a single app, Clean (`modules/{domain,usecases,features,ports,adapters}`) for multiple unified apps / `packages/*` / `crates/*` — applied via `/refactor` `### 4. Architecture Refactor` (arguments `clean`/`layered`)

> Pre-Run: run `/scan-codebase` + `/deep-review` (dimension `review-architecture`) on the target first — never restructure from a guess; microservices and distributed topology are out of scope here

## Canonical Pointers

- Pattern guides with canonical file structures + layer tables (SSOT ของ pattern detail): Clean → `follow-architecture/references/follow-clean-arch.md`; Layered → `follow-architecture/references/follow-layered-arch.md` (`## Guide` ของแต่ละ guide)
- Selection convention + boundary rules: `/follow-architecture` (`## Execute` `### 2`, `## Rules` `### 2`)
- Never copy a stack's file structure here — the owner skill holds it:

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

## 1. Detect Target

> Goal: know what the target is and how many apps it has

1. Run `/scan-codebase` at the root — identify `apps/*`, `packages/*`, `crates/*`, and the target the user specifies
2. Count app entry points and check for shared domain/modules that several apps must use together (unified support)
3. Argument `clean`/`layered` → pick that pattern directly, skipping the selection table

## 2. Select Pattern

> Goal: pick the single pattern that fits the target

| No. | Condition | Pattern | Where |
|-----|-----------|---------|-------|
| 1 | Several `apps/*` need unified support — share `modules/`/`core/`/`contracts/` across entry points | Clean | `## 3. Pattern: Clean` |
| 2 | `packages/*`, `crates/*` (shared libs, domain packages) | Clean | `## 3. Pattern: Clean` |
| 3 | A single app — one `apps/*` or a single-app project | Layered | `## 4. Pattern: Layered` |
| 4 | Other targets — high testability/domain-heavy → Clean; UI-driven/CRUD → Layered | by code character | accordingly |

- Unclear → run `/ask-me` before choosing; never mix patterns in one target — handle one target at a time
- Target matches a stack in the `## Canonical Pointers` table → use that stack's template as the canonical file structure (layered variants — same rules as the main pattern)

## 3. Pattern: Clean

> Goal: the target becomes Clean Architecture — pure domain core, application orchestration, ports & adapters — dependency direction `core` ← `modules` ← `adapters`/`infra` ← `app`

1. Read the pattern guide `follow-architecture/references/follow-clean-arch.md` (read by `/refactor architecture clean`) — its `## Execute` covers prepare → restructure → verify; canonical file structure + layer table live in its `## Guide`
2. Selection rationale + boundary rules → `/follow-architecture` — never duplicate its detail here

## 4. Pattern: Layered

> Goal: a single app as a flat type-grouped structure — dependencies point one way down, no bypassing

1. Read the pattern guide `follow-architecture/references/follow-layered-arch.md` (read by `/refactor architecture layered`) — its `## Execute` covers prepare → restructure → verify; canonical flat structure + layer table live in its `## Guide`
2. Selection rationale + boundary rules → `/follow-architecture` — never duplicate its detail here

## Rules

### 1. Single Entry

- Every architecture restructure picks its pattern through `/follow-architecture` and applies through `/refactor` architecture scope — this file is the detail, the pattern guides' `## Guide` hold the canonical structures, the owner skill holds the stack template
- Never duplicate pattern detail — canonical: Layered = `follow-architecture/references/follow-layered-arch.md`; Clean = `follow-architecture/references/follow-clean-arch.md` (file structure + layer table in each `## Guide`)

### 2. Boundaries

- `domain/` + `core/` must stay pure — no IO, framework imports, or side effects; no `fx/` layer — side effects live in `infra/` and are orchestrated through `features/` (+ `usecases/` when present) + ports; the `usecases → features → domain` direction must never be reversed
- Public API through `index` only — no deep imports across layer/module from outside; modules talk to each other through `contracts/` or ports

### 3. Behavior

- Always preserve the original behavior and public API — tests must pass as before the restructure; one pattern per target, one move batch per `/update-references` + `/run-check` cycle

## Expected Outcome

- The target is restructured with the fitting pattern — multi-app unified/`packages/`/`crates/` = Clean, single app = Layered (flat type-grouped)
- No circular dependencies; the original public API still works
- Passes `/run-check` and the tests; `/report-before-after` shows the old → new layer map

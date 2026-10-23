---
name: follow-architecture
description: Pick and apply the architecture pattern — Clean, Layered, monorepo layout, workspace file structures
argument-hint: "[clean | layered | monorepo | architecture | target]"
related:
  - refactor
  - update-agents-skills-global
  - deep-review
  - scan-codebase
  - relocation
  - rename
  - follow-monorepo
  - update-references
  - run-check
  - follow-tool-madge
  - report-before-after
  - ask-me
  - improve
  - update-agents-md
  - update-astgrep-rules
---

## Goal

Pick the one architecture pattern that fits the target from evidence, then apply it — or record that the existing layout already holds; never restructure from a guess; microservices and distributed topology are out of scope

## Scope

> Invoked as `/follow-architecture` — the architecture SSOT dispatched by `/refactor` for architecture scopes (`### 2` item 6 plans it, `### 3` item 7 hands it here); pattern selection lives here, the pattern guides live in `references/`

| Argument | Seen When | Run |
|----------|-----------|-----|
| (none), `target`, `architecture` | target needs an architecture — the argument `/refactor` passes on | `### 1` → `### 4` full path |
| `clean` | ≥2 entry points share a domain, `packages/*`, `crates/*`, or ≥3 bounded contexts | `### 2` answered as Clean → `references/clean-arch.md` |
| `layered` | a single deployable with one bounded context | `### 2` answered as Layered → `references/layered-arch.md` |
| `monorepo` | repo root holds several workspaces | `## Monorepo Architecture` first, then per-workspace pattern |

An explicit argument answers `### 2` only — `### 1` (evidence + baseline), `### 3` (apply) and `### 4` (verify) always run.

Handed off elsewhere: microservices/distributed topology (see `## Goal`) · the target is a skill package → `/update-agents-skills-global refactor` · folder move only → `/relocation` · naming only → `/rename` · boundary checking without a restructure → `/deep-review` dimension `architecture`

## Execute

### 1. Detect Target

> Goal: know what the target is and how many entry points and bounded contexts it has — never restructure on an unmeasured baseline

1. Baseline first, inherited from `/refactor` `### 1`: clean working tree, `/run-verify` green, characterization tests wherever the target's public behaviour is uncovered, and `git rev-parse HEAD` recorded for the `### 4` comparison
2. Run `/scan-codebase` at the root — identify `apps/*`, `packages/*`, `crates/*`, and the target the user specifies
3. Read what the project already decided: its `AGENTS.md` `Follow Architecture` section + `.devin/rules/` — a recorded pattern is repaired, not re-picked; write back at `### 4`
4. Count deployable entry points — a CLI that is one entry among `api`+`worker`+`cron` is not a single app; check whether several entry points must share one domain (unified support)
5. Count bounded contexts and external volatility — group the domain into its real contexts; list the external systems (providers, queues, storage) and how often each changes; a system behind a port is only worth it when it is volatile or must be faked in tests
6. `/deep-review` dimension `architecture` on the target — the reversed edges and leaked imports are the whole case for moving anything; no violated edge → `### 2` row 0 answers KEEP and the work stops; explicit `clean`/`layered` argument → that pattern, skipping `### 2`

### 2. Select Pattern

> Goal: pick the single pattern that fits the target — or prove that no move is owed

| No. | Condition | Verdict |
|-----|-----------|---------|
| 0 | `### 1` evidence shows the direction holds (0 reversed edges, 0 leaked imports) and the layout is already lived in | KEEP this variant — record it in `AGENTS.md`, stop before `### 3` |
| 1 | ≥2 deployable entry points share a domain/code — in one repo or several workspaces | Clean → `references/clean-arch.md` |
| 2 | Target is a shared `packages/*` / `crates/*` library | Clean subset → `references/clean-arch.md` `## Shared Package Variant` |
| 3 | A single deployable with 1 bounded context — thin rules, UI-driven or CRUD-shaped, stable integrations | Layered → `references/layered-arch.md` |
| 4 | A single deployable with ≥3 bounded contexts, or ≥2 volatile external systems / test isolation needs | Clean → `references/clean-arch.md` |
| 5 | A single deployable with 2 bounded contexts | Layered with per-domain `features/`; upgrade on measured change amplification |
| 6 | Dev tool / one-off script (`tools/*`) | No pattern — flat, skip `### 3` |

1. Read the table top-down — row 0 is the evidence gate, rows 1–2 are mechanical, rows 3–5 are judgement driven by entry points, bounded-context count and external volatility; still unclear → run `/ask-me` before choosing, never mix patterns in one target — handle one target at a time
2. Repo topology is orthogonal — single repo vs monorepo never selects the pattern: `## Monorepo Architecture` decides workspace layout only, and every workspace runs `### 2` independently; an `apps/*` workspace that is one deployable with one context answers row 3
3. Target matches a row of `## File Structure By Workspace Type` → the owner skill's template is canonical for that stack; apply the chosen reference's Layer Table + Rules to its folders instead of the tree there — carry the direction, not the folder names
4. Bulk scope → `/create-plan-in-dot-agents` first; while planning run `/use-lib-effective` — reuse before writing anything new

### 3. Apply The Pattern

> Goal: restructure through the chosen reference, one batch at a time

1. Read `references/clean-arch.md` or `references/layered-arch.md` — per the `### 2` verdict — and follow its `## Restructure` steps; shared packages follow `## Shared Package Variant`
2. Mixed concerns found during a move → fix them with `/refactor` `### 3` item 2 (`concerns`) first — not the whole step, whose item 7 dispatches back here
3. After each move batch → `/update-references` + `/run-check` green before the next; red → rollback that batch

### 4. Verify Pattern Real

> Goal: the pattern stays real in code, not just folder names — and it is provable

1. Boundaries hold: `core/` + `modules/*/domain/` (Clean) or `types/` + `utils/` (Layered) stay pure — no IO, no framework imports; `services/` performs no IO either but reaches data through `infra/` interfaces, while `types/` + `utils/` stay leaves; dependency direction never reversed; public API through barrels only, no deep imports from outside
2. `/follow-tool-madge` (no circular) + `/deep-review` dimension `architecture` vs baseline; tests pass as before, original public API still works
3. Persist the boundary so it stays enforced: import-direction rules → `/update-astgrep-rules` (`rules/architecture/` + `rules/dependencies/`), chosen pattern → the target's `AGENTS.md` `Follow Architecture` section via `/update-agents-md`
4. `/report-before-after` with the old → new layer map, diffed against the `### 1` baseline SHA — the reversed-edge count before and after is the number that proves the move

## Monorepo Architecture

> Goal: repo-level layout only — it never picks the pattern; conventions/tooling verified by `/follow-monorepo`

```text
repo/
├─ apps/<name>/       # Deployable entry points (web, api, worker, cli) — each picks its own pattern
├─ packages/<name>/   # Shared TS libs (domain, ui, config) — Clean-shaped, no app/ layer inside
├─ crates/<name>/     # Shared Rust libs — same role as packages/ (one Cargo workspace)
├─ tools/<name>/      # Internal dev scripts/CLIs — never shipped, never imported by packages/
├─ infra/             # Deploy/observability config — not a workspace
├─ docs/              # root docs only — test specs stay per workspace at apps/<name>/specs/ (/update-specs)
└─ package.json | Cargo.toml | moon.yml / turbo.json   # workspace manifests + task orchestrator
```

1. Workspace types: `app` (leaf — may import shared), `package`/`crate` (shared, Clean internals), `tool` (dev-only); dependencies flow apps → shared → nothing — shared packages are leaves (`/follow-tool-madge` proves no cycles)
2. Every workspace runs `### 2` on its own — a single-context app answers row 3 (Layered), a multi-context app answers row 4 (Clean), a package answers row 2 (Clean subset); the repo being a monorepo changes none of those answers
3. Extract to `packages/`/`crates/` only with ≥2 real consumers — coincidental similarity stays duplicated (`/refactor` shared bullet)
4. Task graph, version/type catalogs, CI, workspace conventions → `/follow-monorepo`; new dep choice for a layer → `/follow-my-techstack`

## File Structure By Workspace Type

> Owner skills hold the stack templates — never copy a structure here; the chosen pattern's direction and Rules still apply inside each workspace

| Type | Owner | Variants (templates live in the owner skill) |
|------|-------|----------------------------------------------|
| Web | `/follow-create-web` (dispatcher) | nextjs, nuxt, svelte, vite-spa, solid SPA + TanStack Router, TanStack Start → CF Workers / Nitro (`/follow-solid-framework`), docs site, WebMCP, Rust WASM |
| Mobile / Desktop | `/follow-create-mobile` / `/follow-create-desktop-tauri` | Capacitor cross-platform, iOS+Android native (KMP), Tauri, Dioxus |
| CLI / TUI / Library | `/follow-create-cli` / `/follow-create-tui-ratatui` / `/follow-tool-tsdown` | Bun CLI, Rust CLI, Rust crate, Nushell module, PowerShell module, TS library |
| Plugin / Extension | `/follow-create-plugins` (dispatcher) | vite, rolldown, bun, nitro, elysia, biome, eslint, oxlint, vitest, storybook, tauri, vscode, browser (WXT), obsidian, nvim, zed, raycast, claude, codex, devin |
| Bot / Service / Product | `/follow-create-bot` / `/follow-create-sdk` / `/follow-create-product` | discord, github bot + GitHub App, line, slack, telegram, MCP server, Docker image, GitHub Action, SDK, Slidev deck, Devin project skills |

> This table lists owner skills only, never actions — the upgrade/downgrade triggers live in `references/clean-arch.md` + `references/layered-arch.md`, and multi-entry targets are already `### 2` row 1. These dispatchers are reached through this table, not through `related`, whose 15-edge cap is spent on the flow skills (plan → apply → verify).

## Rules

- Single Entry — every architecture restructure goes through this skill (`### 1`–`### 4`), dispatched from `/refactor` for architecture scopes; never duplicate pattern detail elsewhere — the pattern guides are `references/clean-arch.md` and `references/layered-arch.md` only
- One pattern per target, one move batch per `/update-references` + `/run-check` cycle; preserve behavior and the original public API (same Two Hats / Safety Net rules as `/refactor` `## Rules`)
- Layered and Clean are the same dependency rule at different granularity — Layered = one bounded context with type-grouped folders, Clean = each context promoted to `modules/<name>/`; never treat them as different philosophies or apply both in one target
- Upgrade on evidence only — Layered → Clean when a second entry point shares the domain, a second/third context appears, or an external system turns volatile enough to need a port; Clean → Layered only when the contexts genuinely collapse to one and no port has a second implementation; re-evaluate at `### 1`, never big-bang one pattern into the other
- No churn without cause — `### 2` row 0 answers KEEP for a layout that already holds the direction and purity checks: repair the violations in place, never restructure a working layout to match a favorite pattern
- Event-driven/messaging redesign is not a pattern restructure here: semantics → `/improve events`, queue ops → `/improve queues`, transport → `/improve realtime`
- Improvement loop over this skill's findings → `/improve architecture` (scope-map resolves to `/follow-architecture`)

## Expected Outcome

- The target carries the fitting pattern — multi-entry unified / shared package / ≥3 contexts = Clean, single-context deployable = Layered — or `### 2` row 0 recorded that the layout already held and nothing moved
- No circular dependencies; the original public API still works; passes `/run-check` and the tests; the boundary is persisted (`/update-astgrep-rules`) and the chosen pattern recorded in the target's `AGENTS.md`
- `/report-before-after` shows the old → new layer map against the `### 1` baseline

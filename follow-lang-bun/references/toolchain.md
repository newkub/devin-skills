# Bun Toolchain

| key | value |
|-----|-------|
| language | JavaScript / TypeScript on the Bun runtime |
| runtime · PM · test · bundler | `bun` — one all-in-one binary |
| install | `mise use -g bun` (fallback: official install script) |
| official docs | https://bun.com/docs |
| version policy | never pinned here — live-check via `/deep-research` at use time (`/follow-up-to-date`) |

| tool | role | command/install |
|------|------|-----------------|
| `bun` | runtime — runs `.ts`/`.tsx`/`.jsx` directly, drop-in Node replacement | `mise use -g bun` |
| `bun init` / `bun create` | project scaffold (blank, react, library, templates) | built in |
| `bun install` / `bun add` / `bun remove` / `bun update` | package management, writes `bun.lock` | built in |
| `bun outdated` / `bun why` / `bun audit` / `bun pm trust` | dependency health and supply-chain control | built in |
| `bunx <pkg>` | one-off binary execution | built in |
| `bun test` | test runner (`bun:test` — Jest-compatible, `--coverage`, `--parallel`) | built in |
| `bun build` | bundler (`--target browser\|bun\|node`), `--compile` standalone binary | built in |
| `bun link` / `bun patch` / `bun publish` | workspace linking, dependency patches, npm publishing | built in |
| `tsc --noEmit` | typecheck only (Bun strips types, never checks them) | `bun add -d typescript bun-types` |
| `biome` | lint + format default (ESLint per project when required) | `bun add -d @biomejs/biome` |
| `bunfig.toml` | single toolchain config (`[install]`, `[test]`, `[build]`) — overrides only | project file |
| `happy-dom` / `jsdom` | DOM environment for `bun test` via `[test] preload` | `bun add -d happy-dom` |
| `bunup` | library bundling for publishing (not raw `bun build`) | see `/follow-tool-bunup` |

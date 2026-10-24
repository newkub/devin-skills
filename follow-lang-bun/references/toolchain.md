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
| `bun check` | typecheck (Bun strips types at runtime, never checks them) — same errors as `tsc`, parallel across all CPU cores; `-p <path>` per project, `-b` follows references like `tsc -b` (a `composite` project checks without building first), `--threads N`, `--all`, compiler flags pass through; no `--watch` and no incremental cache (whole project re-checked each run, no `.tsbuildinfo` even with `incremental`) — watch with `bun run --watch typecheck` | built in (Bun ≥ 1.4) |
| `bun test --check` | typecheck the test files and everything they import before any test runs; needs `bun add -d @types/bun` or else `bun:test` fails to resolve | built in |
| `tsrs` | typecheck for projects that use Vite (`tsrs --noEmit`) — Rust drop-in for the TypeScript 7 compiler; win32 binary is not published, point `TSRS_BINARY` at a local build when needed | `bun add -d tsrs` |
| `bun fmt` | format default — built-in Prettier-compatible formatter (JS/TS/JSX, CSS/SCSS/Less, HTML/Vue/Svelte/Angular, JSON/YAML/TOML, Markdown/MDX, GraphQL, Handlebars); reads `.prettierignore`/`.editorconfig`/`bunfig.toml [fmt]` (never `.prettierrc`); `--check`, `--staged`, `--changed`, `--no-script` | built in |
| `biome` | lint default + assist (ESLint per project when required); always lint separately — `bun fmt` never lints | `bun add -d @biomejs/biome` |
| `bunfig.toml` | single toolchain config (`[install]`, `[test]`, `[fmt]`, `[build]`) — overrides only | project file |
| `happy-dom` / `jsdom` | DOM environment for `bun test` via `[test] preload` | `bun add -d happy-dom` |
| `bunup` | library bundling for publishing (not raw `bun build`) | see `/follow-tool-bunup` |

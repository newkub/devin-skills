# Node.js Toolchain

| key | value |
|-----|-------|
| language | JavaScript / TypeScript on the Node.js runtime |
| runtime | `node` — pin a supported line via `mise`, never EOL |
| package manager | `npm` (default) / `pnpm` / `yarn` — one per project |
| install | `mise use -g node` (or `.nvmrc` per team convention) |
| official docs | https://nodejs.org/api/ |
| version policy | never pinned here — live-check LTS/release schedule via `/deep-research` at use time (`/follow-up-to-date`) |

| tool | role | command/install |
|------|------|-----------------|
| `node` | runtime — `node --watch` dev reload, `node --inspect` debugging, type-stripping for `.ts` per pinned support | `mise use -g node` |
| `npm` | package manager, `npm init/install/run/test`, `npx` one-offs | bundled with `node` |
| `corepack` | enable `pnpm`/`yarn` without global installs | bundled with `node` |
| `node --test` | built-in test runner (`node:test` + `node:assert`) | bundled |
| `bun check` | typecheck for TypeScript projects when Bun ≥ 1.4 is on the machine — same errors as `tsc`, parallel across cores, reads the project `tsconfig.json` | built in (Bun ≥ 1.4) |
| `tsc --noEmit` | typecheck fallback when Bun is absent | `bun add -d typescript @types/node` |
| `biome` | lint + format default (ESLint per project when required) | `bun add -d @biomejs/biome` |
| `npm audit` / `pnpm audit` | dependency vulnerability check | bundled with the PM |
| `c8` / built-in coverage | code coverage for `node --test` | check current recommendation via `/deep-research` |
| `pm2` / `systemd` / `/follow-tool-pitchfork` | process management for long-running servers | per deployment target |

# TypeScript Toolchain

| key | value |
|-----|-------|
| language | TypeScript (latest stable + its default compiler behaviors from live check) |
| runtime install | `mise use -g node` or `mise use -g bun`; compiler via project dev dep |
| package manager | npm / pnpm / bun (per project) |
| official docs | https://www.typescriptlang.org/docs/ · https://devblogs.microsoft.com/typescript/ |
| version policy | never pinned here — live-check the compiler version, defaults, removed options, and breaking changes per release via `/deep-research` at use time (`/follow-up-to-date`) |

| tool | role | command/install |
|------|------|-----------------|
| `typescript` (`tsc`) | compiler + type checker (`--noEmit` for checking, `tsgo` native compiler where available — live-check status) | `npm install -D typescript` |
| `tsx` | run TS files directly in dev (ESM, watch) | `npm install -D tsx` |
| `tsconfig.json` | project config — `strict` + enhanced checks, overrides only | project file |
| Biome / ESLint (`@typescript-eslint`) | lint + format; type-aware rules | `npm install -D @biomejs/biome` or `eslint` + plugin |
| `vitest` | unit test runner (native TS, no compile step) | `npm install -D vitest` |
| `expect-type` | type-level assertions in tests | `npm install -D expect-type` |
| `tstyche` | dedicated type-test runner (public type contracts, multi-TS-version targets) — `/follow-lib-tstyche` | `npm install -D tstyche` |
| `type-coverage` | measure `any` usage — `npx type-coverage --detail` | `npm install -D type-coverage` |
| `tsdown` / `bunup` | library bundlers (ESM/CJS/dts) when publishing a package | `npm install -D tsdown` / `bunup` |
| `dts-buddy` / `arethetypeswrong` | public-API type checking for published packages | `npm install -D` per need |
| `mise.toml` + `engines` | runtime pin — one source of truth | project files |

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
| `bun check` | type checker for projects **without Vite** (Bun ≥ 1.4.3; `--no-script` skips `package.json` scripts) | `mise use -g bun` |
| `tsrs` | Rust drop-in for the TypeScript 7 compiler/LSP, used for **Vite projects** (`tsrs --noEmit`); binary comes from `@tsrs/<os>-<arch>`, win32 is not published — set `TSRS_BINARY` to a local build | `bun add -d tsrs` |
| `typescript` (`tsc`) | declaration emit only (`--emitDeclarationOnly`) for published packages — not the typecheck gate | `npm install -D typescript` |
| `tsx` | run TS files directly in dev (ESM, watch) | `npm install -D tsx` |
| `tsconfig.json` | project config — `strict` + enhanced checks, overrides only | project file |
| `bun fmt` | formatter + check for projects **without Vite** (`bun fmt -c`); JS/TS/CSS/HTML/JSON/YAML/Markdown — `bun format` does not exist | built into Bun ≥ 1.4 |
| `vp fmt` | formatter + check for **Vite projects** (`vp fmt --check src`), forwards to Oxfmt and respects `.gitignore`/`.prettierignore` | `mise use -g vite-plus` |
| Biome / ESLint (`@typescript-eslint`) | lint + format when the project already standardizes on it; type-aware rules — keep the existing scripts, add `format:check` only | `npm install -D @biomejs/biome` or `eslint` + plugin |
| `vitest` | unit test runner (native TS, no compile step) | `npm install -D vitest` |
| `expect-type` | type-level assertions in tests | `npm install -D expect-type` |
| `tstyche` | dedicated type-test runner (public type contracts, multi-TS-version targets) — `/follow-lib-tstyche` | `npm install -D tstyche` |
| `type-coverage` | measure `any` usage — `bunx type-coverage --detail` | `npm install -D type-coverage` |
| `tsdown` / `bunup` | library bundlers (ESM/CJS/dts) when publishing a package | `npm install -D tsdown` / `bunup` |
| `dts-buddy` / `arethetypeswrong` | public-API type checking for published packages | `npm install -D` per need |
| `mise.toml` + `engines` | runtime pin — one source of truth | project files |

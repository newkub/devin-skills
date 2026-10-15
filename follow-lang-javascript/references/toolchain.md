# JavaScript Toolchain

| key | value |
|-----|-------|
| language | JavaScript (current ECMAScript edition from live check; features gated by target runtimes/browserslist) |
| runtime install | `mise use -g node` or `mise use -g bun` |
| package manager | npm / pnpm / bun (per project) |
| official docs | https://262.ecma-international.org/ · https://tc39.es/ · MDN: https://developer.mozilla.org/ |
| version policy | never pinned here — live-check ECMAScript edition and runtime support via `/deep-research` at use time (`/follow-up-to-date`) |

| tool | role | command/install |
|------|------|-----------------|
| `node` | runtime (`node --watch`, built-in test runner available) | `mise use -g node` |
| `bun` | runtime + package manager + test runner + bundler in one | `mise use -g bun` |
| `npm` / `pnpm` | package management (`package.json`, lockfile committed) | bundled with Node / `mise use -g pnpm` |
| Biome | lint + format in one (default per `/follow-my-techstack`) | `npm install -D @biomejs/biome` |
| ESLint + Prettier | alternative lint/format pair when the project needs ESLint plugins | `npm install -D eslint prettier` |
| `vitest` | unit test runner | `npm install -D vitest` |
| `tsc` (checkJs) | optional type checking of JS via JSDoc | `npm install -D typescript` |
| browserslist / `es-toolkit` | feature-support target and utility layer — per live check | project config / `npm install` |
| `package.json` `engines` + `.nvmrc`/`mise.toml` | runtime pin — one source of truth | project files |

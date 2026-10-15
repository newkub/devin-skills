---
name: follow-lang-javascript-setup-project
description: Scaffold a new JavaScript project with ESM, pinned runtime, and quality gates
argument-hint: "[project-name]"
related:
  - follow-lang-javascript
  - follow-lang-bun
  - follow-my-techstack
  - follow-default-config
  - deep-research
  - resolve-errors
---

## Goal

Create a new JavaScript project with a pinned runtime, ESM-first layout, and lint/format/test gates green

## Scope

For a fresh JavaScript project; live-check the current ECMAScript edition, runtime, and toolchain choices via `/deep-research` before pinning anything — read `/follow-lang-javascript` for the language rules

## Execute

### 1. Pin The Runtime

1. `mise use -g node` (or `bun` when the project targets the Bun toolkit — then `/follow-lang-bun` applies) at the live-checked version; record the pin in `mise.toml` and `engines` in `package.json`

### 2. Scaffold ESM-First

1. `npm init -y` (or `bun init`) — set `"type": "module"`; entry via `"exports"` map, not only `"main"`
2. Layout: `src/` + `tests/` (or co-located `*.test.js`); `strict` mode is implicit in modules
3. Lockfile committed; `.gitignore` covers `node_modules/`, build output

### 3. Quality Tools As Dev Deps

1. Add the linter/formatter per `/follow-my-techstack` (Biome default; ESLint+Prettier only when a required plugin exists there alone)
2. Add `vitest`; one passing smoke test from the first commit
3. Config files hold overrides only — follow `/follow-default-config`; browserslist file matches the actual target runtimes

### 4. Verify

1. `node --version` matches the pin → lint/format check clean → `vitest run` green
2. On failure → run `/resolve-errors`

## Rules

- Never restate tool defaults in config; never float the runtime version — `engines` + `mise.toml` agree
- Details in [../../references/toolchain.md](../../references/toolchain.md); run `/deep-research` for the current ecosystem state before every new project

## Expected Outcome

- New JavaScript project: pinned runtime, ESM layout, lint/format/test gates green from the first commit

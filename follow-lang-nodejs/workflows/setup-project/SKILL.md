---
name: follow-lang-nodejs-setup-project
description: Scaffold a new Node.js project with runtime pin, scripts, and config
argument-hint: "[project-name]"
related:
  - follow-lang-nodejs
  - follow-default-config
  - resolve-errors
  - deep-research
---

## Goal

Create a new Node.js project pinned to a supported release, ready to run, test, and typecheck

## Scope

For a fresh Node.js project (JavaScript or TypeScript); live-check the current LTS line and release schedule via `/deep-research` first — read `/follow-lang-nodejs` for the runtime rules

## Execute

### 1. Pin The Runtime

> Goal: Pin The Runtime.

1. `mise use -g node` (or `mise use node@<lts>` per project) — pin to a supported, non-EOL line confirmed by the `/deep-research` check; `.nvmrc` where the team uses it
2. Verify `node --version`; declare `engines.node` in `package.json`

### 2. Scaffold

> Goal: Scaffold.

1. `npm init -y` (or the chosen PM's init); pick `npm`/`pnpm`/`yarn` per project and stick to one
2. Layout: flat `src/` with one entry file; `"type": "module"` (ESM) unless dependencies force CJS
3. Scripts: `dev: node --watch src/index.js`, `start: node src/index.js`, `test: node --test`, `typecheck: bun check` (TS only, Bun ≥ 1.4 — else `tsc --noEmit`), `build:` per target
4. TypeScript for large projects: `bun add -d typescript @types/node` with `strict` — `node --watch` handles dev reload, no `nodemon`; JavaScript is fine for scripts/prototyping

### 3. Configure

> Goal: Configure.

1. Keep config to overrides only per `/follow-default-config`; a `.gitignore` covering `node_modules`, `dist`, `.env`, `coverage`, `*.log`
2. `.env` loading: use `node:util` `parseEnv`/`process.loadEnvFile` when the pinned version supports it, otherwise check the current recommendation via `/deep-research` — never add shims blindly
3. Commit the lockfile (`package-lock.json`/`pnpm-lock.yaml`/`yarn.lock`); never mix lockfiles in one project

### 4. Verify

> Goal: Verify.

1. `node --watch src/index.js` starts; `node --test` (or the chosen runner) passes; typecheck passes for TS projects
2. On failure → run `/resolve-errors`

## Rules

- Module system: one per package (ESM preferred); builtins imported with the `node:` prefix

## Expected Outcome

- New Node.js project on a supported line with pinned runtime, ESM default, committed lockfile, and green local checks

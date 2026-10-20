---
name: follow-lang-typescript-setup-project
description: Scaffold a new TypeScript project with strict tsconfig and quality gates
argument-hint: "[project-name]"
related:
  - follow-lang-typescript
  - follow-lang-javascript
  - follow-my-techstack
  - follow-default-config
  - follow-tool-tsdown
  - check-types-definition
  - deep-research
  - resolve-errors
---

## Goal

Create a new TypeScript project with a pinned runtime, strict `tsconfig.json`, and typecheck/lint/test gates green

## Scope

For a fresh TypeScript project; live-check the latest stable TypeScript and its default compiler behaviors via `/deep-research` before configuring — read `/follow-lang-typescript` for the language rules; for plain JavaScript use `/follow-lang-javascript` instead

## Execute

### 1. Pin The Runtime And Compiler

1. `mise use -g node` (or `bun`) at the live-checked version; `npm install -D typescript` at the latest stable — versions resolve from the live check, never from memory

### 2. Scaffold

1. `npm init` (or `bun init`) with `"type": "module"`; layout `src/` + `tests/` (or co-located `*.test.ts`)
2. `tsconfig.json`: `strict: true` plus the enhanced checks listed in Step 1 of [../../SKILL.md](../../SKILL.md) — overrides only per `/follow-default-config`; verify each option still exists via `/check-types-definition` on the installed compiler

### 3. Quality Tools As Dev Deps

1. Linter/formatter per `/follow-my-techstack` (Biome default; `@typescript-eslint` only when a required rule lives there)
2. `vitest` + `expect-type`; one passing smoke test from the first commit
3. Scripts in `package.json`: `typecheck` (`bun check` when Bun ≥ 1.4 is available, else `tsc --noEmit`), `lint`, `test`

### 4. Verify

1. `bun check` (or `tsc --noEmit`) clean → lint/format check clean → `vitest run` green → `npx type-coverage --detail` shows no `any`
2. On failure → run `/resolve-errors`

## Rules

- A library package additionally gets a bundler (`tsdown`/`bunup`) per `/follow-tool-tsdown` — only when publishing
- Never restate compiler defaults in `tsconfig.json`; never pin versions in this workflow — everything resolves from the `/deep-research` check at use time

## Expected Outcome

- New TypeScript project: pinned runtime, strict tsconfig, typecheck/lint/format/test/any-free gates green from the first commit

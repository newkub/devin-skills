---
name: template-skills-architecture
description: Template สำหรับ follow-*-architecture skills จัดโครงสร้าง project
---

## Goal

Template α╕¬α╕│α╕½α╕úα╕▒α╕Üα╕¬α╕úα╣ëα╕▓α╕ç `follow-*-architecture` workflows α╕ùα╕╡α╣êα╕êα╕▒α╕öα╣éα╕äα╕úα╕çα╕¬α╕úα╣ëα╕▓α╕ç project α╕òα╕▓α╕í best practices α╕₧α╕úα╣ëα╕¡α╕í file structure α╣üα╕Ñα╕░ patterns

## Scope

α╣âα╕èα╣ëα╕¬α╕│α╕½α╕úα╕▒α╕Ü workflows α╕ùα╕╡α╣êα╕üα╕│α╕½α╕Öα╕ö architecture α╣Çα╕èα╣êα╕Ö `follow-solid-tanstack-architecture`, `follow-nuxt-architecture`, `follow-nextjs-architecture`, `follow-svelte-kit-architecture`

## Execute

### 1. Detect Stack

α╕òα╕úα╕ºα╕êα╕êα╕▒α╕Ü tech stack α╕éα╕¡α╕ç project

> Goal: α╕úα╕╣α╣ëα╕ºα╣êα╕▓α╣âα╕èα╣ë framework α╕¡α╕░α╣äα╕ú version α╣âα╕ö α╣üα╕Ñα╕░α╕íα╕╡ `follow-*` workflows α╕¡α╕░α╣äα╕úα╣Çα╕üα╕╡α╣êα╕óα╕ºα╕éα╣ëα╕¡α╕ç

1. α╕¡α╣êα╕▓α╕Ö `package.json`, α╕¡α╣êα╕▓α╕Ö dependency manifest, α╕òα╕úα╕ºα╕êα╕¬α╕¡α╕Ü standalone α╕½α╕úα╕╖α╕¡ monorepo
2. α╕úα╕░α╕Üα╕╕ framework, meta-framework, α╣üα╕Ñα╕░ key dependencies
3. α╕úα╕░α╕Üα╕╕ tech stack `follow-*` workflows α╕ùα╕╡α╣êα╣Çα╕üα╕╡α╣êα╕óα╕ºα╕éα╣ëα╕¡α╕ç (α╣Çα╕èα╣êα╕Ö `/follow-nextjs`, `/follow-vue`, `/follow-pinia`, `/follow-vite`, `/follow-vitest`)
4. α╕ûα╣ëα╕▓α╣äα╕íα╣êα╕₧α╕Ü framework ΓåÆ stop α╣üα╕Ñα╕░ report

### 2. Define Structure

α╕üα╕│α╕½α╕Öα╕ö file structure α╕òα╕▓α╕í best practices

> Goal: α╕íα╕╡ file structure α╕ùα╕╡α╣êα╣Çα╕½α╕íα╕▓α╕░α╕¬α╕í α╕úα╕¡α╕çα╕úα╕▒α╕Ü modules/ α╣üα╕Ñα╕░ monorepo

1. α╕üα╕│α╕½α╕Öα╕ö directories α╕½α╕Ñα╕▒α╕ü, α╕üα╕│α╕½α╕Öα╕ö module structure, α╕üα╕│α╕½α╕Öα╕ö shared package structure α╕ûα╣ëα╕▓α╣Çα╕¢α╣çα╕Ö monorepo
2. Module structure: `src/modules/<feature>/` α╕₧α╕úα╣ëα╕¡α╕í `components/`, `hooks/`, `schemas/`, `utils/`, `types/`, `index.ts`
3. α╕¬α╕úα╣ëα╕▓α╕ç file structure diagram α╕ùα╕▒α╣ëα╕ç standalone α╣üα╕Ñα╕░ monorepo

### 3. Define Patterns

α╕üα╕│α╕½α╕Öα╕ö patterns α╣Çα╕ëα╕₧α╕▓α╕░α╕éα╕¡α╕ç framework

> Goal: α╣âα╕èα╣ë framework patterns α╕ûα╕╣α╕üα╕òα╣ëα╕¡α╕ç

1. α╕üα╕│α╕½α╕Öα╕ö routing conventions, α╕üα╕│α╕½α╕Öα╕ö server functions / API patterns, α╕üα╕│α╕½α╕Öα╕ö rendering modes (SSR, CSR, SSG)
2. α╕üα╕│α╕½α╕Öα╕ö state management patterns
3. α╕üα╕│α╕½α╕Öα╕ö component organization

### 4. Define Rules

α╕üα╕│α╕½α╕Öα╕ö rules α╕¬α╕│α╕½α╕úα╕▒α╕Ü architecture

> Goal: Rules α╕èα╕▒α╕öα╣Çα╕êα╕Ö α╕Üα╕▒α╕çα╕äα╕▒α╕Üα╣äα╕öα╣ë α╣äα╕íα╣êα╕éα╕▒α╕ö best practices

1. α╕üα╕│α╕½α╕Öα╕ö routing rules
2. α╕üα╕│α╕½α╕Öα╕ö module boundary rules
3. α╕üα╕│α╕½α╕Öα╕ö import/export rules ΓÇö α╕ùα╕│ `/follow-import-export`
4. α╕üα╕│α╕½α╕Öα╕ö monorepo rules α╕ûα╣ëα╕▓α╣Çα╕üα╕╡α╣êα╕óα╕ºα╕éα╣ëα╕¡α╕ç
5. α╕üα╕│α╕½α╕Öα╕ö configuration rules

### 5. Validate

α╕òα╕úα╕ºα╕êα╕¬α╕¡α╕Üα╕ºα╣êα╕▓ architecture α╕ùα╕│α╕çα╕▓α╕Öα╣äα╕öα╣ë

> Goal: Architecture α╕¬α╕íα╕Üα╕╣α╕úα╕ôα╣î α╣äα╕íα╣êα╕íα╕╡ conflicts

1. α╕òα╕úα╕ºα╕êα╕¬α╕¡α╕Üα╕ºα╣êα╕▓ structure α╣äα╕íα╣êα╕ùα╕▒α╕Üα╕ïα╣ëα╕¡α╕Öα╕üα╕▒α╕Ü workflows α╕¡α╕╖α╣êα╕Ö
2. α╕ùα╕│ `/restructure` α╕ûα╣ëα╕▓α╕êα╕│α╣Çα╕¢α╣çα╕Ö, α╕ùα╕│ `/refactor-packages` α╕ûα╣ëα╕▓ modules α╣âα╕½α╕ìα╣êα╣Çα╕üα╕┤α╕Öα╣äα╕¢, α╕úα╕▒α╕Ö typecheck, α╕úα╕▒α╕Ö lint
3. α╕ùα╕│ `/suggest-next-action`

## Rules

### 1. Generality

- α╣äα╕íα╣êα╕£α╕╣α╕üα╕üα╕▒α╕Üα╕èα╕╖α╣êα╕¡ project α╕½α╕úα╕╖α╕¡ scope α╣Çα╕ëα╕₧α╕▓α╕░
- α╣âα╕èα╣ë `@<scope>/shared` α╣üα╕ùα╕Öα╕èα╕╖α╣êα╕¡α╕êα╕úα╕┤α╕ç
- α╕úα╕¡α╕çα╕úα╕▒α╕Üα╕ùα╕▒α╣ëα╕ç standalone α╣üα╕Ñα╕░ monorepo

### 2. Tech Stack References

- `related` α╣âα╕Ö frontmatter α╕òα╣ëα╕¡α╕çα╕íα╕╡ `follow-*` workflows α╕éα╕¡α╕ç tech stack α╕ùα╕╡α╣êα╣Çα╕üα╕╡α╣êα╕óα╕ºα╕éα╣ëα╕¡α╕ç
- α╕òα╕▒α╕ºα╕¡α╕óα╣êα╕▓α╕ç: Next.js ΓåÆ `/follow-nextjs`, `/follow-vite`, `/follow-vitest`
- α╕òα╕▒α╕ºα╕¡α╕óα╣êα╕▓α╕ç: Nuxt ΓåÆ `/follow-nuxtjs`, `/follow-vue`, `/follow-pinia`, `/follow-nitro`
- α╕òα╕▒α╕ºα╕¡α╕óα╣êα╕▓α╕ç: SvelteKit ΓåÆ `/follow-svelte`, `/follow-vite`, `/follow-vitest`
- α╕òα╕▒α╕ºα╕¡α╕óα╣êα╕▓α╕ç: SolidJS+TanStack ΓåÆ `/follow-solidjs`, `/follow-tanstack-start`, `/follow-tanstack-router`, `/follow-tanstack-query`
- α╕úα╕ºα╕í `/follow-vite` α╣üα╕Ñα╕░ `/follow-vitest` α╣Çα╕¬α╕íα╕¡α╣Çα╕₧α╕úα╕▓α╕░α╣Çα╕¢α╣çα╕Ö build α╣üα╕Ñα╕░ test tools α╕ùα╕╡α╣êα╣âα╕èα╣ëα╕úα╣êα╕ºα╕íα╕üα╕▒α╕Ö

### 3. Module Boundaries

- α╣üα╕òα╣êα╕Ñα╕░ module α╕íα╕╡ `index.ts` α╣Çα╕¢α╣çα╕Ö public API
- α╣Çα╕üα╣çα╕Ü internal code private
- α╣äα╕íα╣êα╕íα╕╡ circular dependencies

### 4. File Structure

- α╣üα╕¬α╕öα╕ç file structure diagram
- α╕úα╕░α╕Üα╕╕ file patterns α╣Çα╕¢α╣çα╕Öα╕òα╕▓α╕úα╕▓α╕ç
- α╣äα╕íα╣êα╣Çα╕üα╕┤α╕Ö 250 α╕Üα╕úα╕úα╕ùα╕▒α╕öα╕òα╣êα╕¡ workflow

### 5. Monorepo

- α╕¡α╕óα╣êα╕▓ share route tree α╕éα╣ëα╕▓α╕í package boundary
- Share components, hooks, schemas, utils α╣üα╕ùα╕Ö
- α╕ùα╕│ `/follow-monorepo` α╕¬α╕│α╕½α╕úα╕▒α╕Ü validation

## Expected Outcome

- Architecture α╕ùα╕╡α╣êα╕èα╕▒α╕öα╣Çα╕êα╕Öα╕₧α╕úα╣ëα╕¡α╕í file structure diagram
- Module boundaries α╣üα╕Ñα╕░ patterns α╕ùα╕╡α╣êα╕ùα╕│α╕òα╕▓α╕íα╣äα╕öα╣ë
- α╕úα╕¡α╕çα╕úα╕▒α╕Üα╕ùα╕▒α╣ëα╕ç standalone α╣üα╕Ñα╕░ monorepo
- α╣äα╕íα╣êα╕£α╕╣α╕üα╕üα╕▒α╕Ü project α╣Çα╕ëα╕₧α╕▓α╕░

## Example Template

```markdown
---
title: Follow Nextjs Architecture
description: α╕êα╕▒α╕öα╣éα╕äα╕úα╕çα╕¬α╕úα╣ëα╕▓α╕ç Next.js App Router α╕òα╕▓α╕í best practices
auto_execution_mode: 3
related:
  - /follow-nextjs
  - /follow-vite
  - /follow-vitest
  - /follow-import-export
  - /follow-monorepo
---

## Goal
α╕êα╕▒α╕öα╣éα╕äα╕úα╕çα╕¬α╕úα╣ëα╕▓α╕ç Next.js project α╕òα╕▓α╕í App Router best practices

## Scope
α╣âα╕èα╣ëα╕¬α╕│α╕½α╕úα╕▒α╕Ü Next.js projects α╕ùα╕╡α╣êα╣âα╕èα╣ë App Router

## Execute

### 1. Detect Stack
α╕òα╕úα╕ºα╕êα╕êα╕▒α╕Ü Next.js α╣üα╕Ñα╕░ dependencies

> Goal: α╕úα╕╣α╣ë framework version α╣üα╕Ñα╕░ related workflows

1. α╕¡α╣êα╕▓α╕Ö `package.json`, α╕òα╕úα╕ºα╕êα╕¬α╕¡α╕Ü monorepo
2. α╕úα╕░α╕Üα╕╕ tech stack `follow-*` workflows

### 2. Define Structure
α╕üα╕│α╕½α╕Öα╕ö file structure

> Goal: Structure α╕úα╕¡α╕çα╕úα╕▒α╕Ü modules/ α╣üα╕Ñα╕░ monorepo

1. α╕üα╕│α╕½α╕Öα╕ö `src/modules/`, α╕üα╕│α╕½α╕Öα╕ö `app/` directory
2. α╕¬α╕úα╣ëα╕▓α╕ç file structure diagram

### 3. Define Patterns
α╕üα╕│α╕½α╕Öα╕ö Next.js patterns

> Goal: α╣âα╕èα╣ë Next.js patterns α╕ûα╕╣α╕üα╕òα╣ëα╕¡α╕ç

1. α╕üα╕│α╕½α╕Öα╕ö routing, α╕üα╕│α╕½α╕Öα╕ö server components, α╕üα╕│α╕½α╕Öα╕ö client components

### 4. Define Rules
α╕üα╕│α╕½α╕Öα╕ö rules

> Goal: Rules α╕èα╕▒α╕öα╣Çα╕êα╕Ö α╕Üα╕▒α╕çα╕äα╕▒α╕Üα╣äα╕öα╣ë

1. α╕üα╕│α╕½α╕Öα╕ö module boundary rules
2. α╕ùα╕│ `/follow-import-export`

### 5. Validate
α╕òα╕úα╕ºα╕êα╕¬α╕¡α╕Ü

> Goal: Architecture α╕¬α╕íα╕Üα╕╣α╕úα╕ôα╣î

1. α╕úα╕▒α╕Ö typecheck, α╕úα╕▒α╕Ö lint
2. α╕ùα╕│ `/suggest-next-action`

## Rules

### 1. Module Boundaries
- α╣üα╕òα╣êα╕Ñα╕░ module α╕íα╕╡ `index.ts`
- α╣äα╕íα╣êα╕íα╕╡ circular dependencies

### 2. Tech Stack References
- `related` α╕òα╣ëα╕¡α╕çα╕íα╕╡ `/follow-nextjs`, `/follow-vite`, `/follow-vitest`

## Expected Outcome
- Next.js architecture α╕₧α╕úα╣ëα╕¡α╕í file structure α╣üα╕Ñα╕░ patterns
```

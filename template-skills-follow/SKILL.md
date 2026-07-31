---
name: template-skills-follow
description: Template สำหรับ follow-* skills ใช้ best practices
---

## Goal

Template α╕¬α╕│α╕½α╕úα╕▒α╕Üα╕¬α╕úα╣ëα╕▓α╕ç `follow-*` workflows α╕ùα╕╡α╣ê implement best practices α╕éα╕¡α╕ç tools, libraries α╕½α╕úα╕╖α╕¡ frameworks

## Scope

α╣âα╕èα╣ëα╕¬α╕│α╕½α╕úα╕▒α╕Ü workflows α╕ùα╕╡α╣ê setup α╕½α╕úα╕╖α╕¡ implement patterns α╣Çα╕èα╣êα╕Ö `follow-vite`, `follow-solidjs`, `follow-biome`, `follow-drizzle`

## Execute

### 1. Detect Tool

α╕òα╕úα╕ºα╕êα╕êα╕▒α╕Ü tool/library α╣âα╕Ö project

> Goal: α╕úα╕╣α╣ëα╕ºα╣êα╕▓α╣âα╕èα╣ë tool α╕¡α╕░α╣äα╕ú version α╣âα╕ö

1. α╕¡α╣êα╕▓α╕Ö `package.json`, `Cargo.toml`, α╕½α╕úα╕╖α╕¡α╣äα╕ƒα╕Ñα╣î dependencies α╕ùα╕╡α╣êα╣Çα╕üα╕╡α╣êα╕óα╕ºα╕éα╣ëα╕¡α╕ç
2. α╕òα╕úα╕ºα╕êα╕¬α╕¡α╕Ü version α╕éα╕¡α╕ç tool/library
3. α╕ûα╣ëα╕▓α╣äα╕íα╣êα╕₧α╕Ü tool ΓåÆ stop α╣üα╕Ñα╕░ report α╕₧α╕úα╣ëα╕¡α╕íα╕äα╕│α╣üα╕Öα╕░α╕Öα╕│α╕üα╕▓α╕úα╕òα╕┤α╕öα╕òα╕▒α╣ëα╕ç
4. α╕ûα╣ëα╕▓α╣Çα╕¢α╣çα╕Ö optional ΓåÆ α╕ûα╕▓α╕íα╕£α╕╣α╣ëα╣âα╕èα╣ëα╕ºα╣êα╕▓α╕òα╣ëα╕¡α╕çα╕üα╕▓α╕ú setup α╕½α╕úα╕╖α╕¡α╣äα╕íα╣ê

### 2. Read Best Practices

α╕¡α╣êα╕▓α╕Ö best practices α╕êα╕▓α╕ü official docs

> Goal: α╣âα╕èα╣ëα╕éα╣ëα╕¡α╕íα╕╣α╕Ñα╕ùα╕╡α╣êα╕ûα╕╣α╕üα╕òα╣ëα╕¡α╕çα╣üα╕Ñα╕░α╕ùα╕▒α╕Öα╕¬α╕íα╕▒α╕ó

1. α╕ùα╕│ `/learn-from-web`, `/check-reference`, α╕ùα╕│ `/follow-best-practice`
2. α╕òα╕úα╕ºα╕êα╕¬α╕¡α╕Ü version compatibility α╕üα╕▒α╕Ü project
3. α╕ûα╣ëα╕▓α╕éα╣ëα╕¡α╕íα╕╣α╕Ñα╣äα╕íα╣êα╕èα╕▒α╕ö ΓåÆ stop α╣üα╕Ñα╕░ report

### 3. Implement Patterns

Implement best practices patterns

> Goal: Code α╕òα╕úα╕ç best practices α╣üα╕Ñα╕░α╕ùα╕│α╕çα╕▓α╕Öα╣äα╕öα╣ë

1. α╕¬α╕úα╣ëα╕▓α╕çα╕½α╕úα╕╖α╕¡α╕¡α╕▒α╕¢α╣Çα╕öα╕ù configuration files
2. Implement patterns α╕òα╕▓α╕í official docs
3. α╕ùα╕│ `/follow-config` α╕üα╕▒α╕Ü existing code style
4. α╕ûα╣ëα╕▓α╕íα╕╡ breaking changes ΓåÆ α╕ùα╕│ migration steps
5. α╕ûα╣ëα╕▓α╕òα╣ëα╕¡α╕çα╣üα╕üα╣ë >10 α╣äα╕ƒα╕Ñα╣î ΓåÆ α╕ùα╕│ `/use-scripts`

### 4. Validate

α╕òα╕úα╕ºα╕êα╕¬α╕¡α╕Üα╕ºα╣êα╕▓ implementation α╕ùα╕│α╕çα╕▓α╕Öα╣äα╕öα╣ë

> Goal: Implementation α╕£α╣êα╕▓α╕Ö validation α╣äα╕íα╣êα╕íα╕╡ errors

1. α╕úα╕▒α╕Ö typecheck, α╕úα╕▒α╕Ö lint, α╕úα╕▒α╕Ö tests α╕ûα╣ëα╕▓α╕íα╕╡
2. α╕òα╕úα╕ºα╕êα╕¬α╕¡α╕Üα╕ºα╣êα╕▓ config α╕ûα╕╣α╕üα╕òα╣ëα╕¡α╕ç
3. α╕ûα╣ëα╕▓α╕íα╕╡ errors ΓåÆ α╕ùα╕│ `/resolve-errors`
4. α╕ûα╣ëα╕▓α╕£α╣êα╕▓α╕Ö ΓåÆ α╕ùα╕│ `/suggest-next-action`

## Rules

### 1. Source Of Truth

- α╣âα╕èα╣ë official docs α╣Çα╕¢α╣çα╕Öα╣üα╕½α╕Ñα╣êα╕çα╕½α╕Ñα╕▒α╕ü
- α╕ûα╣ëα╕▓ official docs α╕éα╕▒α╕öα╣üα╕óα╣ëα╕çα╕üα╕▒α╕Ü training data ΓåÆ α╣âα╕èα╣ë official docs
- α╕úα╕░α╕Üα╕╕ version α╕ùα╕╡α╣êα╕¡α╣ëα╕▓α╕çα╕¡α╕┤α╕çα╣Çα╕¬α╕íα╕¡

### 2. Compatibility

- α╕òα╕úα╕ºα╕êα╕¬α╕¡α╕Ü version compatibility α╕üα╕▒α╕Ü existing dependencies
- α╕ûα╣ëα╕▓α╕íα╕╡ conflict ΓåÆ report α╕₧α╕úα╣ëα╕¡α╕íα╕ºα╕┤α╕ÿα╕╡α╣üα╕üα╣ë
- α╣äα╕íα╣êα╕Üα╕▒α╕çα╕äα╕▒α╕Ü upgrade α╣éα╕öα╕óα╣äα╕íα╣êα╣üα╕êα╣ëα╕çα╕£α╕╣α╣ëα╣âα╕èα╣ë

### 3. Minimal Changes

- α╣âα╕èα╣ë minimal changes α╣Çα╕¬α╕íα╕¡
- α╣äα╕íα╣ê rewrite α╕ùα╕▒α╣ëα╕çα╣äα╕ƒα╕Ñα╣îα╕ûα╣ëα╕▓α╣Çα╕¢α╕Ñα╕╡α╣êα╕óα╕Öα╣Çα╕ëα╕₧α╕▓α╕░ config
- α╕ûα╣ëα╕▓α╕òα╣ëα╕¡α╕çα╣üα╕üα╣ë >10 α╣äα╕ƒα╕Ñα╣î ΓåÆ α╕ùα╕│ `/use-scripts`

## Expected Outcome

- Tool/library setup α╕òα╕▓α╕í best practices
- Configuration files α╕ûα╕╣α╕üα╕òα╣ëα╕¡α╕çα╣üα╕Ñα╕░ consistent
- Code α╕£α╣êα╕▓α╕Ö typecheck α╣üα╕Ñα╕░ lint
- α╣äα╕íα╣êα╕íα╕╡ breaking changes α╣éα╕öα╕óα╣äα╕íα╣êα╕êα╕│α╣Çα╕¢α╣çα╕Ö

## Example Template

```markdown
---
title: Follow Vite
description: α╕òα╕▒α╣ëα╕çα╕äα╣êα╕▓ Vite α╕¬α╕│α╕½α╕úα╕▒α╕Ü modern web applications
auto_execution_mode: 3
related:
  - /learn-from-web
  - /check-reference
  - /follow-config
---

## Goal
α╕òα╕▒α╣ëα╕çα╕äα╣êα╕▓ Vite α╕òα╕▓α╕í best practices

## Scope
α╣âα╕èα╣ëα╕¬α╕│α╕½α╕úα╕▒α╕Ü projects α╕ùα╕╡α╣êα╣âα╕èα╣ë Vite α╣Çα╕¢α╣çα╕Ö build tool

## Execute

### 1. Detect Tool
α╕òα╕úα╕ºα╕êα╕êα╕▒α╕Ü Vite α╣âα╕Ö project

> Goal: α╕úα╕╣α╣ë version α╣üα╕Ñα╕░ config α╕¢α╕▒α╕êα╕êα╕╕α╕Üα╕▒α╕Ö

1. α╕¡α╣êα╕▓α╕Ö `package.json` α╕½α╕▓ `vite` dependency
2. α╕òα╕úα╕ºα╕êα╕¬α╕¡α╕Ü `vite.config.ts` α╕ùα╕╡α╣êα╕íα╕╡α╕¡α╕óα╕╣α╣ê
3. α╕ûα╣ëα╕▓α╣äα╕íα╣êα╕₧α╕Ü ΓåÆ stop α╣üα╕Ñα╕░ report

### 2. Read Best Practices
α╕¡α╣êα╕▓α╕Ö official docs

> Goal: α╣âα╕èα╣ëα╕éα╣ëα╕¡α╕íα╕╣α╕Ñα╕ùα╕╡α╣êα╕ûα╕╣α╕üα╕òα╣ëα╕¡α╕ç

1. α╕ùα╕│ `/learn-from-web` α╕êα╕▓α╕ü vitejs.dev
2. α╕ùα╕│ `/check-reference` α╕óα╕╖α╕Öα╕óα╕▒α╕Ö patterns

### 3. Implement Patterns
α╕òα╕▒α╣ëα╕çα╕äα╣êα╕▓ Vite config

> Goal: Config α╕òα╕úα╕ç best practices

1. α╕¬α╕úα╣ëα╕▓α╕ç/α╕¡α╕▒α╕¢α╣Çα╕öα╕ù `vite.config.ts`
2. α╕ùα╕│ `/follow-config` α╕¬α╕│α╕½α╕úα╕▒α╕Ü consistency

### 4. Validate
α╕òα╕úα╕ºα╕êα╕¬α╕¡α╕Ü

> Goal: Implementation α╕£α╣êα╕▓α╕Ö

1. α╕úα╕▒α╕Ö typecheck, α╕úα╕▒α╕Ö build
2. α╕ûα╣ëα╕▓α╕íα╕╡ errors ΓåÆ α╕ùα╕│ `/resolve-errors`

## Rules

### 1. Source Of Truth
- α╣âα╕èα╣ë official docs α╣Çα╕¢α╣çα╕Öα╣üα╕½α╕Ñα╣êα╕çα╕½α╕Ñα╕▒α╕ü

### 2. Compatibility
- α╕òα╕úα╕ºα╕êα╕¬α╕¡α╕Ü version compatibility

## Expected Outcome
- Vite config α╕ùα╕╡α╣êα╕ûα╕╣α╕üα╕òα╣ëα╕¡α╕çα╕₧α╕úα╣ëα╕¡α╕íα╣âα╕èα╣ëα╕çα╕▓α╕Ö
```

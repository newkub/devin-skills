---
name: template-skills-run
description: Template สำหรับ run-* skills execute commands
---

## Goal

Template α╕¬α╕│α╕½α╕úα╕▒α╕Üα╕¬α╕úα╣ëα╕▓α╕ç `run-*` workflows α╕ùα╕╡α╣ê execute commands α╕₧α╕úα╣ëα╕¡α╕í prerequisites check, error handling α╣üα╕Ñα╕░ result reporting

## Scope

α╣âα╕èα╣ëα╕¬α╕│α╕½α╕úα╕▒α╕Ü workflows α╕ùα╕╡α╣êα╕úα╕▒α╕Ö commands α╣Çα╕èα╣êα╕Ö `run-build`, `run-test`, `run-lint`, `run-dev`, `run-deploy`

## Execute

### 1. Check Prerequisites

α╕òα╕úα╕ºα╕êα╕¬α╕¡α╕Ü prerequisites α╕üα╣êα╕¡α╕Öα╕úα╕▒α╕Ö

> Goal: α╕úα╕▒α╕Öα╣äα╕öα╣ëα╣üα╕Öα╣êα╕Ö α╣äα╕íα╣êα╣Çα╕¬α╕╡α╕óα╣Çα╕ºα╕Ñα╕▓ fail α╕êα╕▓α╕üα╕éα╕¡α╕çα╕éα╕▓α╕ö

1. α╕òα╕úα╕ºα╕êα╕¬α╕¡α╕Üα╕ºα╣êα╕▓ target α╕íα╕╡α╕¡α╕óα╕╣α╣êα╕êα╕úα╕┤α╕ç (file, directory, package)
2. α╕òα╕úα╕ºα╕êα╕¬α╕¡α╕Ü dependencies, α╕òα╕úα╕ºα╕êα╕¬α╕¡α╕Ü tools α╕ùα╕╡α╣êα╕êα╕│α╣Çα╕¢α╣çα╕Ö, α╕ùα╕│ `/check-configuration`
3. α╕ûα╣ëα╕▓α╕éα╕▓α╕ö prerequisites ΓåÆ stop α╣üα╕Ñα╕░ report α╕₧α╕úα╣ëα╕¡α╕íα╕ºα╕┤α╕ÿα╕╡α╕òα╕┤α╕öα╕òα╕▒α╣ëα╕ç
4. α╕ùα╕│ `/check-should-update` α╕ûα╣ëα╕▓ target α╕¡α╕▓α╕êα╣Çα╕¢α╣çα╕Ö stale

### 2. Execute Command

α╕úα╕▒α╕Ö command α╕½α╕Ñα╕▒α╕ü

> Goal: α╕úα╕▒α╕Ö command α╕¬α╕│α╣Çα╕úα╣çα╕êα╕½α╕úα╕╖α╕¡α╣äα╕öα╣ë error α╕ùα╕╡α╣êα╕èα╕▒α╕öα╣Çα╕êα╕Ö

1. α╕úα╕▒α╕Ö command α╕₧α╕úα╣ëα╕¡α╕í timeout α╕ùα╕╡α╣êα╣Çα╕½α╕íα╕▓α╕░α╕¬α╕í
2. α╣âα╕èα╣ë non-blocking α╕¬α╕│α╕½α╕úα╕▒α╕Ü long-running processes (dev server, watch mode)
3. α╣âα╕èα╣ë blocking α╕¬α╕│α╕½α╕úα╕▒α╕Ü short tasks (build, test, lint)
4. α╕êα╕▒α╕Ü output α╣üα╕Ñα╕░ error α╣üα╕óα╕üα╕üα╕▒α╕Ö
5. α╕ûα╣ëα╕▓α╣Çα╕¢α╣çα╕Ö monorepo ΓåÆ α╕úα╕▒α╕Öα╣âα╕Ö workspace α╕ùα╕╡α╣êα╕üα╕│α╕½α╕Öα╕öα╣Çα╕ùα╣êα╕▓α╕Öα╕▒α╣ëα╕Ö α╕½α╕úα╕╖α╕¡α╣âα╕èα╣ë turbo/bun filter

### 3. Handle Errors

α╕êα╕▒α╕öα╕üα╕▓α╕ú errors α╕ûα╣ëα╕▓ command α╕Ñα╣ëα╕íα╣Çα╕½α╕Ñα╕º

> Goal: Error α╕ûα╕╣α╕ü resolve α╕½α╕úα╕╖α╕¡ report α╕öα╣ëα╕ºα╕ó root cause

1. α╕ûα╣ëα╕▓α╕íα╕╡ errors ΓåÆ α╕ùα╕│ `/resolve-errors`
2. α╕ûα╣ëα╕▓ error α╣Çα╕¢α╣çα╕Ö dependency issue ΓåÆ α╕ùα╕│ `/run-install` α╣üα╕Ñα╣ëα╕º retry (max 1 α╕äα╕úα╕▒α╣ëα╕ç)
3. α╕ûα╣ëα╕▓ error α╣Çα╕¢α╣çα╕Ö config issue ΓåÆ α╕ùα╕│ `/check-configuration`
4. α╕ûα╣ëα╕▓ error α╕ïα╣ëα╕│ 3 α╕äα╕úα╕▒α╣ëα╕ç ΓåÆ stop α╣üα╕Ñα╕░ report α╕₧α╕úα╣ëα╕¡α╕í error log

### 4. Report Results

α╕úα╕▓α╕óα╕çα╕▓α╕Öα╕£α╕Ñα╕Ñα╕▒α╕₧α╕ÿα╣î

> Goal: α╕£α╕╣α╣ëα╣âα╕èα╣ëα╕úα╕╣α╣ëα╕£α╕Ñα╕Ñα╕▒α╕₧α╕ÿα╣îα╣üα╕Ñα╕░ next action

1. α╕¬α╕úα╕╕α╕¢α╕£α╕Ñ: success/fail, duration, key metrics
2. α╕ûα╣ëα╕▓α╕¬α╕│α╣Çα╕úα╣çα╕ê ΓåÆ α╕ùα╕│ `/report-status`, `/suggest-next-action`
3. α╕ûα╣ëα╕▓α╕íα╕╡ warnings ΓåÆ α╕úα╕▓α╕óα╕çα╕▓α╕Öα╕₧α╕úα╣ëα╕¡α╕íα╕äα╕│α╣üα╕Öα╕░α╕Öα╕│
4. α╕ûα╣ëα╕▓α╣Çα╕¢α╣çα╕Ö watch mode ΓåÆ α╕úα╕▓α╕óα╕çα╕▓α╕Ö errors α╕òα╣êα╕¡α╣Çα╕Öα╕╖α╣êα╕¡α╕çα╣üα╕Ñα╕░ fix α╕¡α╕▒α╕òα╣éα╕Öα╕íα╕▒α╕òα╕┤

## Rules

### 1. Safety

- α╕¡α╕óα╣êα╕▓α╕úα╕▒α╕Ö commands α╕ùα╕╡α╣ê destructive α╣éα╕öα╕óα╣äα╕íα╣ê confirm
- α╣âα╕èα╣ë `SafeToAutoRun` α╣Çα╕ëα╕₧α╕▓α╕░ commands α╕ùα╕╡α╣êα╕¢α╕Ñα╕¡α╕öα╕áα╕▒α╕ó
- α╕ûα╣ëα╕▓ command α╕íα╕╡ side effects ΓåÆ α╣üα╕êα╣ëα╕çα╕£α╕╣α╣ëα╣âα╕èα╣ëα╕üα╣êα╕¡α╕Öα╕úα╕▒α╕Ö

### 2. Error Handling

- α╕êα╕▒α╕Ü error α╕ùα╕╕α╕üα╕üα╕úα╕ôα╕╡ α╣äα╕íα╣êα╕¢α╕Ñα╣êα╕¡α╕óα╣âα╕½α╣ë crash
- α╣üα╕óα╕üα╕¢α╕úα╕░α╣Çα╕áα╕ù error: dependency, config, syntax, runtime
- α╕ûα╣ëα╕▓ error α╕ïα╣ëα╕│ 3 α╕äα╕úα╕▒α╣ëα╕ç ΓåÆ stop α╣üα╕Ñα╕░ report

### 3. Output

- α╕úα╕▓α╕óα╕çα╕▓α╕Öα╕¬α╕▒α╣ëα╕Öα╕üα╕úα╕░α╕èα╕▒α╕Ü α╣Çα╕Öα╣ëα╕Öα╕£α╕Ñα╕Ñα╕▒α╕₧α╕ÿα╣îα╣üα╕Ñα╕░ next action
- α╣äα╕íα╣ê dump output α╕ùα╕▒α╣ëα╕çα╕½α╕íα╕ö ΓÇö α╣Çα╕ëα╕₧α╕▓α╕░α╕¬α╣êα╕ºα╕Öα╕¬α╕│α╕äα╕▒α╕ì
- α╕ûα╣ëα╕▓α╕íα╕╡α╕òα╕▒α╕ºα╣Çα╕Ñα╕é (tests passed, coverage) ΓåÆ α╣üα╕¬α╕öα╕ç

## Expected Outcome

- Command α╕úα╕▒α╕Öα╕¬α╕│α╣Çα╕úα╣çα╕êα╕½α╕úα╕╖α╕¡α╕íα╕╡ error report α╕ùα╕╡α╣êα╕èα╕▒α╕öα╣Çα╕êα╕Ö
- Errors α╕ûα╕╣α╕ü resolve α╕½α╕úα╕╖α╕¡α╕íα╕╡ root cause α╕úα╕░α╕Üα╕╕
- α╕£α╕╣α╣ëα╣âα╕èα╣ëα╕úα╕╣α╣ëα╕£α╕Ñα╕Ñα╕▒α╕₧α╕ÿα╣îα╣üα╕Ñα╕░ next action

## Example Template

```markdown
---
title: Run Build
description: α╕úα╕▒α╕Ö build process α╕¬α╕│α╕½α╕úα╕▒α╕Ü production-ready artifacts
auto_execution_mode: 3
related:
  - /check-configuration
  - /resolve-errors
  - /report-status
---

## Goal
α╕úα╕▒α╕Ö build process α╕¬α╕│α╕½α╕úα╕▒α╕Ü workspace α╕ùα╕╡α╣êα╕üα╕│α╕½α╕Öα╕ö

## Scope
α╣âα╕èα╣ëα╕¬α╕│α╕½α╕úα╕▒α╕Ü build commands α╣âα╕Öα╕ùα╕╕α╕ü workspace

## Execute

### 1. Check Prerequisites
α╕òα╕úα╕ºα╕êα╕¬α╕¡α╕Üα╕üα╣êα╕¡α╕Öα╕úα╕▒α╕Ö build

> Goal: α╕úα╕▒α╕Öα╣äα╕öα╣ëα╣üα╕Öα╣êα╕Ö α╣äα╕íα╣êα╣Çα╕¬α╕╡α╕óα╣Çα╕ºα╕Ñα╕▓ fail

1. α╕òα╕úα╕ºα╕êα╕¬α╕¡α╕Üα╕ºα╣êα╕▓α╕íα╕╡ `package.json` α╕½α╕úα╕╖α╕¡ build config
2. α╕òα╕úα╕ºα╕êα╕¬α╕¡α╕Ü dependencies, α╕ùα╕│ `/check-configuration`
3. α╕ûα╣ëα╕▓α╕éα╕▓α╕ö ΓåÆ stop α╣üα╕Ñα╕░ report

### 2. Execute Build
α╕úα╕▒α╕Ö build command

> Goal: Build α╕¬α╕│α╣Çα╕úα╣çα╕êα╕½α╕úα╕╖α╕¡α╣äα╕öα╣ë error α╕èα╕▒α╕öα╣Çα╕êα╕Ö

1. α╕úα╕▒α╕Ö build command α╕₧α╕úα╣ëα╕¡α╕í timeout
2. α╕êα╕▒α╕Ü output α╣üα╕Ñα╕░ error α╣üα╕óα╕üα╕üα╕▒α╕Ö

### 3. Handle Errors
α╕êα╕▒α╕öα╕üα╕▓α╕ú errors

> Goal: Error α╕ûα╕╣α╕ü resolve α╕½α╕úα╕╖α╕¡ report

1. α╕ûα╣ëα╕▓α╕íα╕╡ errors ΓåÆ α╕ùα╕│ `/resolve-errors`
2. α╕ûα╣ëα╕▓α╕ïα╣ëα╕│ 3 α╕äα╕úα╕▒α╣ëα╕ç ΓåÆ stop α╣üα╕Ñα╕░ report

### 4. Report Results
α╕úα╕▓α╕óα╕çα╕▓α╕Öα╕£α╕Ñ

> Goal: α╕£α╕╣α╣ëα╣âα╕èα╣ëα╕úα╕╣α╣ëα╕£α╕Ñα╣üα╕Ñα╕░ next action

1. α╕¬α╕úα╕╕α╕¢: success/fail, duration, output size
2. α╕ùα╕│ `/suggest-next-action`

## Rules

### 1. Safety
- α╕¡α╕óα╣êα╕▓α╕úα╕▒α╕Ö destructive commands α╣éα╕öα╕óα╣äα╕íα╣ê confirm

### 2. Error Handling
- α╣üα╕óα╕üα╕¢α╕úα╕░α╣Çα╕áα╕ù error: dependency, config, syntax, runtime
- α╕ûα╣ëα╕▓ error α╕ïα╣ëα╕│ 3 α╕äα╕úα╕▒α╣ëα╕ç ΓåÆ stop

## Expected Outcome
- Build artifacts α╕₧α╕úα╣ëα╕¡α╕íα╣âα╕èα╣ë α╕½α╕úα╕╖α╕¡ error report α╕ùα╕╡α╣êα╕èα╕▒α╕öα╣Çα╕êα╕Ö
```

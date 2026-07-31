---
name: template-skills-analyze
description: Template สำหรับ analyze-* skills วิเคราะห์ codebase
---

## Goal

Template α╕¬α╕│α╕½α╕úα╕▒α╕Üα╕¬α╕úα╣ëα╕▓α╕ç `analyze-*` skills α╕ùα╕╡α╣êα╕ºα╕┤α╣Çα╕äα╕úα╕▓α╕░α╕½α╣î codebase α╕öα╣ëα╕ºα╕ó scripts, tools α╣üα╕Ñα╕░α╕½α╕Ñα╕▓α╕óα╕íα╕┤α╕òα╕┤

## Scope

α╣âα╕èα╣ëα╕¬α╕│α╕½α╕úα╕▒α╕Ü skills α╕ùα╕╡α╣êα╕ºα╕┤α╣Çα╕äα╕úα╕▓α╕░α╕½α╣î α╣Çα╕èα╣êα╕Ö `analyze-project`, `analyze-code-structure`, `deep-analyze-by-use-scripts`

## Execute

### 1. Gather Data

α╕úα╕ºα╕Üα╕úα╕ºα╕íα╕éα╣ëα╕¡α╕íα╕╣α╕Ñα╕êα╕▓α╕ü codebase

> Goal: α╕íα╕╡α╕éα╣ëα╕¡α╕íα╕╣α╕Ñα╕äα╕úα╕Üα╣Çα╕₧α╕╖α╣êα╕¡α╕ºα╕┤α╣Çα╕äα╕úα╕▓α╕░α╕½α╣î

1. α╕ùα╕│ `/scan-codebase`, α╕¡α╣êα╕▓α╕Ö package manifests, α╕¡α╣êα╕▓α╕Ö configs α╣üα╕Ñα╕░ key files
2. α╕ûα╣ëα╕▓α╕òα╣ëα╕¡α╕çα╕¢α╕úα╕░α╕íα╕ºα╕Ñα╕£α╕Ñα╕ïα╕▒α╕Üα╕ïα╣ëα╕¡α╕Ö ΓåÆ α╕ùα╕│ `/use-scripts`
3. α╕ûα╣ëα╕▓α╕éα╣ëα╕¡α╕íα╕╣α╕Ñα╣äα╕íα╣êα╕₧α╕¡ ΓåÆ α╣âα╕èα╣ë `/deep-analyze` α╣Çα╕₧α╕┤α╣êα╕íα╣Çα╕òα╕┤α╕í

### 2. Analyze

α╕ºα╕┤α╣Çα╕äα╕úα╕▓α╕░α╕½α╣îα╕éα╣ëα╕¡α╕íα╕╣α╕Ñα╕ùα╕╡α╣êα╕úα╕ºα╕Üα╕úα╕ºα╕í

> Goal: α╣Çα╕éα╣ëα╕▓α╣âα╕ê patterns, issues α╣üα╕Ñα╕░ opportunities

1. α╕ºα╕┤α╣Çα╕äα╕úα╕▓α╕░α╕½α╣î structure, dependencies α╣üα╕Ñα╕░ patterns
2. α╕úα╕░α╕Üα╕╕ strengths, α╕úα╕░α╕Üα╕╕ weaknesses, α╕úα╕░α╕Üα╕╕ gaps
3. α╕½α╕▓ root causes α╕éα╕¡α╕ç issues
4. α╕êα╕▒α╕öα╕üα╕Ñα╕╕α╣êα╕í findings α╕òα╕▓α╕í category

### 3. Report

α╕úα╕▓α╕óα╕çα╕▓α╕Öα╕£α╕Ñα╕üα╕▓α╕úα╕ºα╕┤α╣Çα╕äα╕úα╕▓α╕░α╕½α╣î

> Goal: Report α╕èα╕▒α╕öα╣Çα╕êα╕Ö α╕¡α╣êα╕▓α╕Öα╕çα╣êα╕▓α╕ó α╕Ñα╕│α╕öα╕▒α╕Üα╕ûα╕╣α╕üα╕òα╣ëα╕¡α╕ç

1. α╕ùα╕│ `/report-format-table` α╕¬α╕│α╕½α╕úα╕▒α╕Ü summary
2. α╕êα╕▒α╕öα╕Ñα╕│α╕öα╕▒α╕Ü findings α╕òα╕▓α╕í impact
3. α╕úα╕░α╕Üα╕╕ evidence α╕¬α╕│α╕½α╕úα╕▒α╕Üα╕ùα╕╕α╕ü finding
4. α╕ùα╕│ `/suggest-next-action`

## Rules

### 1. Data-Driven

- α╕ùα╕╕α╕ü finding α╕òα╣ëα╕¡α╕çα╕íα╕╡ evidence α╕êα╕▓α╕ü codebase
- α╕ûα╣ëα╕▓α╣Çα╕¢α╣çα╕Ö assumption ΓåÆ α╕úα╕░α╕Üα╕╕α╕èα╕▒α╕öα╣Çα╕êα╕Ö
- α╣äα╕íα╣êα╕¬α╕úα╕╕α╕¢α╣éα╕öα╕óα╣äα╕íα╣êα╕íα╕╡α╕éα╣ëα╕¡α╕íα╕╣α╕Ñ

### 2. Use Scripts

- α╕ûα╣ëα╕▓α╕¢α╕úα╕░α╕íα╕ºα╕Ñα╕£α╕Ñα╕ïα╕▒α╕Üα╕ïα╣ëα╕¡α╕Ö ΓåÆ α╕ùα╕│ `/use-scripts`
- α╣âα╕èα╣ë ast-grep α╕¬α╕│α╕½α╕úα╕▒α╕Ü structural analysis
- α╣âα╕èα╣ë health CLI α╕¬α╕│α╕½α╕úα╕▒α╕Ü project health

### 3. Completeness

- α╕äα╕úα╕¡α╕Üα╕äα╕Ñα╕╕α╕íα╕ùα╕╕α╕ü workspaces α╣âα╕Ö monorepo
- α╣äα╕íα╣êα╕éα╣ëα╕▓α╕í dependencies α╣üα╕Ñα╕░ configs
- α╕úα╕ºα╕í external references α╕ûα╣ëα╕▓α╣Çα╕üα╕╡α╣êα╕óα╕ºα╕éα╣ëα╕¡α╕ç

## Expected Outcome

- Analysis report α╕₧α╕úα╣ëα╕¡α╕í evidence α╣üα╕Ñα╕░ findings
- α╕êα╕▒α╕öα╕Ñα╕│α╕öα╕▒α╕Üα╕òα╕▓α╕í impact
- α╕£α╕╣α╣ëα╣âα╕èα╣ëα╕úα╕╣α╣ë next action α╕ùα╕╡α╣êα╕èα╕▒α╕öα╣Çα╕êα╕Ö

## Example Template

```markdown
---
title: Analyze Project
description: α╕ºα╕┤α╣Çα╕äα╕úα╕▓α╕░α╕½α╣îα╣éα╕¢α╕úα╣Çα╕êα╕üα╕òα╣îα╕₧α╕╖α╣ëα╕Öα╕Éα╕▓α╕Öα╕öα╣ëα╕ºα╕ó tools α╕ùα╕╡α╣êα╣Çα╕½α╕íα╕▓α╕░α╕¬α╕í
auto_execution_mode: 3
related:
  - /scan-codebase
  - /use-scripts
  - /report-format-table
---

## Goal
α╕ºα╕┤α╣Çα╕äα╕úα╕▓α╕░α╕½α╣î project structure, dependencies α╣üα╕Ñα╕░ patterns

## Scope
α╣âα╕èα╣ëα╕¬α╕│α╕½α╕úα╕▒α╕Ü project analysis α╣âα╕Öα╕ùα╕╕α╕ü workspace

## Execute

### 1. Gather Data
α╕úα╕ºα╕Üα╕úα╕ºα╕íα╕éα╣ëα╕¡α╕íα╕╣α╕Ñ

> Goal: α╕íα╕╡α╕éα╣ëα╕¡α╕íα╕╣α╕Ñα╕äα╕úα╕Ü

1. α╕ùα╕│ `/scan-codebase`, α╕¡α╣êα╕▓α╕Ö manifests, α╕¡α╣êα╕▓α╕Ö configs

### 2. Analyze
α╕ºα╕┤α╣Çα╕äα╕úα╕▓α╕░α╕½α╣î

> Goal: α╣Çα╕éα╣ëα╕▓α╣âα╕ê patterns α╣üα╕Ñα╕░ issues

1. α╕ºα╕┤α╣Çα╕äα╕úα╕▓α╕░α╕½α╣î structure α╣üα╕Ñα╕░ dependencies
2. α╕úα╕░α╕Üα╕╕ strengths, weaknesses, gaps

### 3. Report
α╕úα╕▓α╕óα╕çα╕▓α╕Ö

> Goal: Report α╕èα╕▒α╕öα╣Çα╕êα╕Ö

1. α╕ùα╕│ `/report-format-table`
2. α╕ùα╕│ `/suggest-next-action`

## Rules

### 1. Data-Driven
- α╕ùα╕╕α╕ü finding α╕òα╣ëα╕¡α╕çα╕íα╕╡ evidence

### 2. Use Scripts
- α╕ûα╣ëα╕▓α╕ïα╕▒α╕Üα╕ïα╣ëα╕¡α╕Ö ΓåÆ α╕ùα╕│ `/use-scripts`

## Expected Outcome
- Analysis report α╕₧α╕úα╣ëα╕¡α╕í evidence α╣üα╕Ñα╕░ findings
```
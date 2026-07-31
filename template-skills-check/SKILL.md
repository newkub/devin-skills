---
name: template-skills-check
description: Template สำหรับ check-* skills scan และ report
---

## Goal

Template α╕¬α╕│α╕½α╕úα╕▒α╕Üα╕¬α╕úα╣ëα╕▓α╕ç `check-*` skills α╕ùα╕╡α╣ê scan codebase α╕½α╕▓ issues α╣üα╕Ñα╕░ report findings α╕₧α╕úα╣ëα╕¡α╕íα╕äα╕│α╣üα╕Öα╕░α╕Öα╕│

## Scope

α╣âα╕èα╣ëα╕¬α╕│α╕½α╕úα╕▒α╕Ü skills α╕ùα╕╡α╣êα╕òα╕úα╕ºα╕êα╕¬α╕¡α╕Ü α╣Çα╕èα╣êα╕Ö `check-duplication`, `check-unused-deps`, `check-configuration`

## Execute

### 1. Define Scope

α╕üα╕│α╕½α╕Öα╕öα╕éα╕¡α╕Üα╣Çα╕éα╕òα╕üα╕▓α╕úα╕òα╕úα╕ºα╕êα╕¬α╕¡α╕Ü

> Goal: α╕úα╕╣α╣ëα╕ºα╣êα╕▓α╕êα╕░α╕òα╕úα╕ºα╕êα╕¬α╕¡α╕Üα╕¡α╕░α╣äα╕ú α╕ùα╕╡α╣êα╣äα╕½α╕Ö

1. α╕úα╕░α╕Üα╕╕ target: file, directory, package α╕½α╕úα╕╖α╕¡α╕ùα╕▒α╣ëα╕ç project
2. α╕úα╕░α╕Üα╕╕ criteria α╣üα╕Ñα╕░ pass/fail conditions
3. α╕ûα╣ëα╕▓ target α╣äα╕íα╣êα╕íα╕╡α╕¡α╕óα╕╣α╣ê ΓåÆ stop α╣üα╕Ñα╕░ report
4. α╕ûα╣ëα╕▓α╣Çα╕¢α╣çα╕Ö monorepo ΓåÆ α╕òα╕úα╕ºα╕êα╕¬α╕¡α╕Üα╕ùα╕╕α╕ü workspaces α╕½α╕úα╕╖α╕¡α╕úα╕░α╕Üα╕╕ workspace

### 2. Scan

α╕¬α╣üα╕üα╕Ö target α╕òα╕▓α╕í criteria

> Goal: α╕₧α╕Ü issues α╕ùα╕▒α╣ëα╕çα╕½α╕íα╕öα╕ùα╕╡α╣êα╣Çα╕üα╕╡α╣êα╕óα╕ºα╕éα╣ëα╕¡α╕ç

1. α╕ùα╕│ `/scan-codebase` α╣Çα╕₧α╕╖α╣êα╕¡α╕äα╣ëα╕Öα╕½α╕▓ patterns α╕ùα╕╡α╣êα╣Çα╕üα╕╡α╣êα╕óα╕ºα╕éα╣ëα╕¡α╕ç
2. α╣âα╕èα╣ë tools α╕ùα╕╡α╣êα╣Çα╕½α╕íα╕▓α╕░α╕¬α╕í (grep, ast-grep, jscpd, knip) α╕òα╕▓α╕í criteria
3. α╕êα╕▒α╕Üα╕£α╕Ñα╕Ñα╕▒α╕₧α╕ÿα╣îα╣Çα╕¢α╣çα╕Ö list α╕éα╕¡α╕ç findings
4. α╕ûα╣ëα╕▓α╣âα╕èα╣ë scripts α╕ïα╕▒α╕Üα╕ïα╣ëα╕¡α╕Ö ΓåÆ α╕ùα╕│ `/use-scripts`

### 3. Analyze Findings

α╕ºα╕┤α╣Çα╕äα╕úα╕▓α╕░α╕½α╣î findings

> Goal: α╣Çα╕éα╣ëα╕▓α╣âα╕ê severity α╣üα╕Ñα╕░ root cause α╕éα╕¡α╕çα╣üα╕òα╣êα╕Ñα╕░ finding

1. α╕êα╕▒α╕öα╕¢α╕úα╕░α╣Çα╕áα╕ù findings: Critical, Warning, Info
2. α╕úα╕░α╕Üα╕╕ root cause, α╕üα╕úα╕¡α╕ç false positives
3. α╕êα╕▒α╕öα╕Ñα╕│α╕öα╕▒α╕Üα╕òα╕▓α╕í impact

### 4. Report

α╕úα╕▓α╕óα╕çα╕▓α╕Öα╕£α╕Ñα╣üα╕Ñα╕░α╕äα╕│α╣üα╕Öα╕░α╕Öα╕│

> Goal: α╕£α╕╣α╣ëα╣âα╕èα╣ëα╕úα╕╣α╣ë issues α╣üα╕Ñα╕░α╕ºα╕┤α╕ÿα╕╡α╣üα╕üα╣ë

1. α╕¬α╕úα╣ëα╕▓α╕ç report α╣Çα╕¢α╣çα╕Öα╕òα╕▓α╕úα╕▓α╕ç: file, line, issue, severity, recommendation
2. α╕ûα╣ëα╕▓α╕íα╕╡ critical issues ΓåÆ α╣üα╕Öα╕░α╕Öα╕│α╣âα╕½α╣ëα╕ùα╕│ `/resolve-errors`
3. α╕ûα╣ëα╕▓α╣äα╕íα╣êα╕₧α╕Ü issues ΓåÆ report "no issues found"
4. α╕ùα╕│ `/suggest-next-action`

## Rules

### 1. Accuracy

- α╕üα╕úα╕¡α╕ç false positives α╕üα╣êα╕¡α╕Ö report
- α╕úα╕░α╕Üα╕╕ file α╣üα╕Ñα╕░ line number α╕èα╕▒α╕öα╣Çα╕êα╕Ö
- α╕ûα╣ëα╕▓α╣äα╕íα╣êα╣üα╕Öα╣êα╣âα╕ê ΓåÆ α╕úα╕░α╕Üα╕╕α╕úα╕░α╕öα╕▒α╕Üα╕äα╕ºα╕▓α╕íα╣äα╕íα╣êα╣üα╕Öα╣êα╕Öα╕¡α╕Ö

### 2. Completeness

- α╕òα╕úα╕ºα╕êα╕¬α╕¡α╕Üα╕äα╕úα╕Üα╕ùα╕╕α╕ü workspaces α╣âα╕Ö monorepo
- α╣äα╕íα╣êα╕éα╣ëα╕▓α╕í files α╕ùα╕╡α╣ê gitignored
- α╕úα╕ºα╕í dependencies α╣âα╕Öα╕üα╕▓α╕úα╕òα╕úα╕ºα╕êα╕¬α╕¡α╕Üα╕ûα╣ëα╕▓α╣Çα╕üα╕╡α╣êα╕óα╕ºα╕éα╣ëα╕¡α╕ç

### 3. Actionable

- α╕ùα╕╕α╕ü finding α╕òα╣ëα╕¡α╕çα╕íα╕╡ recommendation
- α╕ûα╣ëα╕▓ issue α╕ïα╕▒α╕Üα╕ïα╣ëα╕¡α╕Ö ΓåÆ α╣üα╕Öα╕░α╕Öα╕│ workflow α╕ùα╕╡α╣êα╣Çα╕½α╕íα╕▓α╕░α╕¬α╕í
- α╕ûα╣ëα╕▓α╣äα╕íα╣êα╕íα╕╡α╕ºα╕┤α╕ÿα╕╡α╣üα╕üα╣ë ΓåÆ α╕úα╕░α╕Üα╕╕α╕ºα╣êα╕▓α╕òα╣ëα╕¡α╕çα╕ºα╕┤α╕êα╕▒α╕óα╣Çα╕₧α╕┤α╣êα╕í

## Expected Outcome

- α╕úα╕▓α╕óα╕üα╕▓α╕ú findings α╕₧α╕úα╣ëα╕¡α╕í severity α╣üα╕Ñα╕░ recommendations
- α╣äα╕íα╣êα╕íα╕╡ false positives
- α╕£α╕╣α╣ëα╣âα╕èα╣ëα╕úα╕╣α╣ë next action α╕ùα╕╡α╣êα╕èα╕▒α╕öα╣Çα╕êα╕Ö

## Example Template

```markdown
---
title: Check Duplication
description: α╕òα╕úα╕ºα╕êα╕êα╕▒α╕Ü code duplication α╕öα╣ëα╕ºα╕ó jscpd
auto_execution_mode: 3
related:
  - /scan-codebase
  - /use-scripts
  - /report-status
---

## Goal
α╕òα╕úα╕ºα╕êα╕êα╕▒α╕Ü duplicate code α╣âα╕Ö project

## Scope
α╣âα╕èα╣ëα╕¬α╕│α╕½α╕úα╕▒α╕Üα╕ùα╕╕α╕ü workspace α╣âα╕Ö monorepo

## Execute

### 1. Define Scope
α╕üα╕│α╕½α╕Öα╕öα╕éα╕¡α╕Üα╣Çα╕éα╕ò

> Goal: α╕úα╕╣α╣ëα╕ºα╣êα╕▓α╕êα╕░α╕òα╕úα╕ºα╕êα╕¬α╕¡α╕Üα╕ùα╕╡α╣êα╣äα╕½α╕Ö

1. α╕úα╕░α╕Üα╕╕ target directories
2. α╕üα╕│α╕½α╕Öα╕ö threshold (α╣Çα╕èα╣êα╕Ö 5+ lines)

### 2. Scan
α╕¬α╣üα╕üα╕Öα╕½α╕▓ duplicates

> Goal: α╕₧α╕Ü duplicates α╕ùα╕▒α╣ëα╕çα╕½α╕íα╕ö

1. α╕úα╕▒α╕Ö jscpd α╕Üα╕Ö target
2. α╕êα╕▒α╕Üα╕£α╕Ñα╣Çα╕¢α╣çα╕Ö list

### 3. Analyze Findings
α╕ºα╕┤α╣Çα╕äα╕úα╕▓α╕░α╕½α╣îα╕£α╕Ñ

> Goal: α╣Çα╕éα╣ëα╕▓α╣âα╕ê severity

1. α╕êα╕▒α╕öα╕¢α╕úα╕░α╣Çα╕áα╕ù: Critical >50 lines, Warning 20-50, Info <20
2. α╕üα╕úα╕¡α╕ç false positives

### 4. Report
α╕úα╕▓α╕óα╕çα╕▓α╕Ö

> Goal: α╕£α╕╣α╣ëα╣âα╕èα╣ëα╕úα╕╣α╣ë issues

1. α╕¬α╕úα╣ëα╕▓α╕çα╕òα╕▓α╕úα╕▓α╕ç: file, line, duplicate, severity
2. α╕ùα╕│ `/suggest-next-action`

## Rules

### 1. Accuracy
- α╕üα╕úα╕¡α╕ç false positives α╕üα╣êα╕¡α╕Ö report

### 2. Completeness
- α╕òα╕úα╕ºα╕êα╕äα╕úα╕Üα╕ùα╕╕α╕ü workspaces

## Expected Outcome
- α╕úα╕▓α╕óα╕üα╕▓α╕ú duplicates α╕₧α╕úα╣ëα╕¡α╕í severity
```
---
name: template-skills-review
description: Template สำหรับ review-* skills วิเคราะห์ quality
---

## Goal

Template α╕¬α╕│α╕½α╕úα╕▒α╕Üα╕¬α╕úα╣ëα╕▓α╕ç `review-*` skills α╕ùα╕╡α╣êα╕ºα╕┤α╣Çα╕äα╕úα╕▓α╕░α╕½α╣î quality α╕₧α╕úα╣ëα╕¡α╕í severity ratings, health score, α╣üα╕Ñα╕░ actionable recommendations

## Scope

α╣âα╕èα╣ëα╕¬α╕│α╕½α╕úα╕▒α╕Ü skills α╕ùα╕╡α╣ê review α╣Çα╕èα╣êα╕Ö `review-code-quality`, `review-security`, `review-performance`, `review-architecture` ΓÇö α╣äα╕íα╣êα╕úα╕ºα╕í `review-codebase-everything` α╕ïα╕╢α╣êα╕çα╣Çα╕¢α╣çα╕Ö orchestrator

## Execute

### 1. Gather Context

α╕úα╕ºα╕Üα╕úα╕ºα╕í context α╕üα╣êα╕¡α╕Ö review

> Goal: α╣Çα╕éα╣ëα╕▓α╣âα╕ê scope, target, α╣üα╕Ñα╕░ criteria α╕éα╕¡α╕ç review

1. α╕úα╕░α╕Üα╕╕ review target: file, directory, package α╕½α╕úα╕╖α╕¡α╕ùα╕▒α╣ëα╕ç project
2. α╕¡α╣êα╕▓α╕Ö relevant configs, α╕¡α╣êα╕▓α╕Ö dependencies, α╕ùα╕│ `/scan-codebase`
3. α╕úα╕░α╕Üα╕╕ review criteria α╣üα╕Ñα╕░ rubric α╕¬α╕│α╕½α╕úα╕▒α╕Üα╣üα╕òα╣êα╕Ñα╕░ dimension
4. α╕ûα╣ëα╕▓α╣Çα╕¢α╣çα╕Ö web project ΓåÆ α╣Çα╕₧α╕┤α╣êα╕í `/run-dev` α╣Çα╕₧α╕╖α╣êα╕¡ verify dev server α╕üα╣êα╕¡α╕Ö review

### 2. Deep Analyze

α╕ºα╕┤α╣Çα╕äα╕úα╕▓α╕░α╕½α╣î target α╕¡α╕óα╣êα╕▓α╕çα╕Ñα╕╢α╕üα╕ïα╕╢α╣ëα╕çα╕öα╣ëα╕ºα╕ó health CLI α╣üα╕Ñα╕░ rules

> Goal: α╕₧α╕Üα╕ùα╕╕α╕ü issue α╕₧α╕úα╣ëα╕¡α╕í root cause α╣üα╕Ñα╕░ health score

1. α╕ùα╕│ `/deep-analyze` α╣Çα╕₧α╕╖α╣êα╕¡α╕ºα╕┤α╣Çα╕äα╕úα╕▓α╕░α╕½α╣îα╕½α╕Ñα╕▓α╕óα╕íα╕┤α╕òα╕┤α╕¡α╕óα╣êα╕▓α╕çα╕Ñα╕╢α╕üα╕ïα╕╢α╣ëα╕ç
2. α╕ùα╕│ `/update-codebase-health-cli` α╣Çα╕₧α╕╖α╣êα╕¡α╣âα╕½α╣ë analyzers α╕äα╕úα╕¡α╕Üα╕äα╕Ñα╕╕α╕í categories α╕Ñα╣êα╕▓α╕¬α╕╕α╕ö ΓÇö `/update-codebase-health-cli` α╣Çα╕úα╕╡α╕óα╕ü `/update-rules` α╕áα╕▓α╕óα╣âα╕Öα╕òα╕▒α╕ºα╣Çα╕¡α╕çα╣Çα╕₧α╕╖α╣êα╕¡α╕¡α╕▒α╕¢α╣Çα╕öα╕ò ast-grep rules α╣âα╕Ö `rules/` α╕öα╣ëα╕ºα╕ó
3. α╕ûα╣ëα╕▓ `/update-codebase-health-cli` α╕éα╣ëα╕▓α╕í `/update-rules` ΓåÆ α╕ùα╕│ `/update-rules` α╣üα╕óα╕üα╣Çα╕₧α╕╖α╣êα╕¡α╣âα╕½α╣ëα╣üα╕Öα╣êα╣âα╕êα╕ºα╣êα╕▓ rules α╕äα╕úα╕¡α╕Üα╕äα╕Ñα╕╕α╕í
4. α╕úα╕▒α╕Ö `bunx ast-grep scan --inspect summary` α╣Çα╕₧α╕╖α╣êα╕¡ verify rules α╕ùα╕│α╕çα╕▓α╕Öα╣äα╕öα╣ë
5. α╕úα╕▒α╕Ö `bun --filter @booking/tools-health health:json` α╣Çα╕₧α╕╖α╣êα╕¡α╕öα╕╢α╕ç health report α╕₧α╕úα╣ëα╕¡α╕í metrics
6. α╕òα╕úα╕ºα╕êα╕¬α╕¡α╕Üα╕ùα╕╡α╕Ñα╕░ dimension α╕òα╕▓α╕í criteria α╕êα╕▓α╕ü health CLI output
7. α╕êα╕▒α╕Ü findings α╣Çα╕¢α╣çα╕Ö list α╕₧α╕úα╣ëα╕¡α╕í evidence (file, line, code snippet)
8. α╕òα╕úα╕ºα╕êα╕¬α╕¡α╕Üα╕ùα╕▒α╣ëα╕ç positive α╣üα╕Ñα╕░ negative aspects

### 3. Run Health

α╕úα╕▒α╕Ö health CLI α╣Çα╕₧α╕╖α╣êα╕¡α╕öα╕╢α╕ç metrics α╕Ñα╣êα╕▓α╕¬α╕╕α╕ö

> Goal: α╕íα╕╡ health report α╕₧α╕úα╣ëα╕¡α╕í metrics α╕¬α╕│α╕½α╕úα╕▒α╕Ü scoring

1. α╕ùα╕│ `/run-health` α╣Çα╕₧α╕╖α╣êα╕¡α╕úα╕▒α╕Ö health CLI α╣üα╕Ñα╕░α╕öα╕╢α╕ç health report
2. α╣âα╕èα╣ë health report α╕¬α╕│α╕½α╕úα╕▒α╕Üα╕äα╕│α╕Öα╕ºα╕ô health score α╣âα╕Öα╕éα╕▒α╣ëα╕Öα╕òα╕¡α╕Öα╕ûα╕▒α╕öα╣äα╕¢

### 4. Validate Findings

α╕òα╕úα╕ºα╕êα╕¬α╕¡α╕Ü findings α╕¡α╕óα╣êα╕▓α╕çα╕Ñα╕░α╣Çα╕¡α╕╡α╕óα╕öα╕½α╕Ñα╕▓α╕óα╕íα╕┤α╕òα╕┤

> Goal: findings α╕ùα╕╡α╣êα╕£α╣êα╕▓α╕Ö validation α╣Çα╕ùα╣êα╕▓α╕Öα╕▒α╣ëα╕Ö α╕Ñα╕ö noise α╣üα╕Ñα╕░ rework

1. α╕ùα╕│ `/deep-validate` α╣Çα╕₧α╕╖α╣êα╕¡ validate findings α╕½α╕Ñα╕▓α╕óα╕íα╕┤α╕òα╕┤: cross-reference, type safety, runtime, security, compliance
2. cross-check: α╣üα╕òα╣êα╕Ñα╕░ finding α╕òα╣ëα╕¡α╕çα╕íα╕╡ evidence α╕èα╕▒α╕öα╣Çα╕êα╕Ö (file, line, code) ΓÇö α╕ûα╣ëα╕▓α╣äα╕íα╣êα╕íα╕╡ ΓåÆ discard
3. α╕òα╕úα╕ºα╕êα╕¬α╕¡α╕Üα╕ºα╣êα╕▓ finding α╣Çα╕¢α╣çα╕Öα╕¢α╕▒α╕ìα╕½α╕▓α╕êα╕úα╕┤α╕ç α╣äα╕íα╣êα╣âα╕èα╣ê false positive α╕êα╕▓α╕ü tool
4. α╕ûα╣ëα╕▓ finding α╕ïα╣ëα╕¡α╕Öα╕ùα╕▒α╕Üα╕üα╕▒α╕Ü review α╕¡α╕╖α╣êα╕Ö ΓåÆ α╕¡α╣ëα╕▓α╕çα╕¡α╕┤α╕çα╣üα╕ùα╕Ö α╣äα╕íα╣ê duplicate
5. α╕ûα╣ëα╕▓ finding α╕Öα╕¡α╕ü scope ΓåÆ α╕úα╕░α╕Üα╕╕α╣Çα╕¢α╣çα╕Ö info α╣Çα╕ùα╣êα╕▓α╕Öα╕▒α╣ëα╕Ö α╣äα╕íα╣ê rate severity

### 5. Rate Severity And Health Score

α╣âα╕½α╣ëα╕äα╕░α╣üα╕Öα╕Ö severity α╕éα╕¡α╕çα╣üα╕òα╣êα╕Ñα╕░ finding α╣üα╕Ñα╕░α╕äα╕│α╕Öα╕ºα╕ô health score

> Goal: α╕£α╕╣α╣ëα╣âα╕èα╣ëα╕úα╕╣α╣ëα╕Ñα╕│α╕öα╕▒α╕Üα╕äα╕ºα╕▓α╕íα╕¬α╕│α╕äα╕▒α╕ìα╣üα╕Ñα╕░α╕¬α╕ûα╕▓α╕Öα╕░ overall health

1. α╣âα╕½α╣ë severity: Critical, High, Medium, Low, Info
2. α╕₧α╕┤α╕êα╕▓α╕úα╕ôα╕▓ impact (security, performance, maintainability, UX)
3. α╕₧α╕┤α╕êα╕▓α╕úα╕ôα╕▓ effort: quick fix, moderate, major refactor
4. α╕äα╕│α╕Öα╕ºα╕ô health score: (Critical=0, High=25, Medium=50, Low=75, Info=100) ΓåÆ weighted average
5. α╕êα╕▒α╕öα╕Ñα╕│α╕öα╕▒α╕Ü findings α╕òα╕▓α╕í severity

### 6. Recommend

α╣üα╕Öα╕░α╕Öα╕│ actions α╕ùα╕╡α╣ê actionable α╣üα╕Ñα╕░α╕êα╕▒α╕öα╕Ñα╕│α╕öα╕▒α╕Üα╕òα╕▓α╕í priority

> Goal: α╕£α╕╣α╣ëα╣âα╕èα╣ëα╕úα╕╣α╣ëα╕ºα╣êα╕▓α╕òα╣ëα╕¡α╕çα╕ùα╕│α╕¡α╕░α╣äα╕úα╕üα╣êα╕¡α╕Ö α╕₧α╕úα╣ëα╕¡α╕í estimated effort

1. α╕¬α╕│α╕½α╕úα╕▒α╕Üα╣üα╕òα╣êα╕Ñα╕░ finding ΓåÆ α╣üα╕Öα╕░α╕Öα╕│ fix α╕½α╕úα╕╖α╕¡ workflow α╕ùα╕╡α╣êα╣Çα╕½α╕íα╕▓α╕░α╕¬α╕í
2. α╕êα╕▒α╕öα╕üα╕Ñα╕╕α╣êα╕í recommendations: immediate, short-term, long-term
3. α╕úα╕░α╕Üα╕╕ estimated effort α╕¬α╕│α╕½α╕úα╕▒α╕Üα╣üα╕òα╣êα╕Ñα╕░ action
4. α╕ùα╕│ `/report-review`, α╕ùα╕│ `/report-format-table` α╕¬α╕│α╕½α╕úα╕▒α╕Ü summary
5. α╕ùα╕│ `/suggest-next-action`

### 7. Implement All

α╕òα╕úα╕ºα╕êα╕¬α╕¡α╕Üα╕ºα╣êα╕▓ findings α╕ùα╕╡α╣êα╕₧α╕Üα╕¬α╕▓α╕íα╕▓α╕úα╕û implement α╣äα╕öα╣ëα╕êα╕úα╕┤α╕ç

> Goal: α╣äα╕íα╣êα╕íα╕╡ TODO, MOCK, STUB, placeholder α╕äα╣ëα╕▓α╕çα╕¡α╕óα╕╣α╣êα╕½α╕Ñα╕▒α╕ç review

1. α╕ùα╕│ `/implement-all` α╣Çα╕₧α╕╖α╣êα╕¡α╕òα╕úα╕ºα╕êα╕¬α╕¡α╕Ü implementation completeness α╕éα╕¡α╕ç areas α╕ùα╕╡α╣ê review
2. α╕ûα╣ëα╕▓α╕₧α╕Ü incomplete implementations ΓåÆ α╣Çα╕₧α╕┤α╣êα╕íα╣Çα╕¢α╣çα╕Ö findings α╣âα╕Ö report

## Rules

### 1. Objectivity

- α╣âα╕½α╣ëα╕äα╕░α╣üα╕Öα╕Öα╕òα╕▓α╕í criteria α╕ùα╕╡α╣êα╕üα╕│α╕½α╕Öα╕ö α╣äα╕íα╣êα╕òα╕▓α╕íα╕äα╕ºα╕▓α╕íα╕èα╕¡α╕Üα╕¬α╣êα╕ºα╕Öα╕òα╕▒α╕º
- α╕úα╕░α╕Üα╕╕ evidence α╕ùα╕╕α╕ü finding ΓÇö file, line, code snippet
- α╕ûα╣ëα╕▓α╣äα╕íα╣êα╣üα╕Öα╣êα╣âα╕ê ΓåÆ α╕úα╕░α╕Üα╕╕α╕úα╕░α╕öα╕▒α╕Üα╕äα╕ºα╕▓α╕íα╣äα╕íα╣êα╣üα╕Öα╣êα╕Öα╕¡α╕Ö

### 2. Actionable

- α╕ùα╕╕α╕ü finding α╕òα╣ëα╕¡α╕çα╕íα╕╡ recommendation
- α╕ûα╣ëα╕▓ recommendation α╕äα╕╖α╕¡ "α╕ùα╕│ workflow X" ΓåÆ α╕úα╕░α╕Üα╕╕α╕ºα╣êα╕▓α╕ùα╕│α╕óα╕▒α╕çα╣äα╕ç
- α╕ûα╣ëα╕▓ issue α╣äα╕íα╣êα╕¬α╕▓α╕íα╕▓α╕úα╕ûα╣üα╕üα╣ëα╣äα╕öα╣ëα╣âα╕Öα╕¢α╕▒α╕êα╕êα╕╕α╕Üα╕▒α╕Ö ΓåÆ α╕úα╕░α╕Üα╕╕α╣Çα╕¢α╣çα╕Ö long-term

### 3. Balance

- α╕úα╕▓α╕óα╕çα╕▓α╕Öα╕ùα╕▒α╣ëα╕ç strengths α╣üα╕Ñα╕░ weaknesses
- α╣äα╕íα╣ê focus α╣Çα╕ëα╕₧α╕▓α╕░ negative
- α╕èα╕╖α╣êα╕Öα╕èα╕í patterns α╕ùα╕╡α╣êα╕öα╕╡

### 4. Scope

- α╣äα╕íα╣ê review α╕Öα╕¡α╕ü scope α╕ùα╕╡α╣êα╕üα╕│α╕½α╕Öα╕ö
- α╕ûα╣ëα╕▓α╕₧α╕Ü issue α╕Öα╕¡α╕ü scope ΓåÆ α╕úα╕░α╕Üα╕╕α╣Çα╕¢α╣çα╕Ö info α╣Çα╕ùα╣êα╕▓α╕Öα╕▒α╣ëα╕Ö
- α╕ûα╣ëα╕▓ issue α╕ïα╣ëα╕¡α╕Öα╕ùα╕▒α╕Üα╕üα╕▒α╕Ü review α╕¡α╕╖α╣êα╕Ö ΓåÆ α╕¡α╣ëα╕▓α╕çα╕¡α╕┤α╕ç

### 5. Evidence Quality

- α╣üα╕òα╣êα╕Ñα╕░ finding α╕òα╣ëα╕¡α╕çα╕íα╕╡: file path, line number, code snippet α╕½α╕úα╕╖α╕¡ config evidence
- α╕ûα╣ëα╕▓ evidence α╣äα╕íα╣êα╣Çα╕₧α╕╡α╕óα╕çα╕₧α╕¡ ΓåÆ α╕ùα╕│ `/scan-codebase` α╣Çα╕₧α╕┤α╣êα╕íα╣Çα╕òα╕┤α╕í
- α╕½α╣ëα╕▓α╕í report α╣éα╕öα╕óα╣äα╕íα╣êα╕íα╕╡ evidence α╕½α╕úα╕╖α╕¡α╕¡α╣ëα╕▓α╕çα╕¡α╕┤α╕çα╕êα╕▓α╕üα╕äα╕ºα╕▓α╕íα╕êα╕│α╣Çα╕₧α╕╡α╕óα╕çα╕¡α╕óα╣êα╕▓α╕çα╣Çα╕öα╕╡α╕óα╕º

### 6. Health Score

- α╕äα╕│α╕Öα╕ºα╕ô health score α╣Çα╕¢α╣çα╕Ö percentage (0-100)
- 0 = α╕ùα╕╕α╕ü finding α╣Çα╕¢α╣çα╕Ö Critical, 100 = α╣äα╕íα╣êα╕íα╕╡ finding
- α╣üα╕¬α╕öα╕ç score α╕òα╣êα╕¡ dimension α╣üα╕Ñα╕░ overall score
- α╣âα╕èα╣ë score α╣Çα╕¢α╕úα╕╡α╕óα╕Üα╣Çα╕ùα╕╡α╕óα╕Ü before/after α╣âα╕Öα╕üα╕▓α╕úα╕¢α╕úα╕▒α╕Üα╕¢α╕úα╕╕α╕ç

### 7. Formatting

- α╕½α╣ëα╕▓α╕íα╣âα╕èα╣ë `**` (bold markers) ΓÇö α╣âα╕èα╣ë backticks α╕¬α╕│α╕½α╕úα╕▒α╕Ü emphasis
- α╣âα╕èα╣ë heading levels α╕¬α╕│α╕½α╕úα╕▒α╕Ü structure
- α╕úα╕▓α╕óα╕çα╕▓α╕Öα╣Çα╕¢α╣çα╕Öα╕òα╕▓α╕úα╕▓α╕çα╕öα╣ëα╕ºα╕ó `/report-format-table`

## Expected Outcome

- Review report α╕₧α╕úα╣ëα╕¡α╕í severity ratings, health score, α╣üα╕Ñα╕░ recommendations
- α╕£α╕╣α╣ëα╣âα╕èα╣ëα╕úα╕╣α╣ëα╕Ñα╕│α╕öα╕▒α╕Üα╕üα╕▓α╕úα╣üα╕üα╣ëα╣äα╕éα╣üα╕Ñα╕░ estimated effort
- α╕ùα╕╕α╕ü finding α╕íα╕╡ evidence α╣üα╕Ñα╕░ actionable fix
- Health score α╕òα╣êα╕¡ dimension α╣üα╕Ñα╕░ overall

## Example Template

```markdown
---
title: Review Code Quality
description: Review code quality α╕äα╕úα╕¡α╕Üα╕äα╕Ñα╕╕α╕í static analysis, architecture, types
auto_execution_mode: 3
related:
  - /scan-codebase
  - /update-codebase-health-cli
  - /report-review
  - /report-format-table
  - /suggest-next-action
---

## Goal

Review code quality α╕₧α╕úα╣ëα╕¡α╕í severity, health score, α╣üα╕Ñα╕░ recommendations

## Scope

α╣âα╕èα╣ëα╕¬α╕│α╕½α╕úα╕▒α╕Ü code quality review α╣âα╕Öα╕ùα╕╕α╕ü workspace ΓÇö α╕äα╕úα╕¡α╕Üα╕äα╕Ñα╕╕α╕í naming, types, complexity, duplication

## Execute

### 1. Gather Context

α╕úα╕ºα╕Üα╕úα╕ºα╕í context α╕üα╣êα╕¡α╕Ö review

> Goal: α╣Çα╕éα╣ëα╕▓α╣âα╕ê scope α╣üα╕Ñα╕░ target

1. α╕úα╕░α╕Üα╕╕ target workspace
2. α╕¡α╣êα╕▓α╕Ö configs, α╕ùα╕│ `/scan-codebase`

### 2. Analyze

α╕ºα╕┤α╣Çα╕äα╕úα╕▓α╕░α╕½α╣îα╕òα╕▓α╕í criteria

> Goal: α╕₧α╕Üα╕ùα╕╕α╕ü issue α╕₧α╕úα╣ëα╕¡α╕í evidence

1. α╕ùα╕│ `/update-codebase-health-cli` ΓÇö `/update-codebase-health-cli` α╣Çα╕úα╕╡α╕óα╕ü `/update-rules` α╕áα╕▓α╕óα╣âα╕Öα╣Çα╕₧α╕╖α╣êα╕¡α╕¡α╕▒α╕¢α╣Çα╕öα╕ò ast-grep rules
2. α╕ûα╣ëα╕▓ `/update-codebase-health-cli` α╕éα╣ëα╕▓α╕í `/update-rules` ΓåÆ α╕ùα╕│ `/update-rules` α╣üα╕óα╕ü
3. α╕úα╕▒α╕Ö `bunx ast-grep scan --inspect summary` α╣Çα╕₧α╕╖α╣êα╕¡ verify rules
4. α╕òα╕úα╕ºα╕êα╕¬α╕¡α╕Ü: naming, types, complexity, duplication
5. α╕êα╕▒α╕Ü findings α╕₧α╕úα╣ëα╕¡α╕í evidence (file, line, code)

### 3. Validate Findings

α╕òα╕úα╕ºα╕êα╕¬α╕¡α╕Ü findings α╕Ñα╕ö false positives

> Goal: findings α╕ùα╕╡α╣êα╕£α╣êα╕▓α╕Ö validation α╣Çα╕ùα╣êα╕▓α╕Öα╕▒α╣ëα╕Ö

1. cross-check α╣üα╕òα╣êα╕Ñα╕░ finding α╕íα╕╡ evidence α╕èα╕▒α╕öα╣Çα╕êα╕Ö
2. α╕ûα╣ëα╕▓α╣äα╕íα╣êα╕íα╕╡ evidence ΓåÆ discard

### 4. Rate Severity And Health Score

α╣âα╕½α╣ëα╕äα╕░α╣üα╕Öα╕Öα╣üα╕Ñα╕░α╕äα╕│α╕Öα╕ºα╕ô health score

> Goal: α╕úα╕╣α╣ëα╕Ñα╕│α╕öα╕▒α╕Üα╕äα╕ºα╕▓α╕íα╕¬α╕│α╕äα╕▒α╕ìα╣üα╕Ñα╕░ overall health

1. α╣âα╕½α╣ë severity: Critical, High, Medium, Low, Info
2. α╕äα╕│α╕Öα╕ºα╕ô health score α╕òα╣êα╕¡ dimension

### 5. Recommend

α╣üα╕Öα╕░α╕Öα╕│ actions

> Goal: α╕úα╕╣α╣ëα╕ºα╣êα╕▓α╕ùα╕│α╕¡α╕░α╣äα╕úα╕üα╣êα╕¡α╕Ö

1. α╕êα╕▒α╕öα╕üα╕Ñα╕╕α╣êα╕í: immediate, short-term, long-term
2. α╕ùα╕│ `/report-review`, α╕ùα╕│ `/report-format-table`
3. α╕ùα╕│ `/suggest-next-action`

## Rules

### 1. Objectivity
- α╣âα╕½α╣ëα╕äα╕░α╣üα╕Öα╕Öα╕òα╕▓α╕í criteria α╣äα╕íα╣êα╕òα╕▓α╕íα╕äα╕ºα╕▓α╕íα╕èα╕¡α╕Ü
- α╕úα╕░α╕Üα╕╕ evidence α╕ùα╕╕α╕ü finding

### 2. Actionable
- α╕ùα╕╕α╕ü finding α╕òα╣ëα╕¡α╕çα╕íα╕╡ recommendation

### 3. Evidence Quality
- α╣üα╕òα╣êα╕Ñα╕░ finding α╕òα╣ëα╕¡α╕çα╕íα╕╡ file path, line number, code snippet

## Expected Outcome

- Review report α╕₧α╕úα╣ëα╕¡α╕í severity, health score, α╣üα╕Ñα╕░ recommendations
- α╕ùα╕╕α╕ü finding α╕íα╕╡ evidence α╣üα╕Ñα╕░ actionable fix
```
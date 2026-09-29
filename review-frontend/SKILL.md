---
name: review-frontend
description: Review frontend code quality, components, state, rendering, type safety, CSS, forms, testing
argument-hint: "[scope]"
related:
  - review-uxui
  - follow-tool-lighthouse
  - deep-review
  - review-code-quality
  - scan-codebase
  - deep-analyze
  - run-review
  - deep-validate
  - report
  - suggest-next-action
  - use-subagents
---

## Goal

Review frontend code quality ครอบคลุม component architecture, state management, rendering performance, type safety, CSS/styling architecture, form and error handling, และ frontend testing พร้อม severity ratings และ review score — domain checklist อยู่ใน `subagents/frontend-reviewer/` (dispatch ไป subagent ไม่ตรวจเอง)

## Scope

frontend code review สำหรับ project ที่มี UI code (React, Vue, Solid, Svelte, Angular) — ตรวจ component patterns, state management, rendering optimization, type safety, CSS architecture, form handling, error boundaries, และ test coverage

| Dimension | Checklist |
|-----------|-----------|
| `components` — composition, boundaries, reusability, API, organization | `subagents/frontend-reviewer/components.md` |
| `state` — organization, reactivity, persistence, immutability, hooks/composables | `subagents/frontend-reviewer/state-management.md`, `subagents/frontend-reviewer/hooks-composables.md` |
| `rendering` — re-renders, virtualization, code splitting, bundle, event handling | `subagents/frontend-reviewer/rendering-performance.md`, `subagents/frontend-reviewer/event-handling.md` |
| `types` — `any` usage, inference, generics, compatibility | `subagents/frontend-reviewer/type-safety.md` |
| `css` — styling architecture, specificity, responsive, CSS perf | `subagents/frontend-reviewer/css-styling.md` |
| `forms` — validation, UX, error boundaries, error handling | `subagents/frontend-reviewer/forms.md` |
| `testing` — component/hook/integration/E2E quality | `subagents/frontend-reviewer/testing.md` |
| `fetching` — waterfalls, caching, races, async states | `subagents/frontend-reviewer/data-fetching.md` |
| `web` — rendered-app checks (routes, console, PWA, vitals) | `subagents/frontend-reviewer/web-checklist.md` |

ไม่รวม:
- design quality, design system, visual, accessibility (design perspective) → ใช้ `/review-uxui`
- platform-level (mobile, desktop, CLI, SSR, i18n, web vitals) → ใช้ `/deep-review`
- SEO → ใช้ `/review-seo`
- general code quality, bug-prone patterns → ใช้ `/review-code-quality`
- architecture, modularity, boundaries → ใช้ `/review-architecture`

## Execute

### 1. Prepare And Baseline

> Goal: เข้าใจ frontend stack และ structure พร้อมเก็บ baseline

1. ทำตาม `subagents/frontend-reviewer/prepare.md` — framework, state library, styling system, form library, testing framework
2. ทำ `/scan-codebase` เพื่อเข้าใจ frontend structure และ stack
3. ทำ `/deep-analyze` + `/deep-review` เก็บ analyzer baseline (ใช้เป็น findings-file ให้ subagent cross-check)
4. รัน `bun --filter tools-review-codebase review-codebase:json` เพื่อดึง review report พร้อม metrics; ทำ `/run-review` ดึง metrics ล่าสุด
5. ถ้าสแกนไม่ได้ → stop และ report

### 2. Dispatch Frontend-Reviewer

> Goal: domain review ทำโดย subagent ที่มี checklist เต็ม

1. เลือก dimensions จาก scope argument — ไม่ระบุ → ทุก dimension ที่ apply (ตาม skip conditions ใน Rules)
2. Spawn `subagents/frontend-reviewer/AGENT.md` ผ่าน `/use-subagents` ส่ง `scope`, `dimensions`, `findings-file` (baseline จาก step 1)
3. scope ใหญ่/หลาย entry → spawn หลาย instance ทีละ scope ขนานกัน — dimensions ต่างกันใน scope เดียวรวมเป็น instance เดียว

### 3. Aggregate And Validate

> Goal: findings รวมกันถูกต้องพร้อม severity + score ต่อ dimension

1. รวม findings จากทุก instance — dedup ตาม file:line + issue type
2. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ: cross-reference, type safety, runtime, security, compliance — จัดลำดับการ validate ตาม severity Critical → Info และระบุ false positives
3. ถ้า validation ไม่ผ่าน → ส่ง dimension นั้นกลับให้ reviewer ตรวจซ้ำ
4. Validate score ตาม `subagents/frontend-reviewer/scoring.md`

### 4. Report

> Goal: รายงานครบทุก dimension พร้อม actionable recommendations และ next actions

1. รายงานตาม `subagents/frontend-reviewer/reporting.md` — ทำ `/report` ตาราง No./Dimension/Severity/File/Finding/Suggestion + Metrics Summary + score ต่อ dimension และ overall
2. ทำ `/suggest-next-action`

### Subskills

> Goal: dispatch งานเฉพาะรูปแบบ — check-* report subskill format findings, improve-* fix เมื่อ user confirm

| Topic | Subskill |
|-------|----------|
| `state`, `hooks` — state placement, derived state, drilling | `subskills/check-state/SKILL.md` |
| `forms`, `errors` — validation, submit states, a11y | `subskills/check-forms/SKILL.md` |
| `fetching`, `async`, `data` — waterfalls, caching, races | `subskills/check-fetching/SKILL.md` |
| Fix hydration mismatches + reduce scope (user confirm) | `subskills/improve-hydration/SKILL.md` |
| rendering performance findings (re-renders, memoization, lists, lazy components) | `subskills/improve-rendering/SKILL.md` |

## Rules

### 1. Scope Boundary
- เน้น frontend code quality
- ไม่ซ้ำกับ `/review-uxui`, `/deep-review`, `/review-seo`, `/review-code-quality`, `/review-architecture`
- focus ที่ component patterns, state, rendering, types, CSS, forms, testing
- ห้าม duplicate checklist detail ใน SKILL.md — canonical อยู่ที่ `subagents/frontend-reviewer/` เท่านั้น

### 2. Skip Conditions
- ถ้า project ไม่มี UI code → stop และ report
- ถ้า project ไม่มี state management library → ข้าม state management checks แต่ตรวจ local state
- ถ้า project ไม่มี forms → ข้าม form checks
- ถ้า project ไม่มี tests → ข้าม testing checks แต่ flag เป็น High finding
- ถ้า project ไม่ใช้ TypeScript → ข้าม type safety checks

### 3. Severity Classification
- Critical: God component, state corruption, no error boundary, re-render storm, `any` บน critical path, no tests บน critical components
- High: prop drilling, tight coupling, missing memoization, missing lazy loading, implicit `any`, no form validation, low test coverage
- Medium: inconsistent component API, missing abstraction, minor re-renders, specificity issues, missing async validation
- Low: cosmetic, naming, documentation gap
- Info: suggestion, best practice recommendation

### 4. Evidence-Based Findings
- ทุก finding ต้องมี file path และ line number (frontend)
- ไม่เดา ใช้ tools สำหรับ verification (`ast-grep`, `knip`, `madge`, React DevTools profiler)
- ระบุ component, hook, store, page, หรือ CSS rule ที่เกี่ยวข้อง
- ระบุ false positives ที่พบ

### 5. Review Independence
- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review (frontend)
- ไม่ลบไฟล์, โค้ด, components, หรือ configuration ระหว่าง review
- ถ้าพบ issues ที่ต้องแก้ไข → report ผ่าน `/report` และ `/suggest-next-action`

### 6. Health Score
- ตาม `../shared/review-rules.md` — Health Score (score ตาม `subagents/frontend-reviewer/scoring.md`)

### 7. Formatting
- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis (frontend)
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report`

## Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

1. จัดลำดับ findings ตาม severity — canonical steps ที่ `../shared/review-fix.md`
2. dispatch ตาม subskills — rendering → `subskills/improve-rendering/SKILL.md`; hydration → mismatch แก้ที่ root cause (browser-only APIs ย้ายไป post-mount, non-deterministic values ทำ stable, invalid HTML nesting; `suppressHydrationWarning` เฉพาะ leaf ที่จำเป็น), cost ลด scope (ลบ `'use client'`/`client:load` บน display-only, islands, `client:visible`/`client:idle`, defer third-party) — findings อื่น (components, state, type safety, CSS, forms, offline) แก้ตาม finding ตรงๆ (frontend)
3. preserve behavior + verify + report — canonical ที่ `../shared/review-fix.md`

## Expected Outcome

- รายงานตาราง findings จากทุก frontend dimension พร้อม severity และ location
- รายงาน Metrics Summary พร้อม status indicators และ score ต่อ dimension
- รายงาน recommended actions พร้อม priority (frontend)
- Review score ต่อ dimension และ overall พร้อม grade
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

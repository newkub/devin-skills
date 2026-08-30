---
name: review-frontend
description: Review frontend code quality, components, state, rendering, type safety, CSS, forms, testing
related:
  - review-uxui
  - review-platform
  - review-quality
  - scan-codebase
  - deep-analyze
  - run-review
  - deep-validate
  - report
  - report-table
  - suggest-next-action
---

## Goal

Review frontend code quality ครอบคลุม component architecture, state management, rendering performance, type safety, CSS/styling architecture, form and error handling, และ frontend testing พร้อม severity ratings และ review score

## Scope

frontend code review สำหรับ project ที่มี UI code (React, Vue, Solid, Svelte, Angular) — ตรวจ component patterns, state management, rendering optimization, type safety, CSS architecture, form handling, error boundaries, และ test coverage

ไม่รวม:
- design quality, design system, visual, accessibility (design perspective) → ใช้ `/review-uxui`
- platform-level (mobile, desktop, CLI, SSR, i18n, web vitals) → ใช้ `/review-platform`
- SEO → ใช้ `/review-seo`
- general code quality, bug-prone patterns → ใช้ `/review-quality`
- architecture, modularity, boundaries → ใช้ `/review-architecture`

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ frontend stack และ structure

1. ทำ `/scan-codebase` เพื่อเข้าใจ frontend structure และ stack
2. ระบุ frontend framework, state management library, styling system, form library, testing framework
3. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติ
4. ทำ `/review-codebase-everything` เพื่อให้ analyzers ครอบคลุม categories ล่าสุด
5. รัน `bun --filter tools-review-codebase review-codebase:json` เพื่อดึง review report พร้อม metrics
6. ทำ `/run-review` เพื่อรัน review CLI และดึง metrics ล่าสุด
7. ถ้าสแกนไม่ได้ → stop และ report

### 2. Component Architecture Review

> Goal: ตรวจ component composition, boundaries, reusability, API, organization

ทำตาม `references/components.md`

### 3. State Management And Hooks Review

> Goal: ตรวจ state organization, reactivity, side effects, persistence, immutability, hooks/composables

ทำตาม `references/state-management.md` และ `references/hooks-composables.md`

### 4. Rendering Performance And Event Handling Review

> Goal: ตรวจ re-renders, virtualization, code splitting, bundle, event handling

ทำตาม `references/rendering-performance.md` และ `references/event-handling.md`

### 5. Type Safety Review

> Goal: ตรวจ type safety

ทำตาม `references/type-safety.md`

### 6. CSS And Styling Review

> Goal: ตรวจ CSS/styling architecture

ทำตาม `references/css-styling.md`

### 7. Form And Error Handling Review

> Goal: ตรวจ form validation, UX, error boundaries, error handling

ทำตาม `references/forms.md`

### 8. Frontend Testing Review

> Goal: ตรวจ testing strategy and quality

ทำตาม `references/testing.md`

### 9. Validate Findings

> Goal: Issues ถูกต้องและจัดลำดับตาม severity

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ: cross-reference, type safety, runtime, security, compliance
2. ทำ `/deep-validate` สำหรับ validate issues จากทุก section
3. จัดลำดับการ validate ตาม severity: Critical → High → Medium → Low → Info
4. ระบุ false positives ที่พบ
5. ถ้า validation ไม่ผ่าน → กลับไปแก้ที่ section ที่เกี่ยวข้อง

### 10. Report

> Goal: รายงาน aggregate findings พร้อม actionable recommendations

ทำตาม `references/reporting.md`

## Rules

### 1. Scope Boundary
- เน้น frontend code quality
- ไม่ซ้ำกับ `/review-uxui`, `/review-platform`, `/review-seo`, `/review-quality`, `/review-architecture`
- focus ที่ component patterns, state, rendering, types, CSS, forms, testing

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
- ทุก finding ต้องมี file path และ line number
- ไม่เดา ใช้ tools สำหรับ verification (`ast-grep`, `knip`, `madge`, React DevTools profiler)
- ระบุ component, hook, store, page, หรือ CSS rule ที่เกี่ยวข้อง
- ระบุ false positives ที่พบ

### 5. Review Independence
- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- ไม่ลบไฟล์, โค้ด, components, หรือ configuration ระหว่าง review
- ถ้าพบ issues ที่ต้องแก้ไข → report ผ่าน `/report` และ `/suggest-next-action`

### 6. Health Score
- คำนวณ review score เป็น percentage (0-100) — ดูสูตรใน `references/scoring.md`
- 0 = ทุก finding เป็น Critical, 100 = ไม่มี finding
- แสดง score ต่อ dimension และ overall score
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)
- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง

### 7. Formatting
- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง findings จากทุก frontend section พร้อม severity และ location
- รายงาน Metrics Summary พร้อม status indicators และ score ต่อ dimension
- รายงาน recommended actions พร้อม priority
- Review score ต่อ dimension และ overall พร้อม grade
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

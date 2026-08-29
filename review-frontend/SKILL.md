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
  - analyze-user-flow
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

สแกน codebase เพื่อเข้าใจ frontend stack และ structure

> Goal: เข้าใจ frontend framework, component patterns, state management, styling system

1. ทำ `/scan-codebase` เพื่อเข้าใจ frontend structure และ stack
2. ระบุ frontend framework (React, Vue, Solid, Svelte, Angular), state management library, styling system, form library, testing framework
3. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
4. ทำ `/review-codebase-everythink` เพื่อให้ analyzers ครอบคลุม categories ล่าสุด
5. รัน `bun --filter tools-review-codebase review-codebase:json` เพื่อดึง review report พร้อม metrics
6. ทำ `/run-review` เพื่อรัน review CLI และดึง metrics ล่าสุด
7. ถ้าสแกนไม่ได้ → stop และ report

### 2. Component Architecture Review

Review component architecture — ดูรายละเอียดใน `references/components.md`

> Goal: ครอบคลุมทุก component architecture dimension

1. ตรวจ component composition: compound components, slots, render props, children patterns
2. ตรวจ component boundaries: single responsibility, prop drilling, coupling
3. ตรวจ component reusability: reusable vs one-off, abstraction level
4. ตรวจ component API: prop design, default values, prop types, variant system
5. ตรวจ component organization: feature-based, atomic design, folder structure
6. Critical: God component ที่ทำทุกอย่าง, prop drilling ลึก 5+ levels, broken component composition
7. High: tight coupling ระหว่าง components, missing abstraction, inconsistent component API, no variant system

### 3. State Management And Hooks Review

Review state management และ hooks/composables design — ดูรายละเอียดใน `references/state-management.md` และ `references/hooks-composables.md`

> Goal: ครอบคลุมทุก state management และ hooks/composables dimension

1. ตรวจ state organization: local, shared, global, server state separation
2. ตรวจ reactivity patterns: fine-grained, signals, observables, context
3. ตรวจ side effect management: useEffect, watchers, lifecycle, cleanup
4. ตรวจ state persistence: localStorage, sessionStorage, URL state, cache
5. ตรวจ state immutability: immutable updates, mutation prevention
6. ตรวจ hooks/composables design: single responsibility, parameter validation, return value structure, reusability
7. ตรวจ effect cleanup: timer, event listener, subscription, AbortController, resource disposal
8. Critical: global mutable state ที่ทำให้ debug ไม่ได้, state corruption, no cleanup บน unmount, memory leak from missing cleanup, reactivity leak
9. High: unnecessary re-renders, missing state separation, prop drilling state, no persistence strategy, missing effect disposal, inconsistent return type, stale closure

### 4. Rendering Performance And Event Handling Review

Review rendering performance และ event handling — ดูรายละเอียดใน `references/rendering-performance.md` และ `references/event-handling.md`

> Goal: ครอบคลุมทุก rendering performance และ event handling dimension

1. ตรวจ unnecessary re-renders: memoization, useMemo, useCallback, React.memo
2. ตรวจ virtualization: long lists, large datasets, windowing
3. ตรวจ code splitting: lazy loading, dynamic import, route-based splitting
4. ตรวจ bundle optimization: tree shaking, dead code elimination, bundle analysis
5. ตรวจ render bottlenecks: expensive computations, layout thrashing, forced reflow
6. ตรวจ event listener cleanup: addEventListener/removeEventListener pairs, cleanup on unmount
7. ตรวจ event performance: passive listeners, debounce, throttle, event delegation
8. Critical: re-render storm บน hot path, no virtualization บน 1000+ items, no code splitting, listener leak ใน critical path
9. High: missing memoization, missing lazy loading, expensive computation บน render, missing cleanup on unmount, missing passive listeners, missing debounce/throttle

### 5. Type Safety Review

Review type safety — ดูรายละเอียดใน `references/type-safety.md`

> Goal: ครอบคลุมทุก type safety dimension

1. ตรวจ `any` usage: explicit `any`, implicit `any`, type assertions
2. ตรวจ type completeness: props, state, events, refs, context
3. ตรวจ type inference: explicit types ที่ไม่จำเป็น, missing types ที่จำเป็น
4. ตรวจ generic usage: generic components, generic hooks, constraints
5. ตรวจ type compatibility: union types, intersection, discriminated unions
6. Critical: `any` บน critical path, no types บน public API, type assertions ที่ bypass safety
7. High: implicit `any` กระจาย, missing prop types, missing event types, no generic constraints

### 6. CSS And Styling Review

Review CSS and styling architecture — ดูรายละเอียดใน `references/css-styling.md`

> Goal: ครอบคลุมทุก CSS and styling dimension

1. ตรวจ styling approach: CSS modules, Tailwind, UnoCSS, styled-components, CSS-in-JS
2. ตรวจ CSS organization: file structure, naming convention, specificity
3. ตรวจ CSS specificity: !important, deep selectors, specificity wars
4. ตรวจ responsive CSS: media queries, container queries, mobile-first
5. ตรวจ CSS performance: unused CSS, duplicate styles, large CSS bundles
6. Critical: !important ทั่วทั้ง project, global CSS ที่ leak, broken responsive บน breakpoint หลัก
7. High: specificity wars, inconsistent styling approach, unused CSS มาก, missing responsive

### 7. Form And Error Handling Review

Review form validation, UX, และ error handling — ดูรายละเอียดใน `references/forms.md`

> Goal: ครอบคลุมทุก form และ error handling dimension

1. ตรวจ form validation: schema validation, field rules, real-time/blur/submit validation, cross-field
2. ตรวจ form state management: initialization, reset, dirty tracking, submission state
3. ตรวจ submit handling: error handling, loading state, duplicate prevention, success feedback
4. ตรวจ form accessibility: labels, aria-invalid, aria-describedby, keyboard navigation, focus management
5. ตรวจ error boundaries: React error boundaries, Vue error handlers, fallback UI
6. ตรวจ error handling: try/catch, error states, error recovery, error logging
7. ตรวจ multi-step และ dynamic forms: step validation, state preservation, dynamic field add/remove
8. Critical: no form validation บน critical form, no error boundary, unhandled errors crash app, inaccessible form, keyboard trap
9. High: missing async validation, no error fallback UI, missing error logging, no form accessibility, missing duplicate submit prevention

### 8. Frontend Testing Review

Review frontend testing — ดูรายละเอียดใน `references/testing.md`

> Goal: ครอบคลุมทุก frontend testing dimension

1. ตรวจ component testing: component test coverage, rendering tests, interaction tests
2. ตรวจ hook/composable testing: custom hooks, composables, store tests
3. ตรวจ integration testing: component integration, page integration, flow tests
4. ตรวจ E2E testing: critical user flows, cross-browser, visual regression
5. ตรวจ test quality: meaningful assertions, no snapshot-only, test isolation
6. Critical: no tests บน critical components, no E2E บน critical flow, tests ที่ไม่จับ bugs
7. High: low coverage บน critical components, missing integration tests, snapshot-only tests

### 9. Validate Findings

ตรวจสอบและ validate issues จากทุก section

> Goal: Issues ถูกต้องและจัดลำดับตาม severity

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ: cross-reference, type safety, runtime, security, compliance
2. ทำ `/deep-validate` สำหรับ validate issues จากทุก section
3. จัดลำดับการ validate ตาม severity: Critical → High → Medium → Low → Info
4. ระบุ false positives ที่พบ
5. ถ้า validation ไม่ผ่าน → กลับไปแก้ที่ section ที่เกี่ยวข้อง

### 10. Report

รายงานผล review ในรูปแบบตาราง

> Goal: รายงาน aggregate findings พร้อม actionable recommendations

1. ทำ `/report` พร้อม `/report-table`
2. สร้างตาราง findings: Dimension, Finding, Severity, Location, Impact, Recommendation
3. คำนวณ review score ตามสูตรใน `references/scoring.md`
4. สร้าง Metrics Summary ตาม dimension พร้อม status indicators และ score
5. จัดกลุ่ม findings ตาม dimension และเรียงตาม severity
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี UI code → stop และ report
- ถ้า project ไม่มี state management library → ข้าม state management checks แต่ตรวจ local state
- ถ้า project ไม่มี forms → ข้าม form checks
- ถ้า project ไม่มี tests → ข้าม testing checks แต่ flag เป็น High finding
- ถ้า project ไม่ใช้ TypeScript → ข้าม type safety checks

### 2. Severity Classification

- Critical: God component, state corruption, no error boundary, re-render storm, `any` บน critical path, no tests บน critical components
- High: prop drilling, tight coupling, missing memoization, missing lazy loading, implicit `any`, no form validation, low test coverage
- Medium: inconsistent component API, missing abstraction, minor re-renders, specificity issues, missing async validation
- Low: cosmetic, naming, documentation gap, minor CSS cleanup
- Info: suggestion, best practice recommendation

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ไม่เดา ใช้ tools สำหรับ verification (`ast-grep`, `knip`, `madge`, React DevTools profiler)
- ระบุ component, hook, store, page, หรือ CSS rule ที่เกี่ยวข้อง
- ระบุ false positives ที่พบ

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- ไม่ลบไฟล์, โค้ด, components, หรือ configuration ระหว่าง review
- ถ้าพบ issues ที่ต้องแก้ไข → report ผ่าน `/report` และ `/suggest-next-action`

### 5. Scope Boundaries

- ไม่ review design quality, design system, visual, accessibility (design perspective) → ใช้ `/review-uxui`
- ไม่ review platform-level (mobile, desktop, CLI, SSR, i18n, web vitals) → ใช้ `/review-platform`
- ไม่ review SEO → ใช้ `/review-seo`
- ไม่ review general code quality, bug-prone patterns → ใช้ `/review-quality`
- ไม่ review architecture, modularity, boundaries → ใช้ `/review-architecture`
- focus ที่ frontend code quality: components, state, rendering, types, CSS, forms, testing

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

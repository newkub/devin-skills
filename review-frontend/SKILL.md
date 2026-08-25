---
name: review-frontend
description: Review frontend: components, forms, hooks, state, events, performance, UX, accessibility
---

## Goal

Review frontend ครอบคลุม components, forms, hooks/composables, state management, event handling, performance, assets, hydration, rendering, UX/UI, accessibility, responsive, browser compat, CSS, UX writing, design system พร้อม findings, severity, และ review score

## Scope

ใช้สำหรับ project หรือ workspace ที่มี frontend (web, desktop, mobile web) — ไม่รวม backend หรือ infrastructure review — เน้น review เท่านั้น ไม่แก้ไข code ระหว่าง review

ครอบคลุม: component structure, prop design, event emission, reactivity, composition, reusability, testing, isolation — form validation, field rules, error messages, state, submit, loading, accessibility, UX — hooks/composables design, parameter validation, return value, reactivity, effect cleanup — state management: store, mutation, persistence, sync, SSR, performance — event handling: listener cleanup, delegation, memory leak, passive listeners, debounce/throttle — general frontend performance, assets, hydration, rendering, UX/UI, accessibility, responsive, browser compat, CSS, UX writing, design system

## Execute

### 1. Prepare And Scan

เตรียม context และ scan หา frontend scope

> Goal: เข้าใจ tech stack, structure, และ pain points ของ frontend

1. ทำ `/scan-codebase` เพื่อหา frontend files: `package.json`, `vite.config.*`, `next.config.*`, `nuxt.config.*`, `index.html`, `app.vue`, `app.tsx`
2. ระบุ framework/library: React, Vue, Svelte, Solid, Angular, หรืออื่น
3. ระบุ state management library (Pinia, Vuex, Redux, Zustand, Jotai, XState, Nanostores, Svelte stores), form library (TanStack Form, VeeValidate, React Hook Form, Formik), validation library (Zod, Valibot, Yup)
4. ตรวจสอบ frontend entry points, routes, layout, component tree, composable file patterns (`use-*`), store organization
5. ถ้าเป็น web project → ทำ `/run-dev` เพื่อ verify dev server ก่อน review
6. ทำ `/review-platform` อ้างอิง `references/performance.md` สำหรับ Lighthouse metrics เบื้องต้นหากมี

### 2. Deep Analyze

> Goal: ครอบคลุมทุก frontend dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ frontend patterns
2. ทำ `/update-create-review-cli` — เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต `ast-grep` rules
3. ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-review` เพื่อดึง metrics ล่าสุด

### 3. Component Review

> Goal: ครอบคลุม structure, props, events, reactivity, reusability, testing, isolation

ดู `references/components.md` สำหรับ details

1. ตรวจสอบ component structure: file organization, single responsibility, component size, complexity, naming (PascalCase)
2. ตรวจสอบ prop design: prop naming, types, defaults, validation, prop count (เกิน 4 ต้อง group), required vs optional, prop immutability
3. ตรวจสอบ event emission: event naming (kebab-case for Vue, camelCase for React), payload typing, documentation, custom vs native event
4. ตรวจสอบ component composition: slot usage, named slots, scoped slots, HOC, render functions, component injection
5. ตรวจสอบ reactivity: computed/memo patterns, watch effects, unnecessary re-renders, reactivity dependencies, reactivity leak, effect scope
6. ตรวจสอบ component reusability: reusability across pages, configurability, extensibility, coupling, shared component patterns
7. ตรวจสอบ component testing: unit test coverage, snapshot testing, interaction testing, accessibility testing in components
8. ตรวจสอบ component isolation: isolation from parent, global state, side effects, pure component patterns

### 4. Form Review

> Goal: ครอบคลุม validation, field rules, error messages, state, submit, loading, accessibility, UX

ดู `references/forms.md` สำหรับ details

1. ตรวจสอบ validation schemas: schema completeness, field rule coverage, required vs optional, min/max length, pattern, email, phone, URL, date, custom rules
2. ตรวจสอบ field rules: real-time, blur, submit, debounce, conditional, cross-field, dependent field validation
3. ตรวจสอบ error message quality: clarity, localization, specificity, field-level vs form-level, display timing, display position
4. ตรวจสอบ validation UX: inline validation timing, error display on blur vs change, success feedback, error clearing, error focus management
5. ตรวจสอบ form state: initialization, reset, dirty state tracking, pristine vs dirty, submission state (idle, submitting, success, error)
6. ตรวจสอบ submit handling: error handling, loading state, success feedback, error feedback, duplicate submit prevention, submit on enter
7. ตรวจสอบ form accessibility: label association (`for`/`id`), `aria-invalid`, `aria-describedby`, keyboard navigation, tab order, focus management, screen reader announcements
8. ตรวจสอบ multi-step forms และ dynamic forms ถ้ามี

### 5. Hooks And Composables Review

> Goal: ครอบคลุม design, parameters, return values, reactivity, lifecycle, cleanup

ดู `references/hooks-composables.md` สำหรับ details

1. ตรวจสอบ function design: single responsibility, pure function where possible, side effect isolation, naming (`use-*` prefix), file organization
2. ตรวจสอบ parameter validation: types, defaults, validation, options object pattern, required vs optional
3. ตรวจสอบ return value structure: consistent return type, reactive vs non-reactive, documentation, tuple vs object, stable return reference
4. ตรวจสอบ composable reusability: reusability across components, configurability, composition, coupling
5. ตรวจสอบ reactivity: signal/memo patterns, computed/watch, dependencies tracking, leak prevention, stale closure prevention
6. ตรวจสอบ lifecycle management: `onMount`/`onCleanup`, `onUnmounted`, `onBeforeUnmount`, lifecycle ordering, error handling
7. ตรวจสอบ effect cleanup: effect disposal, timer cleanup, event listener cleanup, subscription cleanup, `AbortController` usage
8. ตรวจสอบ resource disposal: WebSocket, IntersectionObserver, ResizeObserver, AbortController, database connection cleanup
9. ตรวจสอบ Vue/Nuxt specifics ถ้ามี: `ref`/`reactive`, `computed`/`watch`, `provide`/`inject`, effect scope, SSR compatibility, `useFetch`/`useAsyncData`

### 6. State Management Review

> Goal: ครอบคลุม store, mutation, persistence, sync, derivation, SSR, performance

ดู `references/state-management.md` สำหรับ details

1. ตรวจสอบ store structure: file organization, single responsibility per store, size, naming, registration, modular patterns
2. ตรวจสอบ state normalization: normalized vs denormalized, nested depth, duplicate state, single source of truth, state shape consistency
3. ตรวจสอบ mutation patterns: immutability enforcement, direct mutation, action/getter separation, mutation tracking, transactional updates, batch updates
4. ตรวจสอบ state scoping: global vs local, store module boundaries, state ownership, over-globalization, under-globalization
5. ตรวจสอบ state persistence: strategy (`localStorage`, `sessionStorage`, `IndexedDB`, cookie), scope, serialization, migration, sensitive data
6. ตรวจสอบ state synchronization: cross-tab sync, cross-component sync, real-time sync, error handling, conflict resolution, debounced sync
7. ตรวจสอบ state derivation: selector/getter patterns, computed state, memoized selectors, derived state caching, selector composition, stale derived state
8. ตรวจสอบ SSR state hydration: dehydration/rehydration correctness, serialization safety, hydration mismatch, server-only/client-only state, transfer payload size
9. ตรวจสอบ state performance: unnecessary re-renders, large state objects, update frequency, subscription granularity, update batching

### 7. Event Handling Review

> Goal: ครอบคลุม listener cleanup, delegation, memory leak, passive listeners, debounce/throttle

ดู `references/event-handling.md` สำหรับ details

1. ตรวจสอบ listener cleanup: `addEventListener`/`removeEventListener` pairs, cleanup on unmount, route change, component destroy
2. ตรวจสอบ memory leak prevention: listener leak detection, closure reference leak, detached DOM element listeners, global listener cleanup, interval/timeout cleanup
3. ตรวจสอบ event delegation: delegation patterns, delegation vs direct binding, performance, correctness, cleanup
4. ตรวจสอบ event target correctness: correct target, `target` vs `currentTarget`, bubbling, capturing, delegation target matching
5. ตรวจสอบ passive listeners: `passive: true` for touch/wheel, scroll passive, performance, missing passive flag detection
6. ตรวจสอบ debounce: debounce on input/search/resize, time configuration, cleanup, correctness, missing debounce detection
7. ตรวจสอบ throttle: throttle on scroll/resize/mousemove, time configuration, cleanup, vs debounce selection, missing throttle detection
8. ตรวจสอบ custom events: typed payload, naming, documentation, `CustomEvent` usage, dispatching patterns
9. ตรวจสอบ global event listeners: `window`/`document` cleanup, `visibilitychange`, online/offline, `beforeunload`, `popstate`

### 8. Performance, Assets, Hydration, Rendering Review

> Goal: หาปัญหา performance ที่มีผลต่อ user

1. ตรวจสอบ Core Web Vitals: LCP, INP, CLS, TTFB, FCP
2. ตรวจสอบ bundle size และ bundle analysis output
3. ตรวจสอบ critical rendering path และ render-blocking resources
4. ตรวจสอบ images ขนาดใหญ่ที่ไม่ optimize หรือไม่ใช้ modern formats (`WebP`, `AVIF`), responsive images, lazy loading, `srcset`, `sizes`
5. ตรวจสอบ font subsets, `font-display`, preconnect สำหรับ fonts
6. ตรวจสอบ SSR/CSR hydration: hydration boundaries, streaming, progressive hydration, hydration mismatch, `typeof window` checks
7. ตรวจสอบ rendering efficiency: avoidable re-renders, memoization, virtual list, code splitting, dynamic imports, CSS layout/paint/composite, DOM size

### 9. UX/UI, Accessibility, Responsive, Browser Compat, CSS, UX Writing, Design System

> Goal: ครอบคลุม UX/UI, accessibility, responsive, browser compat, CSS, UX writing, design system

1. ตรวจสอบ visual hierarchy, typography, color theory, spacing system, layout principles, micro-interactions
2. ตรวจสอบ accessibility: keyboard navigation, tab order, WCAG 2.1 AA compliance, screen reader support
3. ตรวจสอบ responsive: viewport, breakpoints, mobile-first, container query support
4. ตรวจสอบ browser compat: browserslist config, Autoprefixer, polyfill strategy, CSS reset/normalize, feature detection
5. ตรวจสอบ CSS: architecture, naming conventions, CSS-in-JS patterns, file organization, import order
6. ตรวจสอบ UX writing: voice และ tone consistency, copy clarity, translation keys, error message quality
7. ตรวจสอบ design system: token system, dark mode strategy, component library compliance

### 10. Improve

> Goal: ปรับปรุง frontend ตาม findings

1. ปรับ UX writing, accessibility (WCAG 2.1 AA), SEO, visual design, responsive ตาม findings
2. Optimize assets (modern formats, lazy loading), rendering (memoization, code splitting), battery
3. ทำ `/validate` และ `/run-check` — ถ้าไม่ผ่าน → `/resolve-errors` แล้ว retry (max 3)

### 11. Validate, Rate And Report

> Goal: Issues ถูก validate และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ review score ตาม `references/scoring.md`: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/report` พร้อม `/report-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี components → ข้าม Step 3
- ถ้า project ไม่มี forms → ข้าม Step 4
- ถ้า project ไม่มี hooks/composables → ข้าม Step 5
- ถ้า project ไม่มี state management library → ข้าม Step 6
- ถ้า project ไม่มี event listeners → ข้าม Step 7
- ถ้า project ไม่มี SSR → ข้าม hydration และ SSR checks
- ถ้า project ไม่มี multi-step/dynamic forms → ข้าม relevant form checks

### 2. Severity Classification

- Critical: broken component, prop mutation ที่ก่อให้เกิด error, reactivity bug, memory leak, SSR incompatibility, missing validation on critical field, validation bypass, inaccessible form, keyboard trap, broken store, state inconsistency, circular store dependency, infinite update loop, listener ที่ไม่ cleanup, `preventDefault` บน passive listener ที่ไม่ทำงาน
- High: missing prop validation, poor composition, unnecessary re-render, missing memo, untestable component, missing validation schema, incomplete field rules, poor error messages, missing loading state, missing ARIA, missing effect disposal, inconsistent return type, stale closure, missing immutability, deeply nested state, duplicate state, over-globalization, under-globalization, stale derived state, missing selector memoization, missing passive: true, missing debounce, missing throttle, incorrect event target
- Medium: inconsistent naming, too many props, suboptimal validation timing, minor accessibility gap, suboptimal reactivity, missing composable documentation, suboptimal store organization, minor serialization issue, suboptimal debounce/throttle time, missing event delegation, missing success feedback
- Low: cosmetic, minor naming, documentation gap

### 3. Evidence First

- ทุก finding ต้องมี file path และ line number
- ห้ามเดา issues โดยไม่มี evidence
- ระบุ component, prop, event, slot, form, field, composable, store, state field, listener, หรือ event type ที่เกี่ยวข้อง
- ใช้ tools หรือ scripts ก่อน manual inspection

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- แยก review process จาก fix process
- ถ้า issue ซ้อนทับกับ `/review-codebase` → อ้างอิงแทน ไม่ duplicate

### 5. Scope Control

- review เฉพาะ frontend scope ที่ระบุ
- ถ้าพบ issues นอก scope → รายงาน ไม่แก้

### 6. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงาน findings พร้อม evidence: file, line, severity
- ครอบคลุม components, forms, hooks/composables, state management, event handling, performance, assets, hydration, rendering, UX/UI, accessibility, responsive, browser compat, CSS, UX writing, design system
- review score คำนวณจาก severity weighted average ตาม `references/scoring.md`
- ปรับปรุง frontend ตาม findings โดยไม่มี regression
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

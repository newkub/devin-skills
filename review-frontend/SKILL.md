---
name: review-frontend
description: Review frontend quality including UX/UI, accessibility, responsive, rendering, images, browser compa
allowed-tools:
  - ask_user_question
  - edit
  - exec
  - glob
  - grep
  - read
triggers:
  - model
  - user
related:
  - review-codebase
  - review-correctness
  - review-docs
  - review-infrastructure
  - review-performance
  - review-quality
  - review-reliability
  - review-security
  - suggest-next-action
  - validate
---

## Goal

Review frontend ของ project ครอบคลุม performance, assets, hydration, rendering, UX/UI, และ accessibility พร้อม findings, severity, และ review score Review UX/UI ครอบคลุม UX writing, accessibility, และ visual design พร้อม aggregate findings และ review score Review accessibility ของ project ตาม WCA...

## Scope

ใช้สำหรับ project หรือ workspace ที่มี frontend (web, desktop, mobile web) — ไม่รวม backend หรือ infrastructure review — เน้น review เท่านั้น ไม่แก้ไข code ระหว่าง review UX/UI review สำหรับ user flows, interaction design, visual hierarchy, typography, color theory, spacing system, layout principles, micro-interactions, UX writing, accessibility, design system compliance, responsive UX, animati...

## Execute

### 1. Prepare And Scan

เตรียม context และ scan หา frontend scope

> Goal: เข้าใจ tech stack, structure, และ pain points ของ frontend

1. ทำ `/scan-codebase` เพื่อหา frontend files: `package.json`, `vite.config.*`, `next.config.*`, `nuxt.config.*`, `index.html`, `app.vue`, `app.tsx`
2. ระบุ framework/library: React, Vue, Svelte, Solid, Angular, หรืออื่น
3. ตรวจสอบ frontend entry points, routes, layout, component tree
4. ถ้าเป็น web project → ทำ `/run-dev` เพื่อ verify dev server ก่อน review
5. ทำ `/check-web-performance` หรือ Lighthouse metrics เบื้องต้นหากมี

### 2. Review Performance

ตรวจสอบ frontend performance

> Goal: หาปัญหา performance ทีมีผลต่อ user

1. ตรวจสอบ Core Web Vitals: LCP, INP, CLS, TTFB, FCP
2. ตรวจสอบ bundle size และ bundle analysis output
3. ตรวจสอบ critical rendering path และ render-blocking resources
4. ตรวจสอบ JavaScript execution time และ long tasks
5. บันทึก metrics เป็น baseline พร้อม evidence (file, line, screenshot path)

### 3. Review Assets

ตรวจสอบ images, fonts, static files

> Goal: assets โหลดเร็ว ขนาดเหมาะสม ไม่มี waste

1. ตรวจสอบ images ขนาดใหญ่ทีไม่ optimize หรือไม่ใช้ modern formats (`WebP`, `AVIF`)
2. ตรวจสอบ responsive images, lazy loading, `srcset`, `sizes`
3. ตรวจสอบ font subsets, font-display, preconnect สำหรับ fonts
4. ตรวจสอบ unused assets และ icons ทีโหลดทั้งชุด
5. ตรวจสอบ CDN หรือ static hosting ทีใช้สำหรับ assets

### 4. Review Hydration

ตรวจสอบ SSR/CSR hydration

> Goal: hydration เร็วและไม่มี hydration mismatch

1. ตรวจสอบ server-side rendering settings และ hydration boundaries
2. ตรวจสอบ streaming, progressive hydration, partial hydration ตาม framework
3. ตรวจสอบ JavaScript ทีรันใน hydration phase และทำให้หนัก
4. ตรวจสอบ hydration mismatch, `typeof window` checks, client-only code
5. ถ้าไม่มี SSR/CSR → ข้าม section นี้และบันทึก scope

### 5. Review Rendering

ตรวจสอบ rendering efficiency

> Goal: ลด re-render และ render time

1. ตรวจสอบ avoidable re-renders, memoization, `useMemo`, `useCallback`, `memo`
2. ตรวจสอบ virtual list สำหรับ long lists
3. ตรวจสอบ code splitting, dynamic imports, route-based lazy loading
4. ตรวจสอบ CSS layout/paint/composite: containment, `will-change`, layers
5. ตรวจสอบ DOM size และ nesting depth

### Uxui Deep Checks

เตรียม context ก่อนเริ่ม review

> Goal: เข้าใจ UX/UI structure, design system, และ user flows ใน codebase

1. ใช้ `/scan-codebase` เพื่อตรวจสอบ frontend structure และ design system
2. ระบุ UI framework, CSS framework, design tokens, breakpoint config, และ component library ที่ใช้
3. ถ้าเป็น web project → ใช้ `/run-dev` เพื่อ verify dev server ก่อน review
4. ใช้ `/follow-uxui` เพื่ออ้างอิง UX/UI best practices


Review visual hierarchy, typography, color theory, spacing system, และ layout principles

> Goal: ครอบคลุม visual design ตาม `/review-frontend` และ `/follow-uxui`

1. ตรวจสอบ visual hierarchy: focal point clarity, scan pattern, content priority, visual weight balance, contrast ระหว่าง section, information architecture ที่สะท้อนในภาพ

### Web Accessibility Deep Checks

เตรียม context และ scan หา UI components

> Goal: เข้าใจ frontend stack และ scope ของ UI

1. ทำ `/scan-codebase` เพื่อหา frontend files, components, pages
2. ระบุ framework/library และ rendering mode (CSR, SSR, static)
3. ระบุ accessibility tools ที่มี: `axe-core`, `Lighthouse`, `playwright`, `jest-axe`
4. ถ้าไม่มี UI → stop และ report


ตรวจสอบ keyboard navigation

> Goal: ทุก interaction ใช้ keyboard ได้

1. ตรวจสอบ tab order เป็น logical order และ visible

### Responsive Deep Checks

> Goal: เข้าใจ responsive setup และ breakpoint config

1. ทำ `/scan-codebase` เพื่อเข้าใจ responsive structure
2. ระบุ CSS framework, breakpoint config, responsive utilities, container query support ที่ใช้


> Goal: ครอบคลุมทุก responsive dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ responsive patterns
2. ทำ `/update-create-review-cli` — เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้


> Goal: ครอบคลุม viewport, breakpoints, mobile-first

### Rendering Deep Checks

> Goal: เข้าใจ rendering mode และ framework

1. ทำ `/scan-codebase` เพื่อเข้าใจ rendering structure
2. ระบุ rendering mode (SSR, SSG, CSR, ISR, universal), hydration strategy, rendering framework ที่ใช้


> Goal: ครอบคลุมทุก rendering dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ rendering patterns
2. ทำ `/update-create-review-cli` — `/update-create-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต `ast-grep` rules
3. ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้


> Goal: ครอบคลุม SSR, hydration, universal rendering

### Images Deep Checks

> Goal: เข้าใจ image usage และ optimization setup

1. ทำ `/scan-codebase` เพื่อเข้าใจ image structure
2. ระบุ image optimization tools, CDN provider, image component patterns, lazy loading strategy ที่ใช้
3. ถ้า project ไม่มี images → stop และ report


> Goal: ครอบคลุมทุก image dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ image patterns
2. ทำ `/update-create-review-cli` — `/update-create-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้



### Browser Compat Deep Checks

> Goal: เข้าใจ browser support targets และ compatibility strategy

1. ทำ `/scan-codebase` เพื่อเข้าใจ browser and device compatibility structure
2. ระบุ browserslist config, Autoprefixer config, polyfill strategy, CSS reset/normalize approach ที่ใช้
3. ระบุ responsive breakpoints, touch/pointer event handling, viewport settings ที่ใช้


> Goal: ตรวจสอบ compatibility ของ CSS, JS APIs, polyfills, feature detection, และ device support


1. ทำ `/deep-analyze` เพื่อวิเคราะห์ compatibility patterns
2. ทำ `/update-create-review-cli` — `/update-create-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้


### Css Deep Checks

รวบรวม context ก่อน review CSS

> Goal: เข้าใจ CSS setup, framework, และ conventions

1. ทำ `/scan-codebase` เพื่อหา CSS files, style tags, CSS-in-JS, configuration
2. ระบุ CSS approach: utility-first, BEM, CSS Modules, scoped, preprocessor
3. ระบุ conventions: naming, file organization, import patterns


วิเคราะห์โครงสร้าง CSS

> Goal: หา architectural issues และ inconsistencies

1. ตรวจสอบ consistency ของ patterns: naming conventions, file structure, import order
2. ตรวจสอบ CSS-in-JS patterns: dynamic styles, prop-based styles, performance

### Ux Writing Deep Checks

> Goal: เข้าใจ UX copy ทั้งหมดใน codebase

1. ทำ `/scan-codebase` เพื่อหา UX copy ใน components, pages, routes, translation files, และ content files
2. ระบุ copy sources: hardcoded strings, translation keys, CMS content, design system tokens
3. จัดประเภท copy ตามฟังก์ชัน: navigation, action, feedback, guidance, error
4. บันทึกจุดสัมผัส (touchpoints) ที่มีข้อความและ context การใช้งาน


> Goal: ตรวจสอบ voice และ tone สม่ำเสมอ

1. ตรวจสอบ brand personality ที่กำหนดไว้: friendly, professional, playful, authoritative
2. ตรวจสอบ tone ตาม context: success, error, warning, informational, onboarding
3. ตรวจสอบ voice guidelines: active voice, พูดกับผู้ใช้โดยตรง, หลีกเลี่ยงศัพท์เทคนิค
4. ตรวจสอบ tone matrix สำหรับแต่ละ context


### Design System Deep Checks

> Goal: เข้าใจ design system structure และ token setup

1. ทำ `/scan-codebase` เพื่อเข้าใจ design system structure
2. ระบุ CSS framework, design token system (CSS variables, Tailwind theme, UnoCSS theme), dark mode strategy, component library ที่ใช้

*Some details from merged source skills were condensed to keep the skill under 250 lines.*

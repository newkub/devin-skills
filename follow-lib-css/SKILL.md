---
name: follow-lib-css
description: เขียน CSS ตาม modern best practices และ Baseline features
argument-hint: "[scope]"
related:
  - follow-lib-unocss
  - follow-tool-formatter
  - follow-best-practice
---

## Goal

เขียน CSS ที่ maintainable, performant, และ accessible โดยใช้ modern CSS features ตาม Baseline ปี 2025/2026

## Scope

ใช้กับ CSS ทั้งแบบ traditional, CSS Modules, CSS-in-JS, และ preprocessor ที่ตรวจพบใน project

## Execute

### 1. Analyze CSS Setup

> Goal: วิเคราะห์ CSS setup ปัจจุบัน

1. ตรวจสอบ CSS framework หรือ utility-first engine ที่ใช้ (`Tailwind`, `UnoCSS`, `Bootstrap`, ฯลฯ)
2. ตรวจสอบ CSS-in-JS หรือ scoped styles ที่ใช้ (`CSS Modules`, `styled-components`, ฯลฯ)
3. ตรวจสอบ CSS preprocessor (`Sass`, `Less`, `PostCSS`) และ build tools
4. ระบุ browser support target จาก `browserslist`, `package.json`, หรือ project requirements
5. ถ้าไม่มี target ให้ใช้ Baseline (`last 2 versions, >0.5%`) เป็น default

### 2. Apply Modern Layout And Cascade

> Goal: ใช้ modern CSS features ที่ Baseline-ready

1. ใช้ CSS custom properties (`--variable`) และ `@property` สำหรับ theming และ typed variables
2. ใช้ `:is()` และ `:where()` เพื่อลด specificity ซับซ้อน
3. ใช้ `:has()` สำหรับ relational styling
4. ใช้ native CSS Nesting แทน preprocessor nesting เมื่อ target รองรับ
5. ใช้ `@layer` สำหรับ cascade control (`reset`, `base`, `theme`, `components`, `utilities`)
6. ใช้ Container Queries (`@container`) สำหรับ component-level responsive
7. ใช้ Flexbox, Grid, และ Subgrid สำหรับ layouts
8. ใช้ logical properties (`margin-inline-start`, `inset`, ฯลฯ) เมื่อทำ multi-locale

### 3. Use Modern Color And Sizing

> Goal: ใช้ modern color spaces และ fluid sizing

1. ใช้ `oklch()`, `color-mix()`, และ `light-dark()` สำหรับ color system ทันสมัย
2. ใช้ `clamp()`, `min()`, `max()` สำหรับ fluid typography และ spacing
3. ใช้ relative units (`rem`, `em`, `%`, `cqw`, `cqi`) เพื่อรองรับ user preferences
4. ใช้ `aspect-ratio` สำหรับ media containers
5. ใช้ `gap` แทน `margin` ใน Flexbox/Grid

### 4. Optimize Performance

> Goal: ปรับปรุง performance ของ CSS

1. ใช้ `content-visibility` สำหรับ lazy rendering บน off-screen content
2. ใช้ `contain` property เพื่อ isolate layout/paint
3. ใช้ `will-change` อย่างระมัดระวังและล้างหลัง animation จบ
4. ใช้ `transform` และ `opacity` สำหรับ animations เพื่อ GPU acceleration
5. ลบ unused CSS ด้วย build tools (`PurgeCSS`, `UnoCSS`, `Lightning CSS`)
6. Minify CSS สำหรับ production
7. ใช้ `font-display: swap` สำหรับ web fonts
8. ใช้ `prefetch`/`preload` สำหรับ critical assets อย่างเหมาะสม

### 5. Ensure Accessibility

> Goal: ตรวจสอบ accessibility ของ CSS

1. ใช้ semantic HTML กับ CSS
2. ใช้ `:focus-visible` สำหรับ keyboard navigation
3. ใช้ `prefers-reduced-motion` สำหรับ motion sensitivity
4. ใช้ `prefers-contrast` และ `prefers-color-scheme` ตาม context
5. ตรวจสอบ color contrast ตาม WCAG 2.1 (minimum 4.5:1 สำหรับ text)
6. ใช้ relative units (`rem`, `em`) สำหรับ font และ spacing

### 6. Browser Compatibility

> Goal: ตรวจสอบและจัดการ browser compatibility

1. ใช้ `@supports` สำหรับ feature detection
2. ตรวจสอบ browser support บน `caniuse.com` หรือ `web.dev/baseline`
3. ใช้ progressive enhancement โดยให้ fallbacks สำหรับ unsupported features
4. ใช้ `Autoprefixer` หรือ `Lightning CSS` เฉพาะเมื่อ build pipeline ต้องการ vendor prefixes
5. หลีกเลี่ยง features ที่ยังไม่ Baseline ยกเว้น project กำหนดให้รองรับเฉพาะ browser

## Rules

### 1. CSS Architecture

- จัดโครงสร้าง CSS ด้วย `@layer` หรือ utility-first/ITCSS
- แยก concerns: reset, base, theme, components, utilities
- ใช้ CSS Modules หรือ scoped styles สำหรับ isolation
- ใช้ barrel exports สำหรับ imports เมื่อเหมาะสม
- จัดเรียง declarations ตาม logical group (`layout`, `box model`, `typography`, `visual`)

### 2. Modern Features

- ใช้ CSS custom properties แทน preprocessor variables เมื่อเป็นไปได้
- ใช้ `oklch()` หรือ `hsl()` สำหรับ colors เพื่อ perceptual uniformity
- ใช้ `clamp()` สำหรับ responsive typography
- ใช้ `container`/`@container` สำหรับ component-level responsive
- ใช้ native CSS Nesting แทน Sass/Less nesting เมื่อ browser target รองรับ
- ใช้ `@scope` เมื่อต้องการ limit cascade reach

### 3. Responsive Design

- ใช้ Mobile-first approach
- ใช้ Container Queries สำหรับ components ที่ reuse ในหลาย context
- ใช้ relative units (`rem`, `em`, `%`, `cq*`) และ `min()`/`max()`/`clamp()`
- ทดสอบบน breakpoints ที่ project กำหนด

### 4. Performance

- ลบ unused CSS ด้วย build tool ที่ project ใช้
- ใช้ `contain` property สำหรับ isolate layout/paint
- ใช้ `transform`/`opacity` สำหรับ animations
- ลด critical rendering path blockers
- ใช้ `font-display: swap` สำหรับ custom fonts
- หลีกเลี่ยง overuse ของ `will-change`

### 5. Accessibility

- ใช้ `:focus-visible` แทน `:focus` สำหรับ focus styles
- ให้ `prefers-reduced-motion` media query สำหรับ motion
- ตรวจสอบ contrast ด้วยเครื่องมือ เช่น Lighthouse
- ใช้ relative units เพื่อรองรับ user font scaling

### 6. Browser Compatibility

- ใช้ `@supports` สำหรับ feature queries
- ใช้ `caniuse.com` และ `web.dev/baseline` สำหรับ check support
- ให้ fallbacks สำหรับ features ที่ไม่รองรับ

- ใช้ `/follow-lib-unocss` ถ้าจำเป็น
- ใช้ `/follow-tool-formatter` ถ้าจำเป็น
- ใช้ `/follow-best-practice` ถ้าจำเป็น

## Expected Outcome

- CSS ที่เขียนตาม modern best practices และ Baseline ปี 2025/2026
- Performance ที่ดีขึ้น (ลด unused CSS, ใช้ containment, GPU-friendly animations)
- Accessibility ที่ครบถ้วน
- Maintainable CSS architecture
- Browser compatibility ที่ชัดเจนและมี fallback

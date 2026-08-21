---
name: follow-css
description: เขียน CSS ตาม best practices และ modern features
allowed-tools:
- read
- edit
- grep
- glob
- exec
triggers:
- user
- model
---

## Goal

เขียน CSS ตาม best practices และใช้ modern CSS features อย่างเหมาะสม

## Scope

ใช้สำหรับเขียน CSS ใน project ทั้งแบบ traditional และ CSS-in-JS

## Execute

### 1. Analyze CSS Setup

วิเคราะห์ CSS setup ปัจจุบัน

1. ตรวจสอบ CSS framework ที่ใช้ (Tailwind, UnoCSS, Bootstrap, etc.)
2. ตรวจสอบ CSS-in-JS solution (CSS Modules, styled-components, etc.)
3. ตรวจสอบ CSS preprocessor (Sass, Less, PostCSS)
4. ระบุ browser compatibility requirements

### 2. Apply Modern CSS Features

ใช้ modern CSS features ที่เหมาะสม

1. ใช้ CSS Variables (`--variable`) สำหรับ theming
2. ใช้ `:has()` และ `:is()` selectors
3. ใช้ CSS Nesting สำหรับ organization
4. ใช้ Cascade Layers (`@layer`) สำหรับ specificity control
5. ใช้ Container Queries สำหรับ responsive components
6. ใช้ Grid และ Flexbox สำหรับ layouts

### 3. Optimize Performance

ปรับปรุง performance ของ CSS

1. ใช้ `content-visibility` สำหรับ lazy rendering
2. ใช้ `will-change` อย่างระมัดระวัง
3. ใช้ `transform` และ `opacity` สำหรับ animations
4. ลบ unused CSS ด้วย tools
5. Minify CSS สำหรับ production
6. ใช้ critical CSS สำหรับ above-the-fold content

### 4. Ensure Accessibility

ตรวจสอบ accessibility

1. ใช้ semantic HTML กับ CSS
2. ใช้ `:focus-visible` สำหรับ keyboard navigation
3. ใช้ `prefers-reduced-motion` สำหรับ motion sensitivity
4. ตรวจสอบ color contrast
5. ใช้ relative units (`rem`, `em`, `vw`, `vh`)

## Rules

### 1. CSS Architecture

โครงสร้าง CSS ที่ดี

- ใช้ BEM หรือ utility-first approach
- แยก concerns: layout, components, utilities
- ใช้ CSS Modules หรือ scoped styles สำหรับ isolation
- ใช้ barrel exports สำหรับ imports
- จัดเรียง CSS ตาม specificity

### 2. Modern Features

ใช้ modern CSS features

- ใช้ CSS Variables แทน preprocessor variables
- ใช้ `clamp()` สำหรับ responsive typography
- ใช้ `aspect-ratio` สำหรับ media containers
- ใช้ `gap` สำหรับ Flexbox และ Grid
- ใช้ `backdrop-filter` สำหรับ glassmorphism

### 3. Responsive Design

ออกแบบ responsive

- ใช้ Mobile-first approach
- ใช้ Container Queries สำหรับ component-level responsive
- ใช้ relative units (`rem`, `em`, `%`)
- ใช้ `min()`, `max()`, `clamp()` สำหรับ fluid layouts
- ทดสอบบนทุก breakpoints

### 4. Performance

ปรับปรุง performance

- ลบ unused CSS ด้วย PurgeCSS หรือ UnoCSS
- ใช้ `contain` property สำหรับ isolation
- ใช้ hardware acceleration (`transform: translateZ(0)`)
- ลบ critical rendering path blockers
- ใช้ `font-display: swap` สำหรับ web fonts

### 5. Browser Compatibility

ตรวจสอบ browser compatibility

- ใช้ `@supports` สำหรับ feature detection
- ใช้ Autoprefixer สำหรับ vendor prefixes
- ตรวจสอบ browser support สำหรับ features ที่ใช้
- ใช้ progressive enhancement
- ให้ fallbacks สำหรับ unsupported features

## Expected Outcome

- CSS ที่เขียนตาม modern best practices
- Performance ที่ดีขึ้น
- Accessibility ที่ครบถ้วน
- Maintainable CSS architecture
- Browser compatibility ที่ดี

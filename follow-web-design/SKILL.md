---
name: follow-web-design
description: ออกแบบ web interfaces ด้วย design system principles และ modern best practices
---

## Goal

ออกแบบ web interfaces ที่สวยงาม ใช้งานได้ และเข้าถึงได้ โดยใช้ design system principles และ modern CSS

## Scope

ครอบคลุม layout, typography, colors, components, accessibility, responsive design, UX states, dark mode, และ animation สำหรับ web applications

## Execute

### 1. Setup Design System

> Goal: กำหนด foundation ของ design system

1. ทำ `/follow-design-system` สำหรับ universal design tokens
2. ถ้า project ใช้ UnoCSS ทำ `/follow-unocss` และ `/follow-unocss-theme`
3. กำหนด design tokens (colors, typography, spacing) สำหรับ web platform

### 2. Design Layout

> Goal: ออกแบบโครงสร้างหน้าเว็บ

1. ใช้ semantic HTML (`<header>`, `<nav>`, `<main>`, `<footer>`, `<aside>`)
2. ใช้ CSS Grid หรือ Flexbox สำหรับ layouts
3. ใช้ container queries สำหรับ component-level responsiveness
4. ใช้ `clamp()` สำหรับ fluid typography และ spacing

### 3. Design Typography

> Goal: กำหนดระบบตัวอักษร

1. เลือก font families ที่เหมาะสม (system fonts เป็น default)
2. กำหนด font scale ด้วย `clamp()` สำหรับ fluid responsive
3. ใช้ line-height 1.5-1.6 สำหรับ body text
4. ใช้ `text-wrap: balance` สำหรับ headings

### 4. Design Colors

> Goal: กำหนดระบบสีและ theme

1. ใช้ color palette ที่สม่ำเสมอผ่าน CSS variables
2. กำหนด semantic colors (success, warning, error, info)
3. ตรวจสอบ contrast ratio (4.5:1 normal, 3:1 large text)
4. รองรับ dark mode ด้วย `.dark` selector หรือ `prefers-color-scheme`

### 5. Design Components

> Goal: ออกแบบ component library

1. สร้าง reusable components ด้วย atomic design principles
2. ใช้ design tokens จาก `/follow-design-system`
3. Document ทุก component
4. สร้าง component variants (sizes, states, colors)

### 6. Design UX States

> Goal: ออกแบบสถานะ UI ที่ครบถ้วน

1. Loading states: skeleton screens, shimmer, progressive loading
2. Empty states: onboarding, no-data, first-use พร้อม CTA
3. Error states: 404, 500, offline, maintenance พร้อม friendly illustrations
4. Success states: toast, inline feedback, confirmation

### 7. Design Responsive

> Goal: ออกแบบ responsive บนทุก devices

1. Mobile-first approach
2. ใช้ relative units (rem, em, %, vw, vh)
3. กำหนด breakpoints ชัดเจน
4. ใช้ container queries สำหรับ component-level adaptations
5. ใช้ responsive images (`srcset`, `<picture>`, `aspect-ratio`)

### 8. Design Accessibility

> Goal: ออกแบบสำหรับทุกคน

1. ทำตาม WCAG 2.1 AA guidelines
2. รองรับ keyboard navigation ครบทุก interactive elements
3. รองรับ screen readers ด้วย ARIA labels
4. ใช้ focus states ที่ชัดเจน (`:focus-visible`)
5. ตรวจสอบ color contrast

### 9. Design Animation

> Goal: ออกแบบ animation ที่ smooth และ accessible

1. ใช้ CSS transitions สำหรับ microinteractions (hover, focus)
2. ใช้ `prefers-reduced-motion` สำหรับ accessibility
3. ใช้ `view-transition` API สำหรับ page transitions
4. กำหนด timing functions ที่สม่ำเสมอ (ease, ease-out)

### 10. Optimize Performance

> Goal: ตรวจสอบและปรับปรุง performance

1. ทำ `/review-codebase` สำหรับ Core Web Vitals
2. Optimize images ด้วย modern formats (WebP, AVIF)
3. ใช้ lazy loading สำหรับ images และ components
4. ใช้ `content-visibility: auto` สำหรับ long pages

## Rules

### 1. Semantic HTML

- ใช้ semantic tags (`<header>`, `<nav>`, `<main>`, `<footer>`, `<aside>`, `<article>`, `<section>`)
- ใช้ headings ตามลำดับที่ถูกต้อง (h1 → h6)
- ใช้ `<button>` สำหรับ actions, `<a>` สำหรับ navigation

### 2. Responsive Design

- Mobile-first approach
- ใช้ relative units (rem, em, %, vw, vh)
- กำหนด breakpoints ชัดเจน
- ใช้ container queries สำหรับ component-level responsiveness
- ใช้ `clamp()` สำหรับ fluid typography และ spacing

### 3. Typography

- ใช้ font scale ที่ consistent
- line-height 1.5-1.6 สำหรับ body text
- ไม่ใช้ font size น้อยกว่า 16px สำหรับ body
- ใช้ `text-wrap: balance` สำหรับ headings
- ใช้ `clamp()` สำหรับ fluid font sizes

### 4. Colors

- ใช้ color palette ที่สม่ำเสมอผ่าน CSS variables
- contrast ratio อย่างน้อย 4.5:1 สำหรับ normal text
- contrast ratio อย่างน้อย 3:1 สำหรับ large text
- รองรับ dark mode
- ใช้ colors เพื่อสื่อความหมาย ไม่ใช่ decoration เท่านั้น

### 5. Spacing

- ใช้ spacing scale ที่ consistent (4px, 8px, 16px, 24px, 32px)
- ใช้ whitespace อย่างเหมาะสม
- ไม่ใช้ magic numbers สำหรับ spacing

### 6. Components

- สร้าง components ที่ reusable
- ใช้ props ที่ชัดเจน
- Document ทุก component
- Test ทุก component
- สร้าง component variants (sizes, states, colors)

### 7. UX States

- ทุกหน้าต้องมี loading, empty, error states
- Loading: skeleton screens ไม่ใช่ spinners เมื่อ possible
- Empty: มี CTA และ guidance
- Error: มี friendly message และ recovery action

### 8. Accessibility

- ใช้ ARIA labels เมื่อจำเป็น
- รองรับ keyboard navigation
- ใช้ `:focus-visible` สำหรับ focus states
- ใช้ alt text สำหรับ images
- ใช้ `prefers-reduced-motion` สำหรับ animation

### 9. Animation

- ใช้ CSS transitions สำหรับ microinteractions
- ใช้ `prefers-reduced-motion` เสมอ
- กำหนด timing functions ที่สม่ำเสมอ
- ไม่ใช้ animation ที่รบกวนการอ่าน

### 10. Modern CSS

- ใช้ container queries สำหรับ component-level responsiveness
- ใช้ `:has()` selector สำหรับ parent state
- ใช้ CSS nesting สำหรับ scoped styles
- ใช้ `content-visibility: auto` สำหรับ performance
- ใช้ `aspect-ratio` สำหรับ media

## Expected Outcome

- Web interfaces ที่สวยงามและ consistent
- Responsive บนทุก devices
- Accessible ตาม WCAG 2.1 AA standards
- Loading, empty, error states ครบทุกหน้า
- Dark mode ทำงานได้
- Fast loading performance
- Code ที่ maintainable

## Common Mistakes

- ไม่ใช้ semantic HTML
- ไม่ทำ responsive design
- ไม่ตรวจสอบ contrast ratio
- ไม่ test accessibility
- ใช้ magic numbers สำหรับ spacing
- ไม่มี loading/empty/error states
- ไม่รองรับ dark mode
- ไม่ใช้ `prefers-reduced-motion`

## Anti-Patterns

- ใช้ `<div>` สำหรับทุกอย่าง
- Hardcode pixel values
- ไม่มี focus states
- ไม่มี hover states
- ใช้ colors ที่ไม่มี semantic meaning
- ใช้ spinner แทน skeleton screens
- ไม่มี empty state guidance

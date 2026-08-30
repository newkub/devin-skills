---
name: improve-uxui
description: ปรับ UX/UI ด้วย Vercel + Google guidelines ผ่าน /follow-design-system และ /review-uxui
argument-hint: "[file-or-pattern]"
related:
  - follow-design-system
  - review-uxui
  - follow-create-web
  - optimize-everything
  - ship
---

## Goal

ปรับปรุง UX/UI ของ project ให้ดีขึ้นด้วยการผสมผสาน best practices จาก Vercel Web Interface Guidelines และ Google Modern Web Guidance

## Scope

- ใช้สำหรับ web และ TUI projects
- ครอบคลุม design system, accessibility, visual design, interaction, performance
- ใช้ `/follow-design-system` สำหรับสร้าง/ปรับ design system
- ใช้ `/review-uxui` สำหรับ audit และหาปัญหา
- ใช้ `/optimize-everything` สำหรับ SEO, bundle, และ performance

## Execute

### 1. Detect Project Type

> Goal: ระบุว่าเป้น web, TUI, หรืออื่น

1. ตรวจ `package.json`, `wrangler.toml`, `Cargo.toml`
2. ถ้าเป็น web → ไปข้อ 2
3. ถ้าเป็น TUI → ทำ `/follow-design-system` แล้วข้าม web-specific steps

### 2. Run UX/UI Review

> Goal: หาปัญหา UX/UI ปัจจุบัน

1. ใช้ `/review-uxui <file-or-pattern>`
2. บันทึก findings, severity, score
3. ถ้าไม่มี `review-uxui` ให้ใช้ `/deep-analyze` แทน

### 3. Apply Design System

> Goal: ปรับ/สร้าง design system

1. ใช้ `/follow-design-system`
2. กำหนด tokens: colors, typography, spacing, shadows, borders, radius
3. สร้าง/ปรับ reusable components
4. ทำ `/follow-lib-unocss-theme` ถ้าใช้ UnoCSS

### 4. Apply Vercel Web Interface Guidelines

> Goal: ตรวจสอบตาม Vercel guidelines

1. Fetch หรืออ่าน guidelines จาก URL:
   ```text
   https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
   ```
2. ตรวจสอบ:
   - Accessibility (aria-label, keyboard, semantic HTML, headings)
   - Focus states (focus-visible, ไม่ outline-none)
   - Forms (labels, autocomplete, type, inputmode, placeholders)
   - Animation (prefers-reduced-motion, transform/opacity)
   - Typography (…, curly quotes, non-breaking spaces, text-wrap)
   - Images (width/height, lazy/priority)
   - Performance (virtualize lists, preconnect, font preload)
   - Navigation (URL state, Link, deep-link)
   - Touch (touch-action, overscroll-behavior)
   - Dark mode (color-scheme, meta theme-color)
3. แก้ไข issues ทีพบ

### 5. Apply Google Modern Web Guidance

> Goal: ใช้ modern web APIs และ best practices

1. รัน modern-web-guidance search ถ้าจำเป็น:
   ```bash
   npx -y modern-web-guidance@latest search "<topic>" --skill-version 2026_05_16-c5e78707
   ```
2. ตรวจสอบ:
   - View Transitions
   - Scroll-driven animations
   - Container queries
   - `:has()`, `:user-valid`
   - Anchor Positioning
   - Popover API
   - `content-visibility`
   - `Fetch Priority`
   - `scheduler.yield`
3. ปรับใช้ตาม framework ทีใช้ (Solid, React, Vue)

### 6. Optimize

> Goal: ปรับ performance, SEO, bundling

1. ใช้ `/optimize-everything`
2. รัน build และตรวจ bundle size
3. รัน Lighthouse หรือ PageSpeed Insights ถ้าเป็น web

### 7. Verify

> Goal: ยืนยันว่า UX/UI ดีขึ้น

1. รัน `bun run build`, `bun run typecheck`
2. รัน `/review-uxui` อีกครั้ง
3. เปิด browser ตรวจ visual และ interaction
4. ทำ `/deep-validate`

### 8. Report

> Goal: สรุปผล

1. ทำ `/report-progress`
2. รายงาน before/after score
3. ทำ `/suggest-next-action`

## Rules

- ใช้ `/follow-design-system` ก่อนปรับ components
- ใช้ `/review-uxui` ก่อนและหลังปรับปรุง
- ใช้ `/optimize-everything` สำหรับ SEO/performance
- ใช้ `/follow-create-web` หรือ `/ship` ตาม flow
- ไม่ commit ก่อนตรวจสอบผ่าน
- ใช้ Vercel guidelines สำหรับ UI/UX specifics
- ใช้ Google Modern Web Guidance สำหรับ modern APIs

## Expected Outcome

- UX/UI ดีขึ้นตาม Vercel + Google guidelines
- Design system สม่ำเสมอ
- Accessibility ดีขึ้น
- Performance ดีขึ้น
- มี before/after score

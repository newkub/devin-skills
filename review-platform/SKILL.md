---
name: review-platform
description: Review platform ครอบคลุม mobile, desktop, CLI/TUI, SSR, i18n, SEO, performance, accessibility
related:
  - review-seo
---

## Goal

Review platform ครอบคลุมทุก dimension ของ platform พร้อม aggregate findings และ review score

## Scope

platform review สำหรับ: mobile app, desktop app, CLI/TUI, server-side rendering, state management, routing, PWA, i18n และ localization, SEO, web performance, accessibility, battery/energy usage, browser/platform compatibility

## Execute

### 1. Prepare And Scan

เตรียม context ก่อนเริ่ม review

> Goal: เข้าใจ platform setup ใน codebase

1. ทำ `/scan-codebase` เพื่อเข้าใจ platform setup
2. ระบุ mobile framework, desktop framework, CLI framework, SSR setup, state management library, routing library, PWA setup, i18n library, SEO strategy, battery-sensitive components, compatibility targets
3. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
4. ทำ `/update-create-review-cli` เพื่อให้ analyzers ครอบคลุม categories ล่าสุด
5. รัน `bun --filter tools-review review:json` เพื่อดึง review report พร้อม metrics
6. ทำ `/run-review` เพื่อรัน review CLI และดึง metrics ล่าสุด

### 2. Mobile And Desktop Review

Review mobile และ desktop app — ดูรายละเอียดใน `references/mobile-desktop.md`

> Goal: ครอบคลุมทุก mobile และ desktop dimension

1. ตรวจสอบ Capacitor plugin usage, platform detection, native bridge patterns
2. ตรวจสอบ offline support, push notification handling, biometric auth
3. ตรวจสอบ mobile UX: touch targets, safe area, responsive layout
4. ตรวจสอบ native API usage, IPC patterns, security boundaries ระหว่าง main/renderer processes
5. ตรวจสอบ window management, auto-update mechanism, file system access, sandbox restrictions
6. ตรวจสอบ desktop UX: system tray, notifications, keyboard shortcuts, clipboard integration
7. Critical: native bridge พัง, IPC ไม่มี validation, file system access ไม่จำกัด, app crash บน platform
8. High: ไม่มี offline support, ไม่มี platform-specific handling, auto-update ไม่ verify, ไม่มี offline fallback

### 3. CLI And TUI Review

Review CLI และ TUI tools — ดูรายละเอียดใน `references/cli-tui.md`

> Goal: ครอบคลุมทุก CLI/TUI dimension

1. ตรวจสอบ command structure, options, flags, argument parsing
2. ตรวจสอบ help text completeness, error messages, exit codes
3. ตรวจสอบ interactive mode, autocomplete, configuration file support
4. ตรวจสอบ TUI layout, component composition, resize handling, focus management
5. ตรวจสอบ build configuration, cross-compilation, packaging, distribution channels
6. ตรวจสอบ config consistency ระหว่าง root และ CLI workspace
7. Critical: command พัง, exit code ผิด, TUI layout พัง, input ไม่ถูกจัดการ, terminal crash
8. High: ไม่มี help text, error message สับสน, rendering glitch, ไม่รองรับ resize, build suboptimal

### 4. SSR, State Management, Routing, PWA Review

Review SSR, state management, routing, PWA compliance

> Goal: ครอบคลุมทุก SSR, state, routing, PWA dimension

1. ตรวจสอบ SSR implementation, hydration correctness, SSR-compatible code, streaming SSR
2. ตรวจสอบ store organization, reactivity patterns, side effect management, state persistence
3. ตรวจสอบ route definitions, navigation guards, lazy loading, params validation
4. ตรวจสอบ service worker, web manifest, offline support, install prompt, background sync, push notifications
5. Critical: hydration mismatch, SSR พัง, state corruption, ไม่มี auth guard, ไม่มี service worker บน production
6. High: ไม่มี hydration, unnecessary re-render, ไม่มี lazy load, cache เก่าหลัง update, ไม่มี offline fallback

### 5. I18n And Localization Review

Review i18n และ localization — ดูรายละเอียดใน `references/i18n.md`

> Goal: ครอบคลุมทุก i18n dimension

1. ตรวจสอบ translation completeness, missing keys, locale coverage, fallback strategy
2. ตรวจสอบ locale formatting: date, number, currency, pluralization, relative time
3. ตรวจสอบ RTL support, logical properties, text direction handling, bidirectional text
4. ตรวจสอบ cultural adaptation: address, name, phone, postal code, calendar system
5. ตรวจสอบ locale-specific validation, locale-aware error messages
6. Critical: missing locale entirely, broken translation key ใน critical path, no fallback, broken RTL layout
7. High: missing translation keys, incomplete locale coverage, missing RTL support, incorrect locale formatting

### 6. SEO Review

Review SEO — ดูรายละเอียดใน `references/seo.md`

> Goal: ครอบคลุมทุก SEO dimension

1. ทำ `/review-seo` เพื่อรีวิว SEO โดยเฉพาะ
2. รับ findings, severity และ score จาก `/review-seo` มารวมใน aggregate report
3. ถ้า project ไม่ใช่ web app → ข้าม section นี้

### 7. Battery And Energy Review

Review battery/energy usage — ดูรายละเอียดใน `references/battery.md`

> Goal: ครอบคลุมทุก battery/energy dimension

1. ตรวจสอบ polling และ timers: `setInterval`, `setTimeout`, cron jobs, redundant polling
2. ตรวจสอบ sensors และ hardware: GPS, accelerometer, camera, Bluetooth, wake locks
3. ตรวจสอบ network และ sync: frequent requests, retries ไม่มี backoff, background sync
4. ตรวจสอบ background services, push notifications, periodic tasks, start-up tasks
5. ตรวจสอบ UI rendering: animations ไม่หยุด, layout thrashing, re-renders, heavy canvas/WebGL
6. ตรวจสอบ compute: heavy computations บน main thread, nested loops, repeated parsing
7. Critical: wake lock ค้าง, GPS track ต่อเนื่อง, high-frequency polling บน hot path
8. High: network retries ไม่มี backoff, sensors ไม่ปิด, animations ไม่หยุด, heavy compute บน main thread

### 8. Performance Review

Review web performance — ดูรายละเอียดใน `references/performance.md`

> Goal: ครอบคลุมทุก performance dimension

1. ตรวจ Core Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1
2. ตรวจ bundle size: JavaScript < 200KB, CSS < 50KB, total < 1MB
3. ตรวจ network: render-blocking resources, request count, caching strategy
4. ตรวจ runtime: long tasks, memory usage, frame rate
5. ตรวจ loading: FCP, TTI, Speed Index, TTFB
6. รัน Lighthouse audit ครบทุก category
7. Critical: LCP > 4s, INP > 500ms, CLS > 0.25, page โหลดไม่ได้
8. High: LCP > 2.5s, INP > 200ms, CLS > 0.1, Performance Score < 50, bundle > 500KB

### 9. Accessibility Review

Review accessibility ตาม WCAG 2.1 — ดูรายละเอียดใน `references/accessibility.md`

> Goal: ครอบคลุมทุก accessibility dimension

1. ตรวจ keyboard navigation: tab order, focus indicators, skip link
2. ตรวจ screen reader: ARIA labels, alt text, semantic HTML, heading hierarchy
3. ตรวจ color contrast: WCAG AA (text ≥ 4.5:1), ไม่ใช้สีเพียงอย่างเดียว
4. ตรวจ forms: labels, error messages, keyboard accessible controls
5. ตรวจ media: captions, audio descriptions, autoplay controls
6. รัน automated audit: axe, Lighthouse, pa11y
7. Critical: no keyboard access, no alt text บน critical images, contrast < 3:1
8. High: missing labels, broken heading hierarchy, no focus indicators

### 10. Compatibility Review

Review browser/platform compatibility — ดูรายละเอียดใน `references/compatibility.md`

> Goal: ครอบคลุมทุก compatibility dimension

1. ตรวจสอบ browser support: target browsers, polyfills, feature detection, transpilation config
2. ตรวจสอบ platform compatibility: OS versions, Node.js versions, runtime requirements
3. ตรวจสอบ API compatibility: deprecated APIs, vendor prefixes, browser-specific behavior
4. ตรวจสอบ CSS compatibility: flexbox, grid, custom properties, `backdrop-filter`, vendor prefixes
5. Critical: ใช้ API ที่ browser หลักไม่รองรับ, broken บน target platform, ไม่มี fallback
6. High: missing polyfill สำหรับ feature สำคัญ, inconsistent behavior ข้าม browsers

### 11. Validate Findings

ตรวจสอบและ validate issues จากทุก section

> Goal: Issues ถูกต้องและจัดลำดับตาม severity

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ: cross-reference, type safety, runtime, security, compliance
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับการ validate ตาม severity: Critical → High → Medium → Low

### 12. Report

รายงานผล review ในรูปแบบตาราง

> Goal: รายงาน aggregate findings พร้อม actionable recommendations

1. ทำ `/report` พร้อม `/report-table`
2. สร้างตาราง aggregate findings จากทุก section
3. คำนวณ review score — ดูสูตรใน `references/scoring.md`
4. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี mobile app ให้ข้าม Section 2 mobile parts
- ถ้า project ไม่มี desktop app ให้ข้าม Section 2 desktop parts
- ถ้า project ไม่มี CLI หรือ TUI ให้ข้าม Section 3
- ถ้า project ไม่มี SSR ให้ข้าม Section 4 SSR items
- ถ้า project ไม่มี i18n ให้ข้าม Section 5
- ถ้า project ไม่ใช่ web app ให้ข้าม Section 6
- ถ้า project ไม่มี battery-sensitive dimension ให้ข้าม Section 7
- ถ้า project ไม่ใช่ web app ให้ข้าม Section 8 performance
- ถ้า project ไม่มี UI ให้ข้าม Section 9 accessibility
- ถ้า project ไม่มี compatibility concern ให้ข้าม Section 10

### 2. Severity Classification

- Critical: ระบบพัง, data loss, security hole — ดูรายละเอียดในแต่ละ section และ reference files
- High: ฟังก์ชันหลักพัง, ขาด feature สำคัญ — ดูรายละเอียดในแต่ละ section และ reference files
- Medium: inconsistent UX pattern, suboptimal config, missing safe area, incomplete manifest, suboptimal polling
- Low: cosmetic improvement, naming convention, minor layout issue, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ไม่เดา ใช้ tools สำหรับ verification
- ระบุ locale, translation key, URL, meta tag, หรือ formatting function ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- ไม่ลบไฟล์หรือส่วนประกอบใดๆ ในระหว่าง review

### 5. Health Score

- คำนวณ review score เป็น percentage (0-100) — ดูสูตรใน `references/scoring.md`
- 0 = ทุก finding เป็น Critical, 100 = ไม่มี finding
- แสดง score ต่อ dimension และ overall score
- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง

### 6. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก platform section
- รายงาน recommended actions พร้อม priority
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

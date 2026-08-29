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
4. ทำ `/review-codebase-everythink` เพื่อให้ analyzers ครอบคลุม categories ล่าสุด
5. รัน `bun --filter tools-review-codebase review-codebase:json` เพื่อดึง review report พร้อม metrics
6. ทำ `/run-review` เพื่อรัน review CLI และดึง metrics ล่าสุด

#### 1.2 Mobile And Desktop Review

> Goal: ครอบคลุมทุก mobile และ desktop dimension

Review native bridge, offline support, mobile/desktop UX, IPC, window management, auto-update, and file system access. See [references/mobile-desktop.md](references/mobile-desktop.md).

### 2. CLI And TUI Review

> Goal: ครอบคลุมทุก CLI/TUI dimension

Review command structure, help/exit codes, interactive mode, TUI layout, build config, and distribution. See [references/cli-tui.md](references/cli-tui.md).

### 3. SSR, State Management, Routing, PWA Review

> Goal: ครอบคลุมทุก SSR, state, routing, PWA dimension

Review SSR/hydration, state management, routing, and PWA compliance. See [references/ssr-state-routing-pwa.md](references/ssr-state-routing-pwa.md).

### 4. I18n And Localization Review

> Goal: ครอบคลุมทุก i18n dimension

Review translation completeness, locale formatting, RTL support, cultural adaptation, and locale-specific validation. See [references/i18n.md](references/i18n.md).

### 5. SEO Review

> Goal: ครอบคลุมทุก SEO dimension

1. ทำ `/review-seo` เพื่อรีวิว SEO โดยเฉพาะ
2. รับ findings, severity และ score จาก `/review-seo` มารวมใน aggregate report
3. ถ้า project ไม่ใช่ web app → ข้าม section นี้

### 6. Battery And Energy Review

> Goal: ครอบคลุมทุก battery/energy dimension

Review polling/timers, sensors, network/sync, background services, UI rendering, and compute for battery impact. See [references/battery.md](references/battery.md).

### 7. Performance Review

> Goal: ครอบคลุมทุก performance dimension

Review Core Web Vitals, bundle size, network, runtime, loading metrics, and Lighthouse audit. See [references/performance.md](references/performance.md).

### 8. Accessibility Review

> Goal: ครอบคลุมทุก accessibility dimension

Review keyboard navigation, screen reader support, color contrast, forms, media, and automated audits against WCAG 2.1. See [references/accessibility.md](references/accessibility.md).

### 9. Compatibility Review

> Goal: ครอบคลุมทุก compatibility dimension

Review browser support, polyfills, feature detection, transpilation, OS/runtime compatibility, and CSS compatibility. See [references/compatibility.md](references/compatibility.md).

### 10. Validate Findings

ตรวจสอบและ validate issues จากทุก section

> Goal: Issues ถูกต้องและจัดลำดับตาม severity

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ: cross-reference, type safety, runtime, security, compliance
2. ทำ `/deep-validate` สำหรับ validate issues จากทุก section
3. จัดลำดับการ validate ตาม severity: Critical → High → Medium → Low

#### 10.2 Report

รายงานผล review ในรูปแบบตาราง

> Goal: รายงาน aggregate findings พร้อม actionable recommendations

1. ทำ `/report` พร้อม `/report-table`
2. สร้างตาราง aggregate findings จากทุก section
3. คำนวณ review score — ดูสูตรใน [references/scoring.md](references/scoring.md)
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

- คำนวณ review score เป็น percentage (0-100) — ดูสูตรใน [references/scoring.md](references/scoring.md)
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
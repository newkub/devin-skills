---
name: review-browser-compat
description: Review CSS compatibility, vendor prefixes, JS API compatibility, polyfills, feature detection, browserslist, CSS reset/normalize
---

## Goal

Review browser compatibility ครอบคลุม CSS, JS API, polyfills, feature detection, browserslist พร้อม health score

## Scope

browser compatibility review สำหรับ: CSS compatibility (vendor prefixes, missing fallbacks), JS API compatibility (Web APIs, polyfills, feature detection), target browser support (browserslist config), polyfill strategy, feature detection (@supports, typeof checks), vendor prefixes, CSS reset/normalize, Autoprefixer, legacy browser support

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ browser support targets และ compatibility strategy

1. ทำ `/scan-codebase` เพื่อเข้าใจ browser compatibility structure
2. ระบุ browserslist config, Autoprefixer config, polyfill strategy, CSS reset/normalize approach ที่ใช้

### 2. Deep Analyze

> Goal: ครอบคลุมทุก browser compatibility dimension พร้อม health score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ compatibility patterns
2. ทำ `/update-codebase-health-cli` — `/update-codebase-health-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-codebase-health-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-health` เพื่อดึง metrics ล่าสุด

### 3. CSS Compatibility Review

> Goal: ครอบคลุม CSS compatibility, vendor prefixes, fallbacks

1. ตรวจสอบ CSS compatibility: modern CSS features (container queries, :has(), nesting, cascade layers), browser support coverage, CSS feature fallbacks, progressive enhancement, graceful degradation for unsupported CSS
2. ตรวจสอบ vendor prefixes: Autoprefixer config, manual prefixes (should not exist), prefix coverage, prefix removal for deprecated prefixes, -webkit-, -moz-, -ms-
3. ตรวจสอบ CSS reset/normalize: reset/normalize strategy, reset completeness, normalize vs reset, custom reset quality, reset bundle size
4. ตรวจสอบ @supports: feature detection with @supports, @supports not fallback, @supports for progressive enhancement, missing @supports on modern CSS
5. Critical: critical feature ที่ไม่ทำงานบน browser หลัก, CSS ที่ break layout บน supported browser, no fallback for critical CSS feature
6. High: CSS feature ที่ไม่มี fallback, outdated Autoprefixer, missing @supports, inconsistent vendor prefixes, missing CSS reset

### 4. JS Compatibility And Polyfill Review

> Goal: ครอบคลุม JS API compatibility, polyfills, feature detection

1. ตรวจสอบ JS API compatibility: Web API usage (IntersectionObserver, ResizeObserver, Intl, structuredClone), browser support for JS APIs, modern JS features (optional chaining, nullish coalescing, top-level await), target browser support
2. ตรวจสอบ polyfill strategy: polyfill necessity, polyfill bundle size, polyfill targeting (per-browser), polyfill vs feature detection, core-js config, polyfill.io usage
3. ตรวจสอบ feature detection: typeof checks, in operator checks, feature detection patterns, missing feature detection on optional APIs, feature detection vs user agent sniffing
4. ตรวจสอบ browserslist config: browserslist coverage, browserslist accuracy, browserslist update, browserslist query syntax, browserslist in package.json vs .browserslistrc
5. ตรวจสอบ legacy browser support: legacy build strategy, legacy bundle, legacy polyfills, Internet Explorer support (if needed), legacy CSS fallbacks
6. Critical: critical feature ที่ไม่ทำงานบน browser หลัก, missing polyfill ที่ก่อให้เกิด crash, no feature detection on critical API
7. High: outdated browserslist, missing polyfill, unnecessary polyfill, missing feature detection, inconsistent polyfill strategy, no legacy build (if needed)

### 5. Validate, Rate And Report

> Goal: Issues ถูก validate และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ health score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/report` พร้อม `/report-format-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่ใช่ web app → ข้ามทั้งหมด
- ถ้า project ไม่มี polyfills → ข้าม Step 4 item 2
- ถ้า project ไม่รองรับ legacy browsers → ข้าม Step 4 item 5

### 2. Severity Classification

- Critical: critical feature ที่ไม่ทำงานบน browser หลัก, CSS ที่ break layout บน supported browser, no fallback for critical CSS feature, missing polyfill ที่ก่อให้เกิด crash, no feature detection on critical API
- High: CSS feature ที่ไม่มี fallback, outdated Autoprefixer, missing @supports, outdated browserslist, missing polyfill, unnecessary polyfill, missing feature detection, no legacy build (if needed)
- Medium: inconsistent vendor prefixes, minor CSS fallback gap, suboptimal polyfill strategy, missing CSS reset, inconsistent browserslist
- Low: cosmetic, minor prefix cleanup, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ CSS property, JS API, หรือ browser ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-format-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก browser compatibility section
- Health score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

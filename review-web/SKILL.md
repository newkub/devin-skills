---
name: review-web
description: Review เว็บที่รันจริงทุกมิติ — routes, auth, console, network, forms, state, PWA, vitals
argument-hint: "[url-or-scope]"
related:
  - review-frontend
  - review-uxui
  - review-seo
  - review-accessibility
  - review-performance
  - review-platform
  - watch-browser
  - use-agent-browser
  - deep-validate
  - report
  - suggest-next-action
  - run-review
---

## Goal

Review เว็บแอป/เว็บไซต์ที่ deploy หรือรันอยู่จริงแบบ end-to-end — ตรวจ pages, routes, navigation, links, forms, console errors, network requests, Core Web Vitals, meta/SEO basics, accessibility และ responsive behavior พร้อม severity ratings และ review score

## Scope

runtime web review สำหรับ site ที่เข้าถึงได้ผ่าน URL (local dev server, staging, production) — ตรวจพฤติกรรมจริงของเว็บจาก browser ไม่ใช่ static code review

ไม่รวม:
- frontend source code quality (components, state, hooks) → ใช้ `/review-frontend`
- visual design, design system, UX flow → ใช้ `/review-uxui`
- SEO deep-dive → ใช้ `/review-seo`
- accessibility deep-dive → ใช้ `/review-accessibility`
- performance deep-dive → ใช้ `/review-performance`

## Execute

### 1. Prepare And Open Site

> Goal: ระบุ target URL และเปิด browser พร้อม evidence baseline

1. ระบุ target URL จาก argument — ถ้าไม่มีให้หา dev server หรือ deployment URL ของ project
2. ถ้ายังไม่มี dev server → ทำ `/run-program` เพื่อรัน site ก่อน
3. ทำ `/watch-browser` เพื่อเปิด site ผ่าน agent-browser MCP และ capture baseline evidence (screenshot, console, errors)
4. ถ้า agent-browser ไม่พร้อม → fallback เป็น `use-agent-browser` CLI หรือ `browser-preview`
5. ถ้าเข้าถึง site ไม่ได้ → stop และ report

### 2. Pages And Routes Review

> Goal: ตรวจครบทุก page/route ที่เข้าถึงได้

1. สร้าง page inventory จาก nav links, sitemap, router config
2. visit ทุก route แล้วตรวจ: render สำเร็จ, ไม่มี blank/error page, status code ถูกต้อง
3. ตรวจ 404 handling, redirect chains, trailing-slash consistency
4. ตรวจ broken links, broken images, missing assets (404 ใน network)
5. ตรวจ deep links และ browser back/forward navigation

### 3. Console And Errors Review

> Goal: ไม่มี runtime errors หรือ warnings ที่มีนัยสำคัญ

1. ใช้ `agent-browser console` และ `agent-browser errors` เก็บ console errors, page errors, unhandled rejections ทุก page
2. จำแนก error vs warning vs info — flag hydration errors, CORS errors, CSP violations เป็น High
3. ตรวจ source maps ชี้กลับ source ได้ถูกต้อง (production)

### 4. Network And Requests Review

> Goal: ตรวจ network behavior และ API calls

1. ใช้ `agent-browser network` ดู requests ทั้งหมด — failed requests, 4xx/5xx, slow endpoints
2. ตรวจ API calls: auth headers, error responses, retry behavior
3. ตรวจ resource loading: render-blocking resources, oversized assets, cache headers
4. ตรวจ ไม่มี secrets/tokens รั่วใน request หรือ response

### 5. Forms And Interactions Review

> Goal: forms และ interactions ทำงานครบ

1. ทดสอบทุก form: submit success, validation errors, required fields, error messages
2. ตรวจ keyboard navigation และ focus management บน interactive elements
3. ตรวจ buttons/links ทำงานจริง — ไม่มี dead click, disabled state ถูกต้อง
4. ตรวจ loading states, empty states, error states ของ UI

### 6. Web Vitals, Meta And Accessibility Review

> Goal: ตรวจ Core Web Vitals, meta/SEO signals และ accessibility พื้นฐาน

1. วัด LCP, INP, CLS บน pages หลัก (ผ่าน agent-browser performance หรือ Lighthouse ถ้ามี)
2. ตรวจ time-to-interactive, layout shifts, slow third-party scripts
3. flag pages ที่ LCP > 2.5s หรือ CLS > 0.1 เป็น Medium+
4. ตรวจ bundle size ผลรวมและ route-level code splitting — deep-dive ที่ `/review-performance`
5. ตรวจ `title`, meta description, canonical, OG tags บนทุก page — deep-dive ที่ `/review-seo`
6. ตรวจ lang attribute, heading order, alt text, label associations — deep-dive ที่ `/review-accessibility`
7. ตรวจ HTTPS, mixed content, security headers (CSP, HSTS) — deep-dive ที่ `/review-security`

### 7. Responsive And Compatibility Review

> Goal: ตรวจข้าม viewport และ browser

1. ทดสอบ mobile (375px), tablet (768px), desktop (1280px+) viewports
2. ตรวจ horizontal scroll, overflow, touch targets, viewport meta
3. ตรวจ browser-specific issues ถ้า target หลาย browser

### 8. Auth And Session Review

> Goal: ตรวจ auth flows และ access control — ข้ามถ้า site ไม่มี auth

1. ทดสอบ login/logout/register, password reset, session expiry, token refresh
2. ตรวจ protected routes: unauthenticated → redirect ถูกต้อง, unauthorized → 403 ไม่ใช่ 200
3. ตรวจ role-based access: user ธรรมดาเข้า admin routes ไม่ได้
4. ตรวจ token storage: session tokens ควร httpOnly cookie ไม่ใช่ localStorage (XSS risk)
5. ตรวจ OAuth/SSO redirect flow, callback handling, state parameter
6. flag credentials/tokens ใน URL, query string หรือ referrer เป็น Critical

### 9. Storage, State, Realtime And PWA Review

> Goal: ตรวจ client-side state, realtime behavior และ app-like capabilities — ข้าม dimensions ที่ site ไม่มี

1. ตรวจ cookies/localStorage/sessionStorage: ไม่มี secrets, size เหมาะสม, expiry ถูกต้อง
2. ตรวจ URL state: refresh แล้ว state คงอยู่, shareable URLs, back/forward restore state
3. ตรวจ WebSocket/SSE: reconnect หลัง disconnect, heartbeat, stale data handling
4. ตรวจ optimistic UI: rollback เมื่อ mutation fail, conflict resolution
5. ตรวจ race conditions: rapid navigation, double-submit, stale fetch override
6. ถ้า PWA: manifest valid, service worker ทำงาน, offline fallback, install prompt
7. ตรวจ dark mode/theme: toggle ทำงาน, persist, ไม่มี flash-of-unstyled-content
8. ตรวจ i18n: locale detection, language switcher, hreflang, RTL layout ถ้ารองรับ
9. ตรวจ date/time/number formatting ตาม locale และ timezone
10. ตรวจ print styles และ reduced-motion preference ถ้า claim รองรับ

### 10. Validate And Report

> Goal: findings ถูกต้อง จัดลำดับ severity และรายงานพร้อม evidence

1. ทำ `/deep-validate` กับ findings ทุก section — reproduce error ซ้ำก่อน flag
2. จัดลำดับตาม severity: Critical → High → Medium → Low → Info และระบุ false positives
3. ทำ `/report` ตาราง: `No.`, `Page/URL`, `Finding`, `Severity`, `Evidence`, `Recommendation`
4. คำนวณ review score ต่อ dimension และ overall (0-100, grade A-F) — ใช้ `references/checklist.md` เป็น checklist ครบทุกมิติ
5. ทำ `/suggest-next-action` แนะนำ fix order

## Rules

### 1. Scope Boundary

- เน้น runtime behavior ของ live site — ไม่ใช่ source code review
- ไม่ซ้ำกับ `/review-frontend`, `/review-uxui`, `/review-seo`, `/review-accessibility`, `/review-performance` — findings ลึกส่งต่อให้ domain skills

### 2. Skip Conditions

- ถ้าเข้าถึง URL ไม่ได้ → stop และ report
- ถ้า site ไม่มี forms → ข้าม form checks
- ถ้าไม่สามารถวัด vitals ได้ → ข้ามพร้อม note ใน report

### 3. Severity Classification

- Critical: page พัง, console errors บนทุก page, form submit ไม่ได้, 5xx บน critical routes, secrets รั่ว, credentials ใน URL, auth bypass
- High: broken links/navigation, 4xx บน resources, hydration errors, LCP > 4s, missing error states, protected route เข้าได้โดยไม่ auth, session ไม่ expire
- Medium: console warnings, LCP > 2.5s, CLS > 0.1, missing meta, slow API calls, URL state หายเมื่อ refresh, websocket ไม่ reconnect
- Low: minor visual glitches, non-blocking issues, missing nice-to-have meta, theme flash
- Info: suggestions, best practice recommendations

### 4. Evidence-Based Findings

- ทุก finding ต้องมี URL, console output, network trace หรือ screenshot เป็นหลักฐาน
- ไม่เดา — reproduce ก่อน flag; ใช้ agent-browser tools สำหรับ verification
- ระบุ page, element, request หรือ console message ที่เกี่ยวข้อง

### 5. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code หรือ config ระหว่าง review
- ไม่ submit forms ที่มีผลจริง (payment, destructive actions) โดยไม่ได้รับอนุญาต
- ถ้าพบ issues ที่ต้องแก้ → report ผ่าน `/report` และ `/suggest-next-action`

### 6. Circuit Breaker

- timeout 600s ต่อ site review, max 3 retries ต่อ page ที่เข้าถึงไม่ได้
- ถ้า console errors ซ้ำเกิน 20 ต่อ page → flag ครั้งเดียวแล้วข้าม

### 7. Formatting

- ห้ามใช้ `**` bold markers — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report` ทุก report table เริ่มด้วยคอลัมน์ `No.`
- ใช้ /review-platform ถ้าจำเป็น
- ใช้ /run-review ถ้าจำเป็น

## Expected Outcome

- page/route inventory พร้อมผลตรวจครบทุก URL ที่เข้าถึงได้
- รายงานตาราง findings พร้อม severity, URL และ evidence (console/network/screenshot)
- auth/session, storage/state, PWA/i18n/theme coverage ที่ตรวจแล้ว
- Core Web Vitals ของ pages หลักพร้อม threshold status
- Review score ต่อ dimension และ overall พร้อม grade
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

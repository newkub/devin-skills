# review-frontend — Full Dimension Checklist

ใช้เป็น checklist ครบทุกมิติเมื่อ report — tick ตาม section ใน `SKILL.md`

## 1. Pages And Routes

- [ ] page inventory จาก nav/sitemap/router config
- [ ] ทุก route render สำเร็จ, status code ถูกต้อง
- [ ] 404 handling, redirect chains, trailing-slash consistency
- [ ] broken links, broken images, missing assets
- [ ] deep links, back/forward navigation

## 2. Console And Errors

- [ ] console errors, page errors, unhandled rejections ทุก page
- [ ] hydration errors, CORS errors, CSP violations → High
- [ ] source maps ชี้ source ถูกต้อง (production)

## 3. Network And Requests

- [ ] failed requests, 4xx/5xx, slow endpoints
- [ ] API auth headers, error responses, retry behavior
- [ ] render-blocking resources, oversized assets, cache headers
- [ ] ไม่มี secrets/tokens รั่วใน request/response

## 4. Forms And Interactions

- [ ] submit success, validation errors, required fields, error messages
- [ ] keyboard navigation, focus management
- [ ] dead clicks, disabled states
- [ ] loading/empty/error states

## 5. Auth And Session

- [ ] login/logout/register, password reset, session expiry, token refresh
- [ ] protected routes redirect, unauthorized → 403
- [ ] role-based access control
- [ ] token storage: httpOnly cookie ไม่ใช่ localStorage
- [ ] OAuth/SSO redirect, callback, state parameter
- [ ] ไม่มี credentials ใน URL/query/referrer

## 6. Storage, State And Realtime

- [ ] cookies/localStorage/sessionStorage: no secrets, size, expiry
- [ ] URL state survive refresh/share, back/forward restore
- [ ] WebSocket/SSE reconnect, heartbeat, stale data
- [ ] optimistic UI rollback, conflict resolution
- [ ] race conditions: rapid nav, double-submit, stale fetch

## 7. Web Vitals And Performance

- [ ] LCP ≤ 2.5s, INP, CLS ≤ 0.1 บน pages หลัก
- [ ] TTI, layout shifts, slow third-party scripts
- [ ] bundle size, route-level code splitting

## 8. Meta, SEO And Accessibility Basics

- [ ] title, meta description, canonical, OG tags ทุก page
- [ ] lang, heading order, alt text, label associations
- [ ] HTTPS, mixed content, security headers (CSP, HSTS)

## 9. Responsive And Compatibility

- [ ] mobile 375px, tablet 768px, desktop 1280px+
- [ ] horizontal scroll, overflow, touch targets, viewport meta
- [ ] browser-specific issues

## 10. PWA, i18n And Theming

- [ ] manifest, service worker, offline fallback, install prompt
- [ ] dark mode toggle, persist, no FOUC
- [ ] locale detection, language switcher, hreflang, RTL
- [ ] date/time/number locale + timezone formatting
- [ ] print styles, reduced-motion

## Scoring

- pass = 1, warning = 0.5, fail = 0 ต่อ check
- dimension score = checks passed / checks applicable × 100
- overall = average ของ dimensions ที่ apply
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)

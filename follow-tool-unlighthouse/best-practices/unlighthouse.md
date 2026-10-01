# Unlighthouse — Best Practices

Site-wide Lighthouse audits — crawl ทั้ง site แทนหน้าเดียว

## Recommended Patterns

- `unlighthouse --site <url>` — auto-discovers pages ผ่าน sitemap/crawl; scan ทั้ง site ไม่ใช่ page เดียว
- CI mode: `--ci` + `--budget` assertions — fail เมื่อ scores/metrics ต่ำกว่า threshold
- `--routerPrefix`/`--scanner` config สำหรับ SPA paths — SPA sites ต้อง route discovery
- Report: HTML output เจาะ per-page + aggregated scores — trend over runs
- `unlighthouse.config.ts` สำหรับ persistent config — URLs, budgets, scanner options

## Common Pitfalls

- Large sites = scan time นาน — `--maxRoutes`/sitemap filters scope; sampling acceptable สำหรับ monitoring
- Auth-required pages — unlighthouse ไม่ login เอง; pre-auth cookies หรือ public-only scope
- Lab data เท่านั้น — combine กับ RUM (`/follow-lib-web-vitals`) สำหรับภาพจริง
- Throttling consistency: keep default simulated เทียบ runs ข้ามเวลา — machine load affects scores
- Score variance ±5-10 — budgets ต่ำกว่าจุดนั้น = flaky CI; use threshold margins

## CI Integration

- Nightly/weekly jobs มากกว่า per-PR — site-wide audit นานเกิน PR gate
- Budgets per-category (perf, a11y, seo, best-practices) — assert แยกกัน
- Trend tracking: store JSON results เป็น artifacts → diff over time

## Do / Don't

| Do | Don't |
|----|-------|
| site-wide audits periodic | audit เฉพาะ homepage |
| `--ci` + budgets ใน pipelines | eyeball scores manually |
| scope discovery (sitemap/filters) | unbounded crawls |
| pair กับ RUM data | trust lab scores เดี่ยวๆ |

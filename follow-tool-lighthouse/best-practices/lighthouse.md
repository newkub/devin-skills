# Lighthouse CLI — Best Practices

Single-page audits — perf, a11y, SEO, best-practices

## Recommended Patterns

- `lighthouse <url> --output json --output-path report.json` — JSON สำหรับ programmatic analysis, HTML สำหรับ humans
- `--preset=desktop` สำหรับ desktop audit — default คือ mobile emulation (Moto G)
- `--only-categories=performance,accessibility` เมื่อต้องการ subset — เร็วกว่า full audit
- `--chrome-flags="--headless"` สำหรับ CI; `chromeLauncher` consistent binary
- Audit หลายครั้งแล้ว median — lab metrics variance สูง (≥3 runs)

## Common Pitfalls

- Lab ≠ field data — Lighthouse scores คือ synthetic; triage ด้วย `/follow-lib-web-vitals` RUM data
- Throttling: default simulated throttling; `--throttling-method=devtools/provided` ตาม needs — provided (no throttle) สำหรับ quick smoke
- Authenticated pages: `--extra-headers` หรือ cookie setup ผ่าน puppeteer script — bare lighthouse ไม่ login
- Score variance ±5-10 points ระหว่าง runs ปกติ — fail CI บน thresholds ต่ำกว่าจุดนั้น = flaky
- Opportunities/diagnostics = actionable list — focus นั้น ไม่ใช่ score ตัวเลข

## CI Integration

- `lhci` (Lighthouse CI) สำหรับ budgets/assertions — bare `lighthouse` ใน CI ใช้ `--output json` + parse scores เอง
- Budgets: `budgets.json` หรือ lhci assertions — enforce metric thresholds ไม่ใช่ composite score
- Audit staging URL ก่อน deploy — post-deploy audits late เกิน

## Do / Don't

| Do | Don't |
|----|-------|
| median ของ 3+ runs | trust single run |
| assert specific metrics (LCP, CLS) | assert composite score |
| field data เป็นหลัก, lab เป็น debug | optimize lab score อย่างเดียว |
| authenticated via puppeteer flow | audit login walls ตรงๆ |

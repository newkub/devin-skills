# Unlighthouse — Best Practices

Site-wide Lighthouse audits — crawl the whole site instead of one page

## Recommended Patterns

- `unlighthouse --site <url>` — auto-discovers pages via sitemap/crawl; scans the whole site, not a single page
- CI mode: `--ci` + `--budget` assertions — fails when scores/metrics fall below the threshold
- `--routerPrefix`/`--scanner` config for SPA paths — SPA sites need route discovery
- Report: HTML output drills into per-page + aggregated scores — trend over runs
- `unlighthouse.config.ts` for persistent config — URLs, budgets, scanner options

## Common Pitfalls

- Large sites = long scan time — `--maxRoutes`/sitemap filters scope it; sampling is acceptable for monitoring
- Auth-required pages — unlighthouse won't log in itself; use pre-auth cookies or a public-only scope
- Lab data only — combine with RUM (`/follow-lib-web-vitals`) for the real picture
- Throttling consistency: keep the default simulated throttling to compare runs over time — machine load affects scores
- Score variance ±5-10 — budgets below that margin = flaky CI; use threshold margins

## CI Integration

- Nightly/weekly jobs rather than per-PR — a site-wide audit is too slow for a PR gate
- Budgets per category (perf, a11y, seo, best-practices) — assert them separately
- Trend tracking: store JSON results as artifacts → diff over time

## Do / Don't

| Do | Don't |
|----|-------|
| site-wide audits periodic | audit only the homepage |
| `--ci` + budgets in pipelines | eyeball scores manually |
| scope discovery (sitemap/filters) | unbounded crawls |
| pair with RUM data | trust lab scores alone |

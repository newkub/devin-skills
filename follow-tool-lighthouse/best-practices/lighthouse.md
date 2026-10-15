# Lighthouse CLI — Best Practices

Single-page audits — perf, a11y, SEO, best-practices

## Recommended Patterns

- `lighthouse <url> --output json --output-path report.json` — JSON for programmatic analysis, HTML for humans
- `--preset=desktop` for desktop audits — the default is mobile emulation (Moto G)
- `--only-categories=performance,accessibility` when a subset suffices — faster than a full audit
- `--chrome-flags="--headless"` for CI; `chromeLauncher` for a consistent binary
- Audit several times and take the median — lab metrics variance is high (≥3 runs)

## Common Pitfalls

- Lab ≠ field data — Lighthouse scores are synthetic; triage with `/follow-lib-web-vitals` RUM data
- Throttling: default is simulated throttling; use `--throttling-method=devtools/provided` per need — provided (no throttle) for quick smoke tests
- Authenticated pages: `--extra-headers` or cookie setup via a puppeteer script — bare lighthouse won't log in
- Score variance of ±5-10 points between runs is normal — failing CI on thresholds below that = flaky
- Opportunities/diagnostics = the actionable list — focus there, not the numeric score

## CI Integration

- `lhci` (Lighthouse CI) for budgets/assertions — bare `lighthouse` in CI means `--output json` + parsing scores yourself
- Budgets: `budgets.json` or lhci assertions — enforce metric thresholds, not the composite score
- Audit the staging URL before deploy — post-deploy audits are too late

## Do / Don't

| Do | Don't |
|----|-------|
| median of 3+ runs | trust a single run |
| assert specific metrics (LCP, CLS) | assert composite score |
| field data as primary, lab for debugging | optimize the lab score alone |
| authenticate via a puppeteer flow | audit login walls directly |

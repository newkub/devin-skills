# web-vitals — Best Practices

Core Web Vitals measurement — attribution and reporting discipline

## Recommended Patterns

- Measure the Core Web Vitals fully: `onLCP`, `onINP`, `onCLS` + the diagnostics `onFCP`, `onTTFB` — INP has replaced FID
- Use the attribution build (`web-vitals/attribution`) when debugging — it tells which element/sub-part made the metric bad
- Report via `navigator.sendBeacon` or `fetch(..., {keepalive: true})` — never sync XHR on unload
- Report every metric when final (the callback fires multiple times — use the latest value with `reportAllChanges`, or send on visibilitychange:hidden)
- Batch + queue metrics, then send them together when the page is hidden — fewer beacons

## Common Pitfalls

- Metrics are RUM — lab (Lighthouse) ≠ field data; real users are always worse, optimize from field percentiles (p75)
- CLS/INP accumulate across the session — SPA navigations must reset/report per route yourself (the lib doesn't)
- `onINP` needs a user interaction — sessions with no interaction have no INP value
- Callbacks fire multiple times — don't send on every call; flag that it's reported, or use `reportAllChanges` intentionally
- Third-party scripts/ads/iframes make LCP/CLS worse — the attribution build can name the culprit

## Interpretation

| Metric | Good | Needs work | Poor |
|--------|------|-----------|------|
| LCP | ≤2.5s | ≤4s | >4s |
| INP | ≤200ms | ≤500ms | >500ms |
| CLS | ≤0.1 | ≤0.25 | >0.25 |

- The p75 threshold is the Google ranking signal — optimize for p75, not the median

## Do / Don't

| Do | Don't |
|----|-------|
| `sendBeacon`/`keepalive` when hidden | sync XHR on unload |
| the attribution build when debugging | guess the culprit from a single metric |
| p75 field data | optimize only from Lighthouse |
| report per-route in an SPA | assume an automatic reset across navigations |

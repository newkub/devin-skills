# Use Case — Report Core Web Vitals to an Endpoint

> Collect LCP, INP, and CLS from real users and deliver them without blocking the page. Source: https://github.com/GoogleChrome/web-vitals (accessed 2026-10-20)

## 1. Use the callbacks, not the removed getters

```ts
// src/metrics/report.ts
import type { Metric } from "web-vitals";
import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";

const ENDPOINT = "/api/vitals";

function send(metric: Metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    path: location.pathname,
  });

  // sendBeacon cannot set Content-Type — a Blob lets the browser label it
  const blob = new Blob([body], { type: "application/json" });
  if (!navigator.sendBeacon(ENDPOINT, blob)) {
    void fetch(ENDPOINT, {
      method: "POST",
      body,
      keepalive: true,
      headers: { "content-type": "application/json" },
    });
  }
}

export function reportWebVitals() {
  if (!import.meta.env.PROD) return;

  onLCP(send);
  onINP(send);
  onCLS(send);
  onFCP(send);
  onTTFB(send);
}
```

`on*` callbacks replace the old `get*` functions. `import type { Metric }` matters in v6 — the type is an explicit type export, and a value import pulls the module into a context that only needed a type.

## 2. Keep the endpoint tolerant

1. Accept `text/plain` as well as JSON — `sendBeacon` with a plain string arrives without your content type
2. Treat `id` as the dedupe key; a metric can be delivered twice when the fallback `fetch` also fires
3. Store `rating` alongside `value` — dashboards group by good/needs-improvement/poor, not raw thresholds

## 3. Report on page hide, not on every change

The default behaviour reports the final value when the page becomes hidden. `reportAllChanges: true` sends every intermediate value and exists for debugging:

```ts
onCLS(send, { reportAllChanges: true, debug: true });
```

3. Remove both flags before shipping; they multiply the request count and skew percentiles

## 4. Sample in production

```ts
const SAMPLE_RATE = 0.1;
if (Math.random() > SAMPLE_RATE) return;
```

A 10% sample is enough for percentiles and keeps the endpoint cheap. Sampling at registration also skips the observers for the other 90%.

## 5. Verify

1. `/run-verify` for lint and typecheck
2. `/run-test` with a mocked `navigator.sendBeacon`, asserting one payload per metric name
3. `/run-dev`, scroll and click, then confirm the endpoint receives values in the browser and server logs
4. Set `reportAllChanges: true` locally and check that INP rises as you interact
5. Compare one page's LCP against Lighthouse to confirm the field value lands in the same order of magnitude

## Pitfalls

- Reporting in development, where HMR destroys the timings you are trying to measure.
- `onFID` — removed since v5; INP is the interaction metric now.
- `fetch` without `keepalive`, so the request is cancelled when the page unloads — which is exactly when most metrics fire.
- Sending the whole `entries` array on every metric, which multiplies payload size with no analysis behind it.

## Related

- `references/apis.md`
- `best-practices/web-vitals.md`
- `usecases/debug-inp-with-attribution.md`

# Lib Web Vitals Routes / Topics

| Route / Topic | URL |
|---|---|
| web.dev vitals guide | https://web.dev/articles/vitals |
| README | https://github.com/GoogleChrome/web-vitals |
| Attribution build | https://github.com/GoogleChrome/web-vitals#send-attribution-data |
| Metric thresholds | https://web.dev/articles/defining-core-web-vitals-thresholds |
| Send to analytics | https://github.com/GoogleChrome/web-vitals#send-the-results-to-an-analytics-endpoint |

## Key Concepts

- Core Web Vitals: LCP (≤2.5s), INP (≤200ms), CLS (≤0.1)
- INP แทน FID ตั้งแต่ v4 — อย่าใช้ `onFID` ในโค้ดใหม่
- ส่งค่าไป endpoint ด้วย `navigator.sendBeacon` ใน callback
- `reportAllChanges: true` รายงานทุก update (debug); default รายงาน final เมื่อ page hidden

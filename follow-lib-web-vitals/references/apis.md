# Lib Web Vitals API & Dependencies

## Install

```sh
bun add web-vitals
```

## Version

- Latest: `6.2.1` (verified 2026-09-11)
- [Package Registry](https://www.npmjs.com/package/web-vitals)
- [Repository](https://github.com/GoogleChrome/web-vitals)

## Dependencies

- Zero runtime dependencies — ใช้ Performance Observer API
- มี `web-vitals/attribution` subpath สำหรับ debug attribution data

## Common API / Commands

| api | description | default | options |
|---|---|---|---|
| `onCLS(fn)` | Cumulative Layout Shift | buffered | `reportAllChanges` |
| `onINP(fn)` | Interaction to Next Paint (แทน FID ตั้งแต่ v4) | - | - |
| `onLCP(fn)` | Largest Contentful Paint | - | - |
| `onFCP(fn)` | First Contentful Paint | - | - |
| `onTTFB(fn)` | Time to First Byte | - | - |
| `onLongTasks(fn)` | Long tasks | - | - |
| `metric` object | `{name, value, rating, delta, entries}` | - | rating: good/needs-improvement/poor |

## Source

- Official docs: https://web.dev/articles/vitals
- Description: Core Web Vitals measurement library จาก Google Chrome team.

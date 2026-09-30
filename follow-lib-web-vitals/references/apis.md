| key | value |
|---|---|
| version | 6.2.1 |
| package registry | https://www.npmjs.com/package/web-vitals |
| repository | https://github.com/GoogleChrome/web-vitals |
| docs | https://web.dev/articles/vitals |

| api | description | default | options |
|---|---|---|---|
| `onCLS(fn)` | Cumulative Layout Shift | buffered | `reportAllChanges` |
| `onINP(fn)` | Interaction to Next Paint (แทน FID ตั้งแต่ v4) | - | - |
| `onLCP(fn)` | Largest Contentful Paint | - | - |
| `onFCP(fn)` | First Contentful Paint | - | - |
| `onTTFB(fn)` | Time to First Byte | - | - |
| `onLongTasks(fn)` | Long tasks | - | - |
| `metric` object | `{name, value, rating, delta, entries}` | - | rating: good/needs-improvement/poor |

---
name: scan-render
description: Scan render/DOM scaling — per-item nodes, virtualization gaps, layout cost
---

# Scan Render And DOM Scaling

## Goal

render ไม่โตตาม data size — DOM nodes, layout, re-render count ถูก bound

## Checks

1. `<For>`/`.map()` ที่ render element ต่อ item โดยไม่มี cap — gutters, minimaps, tables, lists — DOM nodes = data size
2. Missing virtualization — scrollable list ที่ render ทั้งชุดแทน visible window (เช็ค threshold pattern + spacer รักษา scroll height)
3. Spread บน arrays ใหญ่ — `Math.max(...arr)`, `[...arr]` ใน hot path → call stack overflow/O(n) copy
4. Layout thrash — read `scrollTop`/`offsetHeight` แล้ว write style ใน loop เดียวกัน, `ResizeObserver` ที่ไม่ debounce
5. Hidden-but-mounted views — keep-alive panels ที่ยัง run effects/timers ตอนซ่อน; `display:none` vs unmount trade-off
6. Reactive over-tracking — effect/memo ที่อ่าน state กว้างเกินจำเป็น (re-run ทุก mutation), `JSON.stringify` ใน reactive context
7. Expensive per-render work — regex compile, `sort`, `filter`, `map` chains, Intl/formatters ใน render body
8. Minimap/canvas/density views — render ต่อ row แทน bucket/sample

## Severity

- Critical: DOM nodes หรือ layout work โตแบบ unbounded ตาม user data
- High: per-frame/per-keystroke re-render ของ subtree ใหญ่, O(n) work ต่อ interaction
- Medium: missing virtualization บน list ขนาดกลาง, layout read/write ผสาน
- Low: memoization เล็กน้อยบน cold path

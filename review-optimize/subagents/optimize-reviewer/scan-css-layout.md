---
name: scan-css-layout
description: Scan CSS and layout pipeline — style recalc, containment, animations, scroll cost
---

# Scan CSS And Layout

## Goal

style/layout/paint work bound — ไม่มี recalc storms, animations ถูก composited, scroll ไม่จูนของ

## Checks

1. Missing containment — long lists, offscreen panels, cards ที่ไม่มี `content-visibility: auto`/`contain` — browser คำนวน layout/paint ทั้ง page
2. Layout-triggering properties ใน animation/transition — `width`, `height`, `top`, `left`, `margin` แทน `transform`/`opacity` → layout ต่อ frame
3. `will-change` abuse — ใส่ทุก element หรือค้างถาวร → layer memory + compositor cost; ควร apply เฉพาะก่อน animate แล้ว remove
4. Expensive selectors — universal `*`, deep descendant chains, `:nth-child` บน lists ใหญ่, attribute selectors ใน hot styles
5. Layout read/write interleave — `offsetHeight`/`getBoundingClientRect` แล้ว write style ใน loop (thrash) — batch reads ก่อน writes
6. Scroll listeners ที่ไม่ passive — `onscroll`/`touchmove` handlers ทำงานต่อ event ไม่มี `{ passive: true }` หรือ rAF-throttle
7. Repaint-heavy effects — `box-shadow`, `filter`, `blur`, `border-radius` บน elements ที่ animate/scroll บ่อย
8. `position: sticky`/fixed overlays บน scrollable ใหญ่ — repaints ต่อ scroll frame
9. Inline style mutations ต่อ event — direct `style.x =` ต่อ mousemove/drag แทน CSS custom properties หรือ transform
10. CSS-in-JS runtime cost — generate/inject styles ต่อ render แทน static extraction

## Severity

- Critical: layout thrash บน scroll/animation path, missing containment บน lists หลายพัน items
- High: layout-property animations, non-passive scroll handlers บน hot path
- Medium: `will-change` ถาวร, expensive selectors บน lists ใหญ่
- Low: selector cleanup, effect tuning บน cold paths

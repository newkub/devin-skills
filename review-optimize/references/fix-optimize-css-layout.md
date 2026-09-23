# Fix Guide — CSS And Layout Pipeline

## Goal

bound style/layout/paint work — composited animations, contained subtrees, passive scroll

## Scope

ใช้กับ render pipeline costs — containment, animation properties, scroll handlers, selector/style recalc — preserve visual output เดิม

## Execute

### 1. Contain Large Subtrees

> Goal: browser ข้าม layout/paint ของสิ่งที่ไม่เห็น

1. `content-visibility: auto` + `contain-intrinsic-size` บน long lists, offscreen panels, card feeds — layout skip โดยไม่กระโดด scroll
2. `contain: layout style paint` บน self-contained widgets (cards, modals, chips) — recalc ไม่ลามทั้ง page
3. เช็ค interaction — `content-visibility` กับ find-in-page/focus มี edge cases; test scroll-jump
4. ห้าม contain บน elements ที่ layout พึ่งขนาดภายนอก (measuring containers)

### 2. Composite Animations

> Goal: animate เฉพาะ `transform`/`opacity`

1. layout-property animations (`width`/`top`/`left`/`margin`) → `transform: translate/scale` + `opacity` เทียบเท่า
2. `will-change` เฉพาะก่อน animate แล้ว remove — ห้ามถาวรทุก element
3. repaints บน scroll/animate path → ลด `box-shadow`/`filter`/`blur` หรือย้ายไป pseudo-element ที่ static
4. `prefers-reduced-motion` — คง respect เดิมเมื่อแก้ animation paths

### 3. Passive And Throttled Scroll

> Goal: scroll handlers ไม่ block compositor

1. `addEventListener("scroll"|"touchmove"|"wheel", fn, { passive: true })` — เว้นแต่ต้อง `preventDefault`
2. work ต่อ scroll event → rAF-throttle หรือ `IntersectionObserver` แทน per-event compute
3. sticky/fixed overlays → เช็ค repaint cost; ลด promoted layers ที่ไม่จำเป็น

### 4. Batch Layout Reads And Writes

> Goal: ไม่ interleave measure/mutate

1. รวม layout reads (`offsetHeight`, `getBoundingClientRect`) ก่อน แล้วค่อย write styles — หรือใช้ `requestAnimationFrame` split phases
2. per-event inline style mutations → CSS custom properties (`style.setProperty`) หรือ transform เดียว
3. expensive selectors บน lists ใหญ่ → class-based, shallow selectors

### 5. Verify

> Goal: frame budget กลับมา, visual เหมือนเดิม

1. scroll/drag/animation ไม่ jank — frame drops ลด (DevTools performance)
2. `content-visibility` ไม่ทำ scroll jump หรือ content หาย
3. visual diff เหมือนเดิม — containment ไม่เปลี่ยน appearance
4. typecheck + tests + build ผ่าน

## Rules

- visual output ต้องเหมือนเดิม — containment/animation rewrite ที่เปลี่ยน look = regression
- `contain`/`content-visibility` ต้องมี `contain-intrinsic-size` ที่ใกล้ขนาดจริง — ผิด = scrollbar กระโดด
- `{ passive: true }` ห้ามใส่ handler ที่เรียก `preventDefault`
- `will-change` เป็น hint ชั่วคราว — ไม่ใช่ decoration
- ใช้ /loop-until-complete ถ้า verify ต้อง iterate

## Expected Outcome

- layout/paint skip offscreen subtrees — scroll smooth บน pages ใหญ่
- animations composite-only — ไม่มี layout ต่อ frame
- scroll handlers passive + throttled — compositor ไม่ block

# Motion And Delight Review

## Goal

ตรวจว่า app มี motion ที่ purpose-driven และ consistent — feedback, spatial continuity, perceived performance — ไม่ใช่ animation เยอะเกินหรือแห้งสนิท

## Checklist — Motion System

- [ ] motion tokens — duration/easing เป็น design tokens (เช่น `duration-fast` 150ms, `duration-normal` 300ms) ไม่ hardcode กระจาย
- [ ] consistent easing — entrances `ease-out`, exits `ease-in`, moves `ease-in-out`
- [ ] `prefers-reduced-motion` respected — media query ปิด/ลด animation (a11y requirement, cross-ref `/review-accessibility`)
- [ ] 60fps properties only — animate `transform`/`opacity`, ห้าม `width`/`height`/`top`/`left` (layout thrash)

## Checklist — Purpose-Driven Motion

- [ ] feedback — button press, toggle, success/error confirmation มี motion response
- [ ] spatial continuity — expand/collapse, modal open, page transition บอกว่า element มาจากไหน
- [ ] perceived performance — skeleton/shimmer loading แทน spinner ตรง content-heavy areas; optimistic UI เมื่อเหมาะ
- [ ] micro-interactions — hover states, focus transitions, drag feedback

## Checklist — Anti-Patterns

- [ ] ไม่มี blocking animation — user ต้องรอ animation จบก่อนทำอย่างอื่นได้
- [ ] ไม่มี motion overload — animation พร้อมกันหลายจุดแย่ง attention
- [ ] ไม่มี scroll-jacking ที่ทำลาย native scroll
- [ ] transition duration ไม่เกิน ~500ms สำหรับ UI feedback

## Implementation Guidance (สำหรับ Fix)

- default: CSS transitions/keyframes สำหรับ state changes ง่ายๆ
- JS-driven animation (stagger, timeline, physics, SVG morph, scroll-linked) → ใช้ `/follow-lib-animejs` เป็น implementation reference
- spring physics สำหรับ drag/gesture → library ตาม stack (`motion`, `animejs`, spring-based libs)
- verify: manual browser pass ดู feel จริง + `prefers-reduced-motion` emulation

## Severity

- `High`: ไม่ respect `prefers-reduced-motion`, layout-thrash animations ทำ jank, blocking animation ใน critical path
- `Medium`: motion tokens ไม่มี (durations กระจาย), ขาด loading skeleton ตรง heavy content, dead interactions (ไม่มี feedback)
- `Low`: micro-interactions ขาด, transitions ไม่ consistent

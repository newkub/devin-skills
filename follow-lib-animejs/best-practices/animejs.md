# Anime.js — Best Practices

Recommended patterns, pitfalls และ perf notes สำหรับ Anime.js

## Recommended Patterns

- ใช้ API หลัก `animate(targets, params)` + `stagger()` สำหรับ sequence — ไม่จับ timeline มือเองถ้า stagger พอ
- Animate เฉพาะ `transform` (`translateX/Y`, `scale`, `rotate`) และ `opacity` — GPU-accelerated, ไม่ trigger layout
- เก็บ animation objects ไว้ reference เพื่อ `pause()`/`cancel()`/`seek()` — อย่าสร้าง animation ใหม่ซ้ำทุก frame
- ใช้ `utils.$()`/`utils.random()` helpers ของ lib แทนเขียนเอง

## Common Pitfalls

- ห้าม animate `width`/`height`/`top`/`left` ถ้าเลี่ยงได้ — layout thrash; ใช้ `scale`/`clip-path` แทน
- SPA frameworks: จำ target ตอน mount — anime ผูก DOM node ตรงๆ, component unmount แล้ว animate ต่อ = leak → cancel ใน cleanup
- `stagger` บน element จำนวนมาก → คุมจำนวน/ใช้ `from: 'center'` เพื่อลด perceived jank
- Animation state ไม่ serialize — อย่าเก็บ animation object ใน reactive state (Solid signal/store) — เก็บใน ref ธรรมดา

## Perf Notes

- ใช้ `will-change: transform` เฉพาะ element ที่ animate จริง — ห้ามใส่ทั้งหน้า
- Infinite loops (`loop: true`) → ตั้ง `autoplay: false` แล้วเล่นเฉพาะตอน visible (IntersectionObserver)
- Scroll-driven → ใช้ built-in scroll observer/`onScroll` แทน scroll listener ที่คำนวณเองทุก frame

## Do / Don't

| Do | Don't |
|----|-------|
| `animate()` + `stagger()` สำหรับ list reveals | manual `setTimeout` chains |
| transform/opacity เท่านั้น | animate layout properties |
| cancel animation ใน cleanup | ปล่อย animation ค้างหลัง unmount |
| `createTimeline()` เมื่อ sequence ซับซ้อน | nest `onComplete` callbacks หลายชั้น |

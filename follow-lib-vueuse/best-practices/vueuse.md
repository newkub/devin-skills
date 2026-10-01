# VueUse — Best Practices

Composables collection — เลือกใช้แทนเขียนเอง, cleanup discipline

## Recommended Patterns

- VueUse ก่อนเขียนเอง: `useEventListener`, `useFetch`, `useLocalStorage`, `useResizeObserver`, `useIntersectionObserver` — auto-cleanup + SSR-safe แล้ว
- Composables return refs + cleanup functions — อย่า destructure จน reactivity หาย (ใช้ `toRefs` หรือเก็บ object)
- `useEventListener` แทน `addEventListener` + `onUnmounted` มือ — auto-remove ตอน unmount
- Options object ของแต่ละ composable (`immediate`, `deep`, `throttle`) — อ่านก่อน assume defaults
- `@vueuse/core` = base; `@vueuse/integrations` สำหรับ wrappers (axios, focus-trap ฯลฯ) — อย่า wrap ซ้ำ

## Common Pitfalls

- Composables ต้อง call ใน setup scope (top-level `<script setup>` หรือ `setup()`) — ไม่ใช่ใน callbacks/event handlers
- SSR: หลาย composables access `window`/`document` — VueUse guard แล้ว แต่ตรวจ `isSupported` ref ที่ return
- `useFetch` ≠ full query client — ไม่มี cache/dedup/retry จริงจัง; งานหนัก → TanStack Query
- Storage composables (`useLocalStorage`) sync ผ่าน storage events — cross-tab ฟรี แต่ระวัง serialization (objects = JSON)

## Perf Notes

- `computed`/`watch` ใน composable = shared reactive graph — สร้าง composable instance ต่อ component ไม่ share instance ข้าม components โดยไม่ตั้งใจ
- Event-based composables throttle/debounce ผ่าน options — scroll/resize/mouse ห้าม raw
- `useVirtualList` สำหรับ long lists — ไม่ใช่ v-for ทั้งหมด

## Do / Don't

| Do | Don't |
|----|-------|
| `useEventListener` auto-cleanup | manual add/remove listeners |
| เช็ค `isSupported` สำหรับ SSR APIs | assume browser globals เสมอ |
| call composables ใน setup scope | call ใน event handlers/async |
| VueUse ก่อนเขียนเอง | re-implement useEventListener เอง |

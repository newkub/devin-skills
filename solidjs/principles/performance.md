---
title: Performance
description: การ optimize performance ใน SolidJS applications
---

## Fine-Grained Reactivity

SolidJS update เฉพาะ DOM nodes ที่ dependent:
- ไม่มี virtual DOM diffing
- ไม่มี component re-renders
- Performance สูงโดย default
- Direct DOM updates ที่ efficient

## Batching Updates

ใช้ `batch` สำหรับ group multiple updates:

```tsx
import { batch } from 'solid-js'

batch(() => {
  setCount(1)
  setTotal(5)
}) // รัน downstream computations ครั้งเดียว
```

SolidJS auto-batch ใน:
- `createEffect` และ `onMount`
- `createStore` setters
- Array mutations บน `createMutable`

## Memoization

ใช้ `createMemo` สำหรับ expensive computations:

```tsx
const expensive = createMemo(() => {
  return heavyCalculation(data())
})
```

## Derived Values

ใช้ functions สำหรับ simple derived values:

```tsx
const fullName = () => `${firstName()} ${lastName()}`
```

ใช้ `createMemo` เมื่อ:
- Computation แพง
- ต้องการ caching
- Dependencies ซับซ้อน

## Resource Management

ใช้ `createResource` สำหรับ async operations:
- Convert async เป็น sync-like
- Track loading state
- Integrate กับ Suspense
- Nested promises support (v1.8.0+)

## Preloading

ใช้ Solid Router preloading:
- Preload routes on hover
- Preload components lazily
- Balance responsiveness กับ network cost

## SSR Optimizations (v1.8.0+)

### Seroval Integration

ใช้ `seroval` สำหรับ streaming serialization:
- De-duping serialization data
- ลดขนาด bundle
- Performance ดีขึ้นสำหรับ data transfer

### Improved Hydration

SolidJS ปรับปรุง hydration:
- ไม่ set attributes หรือ props ซ้ำระหว่าง hydration
- DOM snapshots ที่แม่นยำยิ่งขึ้น
- ป้องกัน element duplication
- Performance ดีขึ้นสำหรับ SSR applications

### Streaming SSR

ใช้ `renderToWebStream` สำหรับ streaming:
- รองรับ Cloudflare Workers
- รองรับ edge environments
- Progressive hydration

## splitProps Performance (v1.9.10+)

`splitProps` มี performance improvements:
- ใช้สำหรับ component props separation
- ลด overhead ใน component composition
- Efficient prop handling

## Template Optimization (v1.8.0+)

Templates เล็กลงโดย:
- ลบ quotes ที่ไม่จำเป็น
- ลด bundle size
- Faster parsing

## createDeferred Fixes (v1.9.12+)

`createDeferred` ปรับปรุง:
- ป้องกัน Node.js process ค้าง
- Lazy creation ของ external sources
- Better memory management

## Best Practices

### Avoid Unnecessary Re-renders

SolidJS ไม่มี re-renders แต่:
- ใช้ `untrack` เมื่อไม่ต้องการ tracking
- ใช้ `createMemo` สำหรับ derived state
- ใช้ `batch` สำหรับ multiple updates

### Use Control Flow Components

ใช้ `Show`, `For`, `Index` แทน conditional rendering:
- Efficient conditional rendering
- No virtual DOM overhead
- Fine-grained updates

### Optimize Lists

ใช้ `For` สำหรับ stable lists:
- Key-based updates
- Minimal DOM manipulation

ใช้ `Index` สำหรับ index-based lists:
- ใช้เมื่อ keys ไม่ stable
- Performance ดีสำหรับ dynamic lists

### Lazy Loading

ใช้ lazy loading สำหรับ:
- Large components
- Route-based code splitting
- Balance initial load กับ responsiveness

---
name: follow-lib-tanstack-pacer
description: ใช้ TanStack Pacer ครบวงจร — debounce, throttle, rate limit, queue, batch — hooks และ core classes
argument-hint: "[framework] [utility]"
related:
  - follow-lib-tanstack-ecosystem
  - run-test
  - run-typecheck
  - resolve-errors
---

## Goal

ใช้ TanStack Pacer ครบ — debounce, throttle, rate limit, queue, batch ทั้ง React hooks และ framework-agnostic core classes

## Scope

ใช้แทน ad-hoc `setTimeout` utilities — search inputs, scroll/resize, API rate limiting, sequential tasks, batched updates — **0.x**: ตรวจ API ล่าสุดใน docs ก่อน implement

- part of TanStack ecosystem — selection/dispatch อยู่ที่ `/follow-lib-tanstack-ecosystem`

## Execute

### 1. Install

```bash
bun add @tanstack/react-pacer   # React hooks; core @tanstack/pacer สำหรับ non-React/vanilla
```

### 2. Core Utilities

> Goal: เลือกเครื่องมือตาม semantics

| เครื่องมือ | Semantics | Use case |
|-----------|-----------|----------|
| `useDebouncedCallback`/`useDebouncedState` | เหลือ call สุดท้ายหลังเงียบ `wait` | search input, resize end |
| `useThrottledCallback`/`useThrottledValue` | สูงสุด 1 call ต่อ `wait` | scroll position, mouse move |
| `useRateLimiter`/`RateLimiter` | hard cap `limit` ต่อ `window` | API quota, login attempts |
| `useQueuer`/`Queuer` | sequential/concurrency-limited | upload queue, job processing |
| `useBatcher`/`Batcher` | รวม rapid events เป็น batch | bulk inserts, analytics flush |

```tsx
const onSearch = useDebouncedCallback((q: string) => api.search(q), { wait: 300 })
const onScroll = useThrottledCallback(() => sync(), { wait: 100 })
const limiter = useRateLimiter(call, { limit: 5, window: 1000 })
```

Core (non-hook): `new Debouncer(fn, { wait })`, `debounce(fn, opts)` จาก `@tanstack/pacer`

### 3. Options And Control

> Goal: fine-tune behavior

1. `leading`/`trailing` edges — default trailing; `leading: true` = call ทันทีครั้งแรก
2. `enabled` flag — pause/resume แบบ conditional
3. Queuer: `concurrency`, `started` state, `getAllItems()`; Batcher: `maxSize` หรือ `wait` trigger
4. Hooks auto-cancel ตอน unmount; core classes ต้อง `.cancel()` เอง

### 4. Testing Patterns

> Goal: timing logic เทสได้

1. `vi.useFakeTimers()` + `advanceTimersByTime` — ยืนยัน `wait`/`window` semantics
2. เทส trailing vs leading แยกกัน
3. Queue/batch → assert call counts หลัง flush

### 5. Verify

1. `/run-test` ด้วย fake timers + `/run-typecheck`
2. Edge behavior (leading/trailing) ตรง options
3. ถ้า fail → `/resolve-errors` max 3 รอบ

## Rules

- Debounce ≠ throttle ≠ rate limit ≠ queue ≠ batch — เลือกตาม semantics ไม่ใช่ใกล้เคียง
- ตั้ง `wait` ตาม UX จริง: search ~300ms, scroll/resize 50-150ms
- ห้าม debounce actions ที่ต้อง immediate feedback (submit button)
- เทส timing ด้วย fake timers เสมอ — อย่า `await sleep()` จริง

## Expected Outcome

- เครื่องมือตรง semantics + timing ถูก
- ไม่มี hand-rolled debounce/throttle เหลือใน codebase
- Timing logic มี tests

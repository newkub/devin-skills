# State Management Checks

## Goal

ตรวจสอบ state organization, reactivity patterns, side effect management, persistence, และ immutability

## Checks

### State Organization

1. แยก local state, shared state, global state, server state ชัดไหม
2. ใช้ state management library ที่เหมาะสมไหม (Pinia, Zustand, Redux, Jotai, signals)
3. server state แยกจาก client state ไหม (React Query, SWR, TanStack Query)
4. มี global state ที่ไม่จำเป็นไหม (ควรเป็น local หรือ shared)
5. state shape ออกแบบดีไหม (normalized, flat, not nested)

### Reactivity Patterns

1. ใช้ fine-grained reactivity ไหม (signals, observables)
2. ใช้ context ที่เหมาะสมไหม (ไม่ over-use, ไม่ under-use)
3. reactivity ไม่มี side effects ที่ไม่คาดคิดไหม
4. ใช้ computed/derived state แทน duplicate state ไหม
5. มี unnecessary reactivity ไหม

### Side Effect Management

1. useEffect/useEffect มี cleanup ไหม
2. มี side effects ที่ควรเป็น event handler ไหม
3. dependency array ถูกต้องไหม (React)
4. มี side effects ใน render phase ไหม (anti-pattern)
5. watchers มี cleanup ไหม (Vue, Solid)

### State Persistence

1. มี persistence strategy ไหม (localStorage, sessionStorage, URL state)
2. persistence ไม่ทำให้ state ไม่ sync ไหม
3. มี cache invalidation ไหม
4. มี state hydration สำหรับ SSR ไหม
5. persistence ไม่เก็บ sensitive data ไหม

### State Immutability

1. ใช้ immutable updates ไหม (spread, immer, structuredClone)
2. มี direct mutation ไหม (state.x = y)
3. มี mutation prevention ไหม (Object.freeze, readonly)
4. ใช้ immutable data structures ไหม
5. มี mutation ที่ทำให้ reactivity พังไหม

## Severity

- Critical: global mutable state ที่ทำให้ debug ไม่ได้, state corruption, no cleanup บน unmount, mutation ที่พัง reactivity
- High: unnecessary re-renders, missing state separation, prop drilling state, no persistence strategy, side effects ใน render
- Medium: inconsistent state organization, missing computed state, minor persistence issue, missing cache invalidation
- Low: minor naming, documentation gap, minor immutability improvement

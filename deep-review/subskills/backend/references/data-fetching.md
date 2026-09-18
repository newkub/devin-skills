# Data Fetching And Cache Checks

## Scope

data fetching review สำหรับ: loading states, error states, cache strategy, optimistic updates, pagination patterns, request deduplication, race condition prevention, data freshness, data fetching library usage (TanStack Query, SWR, useFetch)

## Checklist

### Loading, Error And Cache

- ตรวจสอบ loading states: loading indicators, skeleton screens, suspense fallbacks, loading state coverage on all async data, loading state UX (no layout shift, progressive loading)
- ตรวจสอบ error states: error boundaries for data fetching, error fallback UI, retry mechanism, error state coverage, error state UX (error message, retry button, contact support)
- ตรวจสอบ cache strategy: stale-while-revalidate, cache invalidation, background refresh, cache key design, cache stale time, cache GC time, cache persistence, cache optimistic updates
- ตรวจสอบ request deduplication: duplicate request prevention, request dedup per cache key, request dedup per render, request dedup across components, dedup configuration

### Optimistic Updates, Pagination, Race Conditions And Freshness

- ตรวจสอบ optimistic updates: optimistic update on mutation, optimistic update rollback on error, optimistic update conflict resolution, optimistic update UI feedback, optimistic update correctness
- ตรวจสอบ pagination: cursor-based pagination, offset-based pagination, infinite scroll, infinite scroll cleanup (abort on unmount), pagination state management, pagination cache, pagination error handling
- ตรวจสอบ race condition prevention: stale closure prevention, latest-wins strategy, abort on unmount, AbortController usage, request cancellation, concurrent fetch handling, out-of-order response handling
- ตรวจสอบ data freshness: polling strategy, polling interval, polling cleanup, WebSocket updates, real-time data sync, stale-while-revalidate, background refresh, data freshness indicator
- ตรวจสอบ data fetching library usage: library config correctness, query key design, mutation patterns, query invalidation, prefetching, suspense mode, SSR/SSG data fetching, hydration

## Skip Conditions

- ถ้า project ไม่มี data fetching → ข้ามทั้งหมด
- ถ้า project ไม่มี optimistic updates → ข้ามส่วน optimistic updates
- ถ้า project ไม่มี pagination → ข้ามส่วน pagination
- ถ้า project ไม่มี real-time data → ข้ามส่วน WebSocket
- ถ้า project ไม่มี data fetching library → ข้ามส่วน library usage

## Severity

- Critical: missing loading state ที่ทำให้ UI พัง, no error handling on data fetch, broken cache ที่แสดงข้อมูลผิด, race condition ที่แสดงข้อมูลผิด, missing request cancellation ที่ก่อให้เกิด memory leak, stale data ที่ก่อให้เกิด business error
- High: missing loading state, missing error state, missing cache invalidation, missing request dedup, missing optimistic update, missing pagination error handling, missing polling cleanup, incorrect query key, no WebSocket cleanup
- Medium: suboptimal cache strategy, missing prefetch, missing skeleton screen, suboptimal pagination, minor race condition ใน non-critical path
- Low: cosmetic, minor cache improvement, documentation gap

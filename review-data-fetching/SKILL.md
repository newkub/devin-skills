---
related:
---

## Goal

Review data fetching ครอบคลุม loading states, cache, optimistic updates, pagination, race conditions, data freshness พร้อม review score

## Scope

data fetching review สำหรับ: loading states (indicators, skeleton screens, suspense fallbacks), error states (boundaries, fallback UI, retry), cache strategy (stale-while-revalidate, invalidation, background refresh), optimistic updates, pagination patterns (cursor-based, infinite scroll cleanup), request deduplication, race condition prevention (stale closures, latest-wins, abort on unmount), data freshness (polling, WebSocket updates), data fetching library usage (TanStack Query, SWR, useFetch)

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ data fetching patterns และ library

1. ทำ `/scan-codebase` เพื่อเข้าใจ data fetching structure
2. ระบุ data fetching library (TanStack Query, SWR, Apollo, useFetch, custom), cache strategy, pagination patterns ที่ใช้
3. ถ้า project ไม่มี data fetching → stop และ report

### 2. Deep Analyze

> Goal: ครอบคลุมทุก data fetching dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ data fetching patterns
2. ทำ `/update-create-review-cli` — `/update-create-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-review` เพื่อดึง metrics ล่าสุด

### 3. Loading, Error And Cache Review

> Goal: ครอบคลุม loading states, error states, cache strategy

1. ตรวจสอบ loading states: loading indicators, skeleton screens, suspense fallbacks, loading state coverage on all async data, loading state UX (no layout shift, progressive loading)
2. ตรวจสอบ error states: error boundaries for data fetching, error fallback UI, retry mechanism, error state coverage, error state UX (error message, retry button, contact support)
3. ตรวจสอบ cache strategy: stale-while-revalidate, cache invalidation, background refresh, cache key design, cache stale time, cache GC time, cache persistence, cache optimistic updates
4. ตรวจสอบ request deduplication: duplicate request prevention, request dedup per cache key, request dedup per render, request dedup across components, dedup configuration

### 4. Optimistic Updates, Pagination, Race Conditions And Freshness Review

> Goal: ครอบคลุม optimistic updates, pagination, race conditions, data freshness

1. ตรวจสอบ optimistic updates: optimistic update on mutation, optimistic update rollback on error, optimistic update conflict resolution, optimistic update UI feedback, optimistic update correctness
2. ตรวจสอบ pagination: cursor-based pagination, offset-based pagination, infinite scroll, infinite scroll cleanup (abort on unmount), pagination state management, pagination cache, pagination error handling
3. ตรวจสอบ race condition prevention: stale closure prevention, latest-wins strategy, abort on unmount, AbortController usage, request cancellation, concurrent fetch handling, out-of-order response handling
4. ตรวจสอบ data freshness: polling strategy, polling interval, polling cleanup, WebSocket updates, real-time data sync, stale-while-revalidate, background refresh, data freshness indicator
5. ตรวจสอบ data fetching library usage: library config correctness, query key design, mutation patterns, query invalidation, prefetching, suspense mode, SSR/SSG data fetching, hydration

### 5. Validate, Rate And Report

> Goal: Issues ถูก validate และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/report` พร้อม `/report-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี data fetching → ข้ามทั้งหมด
- ถ้า project ไม่มี optimistic updates → ข้าม Step 4 item 1
- ถ้า project ไม่มี pagination → ข้าม Step 4 item 2
- ถ้า project ไม่มี real-time data → ข้าม Step 4 item 4 สำหรับ WebSocket
- ถ้า project ไม่มี data fetching library → ข้าม Step 4 item 5

### 2. Severity Classification

- Critical: missing loading state ที่ทำให้ UI พัง, no error handling on data fetch, broken cache ที่แสดงข้อมูลผิด, race condition ที่แสดงข้อมูลผิด, missing request cancellation ที่ก่อให้เกิด memory leak, stale data ที่ก่อให้เกิด business error
- High: missing loading state, missing error state, missing cache invalidation, missing request dedup, missing optimistic update, missing pagination error handling, missing polling cleanup, incorrect query key, no WebSocket cleanup
- Medium: suboptimal cache strategy, missing prefetch, missing skeleton screen, suboptimal pagination, minor race condition ใน non-critical path
- Low: cosmetic, minor cache improvement, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ query, mutation, cache key, หรือ component ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก data fetching section
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

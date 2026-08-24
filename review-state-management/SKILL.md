---
name: review-state-management
description: Review state management: store structure, mutations, persistence, sync, derivation, SSR, performance
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - review-codebase
  - validate
  - suggest-next-action
---

## Goal

Review state management ครอบคลุม store structure, mutation patterns, persistence, synchronization, scoping, derivation, SSR hydration, performance พร้อม review score

## Scope

state management review สำหรับ: store structure and organization, state normalization, mutation patterns (immutability, direct mutation), state persistence, state synchronization (cross-tab, cross-component), state scoping (global vs local), state derivation (selectors, getters, computed), SSR state hydration (dehydration/rehydration), state performance (unnecessary re-renders from state, large state objects), state debugging and devtools, state migration and versioning

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ state management library และ patterns

1. ทำ `/scan-codebase` เพื่อเข้าใจ state management structure
2. ระบุ state management library (Pinia, Vuex, Redux, Zustand, Jotai, XState, Nanostores, Svelte stores), store file patterns, store organization ที่ใช้

### 2. Deep Analyze

> Goal: ครอบคลุมทุก state management dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ state management patterns
2. ทำ `/update-create-review-cli` — `/update-create-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-review` เพื่อดึง metrics ล่าสุด

### 3. Store Structure And Mutation Review

> Goal: ครอบคลุม store organization, normalization, mutation patterns

1. ตรวจสอบ store structure: store file organization, single responsibility per store, store size, store naming, store registration, modular store patterns
2. ตรวจสอบ state normalization: normalized vs denormalized state, nested state depth, duplicate state, single source of truth, state shape consistency
3. ตรวจสอบ mutation patterns: immutability enforcement, direct state mutation, action/getter separation, mutation tracking, transactional updates, batch updates
4. ตรวจสอบ state scoping: global vs local state, store module boundaries, state ownership, over-globalization (state ที่ควรเป็น local แต่อยู่ใน global store), under-globalization (state ที่ควรเป็น global แต่ prop-drilled)
5. Critical: direct mutation ที่ก่อให้เกิด error, broken store, state inconsistency, circular store dependency, store ที่ใช้งานไม่ได้
6. High: missing immutability, deeply nested state, duplicate state across stores, poor store boundaries, over-globalization, under-globalization

### 4. Persistence, Synchronization And Derivation Review

> Goal: ครอบคลุม persistence, sync, derivation, SSR hydration

1. ตรวจสอบ state persistence: persistence strategy (localStorage, sessionStorage, IndexedDB, cookie), persistence scope, persistence serialization, persistence migration, sensitive data in persisted state
2. ตรวจสอบ state synchronization: cross-tab sync, cross-component sync, real-time state sync, state sync error handling, state sync conflict resolution, debounced sync
3. ตรวจสอบ state derivation: selector/getter patterns, computed state, memoized selectors, derived state caching, selector composition, stale derived state
4. ตรวจสอบ SSR state hydration: dehydration/rehydration correctness, serialization safety, hydration mismatch, server-only state, client-only state, state transfer payload size
5. Critical: hydration mismatch ที่ก่อให้เกิด error, sensitive data in persisted state, broken cross-tab sync, state sync data loss, serialization crash
6. High: missing persistence migration, stale derived state, missing selector memoization, large hydration payload, missing sync error handling, missing hydration error boundary

### 5. Performance, Debugging And Migration Review

> Goal: ครอบคลุม performance, devtools, migration, versioning

1. ตรวจสอบ state performance: unnecessary re-renders from state changes, large state objects, state update frequency, state subscription granularity, state update batching, reactive dependency tracking
2. ตรวจสอบ state debugging: devtools integration, state action logging, time-travel debugging support, state inspection, action tracking, error tracking in actions
3. ตรวจสอบ state migration: state versioning, migration strategy for breaking changes, backward compatibility, state schema evolution, migration test coverage
4. Critical: infinite update loop, memory leak from state subscription, state performance ที่ก่อให้เกิด crash, broken migration ที่ก่อให้เกิด data loss
5. High: unnecessary re-renders ใน hot path, missing devtools integration, missing state versioning, large state object without splitting, missing migration strategy

### 6. Validate, Rate And Report

> Goal: Issues ถูก validate และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/report` พร้อม `/report-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี state management library → ข้ามทั้งหมด
- ถ้า project ไม่มี SSR → ข้าม Step 4 item 4
- ถ้า project ไม่มี state persistence → ข้าม Step 4 item 1
- ถ้า project ไม่มี cross-tab sync → ข้าม Step 4 item 2

### 2. Severity Classification

- Critical: direct mutation ที่ก่อให้เกิด error, broken store, state inconsistency, circular store dependency, hydration mismatch ที่ก่อให้เกิด error, sensitive data in persisted state, infinite update loop, memory leak from state subscription, broken migration ที่ก่อให้เกิด data loss
- High: missing immutability, deeply nested state, duplicate state, poor store boundaries, over-globalization, under-globalization, missing persistence migration, stale derived state, missing selector memoization, unnecessary re-renders ใน hot path, missing devtools integration, missing state versioning
- Medium: suboptimal store organization, minor serialization issue, missing action logging, large state object without splitting, missing migration test
- Low: cosmetic, minor naming, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ store, state field, action, getter, หรือ selector ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- ถ้า issue ซ้อนทับกับ `/review-codebase` → อ้างอิงแทน ไม่ duplicate

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก state management section
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`


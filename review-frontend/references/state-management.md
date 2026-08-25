# State Management Checks

## Store Structure

- store file organization: modular, single responsibility per store
- store size: ไม่ใหญ่เกินไป, split ถ้าจำเป็น
- store naming: consistent convention
- store registration: explicit registration
- modular store patterns: feature-based organization

## State Normalization

- normalized vs denormalized state: normalize สำหรับ collections
- nested state depth: หลีกเลี่ยง deeply nested state
- duplicate state: single source of truth, no duplicate
- state shape consistency: consistent shape ระหว่าง stores

## Mutation Patterns

- immutability enforcement: ห้าม direct mutation (ยกเว้น Pinia/Vue reactive)
- direct state mutation: ห้าม mutate นอก actions/mutations
- action/getter separation: แยกชัดเจน
- mutation tracking: devtools ตาม tracking ได้
- transactional updates: atomic updates สำหรับ related state
- batch updates: batch สำหรับ multiple updates

## State Scoping

- global vs local state: เลือก scope ที่เหมาะสม
- store module boundaries: ชัดเจน, ไม่ overlap
- state ownership: ระบุ owner ของ state
- over-globalization: state ที่ควรเป็น local แต่อยู่ใน global store
- under-globalization: state ที่ควรเป็น global แต่ prop-drilled

## State Persistence

- persistence strategy: `localStorage`, `sessionStorage`, `IndexedDB`, cookie — เลือกให้ถูก
- persistence scope: persist เฉพาะที่จำเป็น
- persistence serialization: safe serialization, no circular ref
- persistence migration: versioning และ migration strategy
- sensitive data in persisted state: ห้าม persist sensitive data

## State Synchronization

- cross-tab sync: `storage` event, BroadcastChannel
- cross-component sync: store subscription
- real-time state sync: WebSocket, SSE
- state sync error handling: handle sync failures
- state sync conflict resolution: merge strategy
- debounced sync: debounce สำหรับ frequent updates

## State Derivation

- selector/getter patterns: pure selectors
- computed state: derived จาก raw state
- memoized selectors: memoize สำหรับ expensive derivation
- derived state caching: cache ผลลัพธ์
- selector composition: compose selectors
- stale derived state: invalidate ตอน source เปลี่ยน

## SSR State Hydration

- dehydration/rehydration correctness: serialize และ deserialize ถูกต้อง
- serialization safety: no circular ref, no functions
- hydration mismatch: server และ client state ตรงกัน
- server-only state: ไม่ hydrate ไป client
- client-only state: init หลัง hydration
- state transfer payload size: ไม่ใหญ่เกินไป

## State Performance

- unnecessary re-renders from state changes: หา re-render ที่หลีกเลี่ยงได้
- large state objects: split ถ้าใหญ่เกินไป
- state update frequency: debounce/batch ถ้า frequent
- state subscription granularity: subscribe เฉพาะที่จำเป็น
- state update batching: batch updates
- reactive dependency tracking: tracking ถูกต้อง

## State Debugging

- devtools integration: รองรับ devtools
- state action logging: log actions
- time-travel debugging support: รองรับ time-travel
- state inspection: inspect state ได้
- action tracking: track action history
- error tracking in actions: catch และ log errors

## State Migration

- state versioning: version field ใน persisted state
- migration strategy for breaking changes: migration functions
- backward compatibility: รองรับ old version
- state schema evolution: evolve schema อย่างปลอดภัย
- migration test coverage: test migration paths

## Severity Reference

- Critical: direct mutation ที่ก่อให้เกิด error, broken store, state inconsistency, circular store dependency, store ที่ใช้งานไม่ได้, hydration mismatch ที่ก่อให้เกิด error, sensitive data in persisted state, broken cross-tab sync, state sync data loss, serialization crash, infinite update loop, memory leak from state subscription, state performance ที่ก่อให้เกิด crash, broken migration ที่ก่อให้เกิด data loss
- High: missing immutability, deeply nested state, duplicate state across stores, poor store boundaries, over-globalization, under-globalization, missing persistence migration, stale derived state, missing selector memoization, large hydration payload, missing sync error handling, missing hydration error boundary, unnecessary re-renders ใน hot path, missing devtools integration, missing state versioning, large state object without splitting, missing migration strategy
- Medium: suboptimal store organization, minor serialization issue, missing action logging, large state object without splitting, missing migration test
- Low: cosmetic, minor naming, documentation gap

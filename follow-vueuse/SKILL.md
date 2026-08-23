---
name: follow-vueuse
description: ใช้งาน VueUse v14 composables ตาม best practices 2026
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
triggers:
  - user
  - model
related: []
---
## Goal

ใช้งาน VueUse v14 composables สำหรับ Vue 3 applications อย่างมีประสิทธิภาพ

## Scope

ใช้สำหรับ Vue 3.5+ projects ที่ใช้ VueUse v14 composables (ต้องการ Vue 3.5+)

## Execute

### 1. Setup VueUse
> Goal: Setup VueUse

ตั้งค่า VueUse ใน project

1. ติดตั้ง `@vueuse/core` v14+ (ต้องการ Vue 3.5+)
2. ติดตั้ง `@vueuse/nuxt` สำหรับ Nuxt projects
3. ตั้งค่า Nuxt module ใน `nuxt.config.ts`
4. ใช้ auto-imports สำหรับ VueUse composables
5. กำหนด imports ที่ต้องการใช้

### 2. Use VueUse Composables
> Goal: Use VueUse Composables

ใช้ VueUse composables ตาม use case

1. State: `useLocalStorage`, `useSessionStorage`, `useAsyncState`, `useStorage`
2. Elements: `useElementBounding`, `useWindowSize`, `useScroll`, `useIntersectionObserver`
3. Browser: `useMediaQuery`, `useClipboard`, `useDark`, `useCssSupports`
4. Sensors: `useMouse`, `useGeolocation`, `useNetwork`, `useDraggable`, `useDropZone`
5. Animation: `useInterval`, `useTimeout`, `useTransition`, `useRafFn`
6. Utilities: `useSortable`, `useWebSocket`, `useElementVisibility`

### 3. VueUse v14 New Features
> Goal: VueUse v14 New Features

ใช้ features ใหม่ของ VueUse v14

1. `useIntersectionObserver` รองรับ reactive `rootMargin` (ไม่ต้อง recreate observer)
2. `useDraggable` มี auto-scroll ใน scrollable containers
3. `useDropZone` มี validation function สำหรับ file type/size
4. `useSortable` มี `watchElement` สำหรับ auto re-init เมื่อ DOM เปลี่ยน
5. `useCssSupports` สำหรับ reactive CSS feature detection (ใหม่ใน v14)
6. `useWebSocket` รองรับ function support สำหรับ `autoConnect.delay`
7. `useElementVisibility` มี `initialValue` option

### 4. Integrate With Components
> Goal: Integrate With Components

ใช้ VueUse ใน components

1. ใช้ VueUse ใน `<script setup>` components
2. แยก logic ที่ซับซ้อนออกเป็น composables
3. ใช้ TypeScript สำหรับ type inference
4. ทดสอบ composables ด้วย Vitest
5. ใช้ `controls` option สำหรับ advanced configuration

### 5. Optimize Performance
> Goal: Optimize Performance

ปรับปรุง performance

1. ใช้ `useThrottle` สำหรับ scroll/resize events
2. ใช้ `useDebounce` สำหรับ input/search
3. ใช้ `shallowRef` เมื่อไม่ต้องการ deep reactivity
4. ลด watchers ที่ไม่จำเป็น
5. ใช้ `tryOnScopeDispose` สำหรับ cleanup side-effects
6. ใช้ `effectScope` สำหรับ grouped effect disposal

## Rules

### 1. Import Conventions

กำหนดการ import

- ใช้ auto-imports สำหรับ VueUse composables
- ใช้ named imports สำหรับ composables ที่ไม่ได้ configure
- ไม่ import VueUse ที่ไม่ได้ใช้ (tree-shaking)
- VueUse v14 ต้องการ Vue 3.5+

### 2. Usage Patterns

รูปแบบการใช้งาน

- ใช้ VueUse ใน `<script setup>` เท่านั้น
- แยก logic ที่ซับซ้อนออกเป็น composables
- ใช้ destructuring สำหรับ return values
- ใช้ `reactive()` สำหรับ unwrap refs ถ้าต้องการ object properties
- ใช้ reactive getter arguments แทน ref (VueUse 9.0+)
- ใช้ TypeScript types จาก VueUse

### 3. Authoring Guidelines

หลักการเขียน composables ตาม VueUse guidelines

- Import Vue APIs จาก `"vue"`
- ใช้ `ref` แทน `reactive` เมื่อเป็นไปได้
- ใช้ `shallowRef` แทน `ref` เมื่อข้อมูลใหญ่
- ใช้ options object เป็น arguments เพื่อความยืดหยุ่น
- ใช้ `configurableWindow` เมื่อใช้ global variables เช่น `window`
- ใช้ `tryOnScopeDispose` สำหรับ cleanup
- ทำให้ `immediate` และ `flush` options configurable
- ใช้ `isSupported` flag สำหรับ Web APIs ที่ยังไม่ widely supported

### 4. Performance

ปรับปรุง performance

- ใช้ `useThrottle` สำหรับ events
- ใช้ `useDebounce` สำหรับ inputs
- หลีกเลี่ยงการเรียก VueUse ใน loops
- ใช้ `computed` จาก VueUse getters
- ใช้ `shallowRef` สำหรับ large data

### 5. Testing

ทดสอบ VueUse composables

- Mock VueUse composables ใน unit tests
- ใช้ `flushPromises` สำหรับ async composables
- ทดสอบ composables ที่ extend จาก VueUse
- ใชе `effectScope` สำหรับ test isolation

## Expected Outcome

- VueUse v14 composables ที่ใช้อย่างมีประสิทธิภาพ
- Code ที่ clean และ maintainable
- Type safety จาก VueUse TypeScript support
- Performance ที่ดีขึ้นด้วย `shallowRef` และ `effectScope`
- เขียน custom composables ตาม VueUse guidelines

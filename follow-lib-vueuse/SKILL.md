---
name: follow-lib-vueuse
description: ใช้งาน VueUse v14.4 composables ตาม best practices
argument-hint: "[scope]"
related:
  - follow-lib-vue
  - follow-best-practice
  - use-my-packages-on-registry
  - setup-cicd
---

## Goal

ใช้งาน VueUse v14.4 composables สำหรับ Vue 3.5+ applications อย่างมีประสิทธิภาพ

## Scope

ใช้กับ Vue 3.5+ projects ที่ใช้ VueUse v14.4 ครอบคลุม installation, core composables, v14 features, best practices และ testing

## Execute

### 1. Setup VueUse

> Goal: ติดตั้งและตั้งค่า VueUse ใน Vue หรือ Nuxt project

1. ติดตั้ง `@vueuse/core` v14.4+ ด้วย `bun add @vueuse/core`
2. สำหรับ Nuxt ให้ติดตั้ง `@vueuse/nuxt` หรือ `npx nuxt@latest module add vueuse`
3. ตั้งค่า Nuxt module ใน `nuxt.config.ts`
4. ใช้ auto-imports สำหรับ VueUse composables
5. กำหนด imports ที่ต้องการใช้ถ้าไม่ใช้ auto-imports

### 2. Use VueUse Composables

> Goal: เลือก composables ตาม use case จาก categories หลักของ VueUse

1. State: `useLocalStorage`, `useSessionStorage`, `useAsyncState`, `useStorage`, `createSharedComposable`
2. Elements: `useElementBounding`, `useWindowSize`, `useScroll`, `useIntersectionObserver`, `useResizeObserver`
3. Browser: `useMediaQuery`, `useClipboard`, `useDark`, `useCssSupports`, `useTitle`
4. Sensors: `useMouse`, `useGeolocation`, `useNetwork`, `useDraggable`, `useDropZone`
5. Animation: `useInterval`, `useTimeout`, `useTransition`, `useRafFn`
6. Network: `useFetch`, `useWebSocket`, `useEventSource`
7. Utilities: `useSortable`, `useEventListener`, `onClickOutside`, `tryOnScopeDispose`
8. ดูรายละเอียดครบถ้วนใน `https://vueuse.org/functions`

### 3. Use VueUse v14.4 New Features

> Goal: ใช้ features ใหม่ของ VueUse v14 ที่ปรับปรุงจากเวอร์ชันก่อนหน้า

1. `useIntersectionObserver` รองรับ reactive `rootMargin` (ไม่ต้อง recreate observer)
2. `useDraggable` มี auto-scroll ใน scrollable containers
3. `useDropZone` มี validation function สำหรับ file type/size
4. `useSortable` มี `watchElement` สำหรับ auto re-init เมื่อ DOM เปลี่ยน
5. `useCssSupports` สำหรับ reactive CSS feature detection (ใหม่ใน v14)
6. `useWebSocket` รองรับ function support สำหรับ `autoConnect.delay`
7. `useElementVisibility` มี `initialValue` option
8. `useElementOverflow` สำหรับ detect element overflow (ใหม่ใน v14.4)
9. `useSpeechRecognition` expose confidence ของ latest result (v14.4)
10. `useVirtualList` scrollTo รองรับ `behavior`, `block`, `inline` (v14.4)
11. Custom scheduler จาก v14.1.0 สำหรับ time-based composables
12. `watchPausable` deprecated เนื่องจาก Vue 3.5 native `watch` มี `pause/resume/stop`

### 4. Integrate With Components

> Goal: ใช้ VueUse ใน components อย่างเป็นระบบและ testable

1. ใช้ VueUse ใน `<script setup>` components
2. แยก logic ที่ซับซ้อนออกเป็น composables
3. ใช้ TypeScript สำหรับ type inference
4. ทดสอบ composables ด้วย Vitest
5. ใช้ `controls` option สำหรับ advanced configuration

### 5. Optimize Performance

> Goal: ลด re-renders และ side-effects ด้วย VueUse utilities

1. ใช้ `useThrottle` สำหรับ scroll/resize events
2. ใช้ `useDebounce` สำหรับ input/search
3. ใช้ `shallowRef` เมื่อไม่ต้องการ deep reactivity
4. ลด watchers ที่ไม่จำเป็น
5. ใช้ `tryOnScopeDispose` สำหรับ cleanup side-effects
6. ใช้ `effectScope` สำหรับ grouped effect disposal

## Rules

### 1. Import Conventions

- ใช้ auto-imports สำหรับ VueUse composables
- ใช้ named imports สำหรับ composables ที่ไม่ได้ configure
- ไม่ import VueUse ที่ไม่ได้ใช้ (tree-shaking)
- VueUse v14 ต้องการ Vue 3.5+

### 2. Usage Patterns

- ใช้ VueUse ใน `<script setup>` เท่านั้น
- แยก logic ที่ซับซ้อนออกเป็น composables
- ใช้ destructuring สำหรับ return values
- ใช้ `reactive()` สำหรับ unwrap refs ถ้าต้องการ object properties
- ใช้ reactive getter arguments แทน ref (VueUse 9.0+)
- ใช้ TypeScript types จาก VueUse

### 3. Authoring Guidelines

- Import Vue APIs จาก `"vue"`
- ใช้ `ref` แทน `reactive` เมื่อเป็นไปได้
- ใช้ `shallowRef` แทน `ref` เมื่อข้อมูลใหญ่
- ใช้ options object เป็น arguments เพื่อความยืดหยุ่น
- ใช้ `configurableWindow` เมื่อใช้ global variables เช่น `window`
- ใช้ `tryOnScopeDispose` สำหรับ cleanup
- ทำให้ `immediate` และ `flush` options configurable
- ใช้ `isSupported` flag สำหรับ Web APIs ที่ยังไม่ widely supported

### 4. Performance

- ใช้ `useThrottle` สำหรับ events
- ใช้ `useDebounce` สำหรับ inputs
- หลีกเลี่ยงการเรียก VueUse ใน loops
- ใช้ `computed` จาก VueUse getters
- ใช้ `shallowRef` สำหรับ large data

### 5. VueUse v14 Breaking Changes

- VueUse v14 ต้องการ Vue 3.5+
- Migrate ไปใช้ `tsdown` และ dist files ย้ายตำแหน่ง (breaking)
- Alias exports deprecated ให้ใช้ชื่อ function ต้นฉบับ
- `watchPausable` deprecated ให้ใช้ Vue 3.5 native `watch` controls

### 6. Testing

- จำลอง VueUse composables ใน unit tests
- ใช้ `flushPromises` สำหรับ async composables
- ทดสอบ composables ที่ extend จาก VueUse
- ใช้ `effectScope` สำหรับ test isolation

- ใช้ `/follow-lib-vue` ถ้าจำเป็น
- ใช้ `/follow-best-practice` ถ้าจำเป็น
- ใช้ `/use-my-packages-on-registry` ถ้าจำเป็น
- ใช้ `/setup-cicd` ถ้าจำเป็น

## Expected Outcome

- VueUse v14.4 composables ที่ใช้อย่างมีประสิทธิภาพ
- Code ที่ clean และ maintainable
- Type safety จาก VueUse TypeScript support
- Performance ที่ดีขึ้นด้วย `shallowRef` และ `effectScope`
- เขียน custom composables ตาม VueUse guidelines

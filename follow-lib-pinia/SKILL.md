---
name: follow-lib-pinia
description: แนวทางการใช้งาน Pinia v4 สำหรับ state management ใน Vue 3
related:
  - follow-lib-vue
  - follow-best-practice
  - use-my-packages-on-registry
  - setup-cicd
---

## Goal

กำหนดแนวทางการใช้งาน Pinia v4 สำหรับ state management ใน Vue 3 ให้มีประสิทธิภาพและเป็นมาตรฐาน

## Scope

ใช้กับ Vue 3 ที่ต้องการ state management ด้วย Pinia v4 ครอบคลุม setup stores, getters, actions, persistence และ testing

## Execute

### 1. Install Pinia

> Goal: ติดตั้ง Pinia v4 ใน Vue หรือ Nuxt project

1. ติดตั้ง `pinia` ด้วย `bun add pinia`
2. ติดตั้ง `@vue/devtools-api` เนื่องจาก Pinia v4 ต้องการ peer dependency นี้
3. สำหรับ Nuxt ให้ติดตั้ง `@pinia/nuxt` ด้วย `bun add -D @pinia/nuxt` หรือ `npx nuxi@latest module add pinia`
4. สร้าง `stores/` directory สำหรับเก็บ store files
5. จำไว้ว่า Pinia v4 เป็น ESM-only

### 2. Create Pinia Instance

> Goal: สร้างและตั้งค่า Pinia instance

1. ใช้ `createPinia()` เพื่อสร้าง instance
2. ติดตั้งใน Vue app ด้วย `app.use(pinia)`
3. สำหรับ Nuxt ให้เพิ่ม `@pinia/nuxt` ใน `modules` ของ `nuxt.config.ts`
4. กำหนด `pinia.storesDirs` ใน Nuxt ถ้า store directory ไม่อยู่ใน default

### 3. Define Setup Store

> Goal: ออกแบบ stores ด้วย Composition API style

1. ใช้ setup function pattern เป็นหลัก: `defineStore('id', setupFn, options?)`
2. กำหนด state, getters, actions อย่างชัดเจน
3. ใช้ `ref`, `reactive`, `computed` สำหรับ state และ getters
4. ใช้ arrow functions สำหรับ actions
5. แยก stores ตาม domain/feature โดยใช้ชื่อที่สื่อความหมาย

### 4. Implement State, Getters And Actions

> Goal: จัดการ state, derived state และ side effects

1. ใช้ `ref` หรือ `reactive` สำหรับ state
2. สร้าง getters ด้วย `computed`
3. implement actions สำหรับ async logic โดยใช้ `async/await`
4. ใช้ `$patch` สำหรับ batch state updates
5. หลีกเลี่ยงการแก้ไข state นอก actions

### 5. Use Stores In Components

> Goal: เข้าถึง stores ใน components โดยรักษา reactivity

1. ใช้ `storeToRefs` เมื่อต้องการ destructure reactive state
2. Access stores ใน `<script setup>` components
3. เรียกใช้ actions โดยตรงผ่าน store instance
4. ใช้ `$subscribe` หรือ `$onAction` สำหรับ subscriptions ถ้าจำเป็น

### 6. Add Persistence (Optional)

> Goal: ตั้งค่า persisted state plugin สำหรับเก็บ state ข้าม sessions

1. ติดตั้ง `pinia-plugin-persistedstate`
2. กำหนด persist strategies ด้วย `pick` และ `serializer`
3. เลือก fields ที่จะ persist
4. Handle serialization และ SSR compatibility

### 7. Test Stores

> Goal: ทดสอบ stores ด้วย Vitest และ `setActivePinia`

1. เขียน unit tests สำหรับ stores ด้วย Vitest
2. ใช้ `setActivePinia(createPinia())` ใน `beforeEach`
3. Test actions, getters และ state changes
4. จำลอง external dependencies อย่างเหมาะสม

## Rules

### 1. Setup Store Pattern

- ใช้ setup function pattern เป็นหลัก (ไม่แนะนำ option stores สำหรับ project ใหม่)
- ใช้ arrow functions สำหรับ actions
- Return state และ members ที่จำเป็นเท่านั้น
- ใช้ `const` สำหรับ store definition

### 2. State Naming

- ใช้ descriptive names สำหรับ state properties
- หลีกเลี่ยง generic names เช่น `data`, `value`
- ใช้ `isLoading`, `hasError` pattern สำหรับ async states
- กลุ่ม related state เข้าด้วยกัน

### 3. Action Conventions

- ใช้ `async/await` สำหรับ async actions
- Handle errors อย่างครบถ้วน
- Return values จาก actions เมื่อเหมาะสม
- ไม่ mutate state นอก actions

### 4. Getters Usage

- ใช้ getters สำหรับ derived state
- หลีกเลี่ยง duplicate computations
- Pass parameters ด้วย closure ถ้าจำเป็น
- Cache expensive computations ด้วย `computed`

### 5. Pinia v4 Requirements

- ต้องติดตั้ง `@vue/devtools-api` เองใน Pinia v4
- Pinia v4 เป็น ESM-only
- ใช้ TypeScript 5 หรือใหม่กว่า
- ไม่รองรับ `defineStore({ id })` หรือ `PiniaStorePlugin` (removed in v3/v4)

### 6. Nuxt Integration

- ใช้ `@pinia/nuxt` v1.0+ สำหรับ Nuxt 3/4
- ตั้งค่า `pinia.storesDirs` ถ้าจำเป็น
- ใช้ auto-imports สำหรับ `defineStore` และ `storeToRefs`

### 7. Testing

- ใช้ `setActivePinia(createPinia())` ก่อนแต่ละ test
- จำลอง API calls ใน actions
- ตรวจสอบ reactivity หลัง state changes
- ทดสอบ edge cases

- ใช้ `/follow-lib-vue` ถ้าจำเป็น
- ใช้ `/follow-best-practice` ถ้าจำเป็น
- ใช้ `/use-my-packages-on-registry` ถ้าจำเป็น
- ใช้ `/setup-cicd` ถ้าจำเป็น

## Expected Outcome

- Pinia v4 stores ที่ well-structured
- State management ที่ predictable
- Type-safe store usage
- Tested store logic
- Documentation สำหรับ store patterns

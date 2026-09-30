---
name: follow-lib-pinia-setup-pinia
description: ติดตั้ง Pinia — createPinia, store patterns (setup vs options)
argument-hint: "[scope]"
related:
  - follow-lib-pinia
  - follow-lib-vue
  - run-install
  - run-test
  - resolve-errors
---

## Goal

ติดตั้งและตั้งค่า Pinia ใน Vue 3 project — `createPinia`, store definition และเลือก setup vs options store pattern

## Scope

ใช้เมื่อต้อง setup Pinia ครั้งแรกใน Vue 3 หรือ Nuxt project — ครอบคลุม install, `createPinia`, `app.use(pinia)`, `defineStore` patterns และ smoke test

## Execute

### 1. Install Pinia

> Goal: ติดตั้ง Pinia และ peer dependencies

1. ติดตั้ง `bun add pinia` และ `bun add -D @vue/devtools-api` (peer dependency ที่ Pinia v4 ต้องการ)
2. สำหรับ Nuxt: `bun add -D @pinia/nuxt` หรือ `bunx nuxi@latest module add pinia`
3. ถ้า `package.json` มี pinia อยู่แล้ว → verify version เท่านั้น (idempotent)
4. สร้าง `stores/` directory สำหรับ store files
5. จำไว้ว่า Pinia v4 เป็น ESM-only และต้องการ TypeScript 5+

### 2. Create Pinia Instance

> Goal: สร้างและ mount pinia instance

1. `const pinia = createPinia()` ที่ entry point (`main.ts`)
2. `app.use(pinia)` ก่อน `app.mount()`
3. Nuxt: เพิ่ม `@pinia/nuxt` ใน `modules` ของ `nuxt.config.ts` — instance auto-provided
4. ตั้ง `pinia.storesDirs` ใน Nuxt ถ้า store directory ไม่อยู่ใน default

### 3. Define First Store

> Goal: สร้าง store แรกด้วย setup pattern

```ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubled = computed(() => count.value * 2)
  function increment() { count.value++ }
  return { count, doubled, increment }
})
```

1. ใช้ setup function pattern เป็นหลัก: `defineStore('id', setupFn)`
2. `ref`/`reactive` = state, `computed` = getters, functions = actions
3. Return เฉพาะ members ที่ต้อง expose
4. Options store `defineStore('id', { state, getters, actions })` ใช้ได้ แต่ setup pattern แนะนำกว่าสำหรับ project ใหม่ — ใช้ options เมื่อต้อง align กับ codebase เดิม

### 4. Use Store In Component

> Goal: เข้าถึง store โดยรักษา reactivity

1. เรียก `useCounterStore()` ใน `<script setup>` หรือ composable
2. ใช้ `storeToRefs(store)` เมื่อ destructure state/getters — ห้าม destructure ตรงเพราะ reactivity หลุด
3. เรียก actions ผ่าน store instance โดยตรง

### 5. Verify

> Goal: ตรวจสอบ store ทำงานถูกต้อง

1. ทำ `/run-test` — เขียน test ด้วย `setActivePinia(createPinia())` ใน `beforeEach`
2. รัน dev — state เปลี่ยนและ UI reactive ถูกต้อง
3. ถ้าพัง → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report

## Rules

- สร้าง pinia instance เดียว ที่ entry point เท่านั้น
- ใช้ setup store pattern เป็นหลัก — options stores เฉพาะ align กับ codebase เดิม
- ใช้ `storeToRefs` เมื่อ destructure — ห้าม destructure state ตรง
- แยก stores ตาม domain/feature — ไม่รวมทุกอย่างใน store เดียว
- ใช้ `/follow-lib-pinia` สำหรับ full reference และ persistence/testing

## Expected Outcome

- Pinia ติดตั้งและ mount ถูกต้องใน Vue/Nuxt
- Store แรกทำงานได้ด้วย setup pattern พร้อม state/getters/actions
- Components เข้าถึง store โดยรักษา reactivity
- Tests ผ่านด้วย `setActivePinia`

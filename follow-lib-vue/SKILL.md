---
name: follow-lib-vue
description: แนวทางการพัฒนา Vue 3.5+ applications ตาม best practices 2026
argument-hint: "[scope]"
related:
  - follow-lib-animejs
  - follow-lib-arktype
  - follow-lib-better-auth
  - follow-lib-pinia
  - follow-lib-vueuse
  - follow-best-practice
  - use-my-packages-on-registry
  - setup-cicd
---

## Goal

กำหนดแนวทางการพัฒนา Vue.js applications ด้วย Vue 3.5+, Composition API, TypeScript และ modern best practices

## Scope

ใช้สำหรับ Vue 3 projects ทั้ง Vite 8 หรือ Nuxt 4 (Vue 3.5.42 เป็น stable ล่าสุด, Vue 3.6 ยังอยู่ในช่วง RC)

## Execute

### 1. Setup And Configuration

> Goal: ตั้งค่า Vue 3 project ด้วย dependencies และ tools ที่จำเป็น

1. ติดตั้ง Vue 3.5.42+ ด้วย Vite 8 หรือ Nuxt 4.5+
2. ใช้ TypeScript strict mode
3. ติดตั้ง Pinia 4 สำหรับ state management
4. ติดตั้ง Vue Router 5 สำหรับ routing
5. ติดตั้ง UnoCSS หรือ Tailwind CSS สำหรับ styling
6. ใช้ Vite 8 เป็น build tool
7. พิจารณา Vue 3.6 RC สำหรับ Vapor Mode ในกรณีทดสอบ performance สำคัญ (ยังไม่ stable สำหรับ production)
8. ดูรายละเอียดเพิ่มเติมใน [references/vue.md](references/vue.md)

### 2. Component Development

> Goal: เขียน Vue components ตาม Composition API standards

1. ใช้ Single-File Components (SFC) ด้วย `<script setup lang="ts">`
2. ใช้ Composition API แทน Options API (Options API เป็น legacy)
3. ใช้ multi-word component names เสมอ
4. ระบุ prop types ด้วย `defineProps<T>()`
5. ใช้ `defineEmits<T>()` สำหรับ type-safe events
6. ใช้ key กับ v-for เสมอ
7. ใช้ `useTemplateRef()` สำหรับ template refs (Vue 3.5+)
8. ใช้ `useId()` สำหรับ SSR-safe unique IDs (Vue 3.5+)
9. ใช้ `defineModel()` สำหรับ two-way binding
10. ใช้ `defineSlots<T>()` สำหรับ type-safe slots
11. ดูรายละเอียดเพิ่มเติมใน [references/vue-components.md](references/vue-components.md)

### 3. Composables And State

> Goal: จัดระเบียบ logic และ state ด้วย composables และ Pinia

1. แยก logic ออกจาก components ไปที่ composables
2. logic ทั้งหมดควรอยู่ใน composables
3. ใช้ Pinia 4 สำหรับ global state management
4. จัดระเบียบ stores ตาม features/domains
5. ใช้ computed getters สำหรับ derived state
6. ใช้ shared composables สำหรับ local/branch-level state แทนการสร้าง Pinia store
7. ใช้ `provide`/`inject` พร้อม `InjectionKey<T>` สำหรับ dependency injection
8. ใช้ `effectScope` สำหรับ cleanup reactive effects ใน composables ที่ซับซ้อน
9. ดูรายละเอียดเพิ่มเติมใน [references/vue-design-system.md](references/vue-design-system.md)

### 4. Reactivity Best Practices

> Goal: ใช้ Vue reactivity อย่างมีประสิทธิภาพ

1. ใช้ `shallowRef()` สำหรับ large immutable data structures (ประหยัด memory)
2. ใช้ `ref()` สำหรับ primitive values
3. ใช้ `reactive()` สำหรับ object state ที่ต้องการ deep reactivity
4. ใช้ `computed()` สำหรับ derived values
5. หลีกเลี่ยงการสร้าง watchers ที่ไม่จำเป็น (zombie effects)
6. ใช้ `watchEffect` เฉพาะเมื่อต้องการ auto dependency tracking
7. ใช้ `watch` เมื่อต้องการ explicit dependency specification
8. ใช้ `onWatcherCleanup()` และ `onEffectCleanup()` สำหรับ cleanup (Vue 3.5+)

### 5. Vapor Mode (Vue 3.6+)

> Goal: พิจารณา Vapor Mode สำหรับ performance ที่ดีขึ้น

1. ใช้ `vapor` attribute ใน `<script setup>` สำหรับ opt-in Vapor Mode (Vue 3.6+)
2. หรือใช้ `.vapor.vue` file extension สำหรับ opt-in โดยไม่แก้ script
3. เริ่มจาก leaf components (list items, table rows, icon buttons) ก่อน
4. Mixed trees ทำงานได้: vdom parent สามารถ render Vapor children ได้
5. Vapor Mode รองรับ Composition API เท่านั้น (ไม่รองรับ Options API)
6. `Suspense` ยังไม่รองรับใน Vapor-only mode
7. ใช้ Vue 3.6 RC เท่านั้น และควรทดสอบก่อนใช้ใน production

### 6. Styling

> Goal: กำหนด component styles ด้วย design system

1. ใช้ UnoCSS theme ที่กำหนดไว้
2. ไม่ hard-code colors หรือ spacing
3. ใช้ utility classes แทน custom styles
4. ใช้ `<style scoped>` สำหรับ component-specific styles เมื่อจำเป็น

### 7. Project Organization

> Goal: จัดระเบียบ project structure และ conventions

1. components ที่ใช้ซ้ำกันให้ refactor ไปที่ `components/ui/`
2. ใช้ import alias (`~/`, `#app`, `#shared`) หลีกเลี่ยง relative paths
3. ทุก `index.ts` แค่ re-export เท่านั้น ไม่มี logic
4. ลบ `@deprecated` ทั้งหมดจาก codebase
5. ใช้ `useHead` ในทุก page component สำหรับ meta tags
6. ใช้ `useSeoMeta` สำหรับ declarative SEO meta tags

## Rules

### 1. Component Standards

- ใช้ Composition API และ `<script setup>` เท่านั้น (จำเป็นสำหรับ Vapor Mode)
- ใช้ TypeScript สำหรับ type safety
- Component names เป็น multi-word
- Props ต้องมี detailed definitions ด้วย `defineProps<T>()`
- ใช้ key กับ v-for เสมอ
- หลีกเลี่ยง v-if กับ v-for บน element เดียวกัน
- ใช้ `useTemplateRef()` แทน `ref` สำหรับ template refs (Vue 3.5+)

### 2. Code Organization

- แยก logic ออกจาก components เข้า composables
- logic ทั้งหมดควรอยู่ใน composables
- components ที่ใช้ซ้ำกันต้องอยู่ใน `components/ui/`
- ใช้ import alias หลีกเลี่ยง relative paths
- ทุก `index.ts` แค่ re-export เท่านั้น ไม่มี logic
- ลบ `@deprecated` ทั้งหมดจาก codebase

### 3. State Management

- ใช้ Pinia 4 สำหรับ global state management
- จัดระเบียบ stores ตาม features/domains
- ใช้ computed getters สำหรับ derived state
- ใช้ shared composables สำหรับ local/branch-level state
- ใช้ `InjectionKey<T>` สำหรับ type-safe provide/inject

### 4. Reactivity

- ใช้ `shallowRef()` สำหรับ large immutable data structures
- ใช้ `ref()` สำหรับ primitive values
- หลีกเลี่ยง zombie effects ด้วย `effectScope`
- หลีกเลี่ยง unnecessary watchers
- ใช้ `onWatcherCleanup()`/`onEffectCleanup()` สำหรับ cleanup (Vue 3.5+)

### 5. Styling

- ใช้ UnoCSS theme ที่กำหนดไว้
- ไม่ hard-code colors หรือ spacing
- Styles เป็น scoped เมื่อจำเป็น

### 6. Performance

- ใช้ computed properties อย่างมีประสิทธิภาพ
- ใช้ `shallowRef` สำหรับ large data เพื่อประหยัด memory
- หลีกเลี่ยง unnecessary reactivity
- ใช้ dynamic imports สำหรับ lazy loading
- พิจารณา Vapor Mode สำหรับ component-heavy scenarios (Vue 3.6 RC)
- ใช้ tree-shaking อย่างเต็มที่

- ใช้ `/follow-lib-animejs` ถ้าจำเป็น
- ใช้ `/follow-lib-arktype` ถ้าจำเป็น
- ใช้ `/follow-lib-better-auth` ถ้าจำเป็น
- ใช้ `/follow-lib-pinia` ถ้าจำเป็น
- ใช้ `/follow-lib-vueuse` ถ้าจำเป็น
- ใช้ `/follow-best-practice` ถ้าจำเป็น
- ใช้ `/use-my-packages-on-registry` ถ้าจำเป็น
- ใช้ `/setup-cicd` ถ้าจำเป็น

## Expected Outcome

- Vue 3 components ที่มีโครงสร้างถูกต้องตาม Composition API
- Logic ที่แยกออกจาก components เข้า composables
- Reactivity ที่ใช้ `shallowRef` สำหรับ large data
- Performance ที่ดีขึ้นด้วย Vapor Mode (ถ้าใช้ Vue 3.6+)
- Type safety เต็มรูปแบบด้วย TypeScript
- Code ที่ maintainable

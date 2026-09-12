---
name: follow-lib-vue-migrate-vue2-to-3
description: Migrate Vue 2 → Vue 3 — composition API, breaking changes, incremental build
argument-hint: "[scope]"
related:
  - follow-lib-vue
  - follow-lib-pinia
  - follow-lib-vueuse
  - deep-impact
  - use-astgrep
  - check-deprecated-apis
  - report-before-after
---

## Goal

Migrate Vue 2 application ไป Vue 3 อย่างปลอดภัย — options→composition, breaking changes (filters, `$emit`, `v-model`) และ incremental migration

## Scope

ใช้เมื่อต้อง migrate Vue 2 codebase ไป Vue 3 — ครอบคลุม migration plan, build config, API changes และ incremental strategy (ต้อง rollback ได้ ไม่ทำพร้อม feature work)

## Execute

### 1. Plan Migration

> Goal: ระบุ from→to, impact และ rollback path ก่อนเริ่ม

1. อ่าน official migration guide ที่ `https://v3-migration.vuejs.org` — ระบุ breaking changes ทั้งหมดที่กระทบ codebase
2. ทำ `/deep-impact` และ `/scan-codebase` — map จุดที่ใช้ Vue 2 APIs: filters, `$listeners`, `$children`, `v-model` เดิม, event bus, `Vue.extend`
3. เขียน rollback path ชัดเจน — แยก migration commits ต่อ step ให้ bisect ได้
4. ถ้า scope ไม่ชัด → stop และ report

### 2. Upgrade Build And Dependencies

> Goal: migrate config → deps ก่อน code

1. อัปเกรด `vue` เป็น v3 และ `@vue/compat` (migration build) ถ้าต้อง incremental
2. อัปเกรด ecosystem: `vue-router` 4, `pinia` (แทน Vuex) หรือ `vuex` 4, build tool เป็น Vite
3. ตั้ง compat config `compatConfig: { MODE: 3 }` และ per-feature flags ตาม warnings
4. แยก commit: deps/config → ไม่ผสมกับ code changes

### 3. Migrate Code Patterns

> Goal: แปลง Vue 2 APIs เป็น Vue 3 ทีละ pattern

1. Options → Composition: แปลง `data`/`methods`/`computed`/`watch` เป็น `<script setup>` + `ref`/`computed`/`watch` — ทำทีละ component หรือใช้ codemod (`/use-astgrep`, `/migration-by-astgrep`)
2. Breaking changes หลัก:
   - Filters ถูกลบ — แปลง `{{ x | filter }}` เป็น method/computed
   - `v-model`: `modelValue` prop + `update:modelValue` event แทน `value`/`input`; `.sync` → `v-model:propName`
   - `$listeners` merge เข้า `$attrs` — component ใช้ `emits` declaration
   - `$emit` → `defineEmits()` ใน setup
   - Event bus → ใช้ external emitter (เช่น `mitt`) หรือ Pinia
   - `Vue.use`/`Vue.mixin`/`Vue.component` → `app.*` APIs บน `createApp` instance
3. Global API: `new Vue()` → `createApp(App)`, mount ด้วย `app.mount('#app')`

### 4. Remove Compat And Finalize

> Goal: ปิด compat mode เมื่อ warnings หมด

1. แก้ compat warnings ทั้งหมดก่อน — ค่อยๆ flip feature flags เป็น 3
2. ลบ `@vue/compat` เมื่อไม่มี warnings เหลือ
3. ทำ `/check-deprecated-apis` เพื่อเช็ค Vue 2 APIs ค้าง

### 5. Verify

> Goal: lint/typecheck/tests และ runtime smoke test ผ่าน

1. รัน lint, typecheck, tests ทั้งหมด
2. runtime smoke test ทุก route/feature หลัก
3. ถ้าค้าง → สร้าง TODO list ชัดเจน; เสร็จ → `/report-before-after` แล้ว report

## Rules

- Incremental เท่านั้น — ใช้ `@vue/compat` ถ้า codebase ใหญ่ ห้าม big-bang rewrite
- แยก commit ต่อ step — ห้ามผสม migration กับ feature work
- ใช้ codemods/ast-grep แทน manual edit เมื่อมี
- Composition API เป็นเป้าหมายสุดท้าย — Options API ที่เหลือระหว่าง migrate ต้องมี plan
- ใช้ `/follow-lib-vue` สำหรับ Vue 3 target standards

## Expected Outcome

- Application รันบน Vue 3 โดยไม่มี compat warnings
- Vue 2 APIs (filters, `$listeners`, event bus, `.sync`) ถูกแปลงครบ
- Tests/lint/typecheck ผ่านทั้งหมด
- Migration commits แยกชัดเจน bisect ได้

---
name: follow-lib-pinia
description: แนวทางการใช้งาน Pinia สำหรับ state management ใน Vue applications
related:
  - follow-lib-animejs
  - follow-lib-arktype
  - follow-lib-better-auth
  - follow-best-practice
  - use-my-packages-on-registry
  - setup-cicd
---

## Goal

กำหนดแนวทางการใช้งาน Pinia สำหรับ state management ใน Vue applications ให้มีประสิทธิภาพและเป็นมาตรฐาน

## Scope

ใช้สำหรับ Vue 3 projects ที่ต้องการ state management ด้วย Pinia ครอบคลุม setup stores, getters, actions, persistence และ testing

## Execute

### 1. Setup Pinia Store

> Goal: ติดตั้ง Pinia และสร้าง store structure ใน Vue หรือ Nuxt project

1. ติดตั้ง Pinia dependency ด้วย `bun add pinia @pinia/nuxt`
2. สร้าง stores directory ที่ `stores/`
3. กำหนด main store file `stores/index.ts`
4. Setup Pinia module ใน `nuxt.config.ts`
5. ดูรายละเอียดใน [references/pinia-config.md](references/pinia-config.md)

### 2. Define Store Structure

> Goal: ออกแบบ stores ด้วย Composition API style ตาม domain/feature

1. ใช้ Composition API style (setup stores) เท่านั้น
2. กำหนด state, getters, actions อย่างชัดเจน
3. ใช้ proper naming conventions ตาม feature/domain
4. แยก stores ตาม domain/feature ไม่ใช่ generic names
5. ดูรายละเอียดใน [references/pinia-api.md](references/pinia-api.md)

### 3. Implement State Management

> Goal: ใช้ ref/reactive, computed getters และ actions สำหรับ mutations

1. ใช้ `ref`/`reactive` สำหรับ state
2. สร้าง getters ด้วย `computed`
3. implement actions สำหรับ mutations
4. ใช้ `$reset` สำหรับ resetting state
5. ดูรายละเอียดใน [references/pinia-api.md](references/pinia-api.md)

### 4. Use Stores in Components

> Goal: เข้าถึง stores ใน components โดยรักษา reactivity

1. ใช้ `storeToRefs` สำหรับ destructuring
2. Access stores ใน `<script setup>` components
3. ใช้ actions ใน event handlers
4. จัดการ subscriptions ถ้าจำเป็น

### 5. Add Persistence (Optional)

> Goal: ตั้งค่า persisted state plugin สำหรับเก็บ state ข้าม sessions

1. ติดตั้ง `pinia-plugin-persistedstate`
2. กำหนด persist strategies ด้วย `pick` option
3. เลือก fields ที่จะ persist
4. Handle serialization
5. ดูรายละเอียดใน [references/pinia-config.md](references/pinia-config.md)

### 6. Test Stores

> Goal: ทดสอบ stores ด้วย Vitest และ `setActivePinia`

1. เขียน unit tests สำหรับ stores ด้วย Vitest
2. Test actions และ state changes
3. Mock external dependencies
4. Test edge cases
5. ดูรายละเอียดใน [references/pinia-api.md](references/pinia-api.md)

## Rules

### 1. Setup Store Pattern

- ใช้ setup function pattern (ไม่ใช่ option stores)
- ใช้ arrow functions สำหรับ actions
- Return state ที่จำเป็นเท่านั้น
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
- Cache expensive computations

- ใช้ /follow-lib-animejs ถ้าจำเป็น
- ใช้ /follow-lib-arktype ถ้าจำเป็น
- ใช้ /follow-lib-better-auth ถ้าจำเป็น
- ใช้ /follow-best-practice ถ้าจำเป็น
- ใช้ /use-my-packages-on-registry ถ้าจำเป็น
- ใช้ /setup-cicd ถ้าจำเป็น

## Expected Outcome

- Pinia stores ที่ well-structured
- State management ที่ predictable
- Type-safe store usage
- Tested store logic
- Documentation สำหรับ store patterns

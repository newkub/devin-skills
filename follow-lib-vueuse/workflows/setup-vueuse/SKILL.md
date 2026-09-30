---
name: follow-lib-vueuse-setup-vueuse
description: ติดตั้ง VueUse — install, auto-import integration, common composables
argument-hint: "[scope]"
related:
  - follow-lib-vueuse
  - follow-lib-vue
  - run-install
  - run-test
  - resolve-errors
---

## Goal

ติดตั้งและตั้งค่า VueUse ใน Vue 3 project — install, auto-import integration และ composables ที่ใช้บ่อย

## Scope

ใช้เมื่อต้อง setup VueUse ครั้งแรกใน Vue 3.5+ หรือ Nuxt project — ครอบคลุม install, `@vueuse/nuxt` module, auto-import config และ common composables smoke test

## Execute

### 1. Install VueUse

> Goal: ติดตั้ง `@vueuse/core` ตาม framework

1. Vue: `bun add @vueuse/core` — ต้องการ Vue 3.5+
2. Nuxt: `bun add -D @vueuse/nuxt` หรือ `bunx nuxi@latest module add vueuse` แล้วเพิ่มใน `modules` ของ `nuxt.config.ts`
3. ถ้า `package.json` มี VueUse อยู่แล้ว → verify version เท่านั้น (idempotent)
4. ตรวจ Vue version ใน `package.json` ว่า >= 3.5 — VueUse v14 ต้องการ Vue 3.5+

### 2. Setup Auto-Import (Optional)

> Goal: ตั้งค่า auto-import สำหรับ composables

1. Nuxt: auto-imports ทำงานอัตโนมัติผ่าน `@vueuse/nuxt` — ไม่ต้อง config เพิ่ม
2. Vite: ใช้ `unplugin-auto-import` — เพิ่ม `VueUse` ใน `imports` preset หรือ `vueuse` resolver ตาม official docs ที่ `https://vueuse.org`
3. ถ้าไม่ใช้ auto-import → named imports จาก `@vueuse/core` ปกติ
4. merge กับ config เดิม — ห้าม overwrite `vite.config`/`nuxt.config` ทั้งไฟล์

### 3. Use Common Composables

> Goal: ทดสอบ composables ที่ใช้บ่อย

1. State: `useLocalStorage`, `useSessionStorage`, `useAsyncState`
2. Browser: `useMediaQuery`, `useDark`, `useTitle`, `useClipboard`
3. Elements: `useWindowSize`, `useElementBounding`, `useIntersectionObserver`
4. Network: `useFetch`, `useEventSource`
5. Utilities: `useEventListener`, `onClickOutside`, `useDebounce`/`useThrottle`
6. ดูรายการเต็มที่ `https://vueuse.org/functions`

### 4. Verify

> Goal: ตรวจสอบ VueUse ทำงานถูกต้อง

1. รัน dev — ใช้ composable หนึ่งตัวใน `<script setup>` แล้วเช็ค reactivity
2. ถ้าใช้ auto-import — ตรวจว่าไม่ต้อง import เองและ typecheck ผ่าน
3. ทำ `/run-test` ถ้ามี tests ที่เกี่ยวข้อง
4. ถ้าพัง → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report

## Rules

- VueUse v14 ต้องการ Vue 3.5+ — ตรวจ version ก่อนติดตั้ง
- ใช้ auto-imports หรือ named imports — ห้าม import ทั้ง package
- ใช้ composables ใน `<script setup>` เท่านั้น
- อย่าเรียก composables ใน loops หรือ conditional ที่เปลี่ยนแปลงได้
- ใช้ `/follow-lib-vueuse` สำหรับ full reference, v14 features และ best practices

## Expected Outcome

- `@vueuse/core` ติดตั้งและใช้งานได้ใน Vue/Nuxt
- Auto-import ทำงานถ้าตั้งค่า หรือ named imports ถูกต้อง
- Common composables ใช้ได้ทันที
- Typecheck และ dev server ผ่าน

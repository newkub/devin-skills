# Installation

## Purpose

แนะนำการติดตั้ง Pinia สำหรับ Vue 3 และ Nuxt พร้อม TypeScript configuration

## Scope

- Package Installation
- Vue 3 Setup
- Nuxt 3 Setup
- TypeScript Configuration

## Packages Overview

| Package | คำอธิบาย | จำเป็น |
|---------|----------|--------|
| **pinia** | Store library หลัก | ใช่ |
| **vue** | Vue 3 (peer dependency) | ใช่ |
| **pinia-plugin-persistedstate** | Persist store → localStorage | ไม่ (แนะนำ) |

## Install Pinia

### bun (Recommended)

```bash
bun add pinia
```

### bun

```bash
bun install pinia
```

### yarn

```bash
yarn add pinia
```

### bun

```bash
bun add pinia
```

## Vue 3 Setup

### main.ts

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')
```

| ขั้นตอน | Code | คำอธิบาย |
|---------|------|----------|
| **1. Import** | `import { createPinia } from 'pinia'` | Import factory |
| **2. Create** | `const pinia = createPinia()` | สร้าง Pinia instance |
| **3. Register** | `app.use(pinia)` | ติดตั้งเป็น Vue plugin |

### With Plugins

```typescript
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
```

## Nuxt 3 Setup

### ติดตั้ง

```bash
npx nuxi@latest module add pinia
```

### nuxt.config.ts

```typescript
export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],
})
```

### stores/counter.ts

```typescript
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  function increment() { count.value++ }
  return { count, increment }
})
```

| Nuxt Feature | คำอธิบาย |
|--------------|----------|
| **Auto-import** | `defineStore`, `storeToRefs` import อัตโนมัติ |
| **SSR** | Pinia state serialize ไปกับ HTML |
| **Devtools** | Vue DevTools พร้อมใช้งาน |

## TypeScript Configuration

### tsconfig.json

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler"
  }
}
```

| Option | คำอธิบาย | จำเป็น |
|--------|----------|--------|
| `strict` | เปิด strict mode สำหรับ type inference | แนะนำ |
| `target` | ES2020+ สำหรับ modern syntax | แนะนำ |
| `moduleResolution` | `bundler` สำหรับ Vite/Webpack | แนะนำ |

### Type Augmentation (Optional)

```typescript
// pinia.d.ts
import 'pinia'
import type { Router } from 'vue-router'

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    router?: Router
  }
}
```

## Verify Installation

```typescript
import { createPinia, defineStore } from 'pinia'
import { createApp } from 'vue'

const pinia = createPinia()
const app = createApp({}).use(pinia)

const useTestStore = defineStore('test', {
  state: () => ({ count: 0 }),
})

console.log('Pinia installed successfully!')
```

## Summary

| ขั้นตอน | Command |
|---------|---------|
| **Install** | `bun install pinia` |
| **Vue 3** | `app.use(createPinia())` |
| **Nuxt 3** | `npx nuxi@latest module add pinia` |
| **TypeScript** | `strict: true` ใน tsconfig.json |

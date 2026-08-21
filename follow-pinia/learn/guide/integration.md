# Integration

## Purpose

แนะนำการ integrate Pinia กับ tools และ frameworks อื่นๆ

## Scope

- Vue Router
- Nuxt 3
- Vite
- Testing (Vitest)
- Persistence

## Vue Router

ใช้ store สำหรับ route guards:

```typescript
// router/index.ts
import { useAuthStore } from '@/stores/auth'

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'Login' }
  }
})
```

| Use Case | วิธีใช้ |
|----------|---------|
| **Route guard** | อ่าน store ใน `beforeEach` |
| **Dynamic title** | ใช้ getter เป็น page title |
| **Redirect** | ตรวจสอบ auth state แล้ว redirect |

## Nuxt 3

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],
})

// stores/counter.ts — auto-imported
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  return { count }
})

// pages/index.vue — ใช้ได้ทันที
const counter = useCounterStore()
```

| Feature | คำอธิบาย |
|---------|----------|
| **Auto-import** | `defineStore`, `storeToRefs` ไม่ต้อง import |
| **SSR** | State serialize อัตโนมัติ |
| **DevTools** | Vue DevTools พร้อม Pinia tab |

## Vite

Pinia รองรับ Vite HMR โดยอัตโนมัติ:

```typescript
// stores/counter.ts
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  return { count }
})

// Vite HMR — state ไม่หายเมื่อ hot reload
if (import.meta.hot) {
  import.meta.hot.accept()
}
```

## Testing with Vitest

```typescript
// stores/__tests__/counter.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCounterStore } from '../counter'

describe('Counter Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('increments count', () => {
    const store = useCounterStore()
    expect(store.count).toBe(0)
    store.increment()
    expect(store.count).toBe(1)
  })

  it('doubleCount getter', () => {
    const store = useCounterStore()
    store.count = 5
    expect(store.doubleCount).toBe(10)
  })
})
```

| Testing Step | Code |
|--------------|------|
| **Setup Pinia** | `setActivePinia(createPinia())` ใน `beforeEach` |
| **Create store** | `const store = useXxxStore()` |
| **Assert state** | `expect(store.count).toBe(0)` |
| **Call action** | `store.increment()` แล้ว assert |

## Persistence

### piniaPluginPersistedstate

```typescript
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
```

```typescript
export const useAuthStore = defineStore('auth', {
  state: () => ({ token: '', user: null }),
  persist: {
    key: 'auth',
    storage: localStorage,
    paths: ['token'],
  },
})
```

### Custom Persistence Plugin

```typescript
function persistPlugin({ store }) {
  const saved = localStorage.getItem(store.$id)
  if (saved) store.$patch(JSON.parse(saved))
  store.$subscribe((_, state) => {
    localStorage.setItem(store.$id, JSON.stringify(state))
  })
}
```

## Summary

| Tool | วิธี Integrate |
|------|---------------|
| **Vue Router** | ใช้ store ใน `beforeEach` guard |
| **Nuxt 3** | `modules: ['@pinia/nuxt']` |
| **Vite** | HMR อัตโนมัติ |
| **Vitest** | `setActivePinia(createPinia())` ก่อน test |
| **Persistence** | `piniaPluginPersistedstate` + `persist: true` |

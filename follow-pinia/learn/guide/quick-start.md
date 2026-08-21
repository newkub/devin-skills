# Quick Start

## Purpose

เริ่มต้นใช้งาน Pinia ตั้งแต่ติดตั้งจนถึงสร้าง store แรก

## Scope

- Installation
- Pinia Setup
- First Store
- Using in Component
- Multiple Stores

## Step Overview

| ขั้นตอน | คำอธิบาย | เวลา |
|---------|----------|------|
| **1. Install** | ติดตั้ง Pinia | 1 นาที |
| **2. Setup** | Register Pinia ใน Vue app | 1 นาที |
| **3. Create Store** | สร้าง store แรก | 3 นาที |
| **4. Use in Component** | ใช้งาน store ใน component | 5 นาที |
| **5. Add Store** | สร้าง store เพิ่มเติม | 3 นาที |

## Step 1: Install

```bash
bun add pinia
```

## Step 2: Setup

สร้าง `src/main.ts`:

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
```

## Step 3: Create Store

สร้าง `src/stores/counter.ts`:

```typescript
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  return { count, doubleCount, increment, decrement }
})
```

## Step 4: Use in Component

สร้าง `src/components/Counter.vue`:

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCounterStore } from '@/stores/counter'

const store = useCounterStore()

// ใช้ storeToRefs เพื่อ keep reactivity
const { count, doubleCount } = storeToRefs(store)

// destructuring actions (ไม่เสีย reactivity)
const { increment, decrement } = store
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
  </div>
</template>
```

| Pattern | ใช้เมื่อ | ตัวอย่าง |
|---------|----------|----------|
| `storeToRefs(store)` | อ่าน state/getters แบบ reactive | `const { count } = storeToRefs(store)` |
| `store.action()` | เรียก action | `store.increment()` |
| `store.prop = val` | แก้ state ตรงๆ | `store.count = 0` |

## Step 5: Add Another Store

สร้าง `src/stores/user.ts`:

```typescript
import { defineStore } from 'pinia'

interface User {
  id: number
  name: string
  email: string
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const isLoggedIn = computed(() => !!user.value)

  async function login(email: string, password: string) {
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    user.value = await res.json()
  }

  function logout() {
    user.value = null
  }

  return { user, isLoggedIn, login, logout }
})
```

## Cross-Store Usage

Stores เรียกกันเองได้:

```typescript
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const userStore = useUserStore()

  const itemCount = computed(() => items.value.length)

  async function checkout() {
    if (!userStore.isLoggedIn) {
      throw new Error('Please login first')
    }
    await fetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ items: items.value, userId: userStore.user!.id }),
    })
    items.value = []
  }

  return { items, itemCount, checkout }
})
```

## Project Structure

```text
my-project/
├── src/
│   ├── main.ts              # Register Pinia
│   ├── App.vue
│   ├── components/
│   │   └── Counter.vue      # Use store in component
│   └── stores/
│       ├── counter.ts        # Counter store
│       ├── user.ts           # User store
│       └── cart.ts           # Cart store
├── package.json
└── tsconfig.json
```

## Summary

| ขั้นตอน | Action |
|---------|--------|
| **Install** | `bun add pinia` |
| **Setup** | `app.use(createPinia())` ใน main.ts |
| **Store** | `defineStore('id', () => { ... })` ใน stores/ |
| **Use** | `storeToRefs(store)` สำหรับ state, `store.action()` สำหรับ actions |
| **Cross-store** | เรียก `useOtherStore()` ภายใน store |

# Features

## Purpose

สรุป features ทั้งหมดของ Pinia พร้อมตัวอย่างการใช้งาน

## Scope

- Store Patterns
- State Management
- Getters & Computed
- Actions & Async
- Plugins & Extensibility
- DevTools & HMR

## Feature Overview

| Feature | คำอธิบาย | สถานะ |
|---------|----------|--------|
| **Options Store** | สร้าง store แบบ Options API | Stable |
| **Setup Store** | สร้าง store แบบ Composition API | Stable |
| **TypeScript** | Full type safety + auto inference | Stable |
| **DevTools** | Vue DevTools integration | Stable |
| **Plugins** | ขยายความสามารถ stores | Stable |
| **SSR** | Server-side rendering + Nuxt | Stable |
| **HMR** | Hot Module Replacement | Stable |
| **Composition API** | ใช้ composables ใน store ได้ | Stable |

## Store Patterns

### Options Store

```typescript
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0, name: 'Eduardo' }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    increment() { this.count++ },
  },
})
```

### Setup Store

```typescript
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() { count.value++ }
  return { count, doubleCount, increment }
})
```

| Store Type | State | Getters | Actions |
|------------|-------|---------|---------|
| **Options** | `state: () => ({...})` | `getters: {...}` | `actions: {...}` |
| **Setup** | `ref()` | `computed()` | `function` |

## State Management

```typescript
const store = useCounterStore()

// อ่าน + แก้ไข state
store.count++
store.$patch({ count: 0, name: 'Abalam' })
store.$patch((state) => { state.count++; state.name = 'Eduardo' })

// Subscribe state changes
store.$subscribe((mutation, state) => {
  console.log(mutation.type, state) // 'direct' | 'patch object' | 'patch function'
})

// Reset (Options Store only)
store.$reset()
```

| Method | คำอธิบาย | Use Case |
|--------|----------|----------|
| `store.prop` | อ่าน/เขียนตรงๆ | Simple updates |
| `$patch(obj)` | แก้หลาย props | Batch update |
| `$patch(fn)` | แก้ด้วย function | Complex mutations |
| `$subscribe()` | ติดตาม changes | Logging, persistence |
| `$reset()` | คืนค่าเริ่มต้น | Form reset |
| `$dispose()` | ลบ store | Cleanup |

## Getters

```typescript
export const useStore = defineStore('main', {
  state: () => ({ todos: [] }),
  getters: {
    doneTodos: (state) => state.todos.filter((t) => t.done),
    doneCount(): number { return this.doneTodos.length },
    getTodoById: (state) => (id) => state.todos.find((t) => t.id === id),
  },
})

// ใช้งาน
const store = useStore()
store.doneTodos              // computed value
store.getTodoById(1)         // function call with args
```

## Actions

```typescript
export const useUserStore = defineStore('user', {
  actions: {
    async fetchUser(id) {
      this.loading = true
      const res = await fetch(`/api/users/${id}`)
      this.userData = await res.json()
      this.loading = false
    },
    logout() { this.userData = null },
  },
})

// เรียกจาก component
const store = useUserStore()
await store.fetchUser(1)
```

| Feature | Options Store | Setup Store |
|---------|--------------|-------------|
| **Access state** | `this.state` | `state.value` |
| **Call other action** | `this.action()` | `action()` |
| **Async support** | `async` function | `async` function |

## Plugins

```typescript
const pinia = createPinia()

// Persistence plugin
pinia.use(piniaPluginPersistedstate)

// Custom plugin
pinia.use(({ store, app, pinia, options }) => {
  store.$subscribe((mutation, state) => {
    localStorage.setItem(store.$id, JSON.stringify(state))
  })
  return { $shared: sharedRef }  // add to all stores
})
```

| Plugin | คำอธิบาย |
|--------|----------|
| **piniaPluginPersistedstate** | Auto persist store → localStorage/sessionStorage |
| **pinia-plugin-persist** | Alternative persistence plugin |
| **Custom plugin** | เพิ่ม properties, subscriptions, side effects |

## DevTools & HMR

```typescript
// DevTools — ทำงานอัตโนมัติใน dev mode
// ดู state, mutations, time-travel ใน Vue DevTools

// HMR — Vite/Webpack reload store เมื่อแก้ไขไฟล์
// Vite: import.meta.hot.accept()
// Webpack: module.hot.accept()
```

| Tool | ประโยชน์ |
|------|----------|
| **Vue DevTools** | ดู state, mutations, time-travel, pinia tab |
| **HMR** | Reload store state ไม่หายเมื่อแก้โค้ด |
| **TypeScript** | Full inference ไม่ต้องเขียน type เอง |

## Summary

| Category | Features |
|----------|----------|
| **Store** | Options Store, Setup Store, TypeScript |
| **State** | Direct, $patch, $subscribe, $reset |
| **Getters** | Computed, chained, parameterized |
| **Actions** | Sync, async, composition functions |
| **Extensibility** | Plugins, subscriptions, SSR |
| **Tooling** | DevTools, HMR, TypeScript inference |

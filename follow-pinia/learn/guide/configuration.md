# Configuration

## Purpose

อธิบายการตั้งค่า Pinia และ options ที่เกี่ยวข้อง

## Scope

- createPinia Options
- Store Options
- Plugin Configuration
- Persisted State

## createPinia

`createPinia()` สร้าง Pinia instance สำหรับ Vue app — ไม่มี options parameter

```typescript
import { createPinia } from 'pinia'

const pinia = createPinia()
app.use(pinia)
```

| Property | Type | คำอธิบาย |
|----------|------|----------|
| `state` | `Ref<Record<string, StateTree>>` | Global state ของทุก stores |
| `use(plugin)` | `(plugin) => Pinia` | เพิ่ม Pinia plugin |

## defineStore Options

### Options Store

```typescript
defineStore('storeId', {
  state: () => ({ ... }),
  getters: { ... },
  actions: { ... },
}, { ...storeOptions })
```

### Setup Store

```typescript
defineStore('storeId', () => {
  // Composition API
}, { ...storeOptions })
```

### Store Options (3rd argument)

| Option | Type | Default | คำอธิบาย |
|--------|------|---------|----------|
| `actions` | `object` | - | ใช้แทน actions ใน Options Store |
| `hydrate` | `(storeState) => void` | - | Custom hydration สำหรับ SSR |
| `persist` | `boolean` | `false` | เปิด persistedstate (ต้องมี plugin) |

## Store Internal Properties

ทุก store มี built-in properties:

```typescript
const store = useCounterStore()

store.$id           // 'counter' — unique store id
store.$onAction     // subscribe to actions
store.$patch        // batch update state
store.$reset        // reset state (Options Store)
store.$subscribe    // subscribe to state changes
store.$dispose      // dispose store
```

| Property | คำอธิบาย | ตัวอย่าง |
|----------|----------|----------|
| `$id` | Store unique identifier | `'counter'` |
| `$onAction` | ฟังก่อน/หลัง action ทำงาน | `store.$onAction(({ name, after }) => {...})` |
| `$patch` | แก้ state แบบ batch | `store.$patch({ count: 0 })` |
| `$reset` | Reset state กลับค่าเริ่มต้น | `store.$reset()` |
| `$subscribe` | ติดตาม state mutations | `store.$subscribe((mutation) => {...})` |
| `$dispose` | ลบ store + unsubscribe | `store.$dispose()` |

## Plugin Configuration

### piniaPluginPersistedstate

```bash
bun add pinia-plugin-persistedstate
```

```typescript
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
```

### Per-Store Persist

```typescript
export const useUserStore = defineStore('user', {
  state: () => ({ name: 'Eduardo', token: '' }),
  persist: true,  // persist to localStorage
})

// Advanced persist options
export const useSettingsStore = defineStore('settings', {
  state: () => ({ theme: 'dark', lang: 'en' }),
  persist: {
    key: 'my-settings',
    storage: sessionStorage,
    paths: ['theme'],  // persist only theme
  },
})
```

| Persist Option | Type | Default | คำอธิบาย |
|----------------|------|---------|----------|
| `key` | `string` | store.$id | localStorage key |
| `storage` | `Storage` | `localStorage` | storage type |
| `paths` | `string[]` | all | properties ที่ persist |
| `serializer` | `object` | JSON | custom serializer |
| `beforeRestore` | `function` | - | เรียกก่อน restore |
| `afterRestore` | `function` | - | เรียกหลัง restore |

## SSR Configuration

### Nuxt 3

Pinia ทำงานกับ Nuxt SSR อัตโนมัติเมื่อใช้ `@pinia/nuxt`:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],
})
```

### Custom SSR

```typescript
// server
const pinia = createPinia()
// ...render app...
const state = JSON.stringify(pinia.state.value)
// embed state in HTML

// client
const pinia = createPinia()
pinia.state.value = JSON.parse(window.__PINIA_STATE__)
```

## Summary

| การตั้งค่า | คำอธิบาย |
|------------|----------|
| **createPinia()** | สร้าง instance แล้ว `app.use(pinia)` |
| **defineStore options** | `persist`, `hydrate` ใน 3rd argument |
| **Store $methods** | `$patch`, `$subscribe`, `$onAction`, `$reset`, `$dispose` |
| **Persisted state** | `pinia.use(piniaPluginPersistedstate)` + `persist: true` |
| **SSR** | Auto ใน Nuxt, manual สำหรับ custom SSR |

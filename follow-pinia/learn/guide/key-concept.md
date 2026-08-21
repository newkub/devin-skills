# Key Concept

## Purpose

อธิบาย core concepts สำคัญของ Pinia เพื่อเป็นพื้นฐานในการใช้งาน Vue state management

## Scope

- Store Definition
- State
- Getters
- Actions
- Plugins

## Core Concepts

### 1. Store Definition

Store คือที่เก็บ state ของ application สร้างด้วย `defineStore()`

```typescript
import { defineStore } from 'pinia'

// Options Store
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  },
})

// Setup Store (Composition API style)
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }
  return { count, doubleCount, increment }
})
```

| Store Type | ลักษณะ | เหมาะสำหรับ |
|------------|--------|-------------|
| **Options Store** | ใช้ object `{ state, getters, actions }` | ผู้ที่คุ้นเคย Options API |
| **Setup Store** | ใช้ function + `ref()`, `computed()` | ผู้ที่คุ้นเคย Composition API |

### 2. State

State คือข้อมูล reactive ที่เก็บใน store เข้าถึงผ่าน `store.property`

```typescript
const store = useCounterStore()

// อ่าน state
console.log(store.count) // 0

// แก้ไข state (3 วิธี)
store.count++                          // 1. แก้ไขตรงๆ
store.$patch({ count: 10 })           // 2. ใช้ $patch object
store.$patch((state) => {             // 3. ใช้ $patch function
  state.count += 5
})

// Reset state (เฉพาะ Options Store)
store.$reset()
```

| Method | คำอธิบาย | ข้อดี |
|--------|----------|-------|
| **Direct** | `store.count++` | ง่าย, อ่านง่าย |
| **$patch(obj)** | `store.$patch({ count: 10 })` | แก้หลาย properties พร้อมกัน |
| **$patch(fn)** | `store.$patch((s) => {...})` | ใช้ logic ซับซ้อน, arrays |
| **$reset()** | `store.$reset()` | คืนค่า state เริ่มต้น |

### 3. Getters

Getters คือ computed properties ของ store ใช้คำนวณค่าจาก state

```typescript
export const useStore = defineStore('main', {
  state: () => ({
    todos: [{ text: 'Learn Pinia', done: true }, { text: 'Learn Vue', done: false }],
  }),
  getters: {
    // รับ state เป็น parameter
    doneTodos: (state) => state.todos.filter((t) => t.done),

    // ใช้ getter อื่นผ่าน this
    doneTodosCount(): number {
      return this.doneTodos.length
    },

    // รับ argument (return function)
    getTodoById: (state) => (id: number) => state.todos.find((t) => t.id === id),
  },
})
```

| Pattern | คำอธิบาย | ตัวอย่าง |
|---------|----------|----------|
| **From state** | คำนวณจาก state | `(state) => state.count * 2` |
| **From other getter** | อ้างถึง getter อื่น | `this.doneTodos.length` |
| **With args** | return function รับ argument | `(state) => (id) => state.items.find(...)` |

### 4. Actions

Actions คือ methods ของ store ใช้แก้ไข state หรือทำงาน async

```typescript
export const useUserStore = defineStore('user', {
  state: () => ({
    userData: null,
    loading: false,
  }),
  actions: {
    // Sync action
    setName(name: string) {
      this.userData = { ...this.userData, name }
    },
    // Async action
    async fetchUser(id: number) {
      this.loading = true
      try {
        this.userData = await api.getUser(id)
      } finally {
        this.loading = false
      }
    },
  },
})
```

| ลักษณะ | คำอธิบาย |
|--------|----------|
| **เข้าถึง state** | ใช้ `this.stateProperty` |
| **เรียก action อื่น** | ใช้ `this.otherAction()` |
| **Async support** | รองรับ `async/await` |
| **ไม่มีใน Setup Store** | Setup Store ใช้ function ธรรมดาแทน |

### 5. Plugins

Plugin คือ function ที่ใช้เพิ่มความสามารถให้ store ทุกตัว

```typescript
import { createPinia } from 'pinia'

// Plugin เพิ่ม property $isLogin ให้ทุก store
const pinia = createPinia()

pinia.use(({ store }) => {
  store.$isLogin = ref(false)
})

// Plugin subscription (logging)
pinia.use(({ store }) => {
  store.$subscribe((mutation, state) => {
    console.log(`[${store.$id}]`, mutation.type, state)
  })
})
```

| Plugin Context | คำอธิบาย |
|----------------|----------|
| **store** | Store instance ปัจจุบัน |
| **app** | Vue app instance |
| **pinia** | Pinia instance |
| **options** | Options ที่ส่งเข้า defineStore |

## Summary

| Concept | ความสำคัญ | ระดับ |
|---------|-----------|-------|
| **Store Definition** | สร้าง store ด้วย Options หรือ Setup | พื้นฐาน |
| **State** | ข้อมูล reactive ของ store | พื้นฐาน |
| **Getters** | คำนวณค่าจาก state (computed) | พื้นฐาน |
| **Actions** | Methods สำหรับแก้ไข state | พื้นฐาน |
| **Plugins** | ขยายความสามารถของ store | ปานกลาง |

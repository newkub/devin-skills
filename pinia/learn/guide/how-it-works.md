# How It Works

## Purpose

อธิบายการทำงานภายในของ Pinia ตั้งแต่การสร้าง store ไปจนถึงการอัปเดต state และ reactivity

## Scope

- Store Initialization
- Reactivity System
- State Updates
- Subscription Mechanism
- Plugin Pipeline

## Store Initialization

### defineStore() Flow

```
defineStore(id, options/setup)
         |
         v
[Store Definition Created]
         |
         v
[First useStore() Call]
         |
         v
[Lazy Initialization]
         |
         +---> state() -> reactive() -> Proxy
         |
         +---> Setup function execution
         |
         +---> Plugin execution
         |
         v
[Store Instance Cached]
```

| ขั้นตอน | คำอธิบาย |
|---------|----------|
| **Definition** | `defineStore()` สร้าง store definition (ไม่สร้าง instance) |
| **Lazy Init** | Store instance สร้างเมื่อเรียก `useStore()` ครั้งแรกเท่านั้น |
| **State Reactive** | State ถูก wrap ด้วย `reactive()` → Proxy |
| **Plugin Exec** | Plugins ทำงานก่อนคืน instance |
| **Cache** | Instance ถูก cache ใน Pinia instance |

### Options Store vs Setup Store

```
Options Store Flow:
defineStore('id', { state, getters, actions })
    |
    v
state() -> reactive() -> Proxy
getters -> computed() -> attach to store
actions -> bind(this) -> attach to store
    |
    v
Return store instance with $reset()

Setup Store Flow:
defineStore('id', () => {
  const count = ref(0)
  const double = computed(() => count * 2)
  function inc() { count++ }
  return { count, double, inc }
})
    |
    v
Execute setup function
    |
    v
Extract refs/computed/functions
    |
    v
Wrap with reactive()
    |
    v
Return store instance (no $reset)
```

| ลักษณะ | Options Store | Setup Store |
|--------|--------------|-------------|
| **State** | `state()` → `reactive()` | `ref()` จาก setup |
| **Getters** | `computed()` แล้ว attach | `computed()` จาก setup |
| **Actions** | Bind `this` แล้ว attach | Function จาก setup |
| **$reset** | ✅ มี | ❌ ไม่มี |

## Reactivity System

### Vue 3 Reactivity Integration

```
Component reads store.count
         |
         v
Vue tracks dependency (store.count)
         |
         v
store.count++ (mutation)
         |
         v
Proxy setter triggered
         |
         v
Vue notifies all dependents
         |
         v
Components re-render
```

| Phase | Mechanism |
|-------|-----------|
| **Track** | Vue record ทุก reactive property ที่ component อ่าน |
| **Mutate** | Proxy setter ถูกเรียกเมื่อ property เปลี่ยน |
| **Notify** | Vue ส่ง notification ไปยังทุก dependent |
| **Re-render** | Component ที่มี dependency จะ re-render |

### storeToRefs() Pattern

```typescript
const store = useCounterStore()

// ❌ ไม่ใช้ storeToRefs - ไม่ reactive
const { count } = store

// ✅ ใช้ storeToRefs - reactive
const { count } = storeToRefs(store)
```

```
storeToRefs(store)
    |
    v
Extract all state/getters
    |
    v
Convert to refs with .value
    |
    v
Preserve reactivity link to store
```

| ลักษณะ | คำอธิบาย |
|--------|----------|
| **Direct destructuring** | สูญเสีย reactivity (copy by value) |
| **storeToRefs()** | รักษา reactivity (link to store) |
| **Actions** | ไม่ต้องใช้ storeToRefs (methods ไม่ reactive) |

## State Updates

### Three Update Methods

```
Method 1: Direct Mutation
store.count++
    |
    v
Proxy setter triggered
    |
    v
Vue notified

Method 2: $patch Object
store.$patch({ count: 10 })
    |
    v
Merge object into state
    |
    v
Proxy setters triggered
    |
    v
Vue notified

Method 3: $patch Function
store.$patch((state) => {
  state.count += 5
  state.items.push(newItem)
})
    |
    v
Execute function with state
    |
    v
Mutations batched
    |
    v
Vue notified once
```

| Method | Use Case | Performance |
|--------|----------|-------------|
| **Direct** | Simple mutation | 1 notification |
| **$patch(obj)** | Multiple properties | 1 notification |
| **$patch(fn)** | Complex logic, arrays | 1 notification |

### $reset() Mechanism (Options Store Only)

```
store.$reset()
    |
    v
Retrieve initial state from state()
    |
    v
Replace current state with initial
    |
    v
Vue notified
```

| ลักษณะ | คำอธิบาย |
|--------|----------|
| **Initial state** | เก็บไว้จากการเรียก `state()` ครั้งแรก |
| **Replacement** | ไม่ใช้ merge แต่ replace ทั้งหมด |
| **Setup Store** | ไม่รองรับ (ใช้ manual reset แทน) |

## Subscription Mechanism

### $subscribe() Flow

```
store.$subscribe((mutation, state) => {
  console.log(mutation, state)
})
    |
    v
Register callback
    |
    v
[State mutation occurs]
    |
    v
Mutation object created
    |
    v
Callback invoked with mutation + state
```

| Mutation Properties | คำอธิบาย |
|---------------------|----------|
| **storeId** | ID ของ store |
| **type** | 'direct' | 'patch object' | 'patch function' |
| **payload** | Data ที่ใช้ patch (ถ้ามี) |
| **events** | List ของ mutations (ถ้า patch function) |

### $onAction() Flow

```
store.$onAction(({ name, args, after, onError }) => {
  console.log(`Action: ${name}`, args)
  after((result) => {
    console.log('Result:', result)
  })
  onError((error) => {
    console.error('Error:', error)
  })
})
    |
    v
Register action callback
    |
    v
[Action called]
    |
    v
Callback invoked with context
    |
    v
after() called on success
    |
    v
onError() called on failure
```

| Context Properties | คำอธิบาย |
|--------------------|----------|
| **name** | Action name |
| **args** | Arguments ที่ส่งเข้า action |
| **store** | Store instance |
| **after** | Callback หลัง action สำเร็จ |
| **onError** | Callback หาก action ล้มเหลว |

## Plugin Pipeline

### Plugin Registration & Execution

```
createPinia()
    |
    v
pinia.use(plugin1)
pinia.use(plugin2)
pinia.use(plugin3)
    |
    v
[useStore() called]
    |
    v
Store instance created
    |
    v
plugin1({ store, app, pinia, options })
    |
    v
plugin2({ store, app, pinia, options })
    |
    v
plugin3({ store, app, pinia, options })
    |
    v
Return store instance
```

| Plugin Context | คำอธิบาย |
|----------------|----------|
| **store** | Store instance ที่กำลังสร้าง |
| **app** | Vue app instance |
| **pinia** | Pinia instance |
| **options** | Options ที่ส่งเข้า `defineStore()` |

### Plugin Return Value

```typescript
pinia.use(({ store }) => {
  // Add property to store
  return {
    $custom: ref('value'),
    $method() { /* ... */ }
  }
})
```

| Return Type | คำอธิบาย |
|-------------|----------|
| **Object** | Merge เข้า store (add properties/methods) |
| **undefined** | ไม่เพิ่มอะไร (ใช้สำหรับ side effects เช่น logging) |

## Lifecycle Summary

```
1. App Setup
   createPinia() -> app.use(pinia)

2. Store Definition
   defineStore(id, options/setup)

3. First Usage
   useStore() -> lazy init

4. Store Created
   state reactive -> plugins -> cache

5. Component Mount
   read state -> track dependencies

6. State Mutation
   proxy setter -> notify -> re-render

7. Component Unmount
   auto unsubscribe (unless { detached: true })

8. App Unmount
   dispose all stores
```

| Phase | สิ่งที่เกิดขึ้น |
|-------|---------------|
| **Setup** | Pinia instance ถูกสร้างและติดตั้ง |
| **Definition** | Store definition ถูก register |
| **First Use** | Store instance ถูกสร้าง (lazy) |
| **Mount** | Component เริ่ม track dependencies |
| **Mutation** | State เปลี่ยน → component re-render |
| **Unmount** | Component หยุด track (auto cleanup) |
| **Dispose** | All stores ถูก dispose เมื่อ app unmount |

## Summary

| Mechanism | ความสำคัญ |
|-----------|-----------|
| **Lazy Init** | Store สร้างเมื่อต้องการเท่านั้น (performance) |
| **Reactive Proxy** | Auto track + trigger ไม่ต้องเขียน boilerplate |
| **storeToRefs()** | รักษา reactivity เมื่อ destructuring |
| **$patch()** | Batch mutations → single notification |
| **Subscriptions** | Monitor state/action changes สำหรับ logging/persistence |
| **Plugin Pipeline** | Extensible architecture ไม่แก้ core |

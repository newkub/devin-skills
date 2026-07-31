# Best Practices

## Purpose

แนะนำ best practices สำหรับการใช้งาน Pinia ให้มีประสิทธิภาพและ maintainable

## Scope

- Store Design
- State Management
- Component Usage
- Performance

## Store Design

### ตั้งชื่อ Store ด้วย `use` Prefix

```typescript
// ✅ Good
export const useUserStore = defineStore('user', { ... })
export const useCartStore = defineStore('cart', { ... })

// ❌ Bad
export const UserStore = defineStore('user', { ... })
export const cart = defineStore('cart', { ... })
```

### แยก Store ตาม Domain

```typescript
// ✅ Good — แยกตามหน้าที่
stores/user.ts       // authentication, profile
stores/cart.ts       // shopping cart
stores/product.ts    // product catalog

// ❌ Bad — รวมทุกอย่างใน store เดียว
stores/app.ts        // user, cart, products, settings...
```

### ใช้ Setup Store สำหรับ Complex Logic

```typescript
// ✅ Good — Setup Store สำหรับ complex logic
export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = computed(() => decodeToken(token.value))
  async function login() { ... }
  return { token, user, login }
})

// ✅ Good — Options Store สำหรับ simple state
export const useThemeStore = defineStore('theme', {
  state: () => ({ mode: 'light' }),
  actions: {
    toggle() { this.mode = this.mode === 'light' ? 'dark' : 'light' },
  },
})
```

| หลักการ | คำอธิบาย |
|---------|----------|
| **`use` prefix** | ใช้ `useXxxStore` เสมอ |
| **Single responsibility** | หนึ่ง store = หนึ่ง domain |
| **Unique ID** | store ID ต้อง unique ทั้ง app |
| **Setup vs Options** | Setup สำหรับ complex, Options สำหรับ simple |

## State Management

### ใช้ $patch สำหรับ Multiple Updates

```typescript
// ✅ Good — $patch batch update (1 notification)
store.$patch({
  name: 'Eduardo',
  email: 'ed@test.com',
  age: 25,
})

// ❌ Bad — many direct mutations (3 notifications)
store.name = 'Eduardo'
store.email = 'ed@test.com'
store.age = 25
```

### อย่า Mutate State นอก Store

```typescript
// ✅ Good — แก้ไขผ่าน action
const store = useCartStore()
await store.addItem(product)

// ❌ Bad — แก้ state ตรงๆ จาก component
store.items.push(product)  // ไม่ควรมี business logic ใน component
```

### ใช้ storeToRefs ใน Component

```typescript
// ✅ Good — keep reactivity
const { count, doubleCount } = storeToRefs(store)

// ❌ Bad — lose reactivity เมื่อ destructuring
const { count, doubleCount } = store  // reactive หาย!
```

| หลักการ | คำอธิบาย |
|---------|----------|
| **$patch** | ใช้ batch update เพื่อลด notifications |
| **Actions** | ใส่ logic ใน action ไม่ใช่ component |
| **storeToRefs** | destructuring state/getters ด้วย `storeToRefs()` |
| **Immutable reads** | อ่าน state เท่านั้นใน template, ไม่แก้ไข |

## Performance

### Lazy Load Stores

```typescript
// ✅ Good — store สร้างเมื่อเรียกใช้Store() ครั้งแรก
// ไม่ต้องกังวลเรื่อง import unused stores

// ใช้ dynamic import สำหรับ route-level stores
const loadCartStore = async () => {
  const { useCartStore } = await import('./stores/cart')
  return useCartStore()
}
```

### Limit Subscriptions

```typescript
// ✅ Good — subscribe เฉพาะที่ต้องการ
store.$subscribe((mutation, state) => {
  if (mutation.storeId === 'auth') {
    persistToStorage(state)
  }
}, { detached: true })  // detached = survive component unmount

// ❌ Bad — subscribe ทุก store ทุก component
store.$subscribe((mutation, state) => {
  console.log(state)  // log ทุกอย่าง = performance hit
})
```

### Computed over Watchers

```typescript
// ✅ Good — ใช้ getter (computed) แทน watcher
export const useStore = defineStore('store', {
  state: () => ({ items: [] }),
  getters: {
    totalPrice: (state) => state.items.reduce((sum, i) => sum + i.price, 0),
  },
})

// ❌ Bad — watch state แล้วคำนวณใหม่
watch(() => store.items, (items) => {
  totalPrice.value = items.reduce(...)
})
```

## TypeScript

### Type State ด้วย Interface

```typescript
interface UserState {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    id: 0,
    name: '',
    email: '',
    role: 'user',
  }),
})
```

### Type Actions Parameters

```typescript
export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  function addItem(item: CartItem): void {
    items.value.push(item)
  }

  async function checkout(payment: PaymentInfo): Promise<OrderResult> {
    return await api.checkout(payment)
  }

  return { items, addItem, checkout }
})
```

## Common Pitfalls

| Pitfall | วิธีแก้ |
|---------|---------|
| **Destructure lose reactivity** | ใช้ `storeToRefs(store)` |
| **Mutations outside actions** | ใส่ logic ใน action เสมอ |
| **One giant store** | แยก store ตาม domain |
| **No persist strategy** | ใช้ `piniaPluginPersistedstate` สำหรับ auth/settings |
| **Store in store creates cycle** | เรียก store อื่นภายใน function ไม่ใช่ top-level |

## Summary

| Category | Best Practice |
|----------|--------------|
| **Naming** | `useXxxStore`, unique IDs |
| **Structure** | แยก store ตาม domain, single responsibility |
| **State** | `$patch` batch, actions encapsulate logic |
| **Component** | `storeToRefs()` สำหรับ reactivity |
| **Performance** | Getters > watchers, limit subscriptions |
| **TypeScript** | Type state interface, type action params |

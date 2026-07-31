# API

Pinia public API reference.

## Functions

| Function | Description |
|----------|-------------|
| `createPinia()` | Create Pinia instance |
| `defineStore(id, options)` | Define Options Store |
| `defineStore(id, setupFn)` | Define Setup Store |
| `storeToRefs(store)` | Convert store to refs |
| `setActivePinia(pinia)` | Set active Pinia for testing |

## createPinia

Create Pinia instance to be installed in Vue app.

```typescript
const pinia = createPinia()
app.use(pinia)
```

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `state` | `Ref<Record<string, StateTree>>` | Global state of all stores |
| `use(plugin)` | `(plugin) => Pinia` | Add plugin to Pinia |

## defineStore

Define a new store.

### Options Store

```typescript
defineStore('counter', {
  state: () => ({ count: 0 }),
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
defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() { count.value++ }
  return { count, doubleCount, increment }
})
```

### With TypeScript

```typescript
interface CounterState {
  count: number
}

defineStore('counter', {
  state: (): CounterState => ({ count: 0 }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    increment() { this.count++ },
  },
})
```

## Store Instance

Properties and methods available on store instances.

### State Access

| Property | Type | Description |
|----------|------|-------------|
| `$id` | `string` | Unique store identifier |
| `$state` | `StateTree` | Raw state object |

### State Methods

| Method | Description |
|--------|-------------|
| `$patch(state)` | Batch update state with object |
| `$patch(fn)` | Batch update state with function |
| `$reset()` | Reset state to initial values |

### Subscription Methods

| Method | Description |
|--------|-------------|
| `$subscribe(fn, options?)` | Subscribe to state changes |
| `$onAction(fn)` | Subscribe to action calls |

### Lifecycle Methods

| Method | Description |
|--------|-------------|
| `$dispose()` | Dispose store and cleanup subscriptions |

## storeToRefs

Convert store to refs to keep reactivity when destructuring.

```typescript
const store = useCounterStore()

// ❌ Wrong - loses reactivity
const { count, doubleCount } = store

// ✅ Correct - keeps reactivity
const { count, doubleCount } = storeToRefs(store)
```

### Type Signature

```typescript
function storeToRefs<T>(store: T): ToRefs<StoreOrientation<T>>
```

## Plugins

### Plugin Context

```typescript
interface PiniaPluginContext {
  store: Store
  app: App
  pinia: Pinia
  options: DefineStoreOptions
}
```

### Plugin Function

```typescript
function myPlugin(context: PiniaPluginContext) {
  // Add properties to all stores
  return { $myPlugin: true }
}

// Register plugin
pinia.use(myPlugin)
```

## TypeScript Utilities

| Utility | Description |
|---------|-------------|
| `DefineStoreOptionsBase` | Base options for store |
| `StoreDefinition` | Store returned by defineStore |
| `StoreGeneric` | Generic store type |
| `SubscriptionCallback` | Callback type for subscriptions |

## Testing Utilities

| Function | Description |
|----------|-------------|
| `setActivePinia(pinia)` | Set active Pinia for current test |
| `createPinia()` | Create test Pinia instance |

```typescript
import { setActivePinia, createPinia } from 'pinia'

beforeEach(() => {
  setActivePinia(createPinia())
})
```
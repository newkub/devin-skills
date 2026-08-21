# Configuration

Pinia configuration options and store options.

## createPinia

```typescript
import { createPinia } from 'pinia'

const pinia = createPinia()
app.use(pinia)
```

`createPinia()` does not accept options — configuration is done through plugins.

## Store Options

### Options Store

```typescript
defineStore('counter', {
  // State: function returning initial state
  state: () => ({ count: 0 }),

  // Getters: computed properties
  getters: {
    doubleCount: (state) => state.count * 2,
  },

  // Actions: methods (sync or async)
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

  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
```

### Third Argument Options

```typescript
defineStore('counter', () => { ... }, {
  // Custom actions object
  actions: { /* ... */ },

  // SSR hydration
  hydrate(crossStoreState, initialState) {
    // custom hydration logic
  },

  // Persisted state (requires plugin)
  persist: true,
  persist: {
    key: 'my-key',
    storage: localStorage,
    paths: ['count'],
  },
})
```

## Plugin Configuration

### pinia-plugin-persistedstate

```bash
bun add pinia-plugin-persistedstate
```

```typescript
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
```

### Persist Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `key` | `string` | `store.$id` | localStorage key |
| `storage` | `Storage` | `localStorage` | Storage type |
| `paths` | `string[]` | all state | Properties to persist |
| `serializer` | `object` | `JSON` | Custom serialization |
| `beforeRestore` | `function` | - | Callback before restore |
| `afterRestore` | `function` | - | Callback after restore |

## Environment Variables

```env
# .env
VITE_API_URL=http://localhost:3000
```

```typescript
// store using env
export const useStore = defineStore('main', {
  state: () => ({
    apiUrl: import.meta.env.VITE_API_URL,
  }),
})
```

## Vue Configuration

### vite.config.ts

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
```

## TypeScript Configuration

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "lib": ["ES2020", "DOM", "DOM.Iterable"]
  }
}
```

## Nuxt Configuration

### nuxt.config.ts

```typescript
export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],
  pinia: {
    autoImports: ['defineStore', 'storeToRefs'],
  },
})
```

## Store Instance Properties

| Property | Type | Description |
|----------|------|-------------|
| `$id` | `string` | Store identifier |
| `$state` | `StateTree` | Raw state |
| `$patch` | `function` | Batch state update |
| `$subscribe` | `function` | State subscription |
| `$onAction` | `function` | Action subscription |
| `$reset` | `function` | Reset state (Options only) |
| `$dispose` | `function` | Dispose store |

## Subscription Options

```typescript
store.$subscribe((mutation, state) => {
  console.log(mutation.type)
}, {
  detached: false,  // unsubscribe on component unmount
  patch: { deep: true },  // watch nested changes
})
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `detached` | `boolean` | `false` | Keep subscription after unmount |
| `patch` | `object` | - | Shallow or deep watching |
# Vue.js 3.5+ Reference

## Version Info

- `vue`: `3.5.42` (latest stable, Aug 2026)
- `vue`: `3.6.0-rc.6` (latest RC, Vapor Mode feature-complete)
- License: MIT
- Vue 3.6 RC: Vapor Mode stabilization, improved hydration, tree-shaking
- Source: https://vuejs.org

## Installation

```bash
bun add vue
```

## TypeScript Configuration

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "vue",
    "moduleResolution": "Bundler",
    "module": "ESNext",
    "target": "ES2022",
    "strict": true,
    "skipLibCheck": true
  }
}
```

## Component Standards

### Script Setup With TypeScript

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  title: string
  count?: number
}

const props = withDefaults(defineProps<Props>(), { count: 0 })
const emit = defineEmits<{
  update: [value: number]
}>()

const doubled = computed(() => props.count * 2)

function increment() {
  emit('update', props.count + 1)
}
</script>

<template>
  <button @click="increment">{{ props.title }}: {{ doubled }}</button>
</template>
```

### Compiler Macros (Vue 3.5+)

| Macro | Description |
|-------|-------------|
| `defineProps<T>()` | Type-safe props |
| `defineEmits<T>()` | Type-safe events |
| `defineModel<T>()` | Two-way binding (3.4+) |
| `defineSlots<T>()` | Type-safe slots |
| `defineExpose({})` | Explicit public API |
| `defineOptions({})` | Component options in `<script setup>` |
| `useTemplateRef()` | Template ref management (3.5+) |
| `useId()` | SSR-safe ID generation (3.5+) |

## Reactivity

```ts
import { ref, reactive, computed, shallowRef, watch } from 'vue'

// Primitive values
const count = ref(0)
count.value++

// Object state with deep reactivity
const state = reactive({ name: 'Vue', version: 3.5 })

// Derived values
const double = computed(() => count.value * 2)

// Large immutable data — use shallowRef for memory efficiency
const bigList = shallowRef<number[]>([])
bigList.value = Array.from({ length: 10000 }, (_, i) => i)

// Explicit dependency watch
watch(count, (newVal, oldVal) => {
  console.log(`count: ${oldVal} -> ${newVal}`)
})
```

### Reactivity Utilities

| Utility | Description |
|---------|-------------|
| `ref()` | Primitive values |
| `reactive()` | Object state with deep reactivity |
| `shallowRef()` | Large immutable data (memory efficient) |
| `computed()` | Derived values |
| `watch()` | Explicit dependency side effects |
| `watchEffect()` | Auto dependency tracking |
| `toValue()` | Unwrap MaybeRefOrGetter |
| `effectScope()` | Manual effect management |
| `onScopeDispose()` | Cleanup logic in composables |
| `onWatcherCleanup()` | Cleanup in watchers (3.5+) |
| `onEffectCleanup()` | Cleanup in effects (3.5+) |

## Composable Pattern

```ts
import { ref, onScopeDispose, type Ref } from 'vue'

export function useCounter(initial = 0): { count: Ref<number>; increment: () => void } {
  const count = ref(initial)

  function increment() {
    count.value++
  }

  onScopeDispose(() => {
    console.log('counter scope disposed')
  })

  return { count, increment }
}
```

## DefineModel Two-Way Binding

```vue
<!-- Parent: <ChildInput v-model="value" /> -->
<script setup lang="ts">
const model = defineModel<string>({ required: true })
</script>

<template>
  <input v-model="model" />
</template>
```

## Vapor Mode (Vue 3.6+)

Vapor Mode is a new compilation mode that eliminates Virtual DOM overhead.

- 100% opt-in via `vapor` attribute or `.vapor.vue` file extension
- Supports Composition API only (not Options API)
- Mixed trees work: vdom parent can render Vapor children
- Start from leaf components (list items, table rows, icon buttons)
- `Suspense` not yet supported in Vapor-only mode
- `createVaporApp()` for Vapor-only apps
- `vaporInteropPlugin` for mixing Vapor and VDOM components

## Vue 3.5+ Features

- Reactive props destructuring (built-in, no `toRefs` needed)
- `useTemplateRef()` for template ref management
- `useId()` for SSR-safe ID generation
- `onWatcherCleanup()` for cleanup callbacks in watchers
- `onEffectCleanup()` for cleanup in effects
- `deferredComputed()` for performance optimization
- Watch with numeric `deep` option for control watch depth
- Lazy hydration strategies for async components SSR
- `data-allow-mismatch` attribute to suppress hydration mismatch warnings
- `useHost()`/`useShadowRoot()` for custom elements
- Deferred Teleport with `defer` prop
- Reactivity system optimizations: -56% memory usage, 10x faster array tracking

## Source Links

- Vue.js Official Docs: https://vuejs.org/
- Vue.js API Reference: https://vuejs.org/api/
- Vue Router Docs: https://router.vuejs.org/
- Pinia Docs: https://pinia.vuejs.org/
- Vue 3.5 Release Notes: https://blog.vuejs.org/posts/vue-3-5
- Vapor Mode RFC: https://github.com/vuejs/core/pull/10650
- VueUse Composables: https://vueuse.org/
- Vue 3.6 RC Release: https://github.com/vuejs/core/releases/tag/v3.6.0-rc.6

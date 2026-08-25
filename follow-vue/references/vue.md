---
name: vue-overview
description: "แนวทางการพัฒนา Vue.js 3.5+ ตาม best practices สำหรับ Composition API และ Vapor Mode"
---
## Goal

ใช้ Vue.js 3.5+ สร้าง web applications ด้วย Composition API, reactive system, component-based architecture และ Vapor Mode (3.6 beta) สำหรับ performance optimization


## Scope

ใช้สำหรับสร้าง UI และ web applications ด้วย Vue.js 3.5+ framework รวมถึง Vapor Mode (3.6 beta) สำหรับ performance optimization และ reduced bundle size


## Execute

### 1. Installation

ติดตั้ง Vue.js ด้วย `bun add vue`

### 2. Setup

อ่าน `guide/installation.md` สำหรับการติดตั้งและ setup

### 3. Quick Start

อ่าน `guide/quick-start.md` สำหรับเริ่มต้นใช้งาน

### 4. Learn Key Concepts

อ่าน `key-concepts/reactivity.md` สำหรับ reactivity system (3.5 optimizations)
อ่าน `key-concepts/composition-api.md` สำหรับ Composition API
อ่าน `key-concepts/components.md` สำหรับ component system
อ่าน `key-concepts/vapor-mode.md` สำหรับ Vapor Mode (Vue 3.6 beta)
อ่าน `key-concepts/compiler-macros.md` สำหรับ defineModel, defineSlots, useTemplateRef, useId

### 5. Understand Best Practices

อ่าน `principles/composables.md` สำหรับ composables patterns
อ่าน `principles/performance.md` สำหรับ performance optimization
อ่าน `principles/typescript.md` สำหรับ TypeScript integration
อ่าน `principles/vapor-mode.md` สำหรับ Vapor Mode best practices

### 6. Configuration

อ่าน `guide/configuration.md` สำหรับการตั้งค่า
อ่าน `references/configuration.md` สำหรับ configuration reference

### 7. Features

อ่าน `guide/features.md` สำหรับ features ที่มี

### 8. State Management

ใช้ Pinia สำหรับ state management
อ่าน `principles/state-management.md` สำหรับ patterns

### 9. Integration

อ่าน `guide/integration.md` สำหรับ framework integration

### 10. Architecture

อ่าน `guide/architecture.md` สำหรับ system architecture

### 11. Workflows

ใช้ workflows สำหรับ tasks เฉพาะ:
- `workflows/setup-project.md` สำหรับ setup project
- `workflows/create-component.md` สำหรับสร้าง component
- `workflows/review-performance.md` สำหรับ performance optimization


## Rules

- ใช้ `bun add vue` สำหรับ installation
- ใช้ Composition API เป็นหลัก ด้วย `<script setup>`
- ใช้ `ref()` สำหรับ primitive values, `reactive()` สำหรับ objects
- ใช้ `computed()` สำหรับ derived state (prefer over watch when deriving values)
- ใช้ `watch()` และ `watchEffect()` สำหรับ side effects
- ใช้ composables สำหรับ reusable logic (prefix `use`)
- ใช้ `defineModel()` (3.4+) สำหรับ v-model implementation (canonical way)
- ใช้ Pinia สำหรับ global state management
- ใช้ TypeScript สำหรับ type safety
- ใช้ `<script setup lang="ts">` สำหรับ TypeScript components
- ใช้ VueUse composables เมื่อเหมาะสม
- ใช้ `shallowRef()`/`shallowReactive()` สำหรับ performance optimization เมื่อจำเป็น
- ใช้ `toValue()` สำหรับ unwrapping MaybeRefOrGetter
- ใช้ `onScopeDispose()` สำหรับ cleanup logic in composables
- ใช้ SSR-safe patterns สำหรับ server-side rendering
- ใช้ Vapor Mode (3.6 beta) สำหรับ performance optimization (opt-in via `vapor` attribute)
- ใช้ reactive props destructuring (built-in in Vue 3.5+, no toRefs needed)
- ใช้ `defineSlots<>()` สำหรับ explicit slot type checking
- ใช้ `useTemplateRef()` (3.5+) สำหรับ template ref management (supports dynamic ref bindings)
- ใช้ `useId()` (3.5+) สำหรับ SSR-safe ID generation
- ใช้ `onWatcherCleanup()` (3.5+) สำหรับ cleanup callbacks in watchers
- ใช้ `onEffectCleanup()` (3.5+) สำหรับ cleanup in effects
- ใช้ `deferredComputed()` สำหรับ performance optimization
- ใช้ `watchSyncEffect()` สำหรับ synchronous side effects
- ใช้ `defineExpose({})` สำหรับ explicit public API (expose nothing by default)
- ใช้ `defineOptions({})` สำหรับ component options inside `<script setup>`
- ใช้ `toRefs()`/`toRef()` เฉพาะเมื่อ destructure reactive objects (ไม่ใช่ props)
- ใช้ `readonly()` สำหรับ handing out read-only refs
- ใช้ `markRaw()`/`toRaw()` สำหรับ opt-out reactivity
- ใช้ `effectScope()` สำหรับ manual effect management
- ใช้ `watch()` ด้วย numeric `deep` option (3.5+) สำหรับ control watch depth
- ใช้ lazy hydration strategies (3.5+) สำหรับ async components SSR
- ใช้ `data-allow-mismatch` attribute (3.5+) สำหรับ suppress hydration mismatch warnings
- ใช้ `useHost()`/`useShadowRoot()` (3.5+) สำหรับ custom elements
- ใช้ deferred Teleport (3.5+) ด้วย `defer` prop
- ใช้ `createVaporApp()` (3.6 beta) สำหรับ Vapor-only apps
- ใช้ `vaporInteropPlugin` (3.6 beta) สำหรับ mixing Vapor and VDOM components


## API Examples

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

### Composition API Reactivity

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

### Composable Pattern

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

### DefineModel Two-Way Binding

```vue
<!-- Parent: <ChildInput v-model="value" /> -->
<script setup lang="ts">
const model = defineModel<string>({ required: true })
</script>

<template>
  <input v-model="model" />
</template>
```

## Source Links

- Vue.js Official Docs: https://vuejs.org/
- Vue.js API Reference: https://vuejs.org/api/
- Vue Router Docs: https://router.vuejs.org/
- Pinia Docs: https://pinia.vuejs.org/
- Vue 3.5 Release Notes: https://blog.vuejs.org/posts/vue-3-5
- Vapor Mode RFC: https://github.com/vuejs/core/pull/10650
- VueUse Composables: https://vueuse.org/

## Expected Outcome

- Web applications ที่ reactive และ performant
- Components ที่ reusable และ maintainable ด้วย composables
- State management ที่ clean ด้วย Pinia
- Type-safe code ด้วย TypeScript integration
- Performance optimization ที่เหมาะสม
- Vapor Mode integration (3.6 beta) สำหรับ performance และ reduced bundle size
- Modern compiler macros (defineModel, defineSlots, useTemplateRef, useId)
- Reactive props destructuring ที่ built-in (3.5+)
- Reactivity system optimizations (3.5+): -56% memory usage, 10x faster array tracking
- SSR improvements: lazy hydration, useId(), data-allow-mismatch
- Custom elements enhancements: useHost(), useShadowRoot()
- Deferred Teleport support (3.5+)
- Watcher cleanup with onWatcherCleanup() (3.5+)

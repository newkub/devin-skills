# Compiler Macros

Compiler macros เป็น compile-time helpers ที่ Vue ใช้ใน `<script setup>` เพื่อลด boilerplate code และ improve type inference

## defineModel (Vue 3.4+)

Canonical way สำหรับ implement `v-model` บน custom components

```vue
<script setup lang="ts">
// Basic usage
const modelValue = defineModel<string>()

// With name
const count = defineModel<number>('count')

// With options
const title = defineModel<string>('title', { required: true })

// With modifiers
const text = defineModel<string>('text', {
  set(value) {
    return value.toUpperCase()
  }
})
</script>

<template>
  <input v-model="modelValue" />
  <input v-model="count" type="number" />
</template>
```

**Benefits:**
- ลด boilerplate (ไม่ต้อง declare props และ emits)
- Auto-generates `modelValue` prop และ `update:modelValue` event
- Supports multiple v-model bindings
- Supports modifiers and transformers

## defineSlots

Explicit slot type checking สำหรับ better DX และ type safety

```vue
<script setup lang="ts">
defineSlots<{
  default: (props: { item: string }) => any
  header: (props: { title: string }) => any
  footer?: () => any  // Optional slot
}>()
</script>

<template>
  <slot name="header" title="Default Title" />
  <slot :item="data" />
  <slot name="footer" />
</template>
```

**Benefits:**
- Explicit slot contracts
- Better IDE autocomplete
- Type-safe slot props
- Documentation for component API

## useTemplateRef (Vue 3.5+)

Type-safe template ref management

```vue
<script setup lang="ts">
import { useTemplateRef, onMounted } from 'vue'

const inputRef = useTemplateRef<HTMLInputElement>('input')

onMounted(() => {
  inputRef.value?.focus()
})
</script>

<template>
  <input ref="input" />
</template>
```

**Benefits:**
- Type-safe refs (no need for `ref<HTMLInputElement | null>(null)`)
- Cleaner syntax
- Better inference

## useId (Vue 3.5+)

SSR-safe ID generation

```vue
<script setup lang="ts">
import { useId } from 'vue'

const id = useId()
</script>

<template>
  <label :for="id">Label</label>
  <input :id="id" />
</template>
```

**Benefits:**
- SSR-safe (generates consistent IDs on server and client)
- No hydration mismatches
- Configurable via `app.config.idPrefix`

## onWatcherCleanup (Vue 3.5+)

Cleanup callbacks in watchers

```vue
<script setup lang="ts">
import { watch, onWatcherCleanup } from 'vue'

const id = ref(1)

watch(id, (newId) => {
  const controller = new AbortController()
  fetch(`/api/${newId}`, { signal: controller.signal })
    .then(() => {
      // callback logic
    })

  onWatcherCleanup(() => {
    // abort stale request
    controller.abort()
  })
})
</script>
```

**Benefits:**
- Cleanup stale async operations
- Prevent memory leaks
- Better than manual cleanup in onUnmounted

## defineExpose

Explicit public API for components

```vue
<script setup lang="ts">
const internalState = ref(0)

const publicMethod = () => {
  console.log('Called from parent')
}

defineExpose({
  publicMethod,
  // internalState is NOT exposed
})
</script>
```

**Benefits:**
- Explicit public API
- Hide internal implementation
- Better encapsulation

## defineOptions

Set component options inside `<script setup>`

```vue
<script setup lang="ts">
defineOptions({
  name: 'MyComponent',
  inheritAttrs: false,
  customOptions: {}
})
</script>
```

**Benefits:**
- No need for separate `<script>` block
- All configuration in one place
- Better for TypeScript

## defineProps & defineEmits

Props and emits declaration with full type inference

```vue
<script setup lang="ts">
// Type-only props
interface Props {
  msg: string
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
})

// Type-only emits
interface Emits {
  change: [id: number]
  update: [value: string]
}

const emit = defineEmits<Emits>()
</script>
```

**Benefits:**
- Full TypeScript inference
- Type-safe props and emits
- Better IDE support

## Best Practices

- ใช้ `defineModel()` สำหรับ v-model (3.4+)
- ใช้ `defineSlots<>()` สำหรับ explicit slot types
- ใช้ `useTemplateRef()` สำหรับ template refs (3.5+)
- ใช้ `useId()` สำหรับ SSR-safe IDs (3.5+)
- ใช้ `onWatcherCleanup()` สำหรับ cleanup in watchers (3.5+)
- ใช้ `defineExpose({})` เพื่อ expose public API explicitly
- ใช้ `defineOptions({})` สำหรับ component options
- ใช้ TypeScript interfaces สำหรับ props/emits types
- Never mutate props directly - use defineModel or emit events

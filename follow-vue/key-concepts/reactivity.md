# Reactivity System

## Overview

Vue 3 ใช้ Proxy-based reactivity system ที่ track dependencies และ update DOM อัตโนมัติเมื่อ state เปลี่ยน Vue 3.5+ มีการ refactor ของ reactivity system ที่ปรับปรุง performance และ memory usage อย่างมีนัยสำคัญ

## Vue 3.5+ Performance Improvements

- **-56% memory usage**: Refactored reactivity system ด้วย version counting และ doubly-linked list tracking
- **10x faster array tracking**: Optimizations สำหรับ large, deeply reactive arrays
- **Resolved stale computed values**: แก้ปัญหา memory issues จาก hanging computeds ระหว่าง SSR

## Core APIs

### ref()

ใช้สำหรับ primitive values (string, number, boolean)

```typescript
import { ref } from 'vue'

const count = ref(0)
const message = ref('Hello')

// Access value
console.log(count.value) // 0

// Update value
count.value++
```

### reactive()

ใช้สำหรับ objects และ arrays

```typescript
import { reactive } from 'vue'

const state = reactive({
  count: 0,
  user: {
    name: 'Alice',
    age: 30
  }
})

// Direct mutation
state.count++
state.user.name = 'Bob'
```

### computed()

ใช้สำหรับ derived state

```typescript
import { ref, computed } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)
```

### watch() และ watchEffect()

ใช้สำหรับ side effects

```typescript
import { ref, watch, watchEffect } from 'vue'

const count = ref(0)

// watchEffect - auto-track dependencies
watchEffect(() => {
  console.log(`Count is: ${count.value}`)
})

// watch - explicit dependencies
watch(count, (newValue, oldValue) => {
  console.log(`Changed from ${oldValue} to ${newValue}`)
})
```

## Vue 3.5+ New APIs

### Reactive Props Destructuring

Vue 3.5+ มี built-in reactive props destructuring ไม่ต้องใช้ `toRefs()` อีกต่อไป

```vue
<script setup lang="ts">
// Vue 3.5+ - Built-in reactive destructuring
const { title, count } = defineProps<{
  title: string
  count: number
}>()

// title และ count ยังคง reactive
</script>
```

**Benefits:**
- No need for `toRefs(props)` anymore
- Cleaner syntax
- Built-in type inference
- Pass to functions directly without losing reactivity

### onEffectCleanup

ใช้สำหรับ cleanup logic ใน effects (Vue 3.5+)

```typescript
import { onEffectCleanup } from 'vue'

watchEffect((onCleanup) => {
  const timer = setInterval(() => {
    console.log('tick')
  }, 1000)

  onCleanup(() => {
    clearInterval(timer)
  })
})

// หรือใช้โดยตรงใน composables
function useEventListener(target: EventTarget, event: string, handler: Function) {
  target.addEventListener(event, handler)

  onEffectCleanup(() => {
    target.removeEventListener(event, handler)
  })
}
```

### toValue()

ใช้สำหรับ unwrapping MaybeRefOrGetter (Vue 3.5+)

```typescript
import { MaybeRefOrGetter, toValue } from 'vue'

export function useFetch(url: MaybeRefOrGetter<string>) {
  const actualUrl = computed(() => toValue(url))
  // ...
}
```

### deferredComputed

ใช้สำหรับ performance optimization ด้วย deferred computation (Vue 3.5+)

```typescript
import { ref, deferredComputed } from 'vue'

const count = ref(0)
const expensive = deferredComputed(() => {
  // Heavy computation จะถูก defer
  return heavyCalculation(count.value)
})
```

### watchSyncEffect

ใช้สำหรับ synchronous side effects (Vue 3.5+)

```typescript
import { watchSyncEffect } from 'vue'

watchSyncEffect(() => {
  // Run synchronously
  console.log('Immediate effect')
})
```

### watch Deep Option with Number

สามารถใช้ number สำหรับ deep option เพื่อ control watch depth (Vue 3.5+)

```typescript
watch(
  state,
  (newValue) => {
    // ...
  },
  { deep: 2 } // Watch 2 levels deep
)
```

### pause/resume

Pause และ resume effects (Vue 3.5+)

```typescript
import { ref, watchEffect, pause, resume } from 'vue'

const count = ref(0)
const effect = watchEffect(() => {
  console.log(count.value)
})

pause(effect)
count.value++ // Won't trigger
resume(effect)
```

## Best Practices

- ใช้ `ref()` สำหรับ primitives, `reactive()` สำหรับ objects
- ใช้ `computed()` สำหรับ derived state เพื่อ performance
- ใช้ `watch()` เมื่อต้องการ explicit control
- ใช้ `watchEffect()` เมื่อต้องการ auto-tracking
- ใช้ `shallowRef()` สำหรับ large objects เพื่อ performance
- ใช้ `toRefs()` เมื่อ destructuring reactive objects
- ใช้ `onEffectCleanup` สำหรับ cleanup logic (Vue 3.5+)
- ใช้ `toValue()` สำหรับ flexible inputs (Vue 3.5+)
- ใช้ `deferredComputed` สำหรับ heavy computations (Vue 3.5+)
- ใช้ `watchSyncEffect` สำหรับ synchronous effects (Vue 3.5+)

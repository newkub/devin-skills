# Composition API

## Overview

Composition API เป็น function-based API ที่ช่วยจัดระเบียบ logic ใน components ด้วยการ group ตาม functionality

## Script Setup

ใช้ `<script setup>` สำหรับ syntax ที่กระชับที่สุด

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Reactive state
const count = ref(0)
const message = ref('Hello')

// Computed
const doubled = computed(() => count.value * 2)

// Methods
function increment() {
  count.value++
}

// Lifecycle
onMounted(() => {
  console.log('Component mounted')
})
</script>

<template>
  <div>
    <p>{{ message }} {{ count }}</p>
    <p>Doubled: {{ doubled }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>
```

## Composables

สร้าง reusable logic ด้วย composables

```typescript
// composables/useCounter.ts
import { ref, computed } from 'vue'

export function useCounter(initial = 0) {
  const count = ref(initial)
  const doubled = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  return {
    count,
    doubled,
    increment,
    decrement
  }
}
```

```vue
<script setup lang="ts">
import { useCounter } from '@/composables/useCounter'

const { count, doubled, increment, decrement } = useCounter(10)
</script>
```

## Best Practices

- ใช้ `<script setup>` เป็น default
- ตั้งชื่อ composables ด้วย prefix `use`
- สร้าง composables ที่ focused และ single-purpose
- ใช้ TypeScript สำหรับ type safety
- ใช้ `defineProps` และ `defineEmits` สำหรับ props/emits
- ใช้ `defineModel` สำหรับ v-model implementation

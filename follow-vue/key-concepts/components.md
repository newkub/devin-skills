# Component System

## Overview

Vue components เป็น self-contained units ที่ combine template, logic, และ styles ในไฟล์เดียว

## Single-File Component (SFC)

```vue
<script setup lang="ts">
import { ref } from 'vue'

const message = ref('Hello World')
</script>

<template>
  <div>{{ message }}</div>
</template>

<style scoped>
div {
  color: blue;
}
</style>
```

## Props

```vue
<script setup lang="ts">
interface Props {
  title: string
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
})
</script>

<template>
  <h1>{{ title }}</h1>
  <p>Count: {{ count }}</p>
</template>
```

## Emits

```vue
<script setup lang="ts">
const emit = defineEmits<{
  update: [value: string]
  delete: [id: number]
}>()

function handleUpdate() {
  emit('update', 'new value')
}
</script>
```

## Slots

```vue
<!-- Parent -->
<template>
  <MyComponent>
    <template #header>
      <h1>Header</h1>
    </template>
    <p>Default content</p>
    <template #footer>
      <p>Footer</p>
    </template>
  </MyComponent>
</template>

<!-- Child -->
<template>
  <div>
    <slot name="header" />
    <slot />
    <slot name="footer" />
  </div>
</template>
```

## defineModel (Vue 3.4+)

```vue
<script setup lang="ts">
const modelValue = defineModel<string>()

function update() {
  modelValue.value = 'updated'
}
</script>

<template>
  <input v-model="modelValue" />
</template>
```

## Best Practices

- ใช้ `<script setup>` สำหรับ components ใหม่
- ใช้ TypeScript interfaces สำหรับ props
- ใช้ `defineModel` สำหรับ two-way binding
- ใช้ slots สำหรับ flexible composition
- ใช้ scoped styles สำหรับ component isolation
- ทำ components ให้ small และ single-purpose

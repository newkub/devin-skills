# Performance Patterns

## 1. Code Splitting

```typescript
// Dynamic imports for heavy modules
const heavyModule = await import('./heavyModule')
```

## 2. Lazy Loading Images

```vue
<script setup lang="ts">
import { ref } from 'vue'

const imageLoaded = ref(false)

const loadImage = () => {
  imageLoaded.value = true
}
</script>

<template>
  <img
    v-if="imageLoaded"
    src="/heavy-image.jpg"
    @load="loadImage"
  />
  <div v-else class="placeholder">Loading...</div>
</template>
```

## 3. Memoization

```typescript
import { computed } from 'vue'

const expensiveValue = computed(() => {
  // Expensive computation
  return result
})
```

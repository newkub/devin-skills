# Component Patterns

## 1. Container/Presentational Pattern

```vue
<!-- src/components/UserListContainer.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UserList from './UserList.vue'
import { userRepository } from '@/api/repositories/user'

const users = ref([])

onMounted(async () => {
  users.value = await userRepository.getAll()
})
</script>

<template>
  <UserList :users="users" />
</template>
```

```vue
<!-- src/components/UserList.vue -->
<script setup lang="ts">
defineProps<{
  users: User[]
}>()
</script>

<template>
  <ul>
    <li v-for="user in users" :key="user.id">
      {{ user.name }}
    </li>
  </ul>
</template>
```

## 2. Compound Components Pattern

```vue
<!-- src/components/Tabs.vue -->
<script setup lang="ts">
import { ref, provide } from 'vue'

const activeTab = ref(0)

provide('tabs', {
  activeTab,
  setActiveTab: (index: number) => {
    activeTab.value = index
  },
})
</script>

<template>
  <div class="tabs">
    <slot />
  </div>
</template>
```

```vue
<!-- src/components/Tab.vue -->
<script setup lang="ts">
import { inject } from 'vue'

const props = defineProps<{
  index: number
}>()

const tabs = inject('tabs') as any
</script>

<template>
  <button
    :class="{ active: tabs.activeTab === props.index }"
    @click="tabs.setActiveTab(props.index)"
  >
    <slot />
  </button>
</template>
```

## 3. Renderless Components Pattern

```vue
<!-- src/components/MouseTracker.vue -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const x = ref(0)
const y = ref(0)

const update = (event: MouseEvent) => {
  x.value = event.clientX
  y.value = event.clientY
}

onMounted(() => {
  window.addEventListener('mousemove', update)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', update)
})

defineExpose({ x, y })
</script>

<template>
  <slot :x="x" :y="y" />
</template>
```

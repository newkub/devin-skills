# Quick Start

## Create Project

```bash
bun create vite@latest my-vue-app -- --template vue-ts
cd my-vue-app
bun install
```

## Basic Component

```vue
<!-- src/components/HelloWorld.vue -->
<script setup lang="ts">
defineProps<{
  name: string;
}>();
</script>

<template>
  <div class="hello">
    <h1>Hello {{ name }}</h1>
  </div>
</template>

<style scoped>
.hello {
  color: #42b983;
}
</style>
```

## App Component

```vue
<!-- src/App.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import HelloWorld from './components/HelloWorld.vue';

const count = ref(0);
</script>

<template>
  <main>
    <h1>Vue Quick Start</h1>
    <HelloWorld name="Vue 3" />
    <p>Count: {{ count }}</p>
    <button @click="count++">Click me</button>
  </main>
</template>
```

## State Management with Pinia

```typescript
// src/stores/counter.ts
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  actions: {
    increment() {
      this.count++;
    },
  },
});
```

## Router Setup

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', name: 'Home', component: () => import('./views/Home.vue') },
  { path: '/about', name: 'About', component: () => import('./views/About.vue') },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
```

## Run Development

```bash
bun run dev
```

## Build Production

```bash
bun run build
bun run preview
```

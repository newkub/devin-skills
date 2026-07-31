# Integration

## State Management (Pinia)

```bash
bun install pinia
```

```typescript
// src/main.ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

const app = createApp(App);
app.use(createPinia());
app.mount('#app');
```

## Routing (Vue Router)

```bash
bun install vue-router
```

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
  ],
});

export default router;
```

## UI Libraries

| Library | Description |
|---------|-------------|
| Vuetify | Material Design components |
| Quasar | Full-featured framework |
| Element Plus | Element UI for Vue 3 |
| Naive UI | Configurable components |
| PrimeVue | Enterprise components |

## Testing (Vitest)

```bash
bun install -D vitest @vue/test-utils
```

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
  },
});
```

## Build Tools

| Tool | Purpose |
|------|---------|
| Vite | Build tool |
| Vue CLI | CLI scaffolding |
| Nuxt | SSR framework |
| Gridsome | Static site generator |

## DevTools

- Vue DevTools (Browser Extension)
- Volar (VS Code Extension)
- Vetur (VS Code - Legacy)
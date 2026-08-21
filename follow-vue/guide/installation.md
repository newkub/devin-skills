# Installation

## Vue CLI

```bash
bun install -g @vue/cli
vue create my-project
cd my-project
bun run serve
```

## Vite (Recommended)

```bash
bun create vite@latest my-project -- --template vue-ts
cd my-project
bun install
bun run dev
```

## Nuxt.js

```bash
npx nuxi@latest init my-project
cd my-project
bun install
bun run dev
```

## Manual Setup

```bash
bun init -y
bun install vue
bun install -D vite @vitejs/plugin-vue typescript vue-tsc
```

## Vite Config

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
  },
});
```

## Project Structure

```
my-project/
├── src/
│   ├── components/
│   ├── views/
│   ├── stores/
│   ├── router/
│   ├── assets/
│   ├── App.vue
│   └── main.ts
├── public/
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Next Steps

- [Quick Start Guide](quick-start.md)
- [Key Concepts](key-concept.md)
- [Configuration](configuration.md)
---
title: Configuration Reference
description: Configuration ครบถ้วนสำหรับ SolidJS development
---

# Configuration Reference

คู่มือการตั้งค่า SolidJS สำหรับ development และ production

## Vite Configuration

### vite.config.ts

```typescript
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solid()],
  server: {
    port: 3000,
    open: true,
    host: true
  },
  build: {
    target: 'esnext',
    polyfillDynamicImport: false
  }
});
```

### Solid Plugin Options

```typescript
solid({
  solid: {
    moduleName: 'solid-js',
    generate: 'dom',
    hydratable: true
  },
  typescript: {
    typesSource: 'local'
  }
})
```

## TypeScript Configuration

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "bundler",
    "module": "ESNext",
    "noEmit": true,
    "jsx": "preserve",
    "jsxImportSource": "solid-js",
    "isolatedModules": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### tsconfig.node.json

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

## SolidStart Configuration

### app.config.ts

```typescript
import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  start: {
    ssr: true,
    prerender: false,
    adapter: "vercel"
  }
});
```

### SolidStart Adapters

| Adapter | Description |
|---------|-------------|
| `vercel` | Vercel deployment |
| `netlify` | Netlify deployment |
| `cloudflare` | Cloudflare Workers |
| `node` | Node.js server |
| `static` | Static site generation |

## Environment Variables

### Development

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | API endpoint | `https://api.example.com` |
| `VITE_APP_NAME` | Application name | `My App` |
| `NODE_ENV` | Environment | `development` |

### Production

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Production API | `https://api.example.com` |
| `VITE_APP_NAME` | App name | `My App` |
| `NODE_ENV` | Environment | `production` |

### SolidStart Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `SESSION_SECRET` | Session secret | `random-secret-key` |
| `DATABASE_URL` | Database connection | `postgresql://...` |

## Babel Configuration

### babel.config.js

```javascript
module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    ["@babel/preset-typescript"],
    ["solid", { generate: "ssr", hydratable: true }]
  ]
};
```

## Jest Configuration

### jest.config.js

```javascript
module.exports = {
  preset: 'solid-jest/preset/js-env',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'solid-jest'
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  }
};
```

## Vitest Configuration

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';
import solid from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solid()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts'
  }
});
```

## ESLint Configuration

### .eslintrc.cjs

```javascript
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['solid'],
  rules: {
    'solid/reactivity': 'warn',
    'solid/components-return-once': 'error'
  }
};
```

## Prettier Configuration

### .prettierrc

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

## Path Aliases

### vite.config.ts

```typescript
export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@utils': '/src/utils'
    }
  }
});
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@utils/*": ["./src/utils/*"]
    }
  }
}
```


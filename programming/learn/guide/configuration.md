# Configuration

## Purpose

แนวทางการตั้งค่า code style และ project configuration สำหรับการเขียนโปรแกรมที่ดี

## Code Style Configuration

### ESLint

```bash
bun install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

```javascript
// .eslintrc.js
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['@typescript-eslint'],
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  ignorePatterns: ['.dist', 'node_modules'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
};
```

### Prettier

```bash
bun install -D prettier
```

```javascript
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### Combined Config

```javascript
// .eslintrc.js with Prettier
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier', // disable ESLint rules that conflict with Prettier
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
};
```

## TypeScript Configuration

### Strict Mode

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "useUnknownInCatchVariables": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true
  }
}
```

### Path Aliases

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

## Project Structure

### Recommended Structure

```
project/
├── src/
│   ├── components/        # Reusable components
│   │   ├── Button.ts
│   │   └── Input.ts
│   ├── features/          # Feature modules
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── services/
│   │   └── dashboard/
│   ├── hooks/             # Shared hooks
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript types
│   ├── config/            # Configuration
│   └── index.ts           # Entry point
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/                  # Documentation
├── scripts/               # Build scripts
├── package.json
├── tsconfig.json
├── .eslintrc.js
├── .prettierrc
└── vitest.config.ts
```

### Alternative Structures

| Structure | Use Case |
|-----------|----------|
| **Feature-based** | Large applications |
| **Layer-based** | Traditional apps |
| **Domain-driven** | Complex business logic |
| **Monorepo** | Multiple packages |

## Environment Configuration

### Environment Variables

```typescript
// src/config/env.ts
const config = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  apiKey: import.meta.env.VITE_API_KEY,
  debug: import.meta.env.DEV,
};

export default config;
```

### .env Files

```bash
# .env.example
VITE_API_URL=http://localhost:3000
VITE_API_KEY=your-key-here
VITE_ENABLE_LOGGING=true
```

## Testing Configuration

### Vitest

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

## Build Configuration

### Package Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "coverage": "vitest run --coverage",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx}\"",
    "typecheck": "tsc --noEmit"
  }
}
```

## Summary

| Config | Purpose |
|--------|--------|
| ESLint | Code quality |
| Prettier | Code formatting |
| TypeScript | Type safety |
| Vitest | Testing |
| Vite | Build tool |

## Next Steps

| File | Description |
|------|-------------|
| [best-practices.md](best-practices.md) | Coding best practices |
| [installation.md](installation.md) | Dev environment setup |
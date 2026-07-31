# Integration

## Purpose

แนวทางการรวม code เข้ากับ tools และ workflows ต่างๆ

## Scope

- Build Tools
- Testing Tools
- Linting & Formatting
- Version Control

## Build Tools

### Vite

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    minify: 'esbuild',
  },
  server: {
    port: 3000,
    open: true,
  },
});
```

### esbuild

```typescript
// build.ts
import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  minify: true,
  outfile: 'dist/bundle.js',
  platform: 'node',
  target: 'node18',
});
```

## Testing Tools

### Vitest

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
});
```

### Test Patterns

```typescript
// Mocking
const mockFetch = vi.fn().mockResolvedValue({ data: 'test' });
global.fetch = mockFetch;

// Spying
const spy = vi.spyOn(api, 'get');
await getUser('1');
expect(spy).toHaveBeenCalledWith('/users/1');

// Async testing
await waitFor(() => {
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

## Linting & Formatting

### ESLint + Prettier

```javascript
// .eslintrc.js
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
};
```

### Git Hooks

```bash
# .husky/pre-commit
#!/bin/sh
bun run lint
bun run typecheck
```

## Version Control

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/user-auth

# Commit with conventional commits
git commit -m "feat: add login functionality"

# Push and create PR
git push -u origin feature/user-auth
```

### Conventional Commits

| Type | Description |
|------|-------------|
| feat | New feature |
| fix | Bug fix |
| docs | Documentation |
| style | Formatting |
| refactor | Code refactor |
| test | Testing |
| chore | Maintenance |

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: bun ci
      - run: bun run lint
      - run: bun run typecheck
      - run: bun test
```

### GitLab CI

```yaml
# .gitlab-ci.yml
test:
  script:
    - bun ci
    - bun run lint
    - bun test
  only:
    - main
    - develop
```

## Debugging

### VS Code Debug Config

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug",
      "program": "${workspaceFolder}/src/index.ts",
      "preLaunchTask": "tsc: build"
    }
  ]
}
```

## Monitoring

### Error Tracking

```typescript
// Error boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error, info) {
    logError(error, info);
  }
}

// Global error handler
window.addEventListener('error', (event) => {
  logError(event.error);
});
```

## Summary

| Tool | Purpose |
|------|---------|
| **Vite** | Fast build tool |
| **Vitest** | Testing |
| **ESLint** | Code quality |
| **Prettier** | Formatting |
| **GitHub Actions** | CI/CD |

## Next Steps

| File | Description |
|------|-------------|
| [best-practices.md](best-practices.md) | Coding practices |
| [configuration.md](configuration.md) | Project config |
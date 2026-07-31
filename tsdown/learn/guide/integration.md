# Integration

## การรวม tsdown เข้ากับ tools อื่นๆ

### 1. Integration กับ TypeScript Projects

tsdown ทำงานร่วมกับ TypeScript ได้อย่างราบรื่น:

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "bundler"
  }
}

// tsdown.config.ts
import { defineConfig } from 'tsdown';

export default defineConfig({
  tsconfig: './tsconfig.json',
});
```

### 2. Integration กับ Testing Frameworks

**Vitest:**

```json
{
  "scripts": {
    "test": "vitest",
    "build": "tsdown",
    "prepublishOnly": "bun run build && bun run test"
  }
}
```

**Jest:**

```json
{
  "scripts": {
    "test": "jest",
    "build": "tsdown"
  }
}
```

### 3. Integration กับ Monorepos

**bun workspace:**

```json
{
  "scripts": {
    "build": "tsdown",
    "build:all": "bun -r --filter=./packages/* run build"
  }
}
```

**Yarn workspaces:**

```json
{
  "scripts": {
    "build": "tsdown",
    "build:all": "yarn workspaces run build"
  }
}
```

**Turbo:**

```json
{
  "pipeline": {
    "build": {
      "outputs": ["dist/**"]
    }
  }
}
```

### 4. Integration กับ CI/CD

**GitHub Actions:**

```yaml
name: Build
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run build
      - uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist
```

**GitLab CI:**

```yaml
build:
  image: oven/bun:latest
  script:
    - bun install
    - bun run build
  artifacts:
    paths:
      - dist
```

### 5. Integration กับ Release Tools

**release-it:**

```json
{
  "scripts": {
    "release": "release-it",
    "version": "bun run build && git add dist"
  }
}
```

**Auto:**

```json
{
  "scripts": {
    "release": "auto shipit"
  }
}
```

### 6. Integration กับ Linting Tools

**Biome:**

```json
{
  "scripts": {
    "lint": "biome check src",
    "lint:fix": "biome check --write src",
    "build": "tsdown"
  }
}
```

**ESLint:**

```json
{
  "scripts": {
    "lint": "eslint src",
    "lint:fix": "eslint src --fix",
    "build": "tsdown"
  }
}
```

### 7. Integration กับ Formatters

**Prettier:**

```json
{
  "scripts": {
    "format": "prettier --write src",
    "build": "tsdown"
  }
}
```

**dprint:**

```json
{
  "scripts": {
    "format": "dprint fmt",
    "build": "tsdown"
  }
}
```

### 8. Integration กับ Documentation Tools

**TypeDoc:**

```json
{
  "scripts": {
    "docs": "typedoc src",
    "build": "tsdown"
  }
}
```

### 9. Integration กับ Package Managers

**Bun:**

```bash
bun add -D tsdown
bun run build
```

**bun:**

```bash
bun install -D tsdown
bun run build
```

**bun:**

```bash
bun add -D tsdown
bun run build
```

**yarn:**

```bash
yarn add -D tsdown
yarn run build
```

### 10. Integration กับ Path Aliases

```typescript
import { defineConfig } from 'tsdown';
import alias from '@rollup/plugin-alias';
import path from 'path';

export default defineConfig({
  plugins: [
    alias({
      entries: [
        { find: '@', replacement: path.resolve(__dirname, './src') },
        { find: '@utils', replacement: path.resolve(__dirname, './src/utils') },
      ],
    }),
  ],
});
```

### 11. Integration กับ Environment Variables

```typescript
import { defineConfig } from 'tsdown';

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
});
```

### 12. Integration กับ Git Hooks

**Lefthook:**

```yaml
pre-commit:
  commands:
    lint:
      run: bun run lint
    typecheck:
      run: bun run typecheck
```

**Husky:**

```bash
bun pkg set scripts.prepare "husky install"
npx husky add .husky/pre-commit "bun run lint"
```

### 13. Integration กับ Docker

```dockerfile
FROM oven/bun:latest
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install
COPY . .
RUN bun run build
```

### 14. Integration กับ Nx

```json
{
  "targets": {
    "build": {
      "executor": "@nx/js:tsdown"
    }
  }
}
```

### 15. Integration กับ Rush

```json
{
  "commands": [
    {
      "name": "build",
      "command": "tsdown"
    }
  ]
}
```

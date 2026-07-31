# Integration

## การเชื่อมต่อกับเครื่องมือและ workflow ต่างๆ

### GitHub Actions

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: bun install

      - name: Build
        run: turbo run build

      - name: Test
        run: turbo run test --affected

      - name: Lint
        run: turbo run lint
```

### GitLab CI

```yaml
stages:
  - build
  - test

build:
  stage: build
  script:
    - bun install
    - turbo run build

test:
  stage: test
  script:
    - turbo run test --affected
```

### CircleCI

```yaml
version: 2.1

jobs:
  build:
    docker:
      - image: cimg/node:18
    steps:
      - checkout
      - run: bun install
      - run: turbo run build

  test:
    docker:
      - image: cimg/node:18
    steps:
      - checkout
      - run: bun install
      - run: turbo run test --affected
```

### Vercel

```json
{
  "buildCommand": "turbo run build",
  "devCommand": "turbo run dev",
  "installCommand": "bun install"
}
```

### Netlify

```toml
[build]
  command = "turbo run build"
  publish = "apps/web/dist"

[dev]
  command = "turbo run dev"
```

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install

COPY . .

RUN turbo run build

CMD ["turbo", "run", "dev"]
```

### Nx Integration

ใช้ Turborepo กับ Nx:

```json
{
  "extends": ["@nx/vite"]
}
```

### Lerna Integration

ใช้ Turborepo กับ Lerna:

```json
{
  "bunClient": "bun",
  "useWorkspaces": true
}
```

### ESLint

```json
{
  "tasks": {
    "lint": {
      "dependsOn": ["^build"]
    }
  }
}
```

### Prettier

```json
{
  "tasks": {
    "format": {
      "outputs": []
    }
  }
}
```

### Jest

```json
{
  "tasks": {
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    }
  }
}
```

### TypeScript

```json
{
  "globalDependencies": ["tsconfig.json"],
  "tasks": {
    "typecheck": {
      "dependsOn": ["^build"]
    }
  }
}
```

### Next.js

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**"]
    }
  }
}
```

### Vite

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    }
  }
}
```

### Storybook

```json
{
  "tasks": {
    "build-storybook": {
      "dependsOn": ["^build"],
      "outputs": ["storybook-static/**"]
    }
  }
}
```

### Custom Scripts

```json
{
  "tasks": {
    "custom": {
      "dependsOn": ["build"],
      "outputs": ["custom-output/**"]
    }
  }
}
```

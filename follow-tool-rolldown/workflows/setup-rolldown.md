---
title: Setup Rolldown
description: Set up Rolldown for a new project
auto_execution_mode: 3
---

## Goal

Set up Rolldown for a new project with speed and correctness

## Scope

- Initialize project
- Install Rolldown
- Create config file
- Setup basic structure

## Execute

### 1. Initialize Project

Create a new project:

```bash
mkdir my-rolldown-project
cd my-rolldown-project
bun init -y
```

### 2. Install Rolldown

Install Rolldown:

```bash
bun add -D rolldown
```

### 3. Create Source Structure

Create the source structure:

```bash
mkdir src
```

### 4. Create Entry File

Create the entry file:

src/index.ts:
```typescript
export function greet(name: string): string {
  return `Hello, ${name}!`
}

export const version = '1.0.0'
```

### 5. Create Config File

Create the config file:

rolldown.config.ts:
```typescript
import { defineConfig } from 'rolldown'

export default defineConfig({
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
  },
})
```

### 6. Add Build Script

Add the build script in package.json:

```json
{
  "scripts": {
    "build": "rolldown",
    "dev": "rolldown --watch"
  }
}
```

### 7. Test Build

Test the build:

```bash
bun run build
```

### 8. Verify Output

Check the output:

```bash
ls dist/
```

## Optional: TypeScript Setup

### 1. Install TypeScript

```bash
bun add -D typescript
```

### 2. Create tsconfig.json

tsconfig.json:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

### 3. Update Config

rolldown.config.ts:
```typescript
import { defineConfig } from 'rolldown'

export default defineConfig({
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
  },
  tsconfig: './tsconfig.json',
})
```

## Optional: Plugin Setup

### 1. Install Plugins

```bash
bun add -D @rolldown/plugin-commonjs @rolldown/plugin-node-resolve
```

### 2. Update Config

rolldown.config.ts:
```typescript
import { defineConfig } from 'rolldown'
import commonjs from '@rolldown/plugin-commonjs'
import nodeResolve from '@rolldown/plugin-node-resolve'

export default defineConfig({
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
  },
  plugins: [
    nodeResolve(),
    commonjs(),
  ],
})
```

## Rules

- Use `bun add -D rolldown` to install
- Use TypeScript for the config file
- Name the config file `rolldown.config.ts`
- Use `defineConfig` for type safety

## Expected Outcome

- A project with Rolldown installed
- A correct config file
- A ready-to-use build script
- A created output directory

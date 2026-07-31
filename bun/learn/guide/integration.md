# Integration

## Overview

Bun เชื่อมต่อกับ tools และ frameworks ต่างๆ ได้อย่างราบรื่น

## Node.js Compatibility

### Packages

```bash
bun add express lodash axios
```

### CommonJS

```javascript
const express = require('express');
import express from 'express';
```

### APIs

```javascript
import fs from 'fs';
import path from 'path';
import http from 'http';
```

## Framework Integration

```bash
# Next.js
bun create next-app my-app && cd my-app && bun install && bun run dev

# React
bun create vite my-app --template react && cd my-app && bun install && bun run dev

# Vue
bun create vite my-app --template vue && cd my-app && bun install && bun run dev

# Svelte
bun create vite my-app --template svelte && cd my-app && bun install && bun run dev
```

## Tool Integration

```bash
# ESLint
bun add -d eslint && bunx eslint --init

# Prettier
bun add -d prettier && bunx prettier --write .

# TypeScript
bun add -d typescript && bunx tsc --init

# Vitest
bun add -d vitest && bunx vitest init
```

## Database Integration

```bash
# PostgreSQL
bun add pg

# MongoDB
bun add mongodb

# SQLite
bun add better-sqlite3
```

## API Integration

### REST

```typescript
import { serve } from 'bun';
serve({ port: 3000, fetch(req) { return new Response('Hello World'); } });
```

### GraphQL

```bash
bun add @apollo/server
```

## Cloud Integration

```bash
# Vercel
bun add -g vercel && vercel

# Netlify
bun add -g netlify-cli && netlify

# Cloudflare Workers
bun add wrangler && bunx wrangler init
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Bun CI
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun test
```

### GitLab CI

```yaml
test:
  image: oven/bun
  script:
    - bun install
    - bun test
```

## Docker Integration

### Dockerfile

```dockerfile
FROM oven/bun:latest
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install
COPY . .
RUN bun run build
EXPOSE 3000
CMD ["bun", "run", "start"]
```

### docker-compose.yml

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
```

## Testing Integration

```bash
# Jest
bun add -d jest @types/jest

# Vitest
bun add -d vitest

# Bun Test
bun test
```

## Best Practices

- ใช้ `bun add` แทน bun install
- ใช้ `bunx` สำหรับ running CLI tools
- ตรวจสอบ compatibility ก่อนใช้ Node.js packages
- ใช้ TypeScript สำหรับ type safety
- ใช้ environment variables สำหรับ configuration

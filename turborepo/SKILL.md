---
name: turborepo
description: "High-performance build system สำหรับ JavaScript/TypeScript monorepos ด้วย caching และ parallel..."
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

ใช้งาน Turborepo สำหรับ build JavaScript/TypeScript monorepos ด้วยความเร็วสูง


## Scope

ใช้สำหรับ:
- Build JavaScript/TypeScript monorepos ด้วยความเร็วสูง
- Remote caching สำหรับ teams
- Parallel execution สำหรับ efficiency
- Incremental builds สำหรับ speed


## Execute

### 1. Install Turborepo

ติดตั้ง Turborepo:
```bash
bun add -D turbo
```

### 2. Initialize Turborepo

Initialize Turborepo:
```bash
bunx turbo init
```

### 3. Run Build

รัน build:
```bash
bunx turbo run build
```

### 4. Run with Filter

รันด้วย filter:
```bash
bunx turbo run build --filter=myapp
```


## Rules

- ใช้ `bun add -D turbo` สำหรับติดตั้ง
- ใช้ `bunx turbo init` สำหรับ initialize
- ใช้ `bunx turbo run` สำหรับรัน tasks
- ใช้ `--filter` สำหรับ filter packages


## Expected Outcome

- Monorepo builds ที่ fast
- Remote caching ที่ efficient
- Parallel execution ที่ optimized
- Incremental builds ที่ fast

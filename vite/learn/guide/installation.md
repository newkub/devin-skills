# Installation

## Purpose

แนะนำการติดตั้ง Vite พร้อม framework plugins และ dependencies

## Scope

- Vite Installation
- Framework Plugins
- Peer Dependencies
- Project Scaffolding
- TypeScript Configuration

## Packages Overview

| Package | คำอธิบาย | จำเป็น |
|---------|----------|--------|
| **vite** | Build tool หลัก | ใช่ |
| **@vitejs/plugin-react** | React support + Fast Refresh | สำหรับ React |
| **@vitejs/plugin-vue** | Vue SFC support | สำหรับ Vue |
| **@vitejs/plugin-svelte** | Svelte support (ผ่าน @sveltejs/vite-plugin-svelte) | สำหรับ Svelte |

## Create New Project

### Using CLI (Recommended)

```bash
# bun
bun create vite@latest my-app

# yarn
yarn create vite my-app

# bun
bun create vite my-app

# bun
bun create vite my-app
```

### With Template

```bash
# React + TypeScript
bun create vite@latest my-app -- --template react-ts

# Vue + TypeScript
bun create vite@latest my-app -- --template vue-ts

# Svelte + TypeScript
bun create vite@latest my-app -- --template svelte-ts
```

## Available Templates

| Template | คำอธิบาย |
|---------|----------|
| `vanilla` | Vanilla JavaScript |
| `vanilla-ts` | Vanilla TypeScript |
| `react` | React |
| `react-ts` | React + TypeScript |
| `react-swc` | React + SWC (faster) |
| `react-swc-ts` | React + SWC + TypeScript |
| `vue` | Vue |
| `vue-ts` | Vue + TypeScript |
| `preact` | Preact |
| `preact-ts` | Preact + TypeScript |
| `lit` | Lit |
| `lit-ts` | Lit + TypeScript |
| `svelte` | Svelte |
| `svelte-ts` | Svelte + TypeScript |
| `solid` | SolidJS |
| `solid-ts` | SolidJS + TypeScript |
| `qwik` | Qwik |
| `qwik-ts` | Qwik + TypeScript |

## Manual Installation

### bun

```bash
bun install -D vite
```

### yarn

```bash
yarn add -D vite
```

### bun

```bash
bun add -D vite
```

### bun

```bash
bun add -D vite
```

## Install Framework Plugins

### React

```bash
bun install -D @vitejs/plugin-react
```

### Vue

```bash
bun install -D @vitejs/plugin-vue
```

### Svelte

```bash
bun install -D @sveltejs/vite-plugin-svelte svelte
```

### Preact

```bash
bun install -D @preact/preset-vite preact
```

## Node.js Version

Vite ต้องการ Node.js version:

| Version | Support |
|---------|---------|
| **Node.js 18+** | Supported |
| **Node.js 20+** | Recommended |
| **Node.js 22+** | Latest features |

## TypeScript Configuration

เพิ่ม settings ใน `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["src"]
}
```

| Option | คำอธิบาย | จำเป็น |
|--------|----------|--------|
| `module` | ใช้ `ESNext` สำหรับ ESM | ใช่ |
| `moduleResolution` | ใช้ `bundler` สำหรับ Vite | แนะนำ |
| `isolatedModules` | จำลอง esbuild transform behavior | แนะนำ |
| `noEmit` | Vite ใช้ esbuild transform ไม่ต้อง emit | แนะนำ |

## Vite Client Types

สำหรับ React projects เพิ่ม `vite/client` types:

```typescript
// vite-env.d.ts
/// <reference types="vite/client" />
```

## Verify Installation

สร้างไฟล์ `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'

export default defineConfig({
  // Configuration here
})
```

เพิ่ม scripts ใน `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

รัน dev server:

```bash
bun run dev
```

## Summary

| ขั้นตอน | Command |
|---------|---------|
| **Scaffold** | `bun create vite@latest my-app -- --template react-ts` |
| **Install** | `bun install` |
| **Dev** | `bun run dev` |
| **Build** | `bun run build` |
| **Preview** | `bun run preview` |

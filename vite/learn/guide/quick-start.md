# Quick Start

## Purpose

เริ่มต้นใช้งาน Vite ตั้งแต่ติดตั้งจนถึง build production

## Scope

- Project Creation
- Configuration
- Add Plugins
- Development
- Build
- Preview

## Step Overview

| ขั้นตอน | คำอธิบาย | เวลา |
|---------|----------|------|
| **1. Create** | สร้าง project ใหม่ | 1 นาที |
| **2. Configure** | ตั้งค่า vite.config.ts | 3 นาที |
| **3. Dev** | รัน dev server | 1 นาที |
| **4. Build** | Build production | 30 วินาที |

## Step 1: Create Project

```bash
# React + TypeScript
bun create vite@latest my-app -- --template react-ts

# Vue + TypeScript
bun create vite@latest my-app -- --template vue-ts

# Svelte + TypeScript
bun create vite@latest my-app -- --template svelte-ts
```

เข้าไปใน project folder:

```bash
cd my-app
bun install
```

## Step 2: Configure

สร้าง `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
```

## Step 3: Development

รัน dev server:

```bash
bun run dev
```

เปิด browser ไปที่ `http://localhost:5173`

### Hot Module Replacement

แก้ไข code แล้วจะเห็นการเปลี่ยนแปลงทันทีโดยไม่ต้อง reload หน้า

```tsx
// src/App.tsx
function App() {
  return (
    <div>
      <h1>Hello Vite!</h1>
      <p>Edit this text and see the changes instantly</p>
    </div>
  )
}

export default App
```

## Step 4: Build

Build production:

```bash
bun run build
```

Output จะอยู่ใน `dist/` directory

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── ...
```

## Step 5: Preview

Preview production build:

```bash
bun run preview
```

เปิด browser ไปที่ `http://localhost:4173`

## Project Structure

```
my-app/
├── src/
│   ├── main.tsx          # Entry point
│   ├── App.tsx           # Main component
│   └── App.css           # Styles
├── public/              # Static assets
│   └── vite.svg
├── index.html            # HTML entry
├── vite.config.ts        # Vite config
├── tsconfig.json         # TypeScript config
└── package.json
```

## Environment Variables

สร้าง `.env` file:

```env
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=My App
```

ใช้ใน code:

```typescript
const apiUrl = import.meta.env.VITE_API_URL
const title = import.meta.env.VITE_APP_TITLE
```

## TypeScript Types

เพิ่ม Vite types ใน `vite-env.d.ts`:

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

## Summary

| ขั้นตอน | Command |
|---------|---------|
| **Create** | `bun create vite@latest my-app -- --template react-ts` |
| **Install** | `bun install` |
| **Config** | สร้าง `vite.config.ts` พร้อม plugins |
| **Dev** | `bun run dev` |
| **Build** | `bun run build` |
| **Preview** | `bun run preview` |

| Files | Description |
|-------|-------------|
| `vite.config.ts` | Vite configuration |
| `index.html` | HTML entry point |
| `src/main.tsx` | JavaScript/TypeScript entry |

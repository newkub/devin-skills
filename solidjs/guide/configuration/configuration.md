---
title: Configuration
description: การตั้งค่า SolidJS project
---

## Babel Configuration

สร้าง `babel.config.js`:

```javascript
module.exports = {
  presets: ["solid"],
  plugins: [],
};
```

## Vite Configuration

สำหรับ Vite project:

```javascript
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    port: 3000,
  },
});
```

## TypeScript Configuration

สร้าง `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "node",
    "jsx": "preserve",
    "jsxImportSource": "solid-js",
    "types": ["vite/client"],
    "strict": true
  },
  "include": ["src"]
}
```

## SolidStart Configuration

สำหรับ SolidStart project:

```javascript
// app.config.ts
import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  ssr: true,
  adapter: "vercel",
});
```

## ESLint Configuration

ติดตั้ง ESLint สำหรับ SolidJS:

```bash
bun add -D eslint-plugin-solid
```

สร้าง `.eslintrc.js`:

```javascript
module.exports = {
  extends: ["plugin:solid/recommended"],
};
```

## Path Aliases

ตั้งค่า path aliases ใน Vite:

```javascript
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

## Environment Variables

ใช้ `.env` files:

```env
VITE_API_URL=https://api.example.com
```

เข้าถึงใน code:

```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

## ถัดไป

ดู [Features](./features.md) เพื่อเรียนรู้ features ของ SolidJS

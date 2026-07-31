---
title: Installation
description: วิธีติดตั้ง SolidJS ใน project ด้วย Bun
---

## วิธีติดตั้ง

### ติดตั้งด้วย Bun

ใช้ `bun add` เพื่อติดตั้ง SolidJS:

```bash
bun add solid-js
```

### ติดตั้งด้วยเครื่องมืออื่น

ถ้าใช้ package manager อื่น:

```bash
bun install solid-js
# หรือ
bun add solid-js
# หรือ
yarn add solid-js
```

## ติดตั้ง TypeScript Support

สำหรับ TypeScript project:

```bash
bun add -D @types/babel__core
```

## ติดตั้ง Babel Preset

สำหรับ JSX compilation:

```bash
bun add -D babel-preset-solid
```

## ติดตั้ง SolidStart (Full-stack Framework)

ถ้าต้องการใช้ SolidStart:

```bash
bun create solid@latest
```

## ติดตั้ง Packages เพิ่มเติม

### Web Rendering

```bash
bun add solid-js/web
```

### Store System

```bash
bun add solid-js/store
```

### SSR Utilities

```bash
bun add solid-ssr
```

## ตรวจสอบการติดตั้ง

ตรวจสอบใน `package.json`:

```json
{
  "dependencies": {
    "solid-js": "^1.9.0"
  }
}
```

## การตั้งค่า Babel Config

สร้างไฟล์ `babel.config.js`:

```javascript
module.exports = {
  presets: ["solid"]
};
```

## การตั้งค่า Vite

สำหรับ Vite project:

```bash
bun add -D vite-plugin-solid
```

และตั้งค่าใน `vite.config.js`:

```javascript
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solidPlugin()],
});
```

## ถัดไป

หลังติดตั้งเสร็จ ดู [Quick Start](./quick-start.md) เพื่อเริ่มต้นใช้งาน

---
title: Build Tools
description: Build tools ที่รองรับ Tauri
---

## Vite (Recommended)

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import tauri from '@tauri-apps/plugin-vite'

export default defineConfig({
  plugins: [tauri()]
})
```

## Webpack

```javascript
// webpack.config.js
const TauriPlugin = require('@tauri-apps/plugin-webpack')

module.exports = {
  plugins: [new TauriPlugin()]
}
```

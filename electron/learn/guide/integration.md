# Integration

## Electron Forge

Build และ package Electron apps ได้ง่ายขึ้น

```bash
bun init electron-app@latest my-app -- --template=webpack
cd my-app
bun run start
```

### Available Templates

| Template | Description |
|----------|-------------|
| webpack | Webpack bundler |
| vite | Vite bundler |
| parcel | Parcel bundler |

## electron-builder

Package Electron apps สำหรับ distribution

```bash
bun install electron-builder --save-dev
```

### package.json Configuration

```json
{
  "build": {
    "appId": "com.example.myapp",
    "productName": "My App",
    "directories": {
      "output": "dist"
    },
    "files": [
      "main.js",
      "preload.js",
      "index.html"
    ],
    "win": {
      "target": ["nsis", "portable"],
      "icon": "build/icon.ico"
    },
    "mac": {
      "target": ["dmg", "zip"],
      "icon": "build/icon.icns"
    },
    "linux": {
      "target": ["AppImage", "deb"],
      "icon": "build/icon.png"
    }
  }
}
```

## React Integration

### Vite + React + Electron

```bash
bun create vite@latest electron-app -- --template react-ts
cd electron-app
bun install electron electron-builder concurrently wait-on
```

### vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist/renderer',
    emptyOutDir: true
  }
});
```

## Vue Integration

### Vite + Vue + Electron

```bash
bun create vite@latest electron-app -- --template vue-ts
cd electron-app
bun install electron electron-builder concurrently wait-on
```

## TypeScript

### Main Process TypeScript

```typescript
import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
}

app.whenReady().then(createWindow);
```

## Testing

### Playwright for Electron

```bash
bun install -D @playwright/test
npx playwright install --with-deps chromium
```

### test.spec.ts

```typescript
import { test, expect } from '@playwright/test';
import { _electron as electron } from 'playwright';

test('app launches', async () => {
  const electronApp = await electron.launch({ headless: true });
  const window = await electronApp.firstWindow();
  
  await expect(window.locator('h1')).toHaveText('Hello Electron!');
  
  await electronApp.close();
});
```

## DevTools Extensions

### React Developer Tools

```javascript
// main.js
app.whenReady().then(() => {
  if (process.env.NODE_ENV === 'development') {
    BrowserWindow.addDevToolsExtensions(
      require('electron-react-devtools').default
    );
  }
});
```
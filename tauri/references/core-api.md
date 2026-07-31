---
title: Core API
description: Core API ของ Tauri (@tauri-apps/api)
---

## Notification API

```typescript
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/api/notification';

// Check permission
let permissionGranted = await isPermissionGranted();

// Request permission
if (!permissionGranted) {
  const permission = await requestPermission();
  permissionGranted = permission === 'granted';
}

// Send notification
if (permissionGranted) {
  sendNotification({ title: 'Tauri', body: 'Notification sent!' });
}
```

## Global Shortcut API

```typescript
import { register, unregister, unregisterAll } from '@tauri-apps/api/globalShortcut';

// Register shortcut
await register('CommandOrControl+Shift+1', () => {
  console.log('Shortcut triggered');
});

// Unregister shortcut
await unregister('CommandOrControl+Shift+1');

// Unregister all
await unregisterAll();
```

## Clipboard API

```typescript
import { readText, writeText, readImage, writeImage } from '@tauri-apps/api/clipboard';

// Read text
const text = await readText();

// Write text
await writeText('Hello, Tauri!');

// Read image
const image = await readImage();

// Write image
await writeImage(imageBytes);
```

## Positioner API

```typescript
import { position } from '@tauri-apps/api/window';

// Position window
await position({ x: 100, y: 100 });

// Center window
await position({ x: undefined, y: undefined });
```

## Tray API

```typescript
import { TrayIcon } from '@tauri-apps/api/tray';

// Create tray icon
const tray = await TrayIcon.new('path/to/icon.png');

// Set tooltip
await tray.setTooltip('My App');

// Set menu
await tray.setMenu(menuItems);

// Show/hide
await tray.setVisible(true);
await tray.setVisible(false);
```

## invoke

Call a Rust command from frontend.

```typescript
import { invoke } from '@tauri-apps/api/core';

// Call without arguments
const result = await invoke('greet');

// Call with arguments
const result = await invoke<string>('greet', { name: 'World' });
```

## emit / listen

Event system for frontend-backend communication.

```typescript
import { emit, listen } from '@tauri-apps/api/event';

// Emit from frontend
await emit('my-event', { data: 'hello' });

// Listen from frontend
const unlisten = await listen<{ data: string }>('my-event', (event) => {
  console.log(event.payload);
});

// Cleanup
unlisten();
```

## Window API

```typescript
import { getCurrentWindow } from '@tauri-apps/api/window';

const win = getCurrentWindow();

// Properties
win.label;          // Window label
win.title;          // Window title

// Methods
await win.setTitle('New Title');
await win.setSize({ width: 800, height: 600 });
await win.minimize();
await win.maximize();
await win.unmaximize();
await win.close();
await win.setFullscreen(true);
await win.setFocus();
```

## Event API

```typescript
import { getCurrentWindow } from '@tauri-apps/api/event';

const win = getCurrentWindow();

// Listen to window events
await win.onMoved((payload) => {
  console.log(payload.position);
});

await win.onResized((payload) => {
  console.log(payload.size);
});
```

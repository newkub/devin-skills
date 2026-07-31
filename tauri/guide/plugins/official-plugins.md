---
title: Official Plugins
description: Official plugins ของ Tauri v2 ที่รองรับ use cases ทั่วไป
---

## Core Plugins

### File System Plugin

```bash
bun install @tauri-apps/plugin-fs
```

**Features**
- Read/write files
- Directory operations
- File metadata
- Watch for changes

**Usage**
```typescript
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs'

const content = await readTextFile('path/to/file.txt')
await writeTextFile('path/to/file.txt', 'Hello World')
```

### Shell Plugin

```bash
bun install @tauri-apps/plugin-shell
```

**Features**
- Execute shell commands
- Open URLs
- Open files with default app

**Usage**
```typescript
import { open } from '@tauri-apps/plugin-shell'

await open('https://tauri.app')
await open('path/to/file.pdf')
```

### Dialog Plugin

```bash
bun install @tauri-apps/plugin-dialog
```

**Features**
- File dialogs (open, save)
- Message dialogs
- Confirm dialogs

**Usage**
```typescript
import { open, save } from '@tauri-apps/plugin-dialog'

const filePath = await open({
  multiple: false,
  filters: [{ name: 'Text', extensions: ['txt'] }]
})
```

### Notification Plugin

```bash
bun install @tauri-apps/plugin-notification
```

**Features**
- System notifications
- Custom sounds
- Action buttons

**Usage**
```typescript
import { sendNotification } from '@tauri-apps/plugin-notification'

await sendNotification({
  title: 'Hello',
  body: 'World'
})
```

### HTTP Plugin

```bash
bun install @tauri-apps/plugin-http
```

**Features**
- HTTP requests
- WebSocket support
- Custom headers

**Usage**
```typescript
import { fetch } from '@tauri-apps/plugin-http'

const response = await fetch('https://api.example.com')
const data = await response.json()
```

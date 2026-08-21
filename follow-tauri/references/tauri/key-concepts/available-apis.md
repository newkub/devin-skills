---
title: Available APIs
description: APIs ที่มีให้ใช้ใน Tauri
---

## File System API

```typescript
import { readTextFile, writeTextFile, exists } from '@tauri-apps/plugin-fs'

// Read file
const content = await readTextFile('path/to/file.txt')

// Write file
await writeTextFile('path/to/file.txt', 'Hello World')

// Check if file exists
const fileExists = await exists('path/to/file.txt')
```

## Shell API

```typescript
import { open, Command } from '@tauri-apps/plugin-shell'

// Open URL
await open('https://tauri.app')

// Open file
await open('path/to/file.pdf')

// Execute command
const command = Command.create('echo', ['Hello'])
const output = await command.execute()
console.log(output.stdout)
```

## Dialog API

```typescript
import { open, save, message } from '@tauri-apps/plugin-dialog'

// Open file dialog
const filePath = await open({
  multiple: false,
  filters: [{ name: 'Text', extensions: ['txt'] }]
})

// Save file dialog
const savePath = await save({
  filters: [{ name: 'Text', extensions: ['txt'] }]
})

// Message dialog
await message('Operation completed', 'Success')
```

## Notification API

```typescript
import { sendNotification } from '@tauri-apps/plugin-notification'

await sendNotification({
  title: 'Hello',
  body: 'World',
  icon: 'path/to/icon.png'
})
```

## HTTP API

```typescript
import { fetch } from '@tauri-apps/plugin-http'

const response = await fetch('https://api.example.com/data')
const data = await response.json()
```

## Window API

```typescript
import { getCurrentWindow } from '@tauri-apps/api/window'

const window = getCurrentWindow()

// Set title
await window.setTitle('My App')

// Resize
await window.setSize({ width: 800, height: 600 })

// Minimize
await window.minimize()

// Close
await window.close()
```

## App API

```typescript
import { getVersion, getName } from '@tauri-apps/api/app'

const version = await getVersion()
const name = await getName()
```

## Path API

```typescript
import { appDir, downloadDir, documentDir } from '@tauri-apps/api/path'

const appDirPath = await appDir()
const downloadDirPath = await downloadDir()
const documentDirPath = await documentDir()
```

## Event API

```typescript
import { listen, emit } from '@tauri-apps/api/event'

// Listen to event
const unlisten = await listen('my-event', (event) => {
  console.log('Received:', event.payload)
})

// Emit event
await emit('my-event', { data: 'Hello' })
```

## Clipboard API

```typescript
import { readText, writeText } from '@tauri-apps/api/clipboard'

// Read clipboard
const text = await readText()

// Write to clipboard
await writeText('Hello World')
```

---
title: System APIs Use Cases
description: Common use cases สำหรับ System APIs
---

## File Management

```typescript
import { readTextFile, writeTextFile, exists } from '@tauri-apps/plugin-fs'
import { join } from '@tauri-apps/api/path'

async function saveUserData(data: any) {
  const appDir = await appDir()
  const filePath = await join(appDir, 'user-data.json')
  await writeTextFile(filePath, JSON.stringify(data))
}

async function loadUserData() {
  const appDir = await appDir()
  const filePath = await join(appDir, 'user-data.json')
  
  if (await exists(filePath)) {
    const content = await readTextFile(filePath)
    return JSON.parse(content)
  }
  return null
}
```

## Settings Management

```typescript
import { join } from '@tauri-apps/api/path'
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs'

async function saveSetting(key: string, value: any) {
  const appDir = await appDir()
  const settingsPath = await join(appDir, 'settings.json')
  
  const content = await readTextFile(settingsPath)
  const settings = JSON.parse(content || '{}')
  settings[key] = value
  
  await writeTextFile(settingsPath, JSON.stringify(settings))
}
```

## Download Management

```typescript
import { downloadDir } from '@tauri-apps/api/path'
import { writeBinaryFile } from '@tauri-apps/plugin-fs'

async function downloadFile(url: string, filename: string) {
  const response = await fetch(url)
  const buffer = await response.arrayBuffer()
  
  const downloadPath = await downloadDir()
  const filePath = await join(downloadPath, filename)
  
  await writeBinaryFile(filePath, new Uint8Array(buffer))
}
```

## System Integration

```typescript
import { open } from '@tauri-apps/plugin-shell'

async function openInBrowser(url: string) {
  await open(url)
}

async function openInExplorer(path: string) {
  await open(path)
}
```

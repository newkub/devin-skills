---
title: Plugin APIs
description: Plugin APIs ของ Tauri
---

## fs Plugin

```typescript
import {
  readTextFile,
  writeTextFile,
  readDir,
  createDir,
  removeFile,
} from '@tauri-apps/plugin-fs';

// Read file
const content = await readTextFile('config.json');

// Write file
await writeTextFile('output.txt', 'Hello World');
```

## dialog Plugin

```typescript
import { open, save, message, ask, confirm } from '@tauri-apps/plugin-dialog';

// Open file dialog
const selected = await open({
  multiple: false,
  filters: [{ name: 'Text', extensions: ['txt', 'md'] }],
});

// Save file dialog
const path = await save({
  filters: [{ name: 'Text', extensions: ['txt'] }],
});

// Message dialog
await message('Hello!', { title: 'Greeting', kind: 'info' });
```

## http Plugin

```typescript
import { fetch } from '@tauri-apps/plugin-http';

const response = await fetch('https://api.example.com/data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ key: 'value' }),
});

const data = await response.json();
```

## store Plugin

```typescript
import { load } from '@tauri-apps/plugin-store';

const store = await load('settings.json', { autoSave: true });

// Set value
await store.set('theme', 'dark');

// Get value
const theme = await store.get('theme');

// Delete value
await store.delete('theme');

// Save
await store.save();
```

## shell Plugin

```typescript
import { open as openUrl } from '@tauri-apps/plugin-shell';

// Open URL in default browser
await openUrl('https://tauri.app');

// Execute command
const output = await new Command('ls', ['-la']).execute();
```

## sql Plugin

```typescript
import Database from '@tauri-apps/plugin-sql';

const db = await Database.load('sqlite:test.db');

// Execute query
await db.execute('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)');

// Insert
await db.execute('INSERT INTO users (name) VALUES ($1)', ['John']);

// Select
const users = await db.select('SELECT * FROM users');

// Update
await db.execute('UPDATE users SET name = $1 WHERE id = $2', ['Jane', 1]);

// Close
await db.close();
```

## os Plugin

```typescript
import { platform, version, arch, tempdir, locale } from '@tauri-apps/plugin-os';

// Get platform info
const platform = await platform(); // 'windows', 'linux', 'darwin'
const version = await version();
const arch = await arch();
const tempdir = await tempdir();
const locale = await locale();
```

## process Plugin

```typescript
import { exit, relaunch } from '@tauri-apps/plugin-process';

// Exit app
await exit(0);

// Relaunch app
await relaunch();
```

## updater Plugin

```typescript
import { check, install, onUpdaterEvent } from '@tauri-apps/plugin-updater';

// Check for updates
const { shouldUpdate, manifest } = await check();

// Install update
if (shouldUpdate) {
  await install();
}

// Listen to updater events
const unlisten = await onUpdaterEvent((event) => {
  console.log(event.status);
});
```

## log Plugin

```typescript
import { trace, debug, info, warn, error } from '@tauri-apps/plugin-log';

// Log messages
await trace('Trace message');
await debug('Debug message');
await info('Info message');
await warn('Warning message');
await error('Error message');
```

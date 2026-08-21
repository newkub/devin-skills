# Integration

## Frontend Frameworks

### React

```bash
bun install @tauri-apps/api @tauri-apps/plugin-fs
```

```tsx
// src/App.tsx
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';

function App() {
  const [greeting, setGreeting] = useState('');

  async function handleClick() {
    const result = await invoke<string>('greet', { name: 'React' });
    setGreeting(result);
  }

  async function handleOpenFile() {
    const selected = await open();
    console.log(selected);
  }

  return (
    <div>
      <button onClick={handleClick}>Greet</button>
      <p>{greeting}</p>
      <button onClick={handleOpenFile}>Open File</button>
    </div>
  );
}
```

### Vue

```bash
bun install @tauri-apps/api @tauri-apps/plugin-dialog
```

```vue
<!-- src/App.vue -->
<script setup>
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { ref } from 'vue';

const greeting = ref('');

async function greet() {
  greeting.value = await invoke('greet', { name: 'Vue' });
}
</script>

<template>
  <button @click="greet">Greet</button>
  <p>{{ greeting }}</p>
</template>
```

### Svelte

```bash
bun install @tauri-apps/api
```

```svelte
<!-- src/App.svelte -->
<script>
  import { invoke } from '@tauri-apps/api/core';
  let greeting = '';

  async function greet() {
    greeting = await invoke('greet', { name: 'Svelte' });
  }
</script>

<button on:click={greet}>Greet</button>
<p>{greeting}</p>
```

## Backend Integrations

### Database (SQLite)

```bash
bun run tauri add sql
```

```rust
// src-tauri/src/lib.rs
use tauri_plugin_sql::{Migration, MigrationKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::new()
            .add_migrations("sqlite:app.db", vec![
                Migration {
                    version: 1,
                    description: "create_users",
                    sql: "CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT);",
                    kind: MigrationKind::Up,
                }
            ])
            .build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### HTTP Client

```bash
bun run tauri add http
```

```javascript
import { fetch } from '@tauri-apps/plugin-http';

const response = await fetch('https://api.example.com/data', {
  method: 'GET',
});
const data = await response.json();
```

### File System

```bash
bun run tauri add fs
```

```javascript
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';

const content = await readTextFile('config.json');
await writeTextFile('output.json', JSON.stringify(data));
```

## Build Tools

### Vite

```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  clearScreen: false,
  server: {
    port: 1430,
    strictPort: true,
  },
  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    target: process.env.TAURI_ENV_PLATFORM === 'windows' ? 'chrome105' : 'safari13',
    minify: !process.env.TAURI_ENV_DEBUG ? 'esbuild' : false,
    sourcemap: !!process.env.TAURI_ENV_DEBUG,
  },
});
```

### Webpack

```javascript
// webpack.config.js
module.exports = {
  // Tauri expects absolute paths
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
};
```

## Testing

### Playwright

```javascript
// tests/tauri.spec.js
import { test, expect } from '@playwright/test';
import { invoke } from '@tauri-apps/api/core';

test('greet command works', async () => {
  const result = await invoke('greet', { name: 'Test' });
  expect(result).toBe('Hello, Test!');
});
```

### Rust Testing

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_greet() {
        let result = greet("Test");
        assert_eq!(result, "Hello, Test!");
    }
}
```
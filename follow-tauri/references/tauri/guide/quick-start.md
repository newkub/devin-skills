# Quick Start

## 1. Create Project

### Using create-tauri-app

```bash
bun create tauri-app@latest my-app
cd my-app
```

### Manual Setup

```bash
mkdir my-app && cd my-app
bun init -y
bun install @tauri-apps/cli@latest @tauri-apps/api@latest
bun run tauri init
```

## 2. Project Structure

```
my-app/
├── src/                    # Frontend source
│   ├── main.js
│   ├── App.vue (or .svelte, .tsx)
│   └── style.css
├── src-tauri/              # Rust backend
│   ├── src/
│   │   └── lib.rs
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── capabilities/
│       └── main.json
├── package.json
└── vite.config.js          # or other bundler config
```

## 3. Configure tauri.conf.json

```json
{
  "build": {
    "devUrl": "http://localhost:3000",
    "frontendDist": "../dist",
    "beforeDevCommand": "bun run dev",
    "beforeBuildCommand": "bun run build"
  }
}
```

## 4. Add Capabilities

```json
// src-tauri/capabilities/main.json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "main-capability",
  "windows": ["main"],
  "permissions": ["core:default"]
}
```

## 5. Create Rust Command

```rust
// src-tauri/src/lib.rs
use tauri::Command;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## 6. Call from Frontend

```javascript
// src/main.js
import { invoke } from '@tauri-apps/api/core';

async function greetUser() {
  const greeting = await invoke('greet', { name: 'World' });
  console.log(greeting);
}

greetUser();
```

## 7. Run Development Server

```bash
bun run tauri dev
# or
cargo tauri dev
```

## 8. Build for Production

```bash
bun run tauri build
# or
cargo tauri build
```

## Next Steps

| Task | Command |
|------|---------|
| Add plugin | `bun run tauri add fs` |
| Add plugin | `bun run tauri add dialog` |
| Generate icons | `bun run tauri icon` |
| Run on Android | `bun run tauri android dev` |
| Run on iOS | `bun run tauri ios dev` |

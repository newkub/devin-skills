# Best Practices

## Rust Commands

### Use Serde for Serialization

```rust
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct User {
    pub name: String,
    pub age: u32,
}

#[tauri::command]
fn get_user() -> User {
    User {
        name: "John".to_string(),
        age: 30,
    }
}
```

### Async Commands

```rust
use tokio;

#[tauri::command]
async fn fetch_data(url: String) -> Result<String, String> {
    let response = reqwest::get(&url)
        .await
        .map_err(|e| e.to_string())?;
    let body = response.text().await.map_err(|e| e.to_string())?;
    Ok(body)
}
```

## Frontend Integration

### Error Handling

```javascript
import { invoke } from '@tauri-apps/api/core';

try {
  const result = await invoke('my_command', { arg: 'value' });
  console.log(result);
} catch (error) {
  console.error('Tauri error:', error);
}
```

### TypeScript Types

```typescript
// types/tauri.d.ts
interface User {
  name: string;
  age: number;
}

declare global {
  interface Window {
    __TAURI__?: any;
  }
}
```

## Security

### Use Capabilities

```json
// capabilities/main.json
{
  "identifier": "main-capability",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "fs:allow-read-text-file",
    "dialog:allow-open"
  ]
}
```

### Avoid eval()

```rust
// ❌ Bad
#[tauri::command]
fn execute(code: String) -> String {
    // Never evaluate user input!
}

// ✅ Good
#[tauri::command]
fn read_file(path: String) -> Result<String, String> {
    // Validate and sanitize
    std::fs::read_to_string(&path).map_err(|e| e.to_string())
}
```

## Performance

### Minimize IPC Calls

```javascript
// ❌ Bad - Multiple calls
for (const item of items) {
  await invoke('process_item', { item });
}

// ✅ Good - Batch processing
await invoke('process_items', { items });
```

### Lazy Loading

```javascript
// Load plugin only when needed
async function showDialog() {
  const { open } = await import('@tauri-apps/plugin-dialog');
  await open();
}
```

## Build Configuration

### Enable Devtools for Debugging

```json
{
  "build": {
    "devtools": true
  }
}
```

### Optimize Binary Size

```json
{
  "bundle": {
    "targets": ["nsis", "msi"],
    "strip": true
  }
}
```

## Project Organization

```
src-tauri/
├── src/
│   ├── lib.rs           # Main entry
│   ├── commands/       # Command modules
│   ├── models/         # Data structures
│   └── utils/          # Utilities
├── capabilities/        # Permissions
└── tauri.conf.json
```

## Code Signing

```bash
# Generate signing key
bun run tauri signer generate

# Sign during build
bun run tauri build -- --signing-key ./key.pem
```
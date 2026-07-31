---
title: Separation of Concerns Violations
description: การละเมิดหลักการ Separation of Concerns ที่พบบ่อย
---

## Business Logic in Frontend

```typescript
// Bad: Business logic in frontend
async function calculateDiscount(price: number) {
  if (price > 1000) {
    return price * 0.9
  }
  return price
}

// Good: Move to backend
const discountedPrice = await invoke('calculate_discount', { price })
```

## Direct Infrastructure Access from Frontend

```typescript
// Bad: Direct file system access
import { readTextFile } from '@tauri-apps/plugin-fs'
const content = await readTextFile('data.txt')

// Good: Use IPC command
const content = await invoke('read_file', { path: 'data.txt' })
```

## Tight Coupling Between Layers

```rust
// Bad: Tight coupling
#[tauri::command]
async fn process_data() -> Result<String, String> {
    let db = Database::new(); // Direct dependency
    let file = FileRepository::new(); // Direct dependency
    // Process
    Ok("Done".to_string())
}

// Good: Dependency injection
#[tauri::command]
async fn process_data(
    db: State<Database>,
    repo: State<FileRepository>
) -> Result<String, String> {
    // Process with injected dependencies
    Ok("Done".to_string())
}
```

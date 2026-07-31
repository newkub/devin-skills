---
title: Testing Strategies
description: Testing strategies สำหรับ Tauri applications
---

## Unit Testing

**Rust Unit Tests**

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add() {
        assert_eq!(add(2, 2), 4);
    }

    #[test]
    fn test_command() {
        let result = my_command("test");
        assert!(result.is_ok());
    }
}
```

Run with:
```bash
cargo test
```

**JavaScript Unit Tests**

```typescript
// src/utils.test.ts
import { describe, it, expect } from 'vitest'
import { add } from './utils'

describe('utils', () => {
  it('should add numbers', () => {
    expect(add(2, 2)).toBe(4)
  })
})
```

Run with:
```bash
bun test
```

## Integration Testing

**Tauri Commands**

```rust
#[tauri::command]
async fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_greet() {
        assert_eq!(greet("World".to_string()).await, "Hello, World!");
    }
}
```

## E2E Testing

**Playwright Setup**

```bash
bun install -D @playwright/test
npx playwright install
```

**E2E Test Example**

```typescript
// tests/e2e/app.spec.ts
import { test, expect } from '@playwright/test'

test('app loads', async ({ page }) => {
  await page.goto('http://localhost:1420')
  await expect(page).toHaveTitle(/My App/)
})

test('button click', async ({ page }) => {
  await page.goto('http://localhost:1420')
  await page.click('button#greet')
  await expect(page.locator('#result')).toHaveText('Hello, World!')
})
```

Run with:
```bash
bun run tauri build
npx playwright test
```

## IPC Testing

**Test IPC Commands**

```rust
#[cfg(test)]
mod ipc_tests {
    use super::*;
    use tauri::Manager;

    #[test]
    fn test_ipc_command() {
        let app = tauri::Builder::default()
            .build(tauri::generate_context!())
            .expect("error while building tauri application");

        let result = app.invoke("greet", Some("World"));
        assert_eq!(result, "Hello, World!");
    }
}
```

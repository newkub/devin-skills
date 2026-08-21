---
title: Mocking
description: Mocking Tauri APIs และ dependencies
---

## Mocking Tauri APIs

```typescript
// __mocks__/@tauri-apps/api/tauri.ts
export const invoke = jest.fn()

// test file
import { invoke } from '@tauri-apps/api/tauri'

jest.mock('@tauri-apps/api/tauri')

test('mock invoke', async () => {
  invoke.mockResolvedValue('Hello')
  const result = await invoke('greet', { name: 'World' })
  expect(result).toBe('Hello')
})
```

## Mocking File System

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;
    use tempfile::TempDir;

    #[test]
    fn test_file_operations() {
        let dir = TempDir::new().unwrap();
        let file_path = dir.path().join("test.txt");
        
        fs::write(&file_path, "Hello").unwrap();
        let content = fs::read_to_string(&file_path).unwrap();
        
        assert_eq!(content, "Hello");
    }
}
```

# Testing

## Bun Test Runner

- Built-in - ไม่ต้องติดตั้งเพิ่ม
- Fast - รัน tests เร็ว
- TypeScript support - รัน TypeScript ได้โดยตรง
- Snapshots - รองรับ snapshot testing
- Mocking - รองรับ mocking functions

## Basic Usage

### Test File

```typescript
import { describe, it, expect } from 'bun:test';
describe('Math operations', () => {
  it('should add numbers', () => { expect(1 + 1).toBe(2); });
  it('should multiply numbers', () => { expect(2 * 3).toBe(6); });
});
```

### Run Tests

```bash
bun test
bun test --watch
```

## Advanced Features

### Async Tests

```typescript
it('should handle async', async () => {
  const result = await fetchData();
  expect(result).toBeDefined();
});
```

### Snapshots

```typescript
it('should match snapshot', () => {
  const data = { name: 'Bun', version: '1.0' };
  expect(data).toMatchSnapshot();
});
```

### Mocking

```typescript
import { mock } from 'bun:test';
const mockFn = mock(() => 'mocked');
mockFn();
expect(mockFn).toHaveBeenCalled();
```

## Best Practices

- ตั้งชื่อ test files ด้วย `.test.ts`
- ใช้ `describe` สำหรับ grouping
- เขียน test ที่ชัดเจนและอ่านง่าย
- ใช้ `beforeEach` และ `afterEach` สำหรับ setup/teardown

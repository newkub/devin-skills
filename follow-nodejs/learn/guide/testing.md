---
description: การทดสอบด้วย Node.js
---

## Goal

อธิบายวิธีการทดสอบด้วย Node.js

## Scope

สำหรับโปรเจกต์ที่ใช้ Node.js เป็น runtime

## Testing Frameworks

### Jest

- **Built-in** - ไม่ต้องติดตั้งเพิ่ม
- **Fast** - Parallel test execution
- **Snapshot testing** - รองรับ snapshots
- **Mocking** - Built-in mocking

### Mocha

- **Flexible** - Customizable
- **Async support** - รองรับ async/await
- **Plugins** - Extensible

## Basic Usage with Jest

### 1. Install Jest

```bash
bun install -D jest
```

### 2. Create Test File

สร้าง `test/index.test.js`:

```javascript
describe('Math operations', () => {
  it('should add numbers', () => {
    expect(1 + 1).toBe(2);
  });

  it('should multiply numbers', () => {
    expect(2 * 3).toBe(6);
  });
});
```

### 3. Add Script

ใน `package.json`:

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

### 4. Run Tests

```bash
bun test
```

## Advanced Features

### Async Tests

```javascript
it('should handle async', async () => {
  const result = await fetchData();
  expect(result).toBeDefined();
});
```

### Mocking

```javascript
jest.mock('./api', () => ({
  fetchData: jest.fn(() => Promise.resolve('mocked')),
}));
```

### Snapshots

```javascript
it('should match snapshot', () => {
  const data = { name: 'Node', version: '20' };
  expect(data).toMatchSnapshot();
});
```

## Best Practices

- ตั้งชื่อ test files ด้วย `.test.js`
- ใช้ `describe` สำหรับ grouping
- เขียน test ที่ชัดเจนและอ่านง่าย
- ใช้ `beforeEach` และ `afterEach` สำหรับ setup/teardown
- ใช้ mocking สำหรับ external dependencies

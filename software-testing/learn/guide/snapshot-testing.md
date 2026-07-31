# Snapshot Testing

## Overview

Snapshot testing เป็นเทคนิคที่บันทึก output ของ component หรือ function และเปรียบเทียบกับ snapshot ที่บันทึกไว้ เพื่อตรวจสอบว่ามีการเปลี่ยนแปลงที่ไม่คาดคิด

## When to Use Snapshots

**ใช้เมื่อ:**
- Testing UI components (React, Vue, etc.)
- Testing data structures ที่ซับซ้อน
- Testing configuration objects
- Testing API responses

**ไม่ใช้เมื่อ:**
- Output มี dynamic data (timestamps, IDs)
- ต้องการ test logic ที่เฉพาะเจาะจง
- Output เปลี่ยนบ่อย

## Jest Snapshots

### Component Snapshots

```javascript
// Button.test.js
import { render } from '@testing-library/react';
import { Button } from './Button';

test('renders button correctly', () => {
  const { container } = render(<Button>Click me</Button>);
  expect(container.firstChild).toMatchSnapshot();
});
```

### Inline Snapshots

```javascript
test('renders button inline', () => {
  const { container } = render(<Button>Click me</Button>);
  expect(container.firstChild).toMatchInlineSnapshot(`
    <button>
      Click me
    </button>
  `);
});
```

### Property Matchers

```javascript
test('user object with matcher', () => {
  const user = {
    id: expect.any(Number),
    name: 'John',
    createdAt: expect.any(Date)
  };
  expect(user).toMatchSnapshot({
    id: expect.any(Number),
    createdAt: expect.any(Date)
  });
});
```

### Updating Snapshots

```bash
# Update all snapshots
jest --updateSnapshot

# Update specific snapshot
jest --updateSnapshot Button.test.js

# Interactive mode
jest -u
```

## Vitest Snapshots

### Component Snapshots

```typescript
import { render } from '@testing-library/vue';
import { Button } from './Button';

test('renders button correctly', () => {
  const { container } = render(Button, { slots: { default: 'Click me' } });
  expect(container.firstChild).toMatchSnapshot();
});
```

### Inline Snapshots

```typescript
test('renders button inline', () => {
  const { container } = render(Button, { slots: { default: 'Click me' } });
  expect(container.firstChild).toMatchInlineSnapshot(`
    <button>
      Click me
    </button>
  `);
});
```

## Best Practices

### 1. Review Snapshots Carefully

```javascript
// BAD - Accept without review
expect(component).toMatchSnapshot();

// GOOD - Review changes manually
// Run: jest --updateSnapshot
// Review: Check if changes are intentional
```

### 2. Avoid Dynamic Data

```javascript
// BAD - Includes timestamp
const user = {
  id: 1,
  name: 'John',
  createdAt: new Date() // Changes every run
};
expect(user).toMatchSnapshot();

// GOOD - Use matchers
const user = {
  id: 1,
  name: 'John',
  createdAt: expect.any(Date)
};
expect(user).toMatchSnapshot();
```

### 3. Keep Snapshots Focused

```javascript
// BAD - Snapshot entire component tree
expect(render(<App />)).toMatchSnapshot();

// GOOD - Snapshot specific parts
expect(render(<Button />)).toMatchSnapshot();
```

### 4. Custom Serializers

```javascript
// Add custom serializer for Date
expect.addSnapshotSerializer({
  test: (val) => val instanceof Date,
  serialize: (val) => `Date(${val.toISOString()})`
});
```

## Common Pitfalls

### 1. Over-Reliance

```javascript
// BAD - Only snapshot, no assertions
expect(component).toMatchSnapshot();

// GOOD - Snapshot + specific assertions
expect(component).toMatchSnapshot();
expect(screen.getByText('Submit')).toBeInTheDocument();
```

### 2. Large Snapshots

```javascript
// BAD - Snapshot entire page
expect(render(<Page />)).toMatchSnapshot();

// GOOD - Snapshot components
expect(render(<Header />)).toMatchSnapshot();
expect(render(<Footer />)).toMatchSnapshot();
```

### 3. Ignoring Changes

```javascript
// BAD - Auto-update without review
jest --updateSnapshot

// GOOD - Review each change
jest --updateSnapshot
# Manually review git diff
```

## When to Avoid Snapshots

- **Dynamic content**: Timestamps, random IDs
- **Frequent changes**: UI ที่เปลี่ยนบ่อย
- **Logic testing**: ใช้ assertions แทน
- **Large outputs**: Snapshots ใหญ่เกินไป

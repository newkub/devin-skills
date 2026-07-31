# Quick Start

## 1. Choose Testing Framework

| Framework | Language | Best For |
|-----------|----------|----------|
| **Jest** | JavaScript/TypeScript | React apps |
| **Vitest** | JavaScript/TypeScript | Vite projects |
| **pytest** | Python | Python applications |
| **JUnit** | Java | Java applications |
| **RSpec** | Ruby | Ruby applications |

## 2. Install Dependencies

### JavaScript/TypeScript

```bash
# Jest
bun install --save-dev jest @types/jest ts-jest

# Vitest
bun install --save-dev vitest @vitest/ui
```

### Python

```bash
# pytest
pip install pytest pytest-cov pytest-asyncio
```

## 3. Setup Test File

```javascript
// sum.test.js
import { describe, it, expect } from 'vitest';
import { sum } from './sum';

describe('sum', () => {
  it('adds two numbers', () => {
    expect(sum(1, 2)).toBe(3);
  });

  it('handles negative numbers', () => {
    expect(sum(-1, -1)).toBe(-2);
  });
});
```

```python
# test_sum.py
import pytest
from sum import sum

def test_adds_two_numbers():
    assert sum(1, 2) == 3

def test_handles_negative_numbers():
    assert sum(-1, -1) == -2
```

## 4. Run Tests

```bash
# Jest
bun test

# Vitest
npx vitest

# pytest
pytest
```

## 5. First Test Example

### Unit Test

```javascript
// user.test.js
describe('User', () => {
  describe('create', () => {
    it('should create user with valid data', () => {
      const user = User.create({
        name: 'John',
        email: 'john@example.com',
      });

      expect(user.name).toBe('John');
      expect(user.email).toBe('john@example.com');
    });

    it('should throw error for invalid email', () => {
      expect(() => {
        User.create({ name: 'John', email: 'invalid' });
      }).toThrow('Invalid email');
    });
  });
});
```
# Test Coverage

## Overview

Test coverage คือการวัดสัดส่วนของ code ที่ถูก execute โดย tests ช่วยระบุส่วนที่ยังไม่มี tests

## Coverage Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| **Line Coverage** | % of lines executed | 80%+ |
| **Branch Coverage** | % of branches taken | 80%+ |
| **Function Coverage** | % of functions called | 90%+ |
| **Statement Coverage** | % of statements executed | 80%+ |

## Jest Coverage

### Configuration

```javascript
// jest.config.js
module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx}',
    '!src/**/__tests__/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### Run Coverage

```bash
# Run with coverage
bun test -- --coverage

# Generate HTML report
bun test -- --coverage --coverageReporters=html

# Check specific file
bun test -- --coverage Button.test.js
```

### Coverage Thresholds

```javascript
// Per-file thresholds
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80
  },
  './src/components/': {
    branches: 90,
    functions: 90
  }
}
```

## Vitest Coverage

### Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.stories.{ts,tsx}'
      ],
      all: true,
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80
    }
  }
});
```

### Run Coverage

```bash
# Run with coverage
npx vitest run --coverage

# Generate HTML report
npx vitest run --coverage --reporter=html
```

## Pytest Coverage

### Installation

```bash
pip install pytest-cov
```

### Configuration

```ini
# pytest.ini or setup.cfg
[pytest]
addopts = --cov=src --cov-report=html --cov-report=term

[coverage:run]
source = src
omit = 
    */tests/*
    */__init__.py

[coverage:report]
fail_under = 80
```

### Run Coverage

```bash
# Run with coverage
pytest --cov=src --cov-report=html

# Check specific module
pytest --cov=src/module tests/test_module.py

# Generate XML report
pytest --cov=src --cov-report=xml
```

## Coverage vs Quality

### High Coverage != High Quality

```javascript
// 100% coverage but low quality
test('add function', () => {
  expect(add(1, 2)).toBe(3); // Only happy path
});

// Better coverage with quality
test('add function', () => {
  expect(add(1, 2)).toBe(3); // Happy path
  expect(add(-1, -1)).toBe(-2); // Negative numbers
  expect(add(0, 0)).toBe(0); // Edge case
});
```

### Meaningful Coverage

```javascript
// BAD - Coverage for coverage sake
test('trivial getter', () => {
  const obj = { getValue: () => 42 };
  expect(obj.getValue()).toBe(42);
});

// GOOD - Coverage for important logic
test('calculate discount', () => {
  expect(calculateDiscount(100, 0.1)).toBe(90);
  expect(calculateDiscount(100, 0)).toBe(100);
  expect(calculateDiscount(100, 1)).toBe(0);
});
```

## Best Practices

### 1. Set Realistic Targets

```javascript
// BAD - 100% coverage
coverageThreshold: {
  global: {
    lines: 100
  }
}

// GOOD - 80% coverage with exceptions
coverageThreshold: {
  global: {
    lines: 80
  },
  './src/utils/': {
    lines: 90
  },
  './src/types/': {
    lines: 0 // Type definitions
  }
}
```

### 2. Focus on Critical Paths

```javascript
// Prioritize coverage for:
// - Business logic
// - Security-critical code
// - Error handling
// - Complex algorithms
```

### 3. Review Uncovered Code

```bash
# Generate HTML report
bun test -- --coverage --coverageReporters=html

# Open report
open coverage/lcov-report/index.html

# Review uncovered lines manually
```

### 4. Combine with Other Metrics

- **Mutation testing**: ใช้ Stryker หรือ PIT
- **Complexity analysis**: ใช้ ESLint complexity rules
- **Code review**: Manual review ของ critical code

## CI Integration

### GitHub Actions

```yaml
name: Coverage
on: [push, pull_request]
jobs:
  coverage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install dependencies
        run: bun install
      - name: Run tests with coverage
        run: bun test -- --coverage
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
```

### Coverage Badges

```markdown
![Coverage](https://img.shields.io/codecov/c/github/user/repo)
```

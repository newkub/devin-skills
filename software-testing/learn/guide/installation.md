# Installation

## JavaScript/TypeScript

### Jest

```bash
# bun
bun install --save-dev jest @types/jest ts-jest

# yarn
yarn add --dev jest @types/jest ts-jest

# bun
bun add --dev jest @types/jest ts-jest
```

### Vitest

```bash
bun install --save-dev vitest
```

### Cypress

```bash
bun install --save-dev cypress
```

## Python

### pytest

```bash
pip install pytest
# or with extras
pip install pytest[all]
```

## Java

### JUnit 5

```xml
<!-- pom.xml -->
<dependencies>
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter</artifactId>
        <version>5.10.0</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

## Rust

### Built-in Testing

```toml
# Cargo.toml
[dev-dependencies]
mockall = "0.12"
```

## Go

### Testify

```bash
go get github.com/stretchr/testify
```

## VS Code Extensions

```json
{
  "recommendations": [
    "ms-python.python",
    "dbaeumer.vscode-jest-runner",
    "formulahendry.code-runner"
  ]
}
```

## Configuration Files

### Jest (jest.config.js)

```javascript
module.exports = {
  testMatch: ['**/__tests__/**/*.js'],
  collectCoverage: true,
  coverageThreshold: {
    global: { branches: 80, functions: 80 }
  }
};
```

### pytest (pytest.ini)

```ini
[pytest]
testpaths = tests
python_files = test_*.py
python_functions = test_*
addopts = -v --tb=short
```

## CI Setup

### GitHub Actions

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run tests
        run: bun test
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```
# Codegen Guide

## Description

วิธีใช้งาน Playwright Codegen สำหรับ generate test code อัตโนมัติจาก user actions

## Getting Started

### Run Codegen

```bash
bunx playwright codegen https://example.com
```

### Generate Tests

```bash
# Generate test with specific browser
bunx playwright codegen https://example.com --browser=chromium

# Generate test with specific output
bunx playwright codegen https://example.com --output=tests/example.spec.ts
```

## Codegen Features

### Record Actions

Codegen จะ record actions ที่คุณทำ:
- Clicks
- Fills
- Navigations
- Assertions
- Keyboard shortcuts

### Auto-Generated Locators

Codegen จะ generate locators ที่ robust:
- Role-based locators
- Text locators
- Label locators
- Test ID locators

### Assertions

Codegen จะ suggest assertions:
- Visible assertions
- Text assertions
- URL assertions
- Title assertions

## Common Patterns

### Recording a Test

```bash
# Start codegen
bunx playwright codegen https://example.com

# Perform actions in browser
# Codegen will generate code automatically

# Save generated test
```

### Custom Output

```bash
# Save to specific file
bunx playwright codegen https://example.com -o tests/my-test.spec.ts

# Target specific element
bunx playwright codegen https://example.com --target=button
```

### Language Selection

```bash
# Generate TypeScript (default)
bunx playwright codegen https://example.com

# Generate JavaScript
bunx playwright codegen https://example.com --language=javascript

# Generate Python
bunx playwright codegen https://example.com --language=python
```

## Best Practices

1. **Review Generated Code**: Review และ refine generated code
2. **Use Role-based Locators**: Codegen จะ prefer role-based locators
3. **Add Assertions**: Add assertions หลังจาก record actions
4. **Refactor**: Refactor generated code ให้ maintainable

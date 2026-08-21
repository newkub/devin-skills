# UI Mode Guide

## Description

วิธีใช้งาน Playwright UI Mode สำหรับ interactive test development และ debugging

## Getting Started

### Run UI Mode

```bash
bunx playwright test --ui
```

### UI Mode Features

- Watch mode สำหรับ automatic re-run
- Time travel debugging
- Live trace viewing
- Test filtering
- Inspect elements

## Common Patterns

### Watch Mode

```bash
# Run UI mode with watch
bunx playwright test --ui

# Tests auto-rerun on file changes
```

### Filter Tests

```bash
# Filter by file
bunx playwright test --ui example.spec.ts

# Filter by test name
bunx playwright test --ui -g "login"
```

### Time Travel Debugging

```typescript
// UI mode captures snapshots
// Click on timeline to see page state at any point
```

### Inspect Elements

```typescript
// Use inspector to find locators
// Click on element to see suggested locators
```

## UI Mode Interface

### Test List

- View all tests
- Filter tests
- Run specific tests
- See test status

### Timeline

- View execution timeline
- Click to time travel
- See snapshots
- Analyze actions

### Trace Viewer

- View network requests
- Check console logs
- See DOM snapshots
- Analyze performance

## Best Practices

1. **Use UI Mode for Development**: ใช้ UI mode สำหรับ development
2. **Time Travel Debugging**: ใช้ time travel สำหรับ debugging
3. **Inspect Elements**: ใช้ inspector สำหรับ find locators
4. **Watch Mode**: ใช้ watch mode สำหรับ rapid iteration

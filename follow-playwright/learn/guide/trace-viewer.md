# Trace Viewer Guide

## Description

วิธีใช้งาน Playwright Trace Viewer สำหรับ analyze test execution traces และ debugging

## Getting Started

### Enable Tracing

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    trace: 'on-first-retry',
  },
});
```

### View Trace

```bash
# Open trace viewer
bunx playwright show-trace trace.zip
```

## Trace Configuration

### Trace Modes

```typescript
// Trace on first retry
use: {
  trace: 'on-first-retry',
}

// Trace on all retries
use: {
  trace: 'on-all-retries',
}

// Trace always
use: {
  trace: 'retain-on-failure',
}

// Trace all tests
use: {
  trace: 'retain-on-failure',
}
```

### Custom Trace Path

```typescript
// Custom trace path
use: {
  trace: 'on-first-retry',
  traceDir: './traces',
}
```

## Trace Viewer Features

### Timeline View

- View execution timeline
- See action sequence
- Identify slow operations
- Analyze network requests

### Network Tab

- View network requests
- Check request/response details
- Analyze timing
- Debug network issues

### Console Tab

- View console logs
- Check errors and warnings
- Debug JavaScript issues
- Analyze console output

### Snapshots

- View DOM snapshots
- Check element state
- Analyze page changes
- Debug rendering issues

## Best Practices

1. **Use Tracing in CI**: Enable tracing ใน CI environment
2. **Analyze Failures**: Use traces สำหรับ analyze failures
3. **Share Traces**: Share traces สำหรับ collaboration
4. **Clean Up Traces**: Clean up old traces เป็นประจำ

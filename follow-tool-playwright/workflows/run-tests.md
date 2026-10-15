# Run Tests

## Description

Run Playwright tests

## Steps

### 1. Run All Tests

```bash
bunx playwright test
```

### 2. Run Specific Test

```bash
bunx playwright test tests/example.spec.ts
```

### 3. Run Tests in Project

```bash
bunx playwright test --project chromium
```

### 4. Run Tests with Pattern

```bash
bunx playwright test tests/login/
```

## Options

### UI Mode

```bash
bunx playwright test --ui
```

### Debug Mode

```bash
bunx playwright test --debug
```

### Headed Mode

```bash
bunx playwright test --headed
```

### Update Snapshots

```bash
bunx playwright test --update-snapshots
```

## Best Practices

1. Run Locally: Run tests locally before CI
2. Use UI Mode: Use UI mode for debugging
3. Parallel Execution: Use parallel execution for speed
4. Headless in CI: Use headless mode in CI

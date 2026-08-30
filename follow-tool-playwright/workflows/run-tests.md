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

1. Run Locally: Run tests locally ก่อน CI
2. Use UI Mode: ใช้ UI mode สำหรับ debugging
3. Parallel Execution: ใช้ parallel execution สำหรับ speed
4. Headless in CI: ใช้ headless mode ใน CI

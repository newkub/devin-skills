# Installation

## Description

ติดตั้ง Playwright สำหรับ end-to-end testing

## Steps

### Using create-playwright

```bash
bunx create-playwright
```

### Manual Installation

```bash
# Install Playwright
bun add -D @playwright/test

# Install browsers
bunx playwright install --with-deps
```

## Verify Installation

```bash
bunx playwright --version
```

## Best Practices

1. **Use create-playwright**: ใช้ create-playwright สำหรับ setup ง่าย
2. **Install Browsers**: Install browsers ด้วย --with-deps
3. **Version Pin**: Pin version สำหรับ consistency
4. **Update Regularly**: Update Playwright เป็นประจำ

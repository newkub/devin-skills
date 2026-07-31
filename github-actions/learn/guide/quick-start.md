# Quick Start

## เริ่มต้นใช้งาน GitHub Actions

### สร้าง Workflow แรก

1. สร้าง folder `.github/workflows/`
2. สร้างไฟล์ `ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: bun install
      - run: bun test
```

### ดูผลลัพธ์

- Push ไปยัง repository
- ไปที่ **Actions** tab เพื่อดู workflow ทำงาน

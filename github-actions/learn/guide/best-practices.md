# Best Practices

## แนวทางปฏิบัติที่ดี

### 1. Use Caching

ใช้ caching สำหรับ dependencies เพื่อลด build time

```yaml
- uses: actions/cache@v3
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/bun.lockb') }}
```

### 2. Use Matrix Strategy

Test บนหลาย platforms และ versions พร้อมกัน

```yaml
strategy:
  matrix:
    node-version: [18, 20]
    os: [ubuntu-latest, windows-latest]
```

### 3. Pin Action Versions

ใช้ specific version แทน @latest

```yaml
- uses: actions/checkout@v4  # ✅ Good
- uses: actions/checkout@latest  # ❌ Bad
```

### 4. Use Bun Package Manager

ใช้ `bun install` แทน `bun install` สำหรับความเร็ว

```yaml
- run: bun install
- run: bun test
```

### 5. Set Permissions

ตั้งค่า permissions อย่างเหมาะสมสำหรับ security

```yaml
permissions:
  contents: read
```

### 6. Use Reusable Workflows

Share logic ระหว่าง repositories

```yaml
jobs:
  build:
    uses: org/repo/.github/workflows/build.yml@main
```

### 7. Monitor Build Times

ตรวจสอบ build times และ optimize ด้วย caching

### 8. Use Dependabot

Auto-update dependencies ด้วย Dependabot

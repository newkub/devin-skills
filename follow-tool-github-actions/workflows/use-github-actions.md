---
title: Use GitHub Actions
description: ใช้งาน GitHub Actions สำหรับ automation
---

## Goal

ใช้งาน GitHub Actions สำหรับ automation ต่างๆ

## Execute

### 1. ใช้ Caching

เพิ่ม caching สำหรับ dependencies:

```yaml
- name: Cache Dependencies
  uses: actions/cache@v3
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/bun.lockb') }}
```

### 2. ใช้ Matrix Strategy

Test บนหลาย platforms:

```yaml
strategy:
  matrix:
    node-version: [18, 20]
    os: [ubuntu-latest, windows-latest]
```

### 3. ใช้ Secrets

ใช้ secrets ใน workflow:

```yaml
- name: Deploy
  run: bun run deploy
  env:
    API_KEY: ${{ secrets.API_KEY }}
```

### 4. ใช้ Artifacts

Upload build artifacts:

```yaml
- name: Upload Artifacts
  uses: actions/upload-artifact@v3
  with:
    name: build-output
    path: dist/
```

## Expected Outcome

- Workflow ที่มี caching
- Test บนหลาย platforms
- Secrets ที่ปลอดภัย
- Artifacts ที่ถูกเก็บ

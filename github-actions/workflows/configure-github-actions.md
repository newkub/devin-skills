---
title: Configure GitHub Actions
description: ตั้งค่า GitHub Actions ขั้นสูง
---

## Goal

ตั้งค่า GitHub Actions ขั้นสูงสำหรับ production

## Execute

### 1. ตั้งค่า Permissions

จำกัด permissions:

```yaml
permissions:
  contents: read
  pull-requests: write
```

### 2. ตั้งค่า Environments

สร้าง environments สำหรับ deployment:

```yaml
jobs:
  deploy:
    environment: production
    runs-on: ubuntu-latest
```

### 3. ตั้งค่า Timeouts

กำหนด timeouts:

```yaml
jobs:
  test:
    timeout-minutes: 30
```

### 4. ตั้งค่า Reusable Workflows

สร้าง reusable workflow:

```yaml
# .github/workflows/build.yml
on:
  workflow_call:
    inputs:
      node-version:
        required: true
        type: string

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
```

ใช้ reusable workflow:

```yaml
jobs:
  build:
    uses: ./.github/workflows/build.yml
    with:
      node-version: '20'
```

## Expected Outcome

- Permissions ที่จำกัด
- Environments สำหรับ deployment
- Timeouts ที่เหมาะสม
- Reusable workflows

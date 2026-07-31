---
title: Setup GitHub Actions
description: ตั้งค่า GitHub Actions สำหรับ CI/CD
---

## Goal

ตั้งค่า GitHub Actions สำหรับ CI/CD ในโปรเจกต์

## Execute

### 1. สร้าง Workflow Folder

สร้าง folder `.github/workflows/` ใน root ของ repository

### 2. สร้าง Workflow File

สร้างไฟล์ `ci.yml`:

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

### 3. Push ไปยัง GitHub

Push workflow file ไปยัง repository

### 4. ตรวจสอบ

ไปที่ **Actions** tab เพื่อดู workflow ทำงาน

## Expected Outcome

- GitHub Actions workflow ที่ทำงานได้
- CI pipeline สำหรับ test

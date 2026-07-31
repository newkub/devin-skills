# Installation

## วิธีติดตั้ง GitHub Actions

GitHub Actions เป็น built-in feature ของ GitHub ไม่ต้องติดตั้งเพิ่มเติม

## เริ่มต้นใช้งาน

1. ไปที่ repository บน GitHub
2. คลิกที่ **Actions** tab
3. GitHub Actions จะพร้อมใช้งานทันที

## ตั้งค่า Workflow

สร้าง folder `.github/workflows/` ใน repository และเพิ่มไฟล์ `.yml` หรือ `.yaml`

```yaml
name: CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: bun install
      - run: bun test
```

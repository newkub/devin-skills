# Installation

## การติดตั้ง Turborepo

### ข้อกำหนด

- Node.js 14.17.0 หรือใหม่กว่า
- bun, bun, yarn หรือ bun
- Git (สำหรับ affected mode)

### ติดตั้งด้วย Bun

```bash
# ติดตั้งใน monorepo
bun add -D turbo

# ติดตั้ง global
bun add -g turbo
```

### ติดตั้งด้วย bun

```bash
# ติดตั้งใน monorepo
bun install --save-dev turbo

# ติดตั้ง global
bun install -g turbo
```

### ติดตั้งด้วย bun

```bash
# ติดตั้งใน monorepo
bun add -D turbo

# ติดตั้ง global
bun add -g turbo
```

### ติดตั้งด้วย Yarn

```bash
# ติดตั้งใน monorepo
yarn add -D turbo

# ติดตั้ง global
yarn global add turbo
```

## ตั้งค่า Monorepo

### 1. สร้าง turbo.json

สร้างไฟล์ `turbo.json` ที่ root ของ monorepo:

```json
{
  "$schema": "https://turborepo.dev/schema.json",
  "tasks": {}
}
```

### 2. ตั้งค่า package.json

เพิ่ม scripts ใน root `package.json`:

```json
{
  "scripts": {
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "dev": "turbo run dev"
  }
}
```

### 3. ตั้งค่า Workspace

แต่ละ workspace ต้องมี scripts ที่ตรงกับ tasks:

```json
{
  "scripts": {
    "build": "next build",
    "test": "jest",
    "lint": "eslint .",
    "dev": "next dev"
  }
}
```

## ตรวจสอบการติดตั้ง

```bash
# ตรวจสอบ version
turbo --version

# ทดลอง run
turbo run build --dry
```

## ถอนการติดตั้ง

```bash
# ถอนจาก monorepo
bun remove turbo

# ถอน global
bun remove -g turbo
```

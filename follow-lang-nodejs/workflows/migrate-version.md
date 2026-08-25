---
description: migrate ระหว่าง Node.js versions
---

## Goal

migrate โปรเจกต์จาก Node.js version เดิมไป version ใหม่

## Scope

สำหรับโปรเจกต์ที่ต้องการ upgrade Node.js version

## Execute

### 1. Check Current Version

```bash
node --version
npm --version
```

### 2. Install New Version

ใช้ nvm (Node Version Manager):

```bash
# ติดตั้ง version ใหม่
nvm install 20

# ใช้ version ใหม่
nvm use 20

# ตั้งเป็น default
nvm alias default 20
```

หรือใช้ n (Windows):

```bash
n 20
```

### 3. Update Dependencies

```bash
# อัปเดต npm
npm install -g npm@latest

# ลบ node_modules และ package-lock.json
rm -rf node_modules package-lock.json

# ติดตั้ง dependencies ใหม่
npm install
```

### 4. Check Breaking Changes

ตรวจสอบ breaking changes ใน Node.js changelog:
- [Node.js Changelog](https://nodejs.org/en/docs/es6/)

### 5. Test Application

```bash
npm test
npm run dev
```

### 6. Update Dependencies

ตรวจสอบ dependencies ที่อาจไม่รองรับ:

```bash
npm outdated
npm update
```

## Common Issues

### Native Modules

ถ้าใช้ native modules ที่ไม่รองรับ:
- รอ support จาก library
- ใช้ alternatives
- rebuild native modules

### Deprecated APIs

ตรวจสอบ APIs ที่ deprecated:
- ใช้ APIs ใหม่แทน
- อัปเดต code ให้เข้ากับ version ใหม่

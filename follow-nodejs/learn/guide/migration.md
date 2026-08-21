---
description: การ migrate ระหว่าง Node.js versions
---

## Goal

อธิบายขั้นตอนการ migrate โปรเจกต์ระหว่าง Node.js versions

## Scope

สำหรับโปรเจกต์ที่ต้องการ upgrade Node.js version

## Prerequisites

1. Backup โปรเจกต์
2. Test อย่างละเอียดหลัง migration
3. ตรวจสอบ breaking changes

## Migration Steps

### 1. Check Current Version

```bash
node --version
bun --version
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

### 3. Update Dependencies

```bash
# อัปเดต bun
bun install -g bun@latest

# ลบ node_modules และ package-lock.json
rm -rf node_modules package-lock.json

# ติดตั้ง dependencies ใหม่
bun install
```

### 4. Check Breaking Changes

ตรวจสอบ breaking changes:
- [Node.js Changelog](https://nodejs.org/en/docs/es6/)
- [API Changes](https://nodejs.org/docs/latest/api/)

### 5. Update Code

ตรวจสอบ APIs ที่ deprecated:

```javascript
// ❌ Deprecated
const buffer = new Buffer(10);

// ✅ New API
const buffer = Buffer.alloc(10);
```

### 6. Test Application

```bash
bun test
bun run dev
```

## Common Issues

### Native Modules

ถ้าใช้ native modules:
- Rebuild ด้วย `bun rebuild`
- รอ support จาก library
- ใช้ alternatives

### Deprecated APIs

ตรวจสอบ APIs ที่ deprecated:
- ใช้ APIs ใหม่แทน
- อัปเดต code ให้เข้ากับ version ใหม่

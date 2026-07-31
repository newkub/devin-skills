---
title: ESLint Plugin
description: ใช้ eslint-plugin-drizzle สำหรับ prevent accidental destructive operations
---

## Goal

ใช้ eslint-plugin-drizzle สำหรับ enforce best practices และ prevent destructive operations

## Scope

ใช้สำหรับ lint Drizzle ORM code และ prevent accidental destructive operations

## Execute

### 1. Installation

ติดตั้ง:

```bash
bun add -D eslint-plugin-drizzle
```

### 2. Configuration

เพิ่มใน `.eslintrc.js` หรือ `eslint.config.js`:

```javascript
module.exports = {
  plugins: ['drizzle'],
  rules: {
    'drizzle/enforce-delete-with-where': 'error',
    'drizzle/enforce-update-with-where': 'error',
  },
};
```

### 3. Rules

#### enforce-delete-with-where

บังคับให้ใช้ `.where()` กับ `.delete()`:

```typescript
// ❌ Error - ไม่มี where clause
await db.delete(users);

// ✅ OK - มี where clause
await db.delete(users).where(eq(users.id, 1));
```

#### enforce-update-with-where

บังคับให้ใช้ `.where()` กับ `.update()`:

```typescript
// ❌ Error - ไม่มี where clause
await db.update(users).set({ name: 'John' });

// ✅ OK - มี where clause
await db.update(users)
  .set({ name: 'John' })
  .where(eq(users.id, 1));
```

### 4. Flat Config (ESLint 9+)

สำหรับ ESLint 9+ ใช้ flat config:

```javascript
import drizzle from 'eslint-plugin-drizzle';

export default [
  {
    plugins: {
      drizzle,
    },
    rules: {
      'drizzle/enforce-delete-with-where': 'error',
      'drizzle/enforce-update-with-where': 'error',
    },
  },
];
```

## Rules

- เปิดใช้ rules ทั้งสองเสมอสำหรับ production code
- ใช้ `warn` แทน `error` ถ้าต้องการ flexibility
- ปิด rules สำหรับ test files ถ้าจำเป็น

## Expected Outcome

- Prevent accidental destructive operations
- Enforce best practices
- Safer database operations

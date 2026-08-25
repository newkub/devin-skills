---
description: ตั้งค่าโปรเจกต์ด้วย Node.js ตาม best practices
---

## Goal

ตั้งค่าโปรเจกต์ JavaScript/TypeScript ด้วย Node.js ตาม best practices

## Scope

สำหรับโปรเจกต์ใหม่ที่ต้องการใช้ Node.js เป็น runtime หลัก

## Execute

### 1. Initialize Project

```bash
npm init -y
```

หรือใช้ TypeScript:

```bash
npm init -y
bun add -D typescript @types/node
```

### 2. Install Dependencies

ใช้ `bun add` สำหรับ production dependencies:

```bash
bun add package-name
```

ใช้ `bun add -D` สำหรับ dev dependencies:

```bash
bun add -D typescript @types/node
```

### 3. Configure TypeScript

สร้าง `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### 4. Add Scripts

ใน `package.json`:

```json
{
  "scripts": {
    "dev": "node src/index.js",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest",
    "lint": "eslint ."
  }
}
```

### 5. Create Entry Point

สร้าง `src/index.js`:

```javascript
console.log("Hello from Node.js!");
```

### 6. Run Development

```bash
npm run dev
```

## Rules

- ใช้ `bun add` สำหรับ dependencies
- ใช้ `bun add -D` สำหรับ dev dependencies
- ใช้ TypeScript strict mode
- ใช้ `@types/node` สำหรับ type definitions
- ใช้ `nodemon` สำหรับ development watch mode

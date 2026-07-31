# Setup Elysia

ติดตั้งและ setup Elysia project ใหม่

## Prerequisites

- Bun runtime (recommended) หรือ Node.js 18+
- TypeScript 5+

## Installation

### 1. สร้าง Project ใหม่

```bash
# สร้าง folder ใหม่
mkdir my-elysia-app
cd my-elysia-app

# Initialize project
bun init

# ติดตั้ง Elysia
bun add elysia

# ติดตั้ง TypeScript (ถ้ายังไม่มี)
bun add -D @types/bun typescript
```

### 2. สร้าง tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ESNext"],
    "types": ["bun-types"],
    "strict": true,
    "skipLibCheck": true
  }
}
```

### 3. สร้าง Entry File

```typescript
// src/index.ts
import { Elysia } from 'elysia'

const app = new Elysia()
  .get('/', () => 'Hello Elysia!')
  .listen(3000)

console.log(`🦊 Elysia is running at http://localhost:${app.server?.port}`)
```

### 4. อัปเดต package.json

```json
{
  "scripts": {
    "dev": "bun run src/index.ts",
    "build": "bun build src/index.ts --outdir ./dist",
    "start": "bun run dist/index.js"
  }
}
```

## Development

### รัน Development Server

```bash
bun run dev
```

### เพิ่ม Hot Reload

```bash
bun add -D bun-plugin-hot
```

```typescript
// src/index.ts
import { Elysia } from 'elysia'
import { hot } from 'bun-plugin-hot'

const app = new Elysia()
  .get('/', () => 'Hello Elysia!')
  .listen(3000)

if (import.meta.hot) {
  import.meta.hot.accept()
}
```

## Optional Plugins

### CORS

```bash
bun add @elysia/cors
```

```typescript
import { cors } from '@elysia/cors'

app.use(cors())
```

### Swagger

```bash
bun add @elysia/swagger
```

```typescript
import { swagger } from '@elysia/swagger'

app.use(swagger())
```

### JWT

```bash
bun add @elysia/jwt
```

```typescript
import { jwt } from '@elysia/jwt'

app.use(jwt({
  name: 'jwt',
  secret: process.env.JWT_SECRET
}))
```

## Verification

### ทดสอบ Installation

```bash
# รัน dev server
bun run dev

# เปิด browser
# http://localhost:3000
```

### ทดสอบ TypeScript

```bash
bun run typecheck
```

## Next Steps

- อ่าน `/quick-start` สำหรับ quick start guide
- อ่าน `/configuration` สำหรับ configuration options
- อ่าน `/features` สำหรับ features ทั้งหมด

# Deploy Elysia

วิธี deployment Elysia applications

## Build for Production

### 1. Build Project

```bash
bun run build
```

### 2. Test Build

```bash
bun run start
```

## Deployment Platforms

### Vercel

#### 1. สร้าง vercel.json

```json
{
  "buildCommand": "bun run build",
  "outputDirectory": "dist",
  "devCommand": "bun run dev",
  "installCommand": "bun install"
}
```

#### 2. Deploy

```bash
bun add -D vercel
bunx vercel
```

### Cloudflare Workers

#### 1. สร้าง wrangler.toml

```toml
name = "elysia-app"
main = "dist/index.js"
compatibility_date = "2024-01-01"
```

#### 2. Build for Workers

```typescript
// src/index.ts
import { Elysia } from 'elysia'

const app = new Elysia()
  .get('/', () => 'Hello')
  .listen(3000)

export default {
  fetch: app.fetch
}
```

#### 3. Deploy

```bash
bun add -D wrangler
bunx wrangler deploy
```

### Railway

#### 1. Deploy

```bash
bun add -D @railway/cli
bunx railway login
bunx railway init
bunx railway up
```

### Docker

#### 1. สร้าง Dockerfile

```dockerfile
FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install

COPY . .
RUN bun run build

EXPOSE 3000

CMD ["bun", "run", "start"]
```

#### 2. Build Image

```bash
docker build -t elysia-app .
```

#### 3. Run Container

```bash
docker run -p 3000:3000 elysia-app
```

### Fly.io

#### 1. Deploy

```bash
bun add -D flyctl
bunx flyctl launch
bunx flyctl deploy
```

## Environment Variables

### .env File

```env
PORT=3000
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret
```

### Load Environment Variables

```typescript
const app = new Elysia({
  aot: process.env.NODE_ENV === 'production'
})
```

## Health Checks

### Health Endpoint

```typescript
app.get('/health', () => ({
  status: 'ok',
  timestamp: new Date().toISOString()
}))
```

## Monitoring

### Add Logging

```typescript
import { logger } from 'elysia/logger'

app.use(logger({
  level: 'info'
}))
```

## Best Practices

- **Production Mode**: เปิด AOT ใน production
- **Environment Variables**: ใช้ environment variables สำหรับ secrets
- **Health Checks**: เพิ่ม health endpoint
- **Monitoring**: เพิ่ม logging และ monitoring
- **Testing**: ทดสอบ build ก่อน deploy

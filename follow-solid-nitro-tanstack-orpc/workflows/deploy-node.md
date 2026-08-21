---
description: Deploy TanStack Start (SolidJS) กับ Nitro ไปยัง Node.js
---

## Deploy to Node.js

### 1. Build Project

```bash
bun run build
```

### 2. Start Server

```bash
bun run start
```

หรือ:

```bash
node .output/server/index.mjs
```

### 3. Environment Variables

ตั้งค่า environment variables ใน `.env`:

```env
NODE_ENV=production
PORT=3000
```

### 4. Process Manager

ใช้ PM2 สำหรับ production:

```bash
bun install -g pm2
pm2 start .output/server/index.mjs --name tanstack-app
pm2 save
pm2 startup
```

### 5. Nginx Reverse Proxy (Optional)

```nginx
server {
  listen 80;
  server_name your-domain.com;

  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

# Integration - Scalar

## Overview

รวม Scalar เข้ากับเครื่องมือและ workflow ต่างๆ เพื่อเพิ่มประสิทธิภาพในการทำงาน

## GitHub Integration

### Sync Schema

```bash
# Clone repository with schema
git clone https://github.com/user/api-schema.git

# Open in Scalar
cd api-schema
bunx @scalar/api-designer
```

### GitHub Actions

```yaml
# .github/workflows/scalar-deploy.yml
name: Deploy Scalar Docs

on:
  push:
    branches: [main]
    paths: ['schema/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Scalar
        run: bun install @scalar/api-designer

      - name: Deploy
        run: bun run deploy
        env:
          SCALAR_API_URL: ${{ secrets.API_URL }}
```

## VS Code Extension

### Installation

```bash
code --install-extension scalar.scalar-for-vscode
```

### Features

| Feature | Description |
|---------|-------------|
| Syntax Highlighting | GraphQL schema highlighting |
| Autocomplete | Type and field suggestions |
| Inline Docs | Show field descriptions |
| Playground | Open Playground in VS Code |

### Configuration

```json
{
  "scalar.enable": true,
  "scalar.theme": "dark",
  "scalar.proxyUrl": "http://localhost:4000/graphql"
}
```

## CI/CD Integration

### Docker Deployment

```dockerfile
FROM scalarorg/scalar:latest

COPY schema.graphql /app/schema.graphql
COPY scalar.config.json /app/scalar.config.json

EXPOSE 3000

CMD ["--config", "/app/scalar.config.json"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  scalar:
    image: scalarorg/scalar:latest
    ports:
      - "3000:3000"
    volumes:
      - ./schema:/app/schema
    environment:
      - SCALAR_PROXY_URL=http://api:4000/graphql
    depends_on:
      - api

  api:
    image: my-api:latest
    ports:
      - "4000:4000"
```

## API Gateway Integration

### Nginx Proxy

```nginx
server {
    listen 80;
    server_name api-docs.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
```

## Monitoring Integration

### Health Check

```bash
# Check if Scalar is running
curl http://localhost:3000/health

# Response
{
  "status": "ok",
  "version": "1.0.0"
}
```

## Next.js Integration

```tsx
// pages/api-reference.tsx
import { ApiReference } from '@scalar/api-designer'

export default function ApiDocs() {
  return (
    <ApiReference
      configuration={{
        spec: {
          url: '/api/openapi.json'
        },
        theme: 'dark'
      }}
    />
  )
}
```

## Vercel Deployment

```bash
# Install Vercel adapter
bun install @scalar/vercel

# vercel.json
{
  "routes": [
    { "src": "/(.*)", "dest": "/api/designer" }
  ]
}
```

## Best Practices

| Practice | Description |
|----------|-------------|
| Use environment variables | Store sensitive config in env |
| Version control schema | Keep schema in Git |
| Automate deployment | Use CI/CD for consistency |
| Monitor uptime | Set up health checks |
| Backup configuration | Store config in version control |

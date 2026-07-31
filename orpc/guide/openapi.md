# OpenAPI Guide

คู่มือการใช้งาน OpenAPI กับ oRPC

## What Is OpenAPI

OpenAPI เป็น standard สำหรับ API documentation

## Generate OpenAPI Spec

สร้าง OpenAPI spec:

```typescript
import { orpc } from '@orpc/server'

const openAPIDocument = orpc.openapi(appRouter, {
  title: 'My API',
  version: '1.0.0'
})
```

## Export As JSON

Export เป็น JSON:

```typescript
import { writeFile } from 'fs/promises'

await writeFile('openapi.json', JSON.stringify(openAPIDocument, null, 2))
```

## Export As YAML

Export เป็น YAML:

```typescript
import yaml from 'js-yaml'

await writeFile('openapi.yaml', yaml.dump(openAPIDocument))
```

## Configure Metadata

ตั้งค่า metadata:

```typescript
const openAPIDocument = orpc.openapi(appRouter, {
  title: 'My API',
  version: '1.0.0',
  description: 'API documentation',
  servers: [
    { url: 'https://api.example.com' }
  ]
})
```

## Add Tags

เพิ่ม tags สำหรับ grouping:

```typescript
const openAPIDocument = orpc.openapi(appRouter, {
  tags: [
    { name: 'users', description: 'User operations' }
  ]
})
```

## Integrate With Swagger UI

ใช้กับ Swagger UI:

```typescript
import { serve } from '@hono/node-server'
import { swaggerUI } from '@hono/swagger-ui'

app.get('/docs', swaggerUI({ url: '/openapi.json' }))
```

## Integrate With Redoc

ใช้กับ Redoc:

```typescript
import { serve } from '@hono/node-server'
import { redoc } from 'hono-redoc'

app.get('/docs', redoc({ specUrl: '/openapi.json' }))
```

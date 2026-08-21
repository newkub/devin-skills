# Integration

## ภาพรวม

Node.js สามารถเชื่อมต่อกับ tools และ frameworks ต่างๆ ได้อย่างราบรื่น

## Framework Integration

### Express

```bash
bun install express
```

```javascript
import express from 'express';
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(3000);
```

### Fastify

```bash
bun install fastify
```

```javascript
import Fastify from 'fastify';
const fastify = Fastify({ logger: true });

fastify.get('/', async (request, reply) => {
  return { hello: 'world' };
});

fastify.listen({ port: 3000 });
```

### Koa

```bash
bun install koa
```

```javascript
import Koa from 'koa';
const app = new Koa();

app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000);
```

### NestJS

```bash
bun install -g @nestjs/cli
nest new my-app
```

## Tool Integration

### ESLint

```bash
bun install -D eslint
npx eslint --init
```

### Prettier

```bash
bun install -D prettier
npx prettier --write .
```

### TypeScript

```bash
bun install -D typescript
npx tsc --init
```

### Jest

```bash
bun install -D jest
npx jest --init
```

## Database Integration

### PostgreSQL

```bash
bun install pg
```

```javascript
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'mydb',
  user: 'user',
  password: 'password',
});
```

### MongoDB

```bash
bun install mongodb
```

```javascript
import { MongoClient } from 'mongodb';

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
```

### MySQL

```bash
bun install mysql2
```

```javascript
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'user',
  password: 'password',
  database: 'mydb',
});
```

### SQLite

```bash
bun install better-sqlite3
```

```javascript
import Database from 'better-sqlite3';
const db = new Database('mydb.sqlite');
```

## API Integration

### REST APIs

```javascript
import express from 'express';
const app = express();

app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

app.listen(3000);
```

### GraphQL

```bash
bun install @apollo/server graphql
```

```javascript
import { ApolloServer } from '@apollo/server';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
```

### gRPC

```bash
bun install @grpc/grpc-js @grpc/proto-loader
```

## Cloud Integration

### Vercel

```bash
bun install -g vercel
vercel
```

### Netlify

```bash
bun install -g netlify-cli
netlify
```

### AWS Lambda

```bash
bun install -g serverless
serverless create
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Node.js CI
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: bun install
      - run: bun test
```

### GitLab CI

```yaml
test:
  image: node:18
  script:
    - bun install
    - bun test
```

## Docker Integration

### Dockerfile

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN bun install
COPY . .
RUN bun run build
EXPOSE 3000
CMD ["bun", "start"]
```

### docker-compose.yml

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
```

## Testing Integration

### Jest

```bash
bun install -D jest
```

### Mocha

```bash
bun install -D mocha
```

### Vitest

```bash
bun install -D vitest
```

## Best Practices

1. **ใช้ bun** สำหรับ package management
2. **ใช้ npx** สำหรับ running CLI tools
3. **ใช้ TypeScript** สำหรับ type safety
4. **ใช้ environment variables** สำหรับ configuration
5. **ใช้ Docker** สำหรับ containerization

# Performance Best Practices

ปรับปรุง performance สำหรับ oRPC

## Lazy Router

ใช้ lazy router สำหรับ cold start:

```typescript
const appRouter = orpc.lazy(() => import('./router'))
```

## Streaming

ใช้ streaming สำหรับ large responses:

```typescript
query: orpc.procedure().stream().query(async function* () {
  yield { data: 'chunk1' }
  yield { data: 'chunk2' }
})
```

## Caching

ใช้ caching สำหรับ frequently accessed data:

```typescript
query: orpc.procedure().cache(60).query(() => { ... })
```

## Bundler Optimization

ใช้ bundler optimization สำหรับ client:

```typescript
// Vite config
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          orpc: ['@orpc/client']
        }
      }
    }
  }
})
```

## Query Batching

Batch queries สำหรับ multiple requests:

```typescript
const [user, posts] = await Promise.all([
  orpcClient.users.get.query({ id: '1' }),
  orpcClient.posts.list.query()
])
```

## Response Compression

ใช้ compression สำหรับ responses:

```typescript
// Server config
app.use(compression())
```

## Connection Pooling

ใช้ connection pooling สำหรับ database:

```typescript
const pool = new Pool({ max: 10 })
```

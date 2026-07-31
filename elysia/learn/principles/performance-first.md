# Performance First

หลักการที่เน้น performance เป็นหลัก

## Principle 1: Zero-Allocation

ลดการ allocate memory:

```typescript
// Reuse objects แทนการสร้างใหม่
const response = { status: 200, data: null }

app.get('/', () => {
  response.data = getData()
  return response
})
```

## Principle 2: Compile-Time Optimization

ทำงานที่ compile-time แทน runtime:

```typescript
// Type checking ที่ compile-time
app.get('/user', () => user, {
  response: t.Object({
    name: t.String()
  })
})
```

## Principle 3: Efficient Routing

ใช้ Trie tree สำหรับ O(1) route matching:

```typescript
// Route matching เร็วไม่ว่าจะมีกี่ routes
app.get('/a', () => 'A')
app.get('/b', () => 'B')
// ... 1000+ routes
```

## Principle 4: Streaming

ใช้ streaming สำหรับ large responses:

```typescript
app.get('/large-data', () => {
  return new Response(
    ReadableStream.from(generateData())
  )
})
```

## Best Practices

- **Enable Production Mode**: ปิด debug features
- **Use Streaming**: สำหรับ large responses
- **Cache Schemas**: ลด compile time
- **Profile Performance**: ติดตาม metrics

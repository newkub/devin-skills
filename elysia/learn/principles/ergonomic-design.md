# Ergonomic Design

หลักการออกแบบที่เน้น developer experience

## Principle 1: Minimal Boilerplate

Elysia ถูกออกแบบมาเพื่อลบ boilerplate:

```typescript
// ❌ Express
const app = express()
app.use(express.json())
app.get('/', (req, res) => {
  res.json({ message: 'Hello' })
})

// ✅ Elysia
new Elysia()
  .get('/', () => ({ message: 'Hello' }))
```

## Principle 2: Type Inference

Types ถูก inferred อัตโนมัติ:

```typescript
app.post('/user', ({ body }) => {
  // body type ถูก inferred จาก schema
  return body
}, {
  body: t.Object({
    name: t.String()
  })
})
```

## Principle 3: Composable

Plugins สามารถ compose กันได้:

```typescript
app
  .use(cors())
  .use(jwt())
  .use(logger())
```

## Principle 4: Performance First

ไม่ trade-off performance สำหรับ DX:

- O(1) route matching
- Compile-time type checking
- Minimal runtime overhead

## Best Practices

- **Keep It Simple**: ใช้ syntax ที่เรียบง่ายที่สุด
- **Leverage Types**: ให้ TypeScript ทำงานให้
- **Compose Plugins**: รวม plugins สำหรับ functionality ที่ซับซ้อน

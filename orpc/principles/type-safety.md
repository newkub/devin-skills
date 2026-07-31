# Type Safety Principles

หลักการ type safety สำหรับ oRPC

## End-to-End Type Safety

oRPC ให้ type safety ตั้งแต่ server ถึง client:

- Input types ถูก validated ด้วย schema validators
- Output types ถูก inferred อัตโนมัติ
- Error types ถูกกำหนดอย่างชัดเจน
- Client ได้รับ types จาก server โดยอัตโนมัติ

## Schema Validators

ใช้ schema validators สำหรับ type safety:

```typescript
.input(z.object({
  id: z.string(),
  name: z.string().min(1)
}))
```

## Type Inference

ใช้ inferred types แทน manual typing:

```typescript
type Input = inferProcedureInput<AppRouter['hello']>
type Output = inferProcedureOutput<AppRouter['hello']>
```

## Type Exports

Export types สำหรับ client:

```typescript
export type AppRouter = typeof appRouter
```

## TS Plugin

ใช้ `@orpc/ts-plugin` สำหรับ autocomplete:

```json
{
  "compilerOptions": {
    "plugins": [{ "name": "@orpc/ts-plugin" }]
  }
}
```

## Strict Mode

เปิด strict mode ใน TypeScript:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

## Type Checking

รัน typecheck ก่อน commit:

```bash
bun run typecheck
```

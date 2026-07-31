# Add Procedure Workflow

เพิ่ม procedure ใหม่ใน oRPC

## Step 1: Choose Procedure Type

เลือก type ของ procedure:

- **Query**: สำหรับดึงข้อมูล (GET)
- **Mutation**: สำหรับเปลี่ยนแปลงข้อมูล (POST/PUT/DELETE)

## Step 2: Define Input Schema

กำหนด input schema:

```typescript
import { z } from 'zod'

const inputSchema = z.object({
  id: z.string(),
  name: z.string().min(1)
})
```

## Step 3: Define Output Schema

กำหนด output schema:

```typescript
const outputSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date()
})
```

## Step 4: Create Procedure

สร้าง procedure:

```typescript
getUser: orpc
  .procedure()
  .input(inputSchema)
  .output(outputSchema)
  .query(async ({ input }) => {
    const user = await db.user.findUnique({
      where: { id: input.id }
    })
    return user
  })
```

## Step 5: Add To Router

เพิ่มลงใน router:

```typescript
export const userRouter = orpc.router({
  getUser: orpc.procedure()...
})
```

## Step 6: Test Procedure

ทดสอบ procedure:

```typescript
const result = await orpcClient.users.getUser.query({ id: '123' })
```

## Step 7: Update Client

อัพเดท client ถ้าจำเป็น:

```typescript
// types จะถูก inferred อัตโนมัติ
```

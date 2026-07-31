# Organization Best Practices

จัดระเบียบ oRPC code อย่างเหมาะสม

## File Structure

โครงสร้างไฟล์ที่แนะนำ:

```
src/
  server/
    router/
      index.ts        # main router
      users.ts        # user procedures
      posts.ts        # post procedures
    middleware/
      auth.ts         # auth middleware
      logger.ts       # logging middleware
  client/
    index.ts          # client setup
```

## Procedure Naming

ตั้งชื่อ procedures ด้วย pattern:

- **Queries**: `get{Entity}`, `list{Entity}`, `find{Entity}`
- **Mutations**: `create{Entity}`, `update{Entity}`, `delete{Entity}`

```typescript
getUser, listUsers, createUser, updateUser, deleteUser
```

## Router Grouping

จัดกลุ่ม procedures ตาม domain:

```typescript
const appRouter = orpc.router({
  users: userRouter,
  posts: postRouter,
  comments: commentRouter
})
```

## Contract Separation

แยก contract ไว้ในไฟล์แยก สำหรับ large projects:

```typescript
// contracts/user.ts
export const userSchema = z.object({
  id: z.string(),
  name: z.string()
})
```

## Context Management

จัดการ context อย่างเป็นระบบ:

```typescript
const createContext = async () => ({
  user: await getCurrentUser(),
  db: await getDatabase()
})
```

## Error Codes

ใช้ error codes ที่ standard:

- `BAD_REQUEST`: Invalid input
- `UNAUTHORIZED`: Not authenticated
- `FORBIDDEN`: Not authorized
- `NOT_FOUND`: Resource not found
- `INTERNAL_SERVER_ERROR`: Server error

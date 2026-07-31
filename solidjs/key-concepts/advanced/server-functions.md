---
title: Server Functions
description: เรียนรู้เรื่อง Server Functions สำหรับ client-server communication
---

## สิ่งที่คือ Server Functions

Server Functions ช่วยให้เรียก functions บน server โดยตรงจาก client components พร้อม automatic serialization

## การใช้งาน (SolidStart)

```jsx
// server.ts
import "server-only";

export async function getUser(id: string) {
  const user = await db.users.find(id);
  return user;
}

// component.tsx
import { getUser } from "./server";

function UserComponent() {
  const [user] = createResource(() => getUser("123"));

  return <div>{user()?.name}</div>;
}
```

## การทำงาน

```
Client Component → Server Function → Database
        ↓                ↓
    Serialize        Execute
        ↓                ↓
    HTTP Request   Return Data
        ↓                ↓
    Deserialize    Serialize
        ↓
   Update State
```

## "server-only" Import

ป้องกันการใช้ server code บน client:

```jsx
import "server-only";

export function serverOnlyFunction() {
  // จะ error ถ้าใช้บน client
}
```

## Serialization

Arguments และ return values ถูก serialize อัตโนมัติ:

- Primitives: strings, numbers, booleans
- Objects: plain objects, arrays
- Dates: Date objects
- Errors: Error objects
- Resources: Special serialization

## Use Cases

- **Database Queries**: Query databases จาก client
- **API Calls**: Call external APIs จาก server
- **Authentication**: Verify auth tokens
- **File Operations**: Server-side file handling
- **Secrets**: Access environment variables

## ประโยชน์

- **Type Safety**: Full TypeScript support
- **No API Routes**: ไม่ต้องสร้าง endpoints แยก
- **Code Co-location**: Logic อยู่ใกล้ UI
- **Automatic Caching**: Built-in caching
- **Security**: Secrets อยู่บน server เสมอ

## ข้อจำกัด

- ต้องใช้กับ SolidStart หรือ meta-frameworks
- Functions ต้อง serializable
- Complex objects ต้อง handle พิเศษ

## ถัดไป

ดู [Islands Architecture](./islands-architecture.md) เพื่อเรียนรู้เรื่อง selective hydration

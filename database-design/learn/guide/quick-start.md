# Quick Start

## เริ่มต้น Database Design อย่างรวดเร็ว

### Step 1: สร้าง Project Structure

```bash
mkdir database-demo
cd database-demo
mkdir prisma migrations docs
```

### Step 2: ติดตั้ง Prisma

```bash
bun init -y
bun install prisma @prisma/client
npx prisma init
```

### Step 3: สร้าง Schema

**prisma/schema.prisma**:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
}
```

### Step 4: ตั้งค่า Environment

**.env**:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb?schema=public"
```

### Step 5: Run Migration

```bash
npx prisma migrate dev --name init
```

### Step 6: สร้าง Seed Script

**prisma/seed.ts**:
```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'john@example.com',
      name: 'John Doe',
      posts: {
        create: {
          title: 'Hello World',
          content: 'This is my first post',
        },
      },
    },
  })

  console.log({ user })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

### Step 7: Run Seed

```bash
npx prisma db seed
```

### Step 8: สร้าง Query Script

**src/index.ts**:
```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create user
  const user = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      name: 'Jane Doe',
    },
  })

  // Find user
  const foundUser = await prisma.user.findUnique({
    where: { email: 'jane@example.com' },
    include: { posts: true },
  })

  // Update user
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { name: 'Jane Smith' },
  })

  // Delete user
  await prisma.user.delete({
    where: { id: user.id },
  })
}

main()
```

### Step 9: Run Query

```bash
npx ts-node src/index.ts
```

### Step 10: ดู Prisma Studio

```bash
npx prisma studio
```

### Next Steps

1. อ่าน `key-concept.md` สำหรับ concepts เพิ่มเติม
2. ดู `how-it-works.md` สำหรับ database internals
3. ศึกษา `schema-design.md` สำหรับ schema design
4. ดู `indexing.md` สำหรับ indexing strategies
5. ดู `query-optimization.md` สำหรับ query optimization

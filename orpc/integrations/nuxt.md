# Nuxt Integration

ใช้ oRPC กับ Nuxt

## Setup

ติดตั้ง dependencies:

```bash
bun add @orpc/server @orpc/client @orpc/nuxt
bun add zod
```

## Configure Nuxt

ตั้งค่า `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['@orpc/nuxt'],
  orpc: {
    router: './server/router'
  }
})
```

## Create Router

สร้าง `server/router/index.ts`:

```typescript
import { orpc } from '@orpc/server'
import { z } from 'zod'

export const appRouter = orpc.router({
  hello: orpc
    .procedure()
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return { message: `Hello ${input.name}!` }
    })
})

export type AppRouter = typeof appRouter
```

## Use In Components

ใช้ใน Vue components:

```vue
<script setup lang="ts">
const { data } = await useAsyncData('hello', () =>
  $orpc.hello.query({ name: 'World' })
)
</script>

<template>
  <div>{{ data?.message }}</div>
</template>
```

## Use With Pinia Colada

ใช้กับ Pinia Colada:

```typescript
import { useQuery } from '@pinia/colada'

const { data } = useQuery({
  key: ['hello'],
  query: () => $orpc.hello.query({ name: 'World' })
})
```

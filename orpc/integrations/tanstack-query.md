# TanStack Query Integration

ใช้ oRPC กับ TanStack Query

## Setup

ติดตั้ง dependencies:

```bash
bun add @orpc/client @tanstack/react-query
```

## Create Client

สร้าง oRPC client:

```typescript
import { orpc } from '@orpc/client'
import type { AppRouter } from '../server/router'

export const orpcClient = orpc.client<AppRouter>({
  baseURL: 'http://localhost:3000/api'
})
```

## Query Provider

ตั้งค่า QueryClient:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* your app */}
    </QueryClientProvider>
  )
}
```

## Use Query

ใช้ `useQuery` สำหรับ data fetching:

```typescript
import { useQuery } from '@tanstack/react-query'
import { orpcClient } from './client'

function UserList() {
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => orpcClient.users.list.query()
  })

  if (isLoading) return <div>Loading...</div>
  return <div>{JSON.stringify(data)}</div>
}
```

## Use Mutation

ใช้ `useMutation` สำหรับ mutations:

```typescript
import { useMutation } from '@tanstack/react-query'

function CreateUser() {
  const mutation = useMutation({
    mutationFn: (data) => orpcClient.users.create.mutate(data)
  })

  return (
    <button onClick={() => mutation.mutate({ name: 'John' })}>
      Create User
    </button>
  )
}
```

## TypeScript Types

Types ถูก inferred อัตโนมัติ:

```typescript
// Input type
type CreateUserInput = inferProcedureInput<AppRouter['users']['create']>

// Output type
type User = inferProcedureOutput<AppRouter['users']['get']>
```

---
description: ใช้งาน TanStack Query สำหรับ data fetching ที่มี caching และ synchronization
---

## Goal

ติดตั้งและใช้งาน TanStack Query สำหรับ data fetching ที่มี caching, synchronization, และ error handling ที่ดี

## Scope

- ติดตั้ง TanStack Query
- ตั้งค่า QueryClient
- ใช้งาน useQuery hook
- ใช้งาน useMutation hook
- ตั้งค่า caching และ invalidation

## Execute

### 1. Install TanStack Query

```bash
bun add @tanstack/react-query
```

### 2. Setup QueryClient

สร้าง `src/lib/query-client.ts`:

```typescript
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 3,
    },
  },
})
```

### 3. Wrap App with QueryClientProvider

```tsx
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/query-client'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app */}
    </QueryClientProvider>
  )
}
```

### 4. Use useQuery for Data Fetching

```tsx
import { useQuery } from '@tanstack/react-query'

function Posts() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await fetch('https://api.example.com/posts')
      return response.json()
    },
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <ul>
      {data?.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

### 5. Use useMutation for Data Updates

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

function CreatePost() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (newPost) => {
      const response = await fetch('https://api.example.com/posts', {
        method: 'POST',
        body: JSON.stringify(newPost),
      })
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate({ title: 'New Post' })
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

## Best Practices

- ใช้ queryKey ที่เป็น array และมีความหมาย
- ตั้งค่า staleTime และ gcTime ตาม data freshness requirements
- ใช้ invalidateQueries หลังจาก mutation
- ใช้ error boundaries สำหรับ error handling

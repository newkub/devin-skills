# Integration

## TanStack Query with React

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourComponent />
    </QueryClientProvider>
  );
}
```

## TanStack Query with Next.js

```tsx
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

export default async function Page() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({ queryKey: ['posts'], queryFn: fetchPosts });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Posts />
    </HydrationBoundary>
  );
}
```

## TanStack Table with UI Libraries

TanStack Table เป็น headless สามารถใช้กับ UI libraries ได้ทั้งหมด:
- MUI
- Chakra UI
- Tailwind CSS
- Bootstrap

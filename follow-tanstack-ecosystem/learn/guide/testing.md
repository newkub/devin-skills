# Testing

## TanStack Query Testing

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

test('fetches data', async () => {
  const queryClient = new QueryClient();
  const { result } = renderHook(() => useQuery({ queryKey: ['key'], queryFn: fetchFn }), {
    wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true);
});
```

## TanStack Table Testing

- **Test columns** - test column definitions
- **Test sorting** - test sorting logic
- **Test filtering** - test filtering logic
- **Test pagination** - test pagination logic

## TanStack Router Testing

- **Test routes** - test route matching
- **Test loaders** - test data loading
- **Test navigation** - test navigation logic

# Data Synchronization

## Optimistic Updates

อัปเดต UI ก่อน server response:
```typescript
const mutation = useMutation({
  mutationFn: updatePost,
  onMutate: async (newPost) => {
    await queryClient.cancelQueries({ queryKey: ['posts'] });
    const previousPosts = queryClient.getQueryData(['posts']);
    queryClient.setQueryData(['posts'], newPosts);
    return { previousPosts };
  },
  onError: (err, newPost, context) => {
    queryClient.setQueryData(['posts'], context.previousPosts);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  },
});
```

## Background Refetch

- Refetch เมื่อ window focus
- Refetch เมื่อ reconnect
- Refetch เมื่อ component mount
- Refetch ตาม intervals

## Cross-Tab Synchronization

TanStack Query sync data ระหว่าง tabs/windows ผ่าน:
- BroadcastChannel API
- LocalStorage events

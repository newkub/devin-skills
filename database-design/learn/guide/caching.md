# Caching

## Cache Query Results

```typescript
// Cache frequently accessed data
const cache = new Map();

async function getUser(id: number) {
  if (cache.has(id)) {
    return cache.get(id);
  }
  
  const user = await prisma.user.findUnique({ where: { id } });
  cache.set(id, user);
  return user;
}
```

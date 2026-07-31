# Migration

## Migrating from Promises

### Key Differences

| Feature | Promise | Effect |
|---------|---------|--------|
| Error Handling | Try/catch หรือ .catch() | Built-in error type |
| Composition | .then() chaining | pipe() หรือ Effect.gen |
| Type Safety | Limited | Full TypeScript support |
| Cancellation | Limited | Built-in support |

### Migration Steps

1. **Convert promises ไปเป็น effects**
```typescript
// Before (Promise)
const fetchUser = (id: number) => 
  fetch(`/api/users/${id}`).then(r => r.json());

// After (Effect)
const fetchUser = (id: number) =>
  Effect.tryPromise({
    try: () => fetch(`/api/users/${id}`).then(r => r.json()),
    catch: (error) => new FetchError(error)
  });
```

2. **Update error handling**
```typescript
// Before
fetchUser(1).catch(error => console.error(error));

// After
Effect.runPromise(
  fetchUser(1).pipe(
    Effect.catchAll(error => Effect.logError(error))
  )
);
```

3. **Update composition patterns**
```typescript
// Before
fetchUser(1)
  .then(user => fetchPosts(user.id))
  .then(posts => ({ user, posts }));

// After
const program = Effect.gen(function* () {
  const user = yield* fetchUser(1);
  const posts = yield* fetchPosts(user.id);
  return { user, posts };
});
```

## Migrating from RxJS

| Feature | Observable | Effect |
|---------|------------|--------|
| Value Type | Stream of values | Single value |
| Cancellation | Subscription | Fiber |
| Type Safety | Runtime | Compile-time |
| Backpressure | Limited | Built-in |

### Migration Example

```typescript
// Before (RxJS)
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

const user$ = from(fetchUser(1)).pipe(
  map(user => user.name)
);

// After (Effect)
const userName = fetchUser(1).pipe(
  Effect.map(user => user.name)
);
```

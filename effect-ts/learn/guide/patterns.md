# Patterns

## Common Patterns

### Effect Definition

```typescript
import { Effect } from 'effect';

const getUser = (id: number) =>
  Effect.tryPromise({
    try: () => fetchUser(id),
    catch: (error) => new FetchError(error),
  });
```

### Effect Composition

```typescript
const program = Effect.gen(function* () {
  const user = yield* getUser(1);
  const posts = yield* getPosts(user.id);
  return { user, posts };
});
```

### Error Handling

```typescript
const program = Effect.gen(function* () {
  const result = yield* Effect.either(getUser(1));
  if (result._tag === 'Left') {
    return yield* Effect.log('User not found');
  }
  return result.right;
});
```

### Retry Pattern

```typescript
import { Effect, Schedule } from 'effect';

const retryFetch = (url: string) =>
  Effect.tryPromise({
    try: () => fetch(url),
    catch: (error) => new FetchError(error)
  }).pipe(
    Effect.retry(Schedule.exponential(1000)),
    Effect.catchAll(() => Effect.succeed(null))
  );
```

### Caching Pattern

```typescript
import { Effect, Cache } from 'effect';

const cache = Cache.make({
  capacity: 100,
  timeToLive: '5 minutes'
});

const cachedFetch = (url: string) =>
  Effect.gen(function* () {
    const cached = yield* Cache.get(cache, url);
    if (cached) return cached;
    
    const result = yield* fetch(url);
    yield* Cache.set(cache, url, result);
    return result;
  });
```

### Resource Management

```typescript
import { Effect, Scope } from 'effect';

const withConnection = Effect.gen(function* () {
  const scope = yield* Scope;
  const conn = yield* acquireConnection;
  
  yield* Scope.addFinalizer(() => Effect.sync(() => conn.close()));
  
  return yield* conn.query('SELECT * FROM users');
});
```

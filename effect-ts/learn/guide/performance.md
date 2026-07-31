# Performance

## Performance Tips

| Technique | Description | Impact |
|-----------|-------------|--------|
| Lazy Evaluation | Effects ไม่ execute จนกว่าจะ run | Reduce unnecessary computations |
| Memoization | Cache results ของ expensive operations | Avoid redundant work |
| Parallel Execution | Run independent effects พร้อมกัน | Faster throughput |
| Fiber Pooling | Reuse fibers สำหรับ repeated tasks | Reduce allocation overhead |

## Optimization Techniques

### Memoization

```typescript
import { Effect } from 'effect';

const memoized = Effect.memoize(() => {
  return expensiveOperation();
});

// Use memoized effect multiple times
Effect.runPromise(memoized);
Effect.runPromise(memoized); // Uses cached result
```

### Parallel Execution

```typescript
import { Effect } from 'effect';

// Run effects in parallel
const parallel = Effect.all([
  fetchUser(1),
  fetchUser(2),
  fetchUser(3),
], { concurrency: 'unbounded' });
```

### Batch Operations

```typescript
const batch = Effect.all([
  Effect.succeed(1),
  Effect.succeed(2),
  Effect.succeed(3),
]);
```

### Resource Pooling

```typescript
import { Effect, Pool } from 'effect';

const pool = Pool.make({
  acquire: Effect.sync(() => createConnection()),
  release: (conn) => Effect.sync(() => conn.close()),
  size: 10
});

const usePool = Effect.gen(function* () {
  const conn = yield* Pool.get(pool);
  return yield* conn.query('SELECT * FROM users');
});
```

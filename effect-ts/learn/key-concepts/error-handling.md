# Error Handling

## What is Error Handling

Effect มี built-in error handling:
- **Type-safe Errors** - typed errors
- **Recovery** - error recovery
- **Composition** - compose with errors

## Error Handling Patterns

```typescript
import { Effect } from 'effect';

const program = Effect.tryPromise({
  try: () => fetchUser(1),
  catch: (error) => new FetchError(error),
});

const recovered = program.pipe(
  Effect.catchAll((error) => Effect.succeed(null))
);
```

## Error Types

- **Error** - generic error type
- **Specific Errors** - specific error types
- **Either** - success/failure pattern
